// Escena de PENUMBRA (WebGL propio, sin librerías): una aurora viva (ruido fbm con deformación, dibujada a baja
// resolución y estirada con filtro lineal, con grano) y un objeto de partículas que cambia de forma según la sección que
// se ve (esfera en la portada, nube detrás de las tarjetas, anillo alrededor de la cuenta regresiva y del precio, galaxia
// en "por qué ahora", mar de puntos en el cierre), que se inclina con el puntero. Aurora y partículas se apagan en la zona
// del texto de cada sección.
// Se compacta (esbuild) en ESCENAS.penumbra. La arranca motor/cliente/movimiento.js con window.__ewEscena(api)
// después de la primera pintura y en tiempo libre (nunca con movimiento reducido, ahorro de datos o 2G). Dibuja en un
// solo lienzo fijo de página (.ew-lienzo, detrás de las secciones; el CSS lo recorta con el telón), solo con la pestaña
// a la vista, a 40 cuadros por segundo (30 en el celular, con menos partículas), y baja la calidad sola si el equipo no
// da. La aurora nunca pasa la luz de --aura-tope: el contraste del texto se mide contra ese punto. Con un fondo claro
// (colores propios de la persona) es una aurora de día: sus tonos pastel oscurecen el fondo hasta
// --aura-tope (ese es el piso) y las partículas son de tinta (se multiplican en vez de sumar luz).
(function () {
  var NZ =
    'float h(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+19.19);return fract(p.x*p.y);}' +
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n(p);p=mat2(1.6,1.2,-1.2,1.6)*p+3.1;a*=.5;}return s;}';
  // Aurora (a baja resolución). Z: zona apagada detrás del texto (x, y, fuerza). OG: brillo del objeto. TP: tope de luz.
  var FA =
    'precision mediump float;uniform vec2 R,M;uniform float T,I,TP,CL;uniform vec3 C0,C1,C2,C3,Z;uniform vec4 OG;' + NZ +
    'void main(){vec2 uv=gl_FragCoord.xy/R,p=(gl_FragCoord.xy-.5*R)/R.y;float t=T*.03;' +
    'vec2 q=vec2(fb(p*1.2+vec2(0.,t)),fb(p*1.2+vec2(5.2,1.3)-t));' +
    'vec2 r=vec2(fb(p*1.1+2.6*q+vec2(1.7,9.2)+.7*t+M*.18),fb(p*1.1+2.6*q+vec2(8.3,2.8)-.5*t));' +
    'float f=fb(p*1.3+3.*r);vec3 c=C0;' +
    'c=mix(c,C3*mix(.55,1.,CL),smoothstep(.25,.85,q.y)*.65);' +
    'c=mix(c,C2*mix(.62,1.,CL),smoothstep(.45,.95,r.x)*.6);' +
    'float k=smoothstep(.5,.92,f);c=mix(c,C1*mix(.9,1.,CL),k*k*.8);c+=C1*pow(smoothstep(.55,.95,f*r.y*1.5),3.)*.3*(1.-CL);' +
    'float v=.16+.95*smoothstep(1.15,.05,length((uv-vec2(.9,.95))*vec2(1.,1.2)))+.5*smoothstep(.6,0.,uv.y)*smoothstep(1.2,.2,abs(uv.x-.35)*1.6);' +
    'float z=1.-Z.z*smoothstep(.75,0.,length((uv-Z.xy)*vec2(R.x/R.y,1.)));' +
    'c=C0+(c-C0)*I*v*z;vec2 od=(uv-OG.xy)*vec2(R.x/R.y,1.);float ol=length(od)/max(OG.z,.01);' +
    'float og=OG.w*(.2*exp(-ol*ol*1.4)+.07*exp(-ol*ol*.25))*z;c+=mix(C1,C2,.35)*og*(1.-CL);c=mix(c,mix(C1,C2,.35),min(og*CL*1.6,1.));' +
    'c*=mix(mix(.6,1.,CL),1.,smoothstep(1.25,.3,length(uv-.5)*1.5));' +
    'c=max(c,0.);float L=dot(pow(c,vec3(2.2)),vec3(.2126,.7152,.0722));if((CL<.5&&L>TP)||(CL>.5&&L<TP))c=min(c*pow(TP/max(L,1e-4),.4545),1.);' +
    'gl_FragColor=vec4(c,1.);}';
  // Estirado a pantalla completa con grano.
  var FB =
    'precision mediump float;uniform sampler2D U;uniform vec2 R;uniform float T;void main(){vec3 c=texture2D(U,gl_FragCoord.xy/R).rgb;' +
    'float g=fract(sin(dot(gl_FragCoord.xy+fract(T)*97.,vec2(12.9898,78.233)))*43758.5453);gl_FragColor=vec4(c+(g-.5)*(2./255.),1.);}';
  // Partículas: cada semilla (u, v, w) tiene un lugar en cada forma; se pasa de la forma A a la B con X (0-1).
  // 0 esfera · 1 anillo · 2 galaxia · 3 olas (mar de puntos) · 4 nube.
  var VP =
    'attribute vec3 s;uniform float T,A,B,X,S,P,AL;uniform vec2 O,G,F;uniform vec3 C1,C2,Z;varying vec3 vc;varying float va;' +
    'float hs(float x){return fract(sin(x*91.3458)*47453.5453);}' +
    'vec3 rY(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);}' +
    'vec3 rX(vec3 p,float a){float c=cos(a),s=sin(a);return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);}' +
    'vec3 fo(float k,vec3 s){float u=s.x,v=s.y,w=s.z,e=hs(u*13.1+v*71.7+w*3.3),j=k<.5?.0015:k>1.5&&k<2.5?.012:0.;u+=(hs(e*1.7)-.5)*j;v+=(hs(e*2.3)-.5)*j*2.;vec3 p;' +
    'if(k<.5){float th=u*6.2832+w*.05,ph=acos(clamp(2.*v-1.,-1.,1.));p=vec3(sin(ph)*cos(th),cos(ph),sin(ph)*sin(th));float o=sin(p.x*3.+T*.8)*sin(p.y*4.-T*.6)*sin(p.z*3.5+T*.5);p*=(e<.16?.25+3.4*e:1.)*(1.+.08*o+.04*(w-.5));p=rX(rY(p,T*.11),.32);}' +
    'else if(k<1.5){float th=u*6.2832,ph=v*6.2832,rr=.05+.1*w*w;p=vec3((1.+rr*cos(ph))*cos(th),rr*sin(ph)*.7+.035*sin(th*6.+T),(1.+rr*cos(ph))*sin(th));p=rX(rY(p,T*.07),1.2);}' +
    'else if(k<2.5){float br=floor(e*3.),rr=pow(u,.62)*1.4,an=rr*3.3+br*2.0944-T*.05+(v-.5)*1.1/(rr*2.4+.35);p=vec3(cos(an)*rr,(hs(e*5.1)-.5)*.14*(1.5-rr),sin(an)*rr);p=rX(p,1.);}' +
    'else if(k<3.5){float x=(u-.5)*5.6,z=(v-.5)*3.;p=vec3(x,.15*sin(x*1.5+T*.55)+.1*sin(z*2.3-T*.45+x*.6)+.05*sin((x-z)*3.+T*.8),z);p=rX(p,-.36);}' +
    'else{p=(vec3(e,hs(e*7.3+v),hs(u*3.1+e))-.5)*vec3(3.6,2.2,1.8);p+=.07*vec3(sin(T*.3+w*20.),cos(T*.25+u*17.),sin(T*.2+v*13.));p=rY(p,T*.025);}' +
    'return p;}' +
    'float fw(float k,vec3 s){return k>2.5&&k<3.5?smoothstep(1.,.72,s.y)*smoothstep(0.,.15,s.y)*smoothstep(1.,.7,abs(s.x-.5)*2.):1.;}' +
    'void main(){float m=clamp(X*1.4-s.z*.4,0.,1.);m=m*m*(3.-2.*m);vec3 p=mix(fo(A,s),fo(B,s),m);p=rX(rY(p,G.x),G.y);' +
    'float z=p.z+4.,k=4./z;gl_Position=vec4(p.xy*k*S*F+O,0.,1.);' +
    'float e=hs(s.x*7.7+s.y*3.1+s.z),sp=e>.985?2.4:1.;gl_PointSize=P*k*(.75+1.6*s.z*s.z*s.z)*sp;' +
    'float nr=smoothstep(1.2,-1.,p.z);vc=mix(C2*.85,C1,clamp(nr*.8+.3*p.y+.2,0.,1.));vc=mix(vc,vec3(1.),sp>1.?.6:.06+.22*nr*nr);' +
    'vec2 su=gl_Position.xy*.5+.5;va=AL*1.55*mix(fw(A,s),fw(B,s),m)*(.3+.7*nr)*(.5+.5*s.z)*(1.-Z.z*.85*smoothstep(.55,0.,length((su-Z.xy)*vec2(F.y/F.x,1.))));}';
  // De noche las partículas suman luz; de día (CL) se multiplican: tinta del color de la marca.
  var FP = 'precision mediump float;uniform float CL;varying vec3 vc;varying float va;void main(){float r=length(gl_PointCoord-.5)*2.;float a=max(0.,1.-r);a*=a;' +
    'gl_FragColor=CL>.5?vec4(mix(vec3(1.),vc,clamp(a*va,0.,1.)*.85),1.):vec4(vc*a*va,1.);}';

  // Guion de la escena: qué forma toma el objeto en cada sección y dónde. Por tipo o "tipo.variante":
  // [forma, x, y, escala, partículas, aurora, zx, zy, fuerza] en el escritorio y, si cambia, lo mismo para el celular.
  // x, y: centro del objeto (-1 a 1 de la pantalla); zx, zy: centro de la zona del texto (0 a 1, desde abajo a la
  // izquierda) donde aurora y partículas se apagan.
  var LEJOS = [2, 1.2, -0.7, 1.5, 0, 0.36, 0.5, 0.5, 0.2];
  var GUION = {
    hero: [[0, 0.5, 0.02, 1.02, 1, 1, 0.28, 0.5, 0.6], [0, 0.62, 0.64, 1, 0.85, 1, 0.45, 0.66, 0.75]],
    'hero.centrado': [[0, 0, 0.06, 1.25, 0.55, 0.95, 0.5, 0.55, 0.7], [0, 0, 0.45, 0.95, 0.6, 0.95, 0.5, 0.6, 0.8]],
    'hero.video': [[1, 0, -0.12, 1.55, 0.75, 0.9, 0.5, 0.82, 0.55], [1, 0, -0.14, 1.25, 0.45, 0.9, 0.5, 0.8, 0.85]],
    gracias: [[0, 0.55, 0.25, 0.8, 0.85, 1, 0.5, 0.55, 0.65], [0, 0.6, 0.7, 0.75, 0.7, 1, 0.5, 0.6, 0.75]],
    beneficios: [[4, 0, 0.05, 1.15, 0.6, 0.75, 0.5, 0.72, 0.5], [4, 0, 0.1, 1.25, 0.5, 0.75, 0.5, 0.7, 0.5]],
    'beneficios.numerada': [[4, 0.38, 0, 1.05, 0.85, 0.75, 0.25, 0.5, 0.45], [4, 0, 0.1, 1.25, 0.55, 0.75, 0.5, 0.5, 0.45]],
    problema: [[4, 0.55, -0.1, 1, 0.45, 0.6, 0.4, 0.6, 0.45]],
    mecanismo: [[4, 0, 0, 1.15, 0.55, 0.7, 0.5, 0.7, 0.45]],
    bonos: [[4, 0, 0.05, 1.15, 0.55, 0.7, 0.5, 0.72, 0.45]],
    servicios: [[4, 0, 0.05, 1.15, 0.5, 0.7, 0.5, 0.72, 0.45]],
    contador: [[1, 0, -0.02, 1.32, 1, 0.85, 0.5, 0.5, 0.4], [1, 0, 0.02, 1.5, 0.85, 0.85, 0.5, 0.5, 0.4]],
    garantia: [[1, 0, 0, 1.15, 0.7, 0.8, 0.5, 0.5, 0.45]],
    oferta: [[1, 0, 0, 1.45, 0.8, 0.85, 0.5, 0.55, 0.45], [1, 0, 0.05, 1.4, 0.6, 0.85, 0.5, 0.55, 0.45]],
    'oferta.dividida': [[1, 0.35, 0, 1.25, 0.8, 0.85, 0.3, 0.55, 0.45], [1, 0, 0.05, 1.4, 0.6, 0.85, 0.5, 0.55, 0.45]],
    urgencia: [[2, 0.52, -0.1, 1.15, 0.95, 0.95, 0.3, 0.55, 0.55], [2, 0.3, -0.42, 1.5, 0.6, 0.95, 0.5, 0.6, 0.5]],
    comparacion: [[2, 1.05, -0.55, 1.5, 0.22, 0.5, 0.5, 0.5, 0.3], [2, 1.05, -0.55, 1.5, 0.12, 0.5, 0.5, 0.5, 0.3]],
    formulario: [[3, 0, -0.74, 1.05, 1.1, 0.9, 0.5, 0.6, 0.45], [3, 0, -0.72, 1.15, 0.8, 0.9, 0.5, 0.6, 0.4]],
    cta: [[3, 0, -0.74, 1.05, 1.3, 1, 0.5, 0.6, 0.45], [3, 0, -0.72, 1.15, 0.8, 1, 0.5, 0.6, 0.4]],
  };
  var NOMBRE = { esfera: 0, anillo: 1, galaxia: 2, olas: 3, nube: 4 };
  var BRILLO = [1, 0.55, 0.9, 0, 0.3];

  function rgb(s) {
    s = String(s || '').trim().replace('#', '');
    if (s.length === 3) s = s.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(s, 16);
    if (isNaN(n)) n = 0x05070a;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function lum(c) {
    var w = [0.2126, 0.7152, 0.0722];
    return c.reduce(function (s, v, i) { return s + w[i] * (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)); }, 0);
  }
  function cl(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  window.__ewEscena = function (api) {
    var d = document;
    var cv = d.createElement('canvas');
    cv.className = 'ew-lienzo';
    cv.setAttribute('aria-hidden', 'true');
    d.body.insertBefore(cv, d.body.firstChild);
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return cv.remove();
    var hacer = function (v, f) {
      var p = gl.createProgram();
      [[gl.VERTEX_SHADER, v], [gl.FRAGMENT_SHADER, f]].forEach(function (x) {
        var o = gl.createShader(x[0]);
        gl.shaderSource(o, x[1]);
        gl.compileShader(o);
        gl.attachShader(p, o);
      });
      gl.bindAttribLocation(p, 0, v === VQ ? 'p' : 's');
      gl.linkProgram(p);
      return p;
    };
    var VQ = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var PA = hacer(VQ, FA), PB = hacer(VQ, FB), PP = hacer(VP, FP);
    var PS = [PA, PB, PP];
    var kx = gl.getExtension('KHR_parallel_shader_compile');
    // Los sombreadores se compilan en paralelo si el navegador lo permite: así no traban la página mientras tanto.
    var esperar = function () {
      if (kx && !PS.every(function (p) { return gl.getProgramParameter(p, kx.COMPLETION_STATUS_KHR); })) return setTimeout(esperar, 40);
      if (PS.every(function (p) { return gl.getProgramParameter(p, gl.LINK_STATUS); })) montar();
      else cv.remove();
    };
    esperar();

    function montar() {
      var un = function (p) {
        var o = {};
        var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < n; i++) {
          var a = gl.getActiveUniform(p, i);
          o[a.name] = gl.getUniformLocation(p, a.name);
        }
        return o;
      };
      var UA = un(PA), UB = un(PB), UP = un(PP);
      var movil = api.movil;
      var N = movil ? 3500 : 9000;
      var dibujadas = N;
      var c = function (nombre) { return rgb(api.color(nombre)); };
      // Con un fondo claro el tope es el piso (lo más oscuro que pinta la aurora): se deja un pelo más claro.
      var claro = lum(c('--fondo')) > 0.18 ? 1 : 0;
      var tope = lum(c('--aura-tope')) * (claro ? 1.08 : 0.9);
      gl.useProgram(PA);
      gl.uniform1f(UA.CL, claro);
      gl.uniform3fv(UA.C0, c('--fondo'));
      gl.uniform3fv(UA.C1, c('--aura-1'));
      gl.uniform3fv(UA.C2, c('--aura-2'));
      gl.uniform3fv(UA.C3, c('--aura-3'));
      gl.uniform1f(UA.TP, tope);
      gl.useProgram(PP);
      gl.uniform3fv(UP.C1, c('--acento'));
      gl.uniform3fv(UP.C2, c('--aura-p2'));
      gl.uniform1f(UP.CL, claro);
      gl.useProgram(PB);
      gl.uniform1i(UB.U, 0);
      // Un triángulo a pantalla completa y las semillas de las partículas (una rejilla con algo de azar).
      var tri = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, tri);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var sd = new Float32Array(N * 3);
      var cols = Math.round(Math.sqrt(N * 2));
      var filas = Math.ceil(N / cols);
      for (var i = 0; i < N; i++) {
        sd[i * 3] = ((i % cols) + 0.5) / cols;
        sd[i * 3 + 1] = (Math.floor(i / cols) + 0.5) / filas;
        sd[i * 3 + 2] = Math.random();
      }
      var sb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sb);
      gl.bufferData(gl.ARRAY_BUFFER, sd, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      // La aurora va a un búfer chico (la mitad en el escritorio, un tercio en el celular) y se estira con filtro lineal.
      var tx = gl.createTexture();
      var fbo = gl.createFramebuffer();
      gl.bindTexture(gl.TEXTURE_2D, tx);
      [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(function (x) {
        gl.texParameteri(gl.TEXTURE_2D, x[0], x[1]);
      });
      var cw = 0, ch = 0, bw = 0, bh = 0, dp = 1, q = 1;
      var tam = function (forzar) {
        var w = cv.clientWidth, h = cv.clientHeight;
        if (!w || !h || (w === cw && h === ch && !forzar)) return;
        cw = w;
        ch = h;
        dp = Math.min(window.devicePixelRatio || 1, 1.5) * (q < 1 ? 0.85 : 1);
        cv.width = Math.round(w * dp);
        cv.height = Math.round(h * dp);
        var k = (movil ? 0.33 : 0.5) * q;
        bw = Math.max(2, Math.round(w * k));
        bh = Math.max(2, Math.round(h * k));
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bw, bh, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      };

      // Las secciones de la página con su lugar en el guion. La portada (y gracias) ponen la esfera donde está su ancla
      // (.ew-ancla, la pone movimiento.js y el CSS la ubica en cada variante): ahí también va su visor.
      var est = [];
      var leer = function () {
        var m = matchMedia('(max-width: 860px)').matches;
        var y = scrollY;
        var mi = Math.min(cw, ch) * 0.36 || 1;
        est = [];
        [].slice.call(d.querySelectorAll('section.sec')).forEach(function (s) {
          if (!s.offsetHeight || /\bs-(aviso|pie)\b/.test(s.className)) return;
          var tipo = (s.className.match(/\bs-([a-z_]+)/) || [])[1];
          var vari = (s.className.match(/\bv-([a-z]+)/) || [])[1];
          var g = GUION[tipo + '.' + vari] || GUION[tipo] || [LEJOS];
          var v = (m && g[1]) || g[0];
          var r = s.getBoundingClientRect();
          var e = { t: r.top + y, f: v[0], x: v[1], y: v[2], s: v[3], a: v[4], au: v[5], z: [v[6], v[7], v[8]] };
          var an = !est.length && s.querySelector('.ew-ancla');
          var ar = an && an.getBoundingClientRect();
          if (ar && ar.width > 20) {
            e.f = NOMBRE[an.getAttribute('data-forma')] || 0;
            e.x = ((ar.left + ar.width / 2) / cw) * 2 - 1;
            e.y = 1 - ((ar.top + y + ar.height / 2) / ch) * 2;
            e.s = (ar.width * 0.47) / mi;
          }
          est.push(e);
        });
        if (!est.length) est.push({ t: 0, f: 2, x: 1.2, y: -0.7, s: 1.5, a: 0, au: 0.36, z: [0.5, 0.5, 0.2] });
      };
      var fase = function () {
        var y = scrollY, vh = innerHeight, k = 0;
        for (var i = 0; i < est.length; i++) if (y >= est[i].t - vh * 0.45) k = i;
        var B = est[k + 1];
        return B ? k + cl((y - (B.t - vh * 1.05)) / (vh * 0.6), 0, 1) : k;
      };

      var ph = 0, tt = 0, ultimo = 0, corre = false, vis = true, mx = 0, my = 0, gx = 0, gy = 0, lentos = 0, listo = 0;
      if (!movil && matchMedia('(pointer: fine)').matches) {
        addEventListener('pointermove', function (e) {
          mx = e.clientX / innerWidth - 0.5;
          my = e.clientY / innerHeight - 0.5;
        }, { passive: true });
      }
      var dibujar = function (dt) {
        tt += dt;
        var f = fase();
        ph = dt ? ph + (f - ph) * (1 - Math.exp(-dt * 3.2)) : f;
        var e1 = 1 - Math.exp(-dt * 2);
        gx += (mx * 0.45 - gx) * e1;
        gy += (my * 0.25 - gy) * e1;
        var k = Math.min(Math.floor(ph), est.length - 1);
        var A = est[k], B = est[Math.min(k + 1, est.length - 1)];
        var qq = ph - k, e = qq * qq * (3 - 2 * qq);
        var L = function (a, b) { return a + (b - a) * e; };
        var mi = Math.min(cw, ch) * 0.36;
        var zz = [L(A.z[0], B.z[0]), L(A.z[1], B.z[1]), L(A.z[2], B.z[2])];
        var al = L(A.a, B.a);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.viewport(0, 0, bw, bh);
        gl.useProgram(PA);
        gl.bindBuffer(gl.ARRAY_BUFFER, tri);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(UA.R, bw, bh);
        gl.uniform1f(UA.T, tt);
        gl.uniform1f(UA.I, L(A.au, B.au));
        gl.uniform2f(UA.M, gx, gy);
        gl.uniform3f(UA.Z, zz[0], zz[1], zz[2]);
        gl.uniform4f(UA.OG, L(A.x, B.x) * 0.5 + 0.5, L(A.y, B.y) * 0.5 + 0.5, (L(A.s, B.s) * mi) / ch, al * L(BRILLO[A.f], BRILLO[B.f]));
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, cv.width, cv.height);
        gl.useProgram(PB);
        gl.bindTexture(gl.TEXTURE_2D, tx);
        gl.uniform2f(UB.R, cv.width, cv.height);
        gl.uniform1f(UB.T, tt);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (al < 0.01) return;
        gl.useProgram(PP);
        gl.bindBuffer(gl.ARRAY_BUFFER, sb);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.uniform1f(UP.T, tt);
        gl.uniform1f(UP.A, A.f);
        gl.uniform1f(UP.B, B.f);
        gl.uniform1f(UP.X, A.f === B.f ? 0 : e);
        gl.uniform1f(UP.S, L(A.s, B.s));
        gl.uniform1f(UP.AL, al);
        gl.uniform1f(UP.P, (movil ? 2.1 : 1.9) * dp);
        gl.uniform2f(UP.O, L(A.x, B.x), L(A.y, B.y));
        gl.uniform2f(UP.G, gx, gy);
        gl.uniform3f(UP.Z, zz[0], zz[1], zz[2]);
        gl.uniform2f(UP.F, mi / (cw / 2), mi / (ch / 2));
        gl.enable(gl.BLEND);
        if (claro) gl.blendFunc(gl.DST_COLOR, gl.ZERO);
        else gl.blendFunc(gl.ONE, gl.ONE);
        gl.drawArrays(gl.POINTS, 0, dibujadas);
        gl.disable(gl.BLEND);
      };
      var fps = movil ? 30 : 40;
      var minimo = 1000 / fps;
      var cuadro = function (n) {
        if (!corre) return;
        requestAnimationFrame(cuadro);
        var dt = n - ultimo;
        if (dt < minimo - 1.5) return;
        // Si el equipo no llega a los cuadros pedidos: menos partículas y la aurora más chica (hasta un piso).
        if (dt > minimo * 1.8 && dt < 400) {
          if (++lentos > 40 && q > 0.6) {
            q *= 0.8;
            dibujadas = Math.max(Math.round(N * 0.35), Math.round(dibujadas * 0.75));
            lentos = 0;
            tam(true);
          }
        } else lentos = Math.max(0, lentos - 1);
        ultimo = n;
        dibujar(Math.min(dt, 100) / 1000);
        if (!listo) {
          listo = 1;
          cv.classList.add('ew-on');
          d.documentElement.classList.add('ew-gl');
        }
      };
      var sync = function () {
        var ok = vis && !d.hidden;
        if (ok && !corre) {
          corre = true;
          ultimo = performance.now();
          requestAnimationFrame(cuadro);
        } else if (!ok) corre = false;
      };
      tam();
      leer();
      ph = fase();
      api.observar(cv, function (si) {
        vis = si;
        sync();
      });
      d.addEventListener('visibilitychange', sync);
      var espera;
      addEventListener('resize', function () {
        clearTimeout(espera);
        espera = setTimeout(function () {
          tam();
          leer();
        }, 150);
      });
      if (typeof ResizeObserver === 'function') new ResizeObserver(function () { leer(); }).observe(d.body);
      cv.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        corre = false;
        vis = false;
        cv.classList.remove('ew-on');
        d.documentElement.classList.remove('ew-gl');
      });
    }
  };
})();
