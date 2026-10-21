// Escena de NÁCAR (WebGL propio, sin librerías): un campo de nácar iridiscente (ruido fbm deformado, con los brillos de
// la marca) y un objeto de vidrio con refracción y dispersión (la gota en la portada, el anillo en el cierre).
// Se compacta (esbuild) en ESCENAS.nacar. La arranca motor/cliente/movimiento.js con window.__ewEscena(api)
// después de la primera pintura y en tiempo libre. Cada objeto va donde está su ancla (.ew-ancla, la pone movimiento.js
// y tiene su respaldo en CSS): aquí se crea un lienzo en su sección, se dibuja solo cuando se ve y con la pestaña a la
// vista, a 24-30 cuadros por segundo, y baja la resolución sola si el equipo no da.
(function () {
  var FS =
    'precision highp float;' +
    'uniform vec2 uR;uniform float uT,uF,uS,uU,uN;uniform vec3 uO,uC0,uC1,uC2,uC3,uC4,uK;uniform vec2 uM;' +
    'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
    'float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}' +
    'float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<3;i++){s+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s/.875;}' +
    'vec3 pal(float a){a=fract(a)*4.;vec3 c=mix(uC1,uC2,smoothstep(0.,1.,a));c=mix(c,uC3,smoothstep(1.,2.,a));c=mix(c,uC4,smoothstep(2.,3.,a));return mix(c,uC1,smoothstep(3.,4.,a));}' +
    'vec3 campo(vec2 p){float t=uT*.045;' +
    'vec2 w=vec2(fb(p*1.3+vec2(t,-t*.6)),fb(p*1.3+vec2(-t*.7,t)+5.3));' +
    'vec2 q=p+(w-.5)*.75;float g=fb(q*1.7-t*.6);' +
    'float r=length(q*vec2(.8,1.));' +
    'vec3 c=pal(atan(q.y,q.x)/6.2832+g*.55+r*.45+t*.5);' +
    'float m=smoothstep(1.1,.04,r+(g-.5)*.55);' +
    'float s=sin(q.x*2.6+q.y*4.1+g*5.5+uT*.13);' +
    'c=mix(c,vec3(1.-uN),.24*smoothstep(.5,1.,s));' +
    'return mix(uC0,c,m*.9);}' +
    'mat2 rt(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}' +
    'float sm(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}' +
    'float sdf(vec3 p){' +
    'p.yz*=rt(.35+uM.y*.25+uS*.9);p.xz*=rt(uT*.16+uM.x*.4+uS*.6);' +
    'if(uF<.5){float d=length(p)-.8;' +
    'd+=.05*sin(2.3*p.x+uT*.8)*sin(2.1*p.y+uT*.6)*sin(2.5*p.z+uT*.7)+.018*sin(5.*p.y+uT*1.3);' +
    'vec3 c=vec3(cos(uT*.37),.4*sin(uT*.23),sin(uT*.37))*.8;' +
    'return sm(d,length(p-c)-.15,.3);}' +
    'p.yz*=rt(.85);vec2 q=vec2(length(p.xz)-.6,p.y);' +
    'return length(q)-.24-.02*sin(atan(p.z,p.x)*3.+uT*1.1);}' +
    'vec3 nr(vec3 p){const vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*sdf(p+e.xyy)+e.yyx*sdf(p+e.yyx)+e.yxy*sdf(p+e.yxy)+e.xxx*sdf(p+e.xxx));}' +
    'vec3 env(vec3 d){vec3 c=mix(uC0*.9,vec3(1.04),smoothstep(-.5,.7,d.y));' +
    'c=mix(c,uK,.82*exp(-abs(d.y+.05)*12.));' +
    'c+=pal(d.x*.35+.15)*.28*smoothstep(-.1,-.8,d.y);' +
    'vec2 sb=vec2(d.x+.46,d.y-.6);c+=1.5*smoothstep(.2,.05,max(abs(sb.x)*.85,abs(sb.y)*1.7));' +
    'c+=1.4*pow(max(dot(d,normalize(vec3(-.5,.66,.56))),0.),160.);' +
    'c+=.65*pow(max(dot(d,normalize(vec3(.8,.12,.58))),0.),26.);' +
    'return c;}' +
    'void main(){vec2 fc=gl_FragCoord.xy;vec2 p=(fc-uO.xy)/uU;' +
    'vec3 col=campo(p);' +
    'vec2 so=(fc-uO.xy)/uO.z-vec2(0.,-1.22);' +
    'col*=1.-.15*exp(-(so.x*so.x*2.+so.y*so.y*16.));' +
    'col+=.16*pal(uT*.03+.3)*exp(-(so.x*so.x*7.+so.y*so.y*40.));' +
    'vec2 op=(fc-uO.xy)/uO.z;' +
    'if(dot(op,op)<2.6){' +
    'vec3 ro=vec3(0.,0.,3.6),rd=normalize(vec3(op,-3.6));' +
    'float t=2.,dm=1e3,tm=2.;' +
    'for(int i=0;i<PASOS;i++){float dd=sdf(ro+rd*t);if(dd<dm){dm=dd;tm=t;}if(dd<.0008||t>5.2)break;t+=dd*.9;}' +
    'float cv=1.-smoothstep(0.,1.7/uO.z,dm);' +
    'if(cv>0.){vec3 ps=ro+rd*tm,n=nr(ps);' +
    'float nv=clamp(dot(n,-rd),0.,1.),fr=.04+.96*pow(1.-nv,5.);' +
    'vec3 rr=refract(rd,n,.72);vec2 of=(-op*.5+(rr.xy-rd.xy)*1.9)*uO.z/uU;' +
    'vec3 rf=vec3(campo(p+of).r,campo(p+of*1.1).g,campo(p+of*1.2).b);' +
    'rf=mix(vec3(dot(rf,vec3(.333))),rf,1.65);rf=(rf-.5)*1.12+.52;' +
    'vec3 fl=pal(1.35*(1.-nv)+.22*n.y+uT*.02);' +
    'vec3 c=rf*mix(vec3(1.),fl,.22);' +
    'c=mix(c,env(reflect(rd,n)),clamp(fr*1.15,0.,1.));' +
    'c+=fl*pow(1.-nv,2.2)*.26;' +
    'c=mix(c,uK,smoothstep(.86,.985,1.-nv)*.28);' +
    'vec3 rl=reflect(rd,n);' +
    'c+=1.6*pow(max(dot(rl,normalize(vec3(-.5,.62,.6))),0.),220.)+.35*pow(max(dot(rl,normalize(vec3(-.5,.62,.6))),0.),18.);' +
    'c+=.5*pow(max(dot(rl,normalize(vec3(.7,-.35,.62))),0.),60.);' +
    'c+=pal(.6+n.x*.3)*.22*smoothstep(.2,1.,-n.y)*nv;' +
    'c*=mix(.93,1.03,n.y*.5+.5);' +
    'col=mix(col,c,cv);}}' +
    'col+=(h(fc+fract(uT*7.))-.5)/180.;' +
    'gl_FragColor=vec4(col,1.);}';

  var UNIFORMES = ['uR', 'uT', 'uF', 'uS', 'uU', 'uN', 'uO', 'uC0', 'uC1', 'uC2', 'uC3', 'uC4', 'uK', 'uM'];

  function rgb(s) {
    s = String(s || '').trim().replace('#', '');
    if (s.length === 3) s = s.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(s, 16);
    if (isNaN(n)) n = 0xf4f0e8;
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  function cl(v, a, b) {
    return v < a ? a : v > b ? b : v;
  }

  // Una sección con su lienzo y su objeto (forma 0 = gota, 1 = anillo).
  function lienzo(api, ancla, forma) {
    var sec = ancla.closest('section');
    if (!sec) return;
    var cv = document.createElement('canvas');
    cv.className = 'ew-lienzo';
    cv.setAttribute('aria-hidden', 'true');
    sec.insertBefore(cv, sec.firstChild);
    var gl = cv.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) {
      cv.remove();
      return;
    }
    var movil = api.movil;
    var sombra = function (t, s) {
      var o = gl.createShader(t);
      gl.shaderSource(o, s);
      gl.compileShader(o);
      return o;
    };
    var pr = gl.createProgram();
    gl.attachShader(pr, sombra(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
    gl.attachShader(pr, sombra(gl.FRAGMENT_SHADER, '#define PASOS ' + (movil ? 30 : 44) + '\n' + FS));
    gl.linkProgram(pr);
    var ext = gl.getExtension('KHR_parallel_shader_compile');
    var U = {};
    var esc = 1, w = 0, alto = 0, ox = 0, oy = 0, orad = 1, uu = 1, vis = 0, raf = 0, t0 = performance.now(), ultimo = 0, q = 1, lentos = 0;
    var mx = 0, my = 0, tx = 0, ty = 0, listo = 0;
    var fps = movil ? 24 : 30;
    var minimo = 1000 / fps;
    var medir = function () {
      var r = cv.getBoundingClientRect();
      var a = ancla.getBoundingClientRect();
      if (!r.width) return;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var max = movil ? 4.5e5 : 1.25e6;
      var s = dpr * (movil ? 0.85 : 0.9);
      if (r.width * r.height * s * s > max) s = Math.sqrt(max / (r.width * r.height));
      s *= q;
      esc = s;
      w = Math.round(r.width * s);
      alto = Math.round(r.height * s);
      cv.width = w;
      cv.height = alto;
      gl.viewport(0, 0, w, alto);
      ox = (a.left + a.width / 2 - r.left) * s;
      oy = (r.bottom - (a.top + a.height / 2)) * s;
      orad = (a.width / 2 / 0.8) * s;
      uu = Math.min(Math.max(r.width, innerHeight * 0.9), 1150) * s * (movil ? 0.62 : 0.85);
    };
    var dibujar = function (ahora) {
      var r = cv.getBoundingClientRect();
      var vh = innerHeight;
      var fuera = vh / 2 - (r.top + r.height / 2);
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      gl.uniform2f(U.uR, w, alto);
      gl.uniform1f(U.uT, (ahora - t0) / 1000 + 14);
      gl.uniform1f(U.uU, uu);
      gl.uniform3f(U.uO, ox, oy + cl(fuera, -vh, vh) * 0.12 * esc, orad);
      gl.uniform2f(U.uM, mx, my);
      gl.uniform1f(U.uS, cl(fuera / vh, -1, 1) * 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!listo) {
        listo = 1;
        cv.classList.add('ew-on');
        sec.classList.add('ew-gl');
      }
    };
    var bucle = function (ahora) {
      raf = 0;
      if (!vis || document.hidden) return;
      raf = requestAnimationFrame(bucle);
      var dt = ahora - ultimo;
      if (dt < minimo - 2) return;
      // Si el equipo no llega a los cuadros pedidos, se baja la resolución (hasta la mitad).
      if (ultimo && dt > minimo * 1.8) {
        if (++lentos > 45 && q > 0.55) {
          q *= 0.8;
          lentos = 0;
          medir();
        }
      } else lentos = Math.max(0, lentos - 1);
      ultimo = ahora;
      dibujar(ahora);
    };
    var arrancar = function () {
      if (!raf && vis && !document.hidden) {
        ultimo = 0;
        raf = requestAnimationFrame(bucle);
      }
    };
    var empezar = function () {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        cv.remove();
        return;
      }
      gl.useProgram(pr);
      UNIFORMES.forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var al = gl.getAttribLocation(pr, 'a');
      gl.enableVertexAttribArray(al);
      gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
      // Los colores de su sección (una sección con estilo propio tiene los suyos). Con un fondo oscuro (colores propios),
      // el brillo del nácar es de sombra en vez de luz: el texto claro se sigue leyendo encima.
      var c = function (n) { return rgb(api.color(n, sec)); };
      var f0 = c('--fondo');
      gl.uniform1f(U.uN, 0.2126 * f0[0] + 0.7152 * f0[1] + 0.0722 * f0[2] < 0.42 ? 1 : 0);
      gl.uniform3fv(U.uC0, c('--fondo'));
      gl.uniform3fv(U.uC1, c('--iri-1'));
      gl.uniform3fv(U.uC2, c('--iri-2'));
      gl.uniform3fv(U.uC3, c('--iri-3'));
      gl.uniform3fv(U.uC4, c('--iri-4'));
      gl.uniform3fv(U.uK, c('--duo'));
      gl.uniform1f(U.uF, forma);
      medir();
      if (typeof ResizeObserver === 'function') new ResizeObserver(medir).observe(sec);
      else addEventListener('resize', medir);
      api.observar(cv, function (si) {
        vis = si;
        arrancar();
      }, '60px 0px');
      document.addEventListener('visibilitychange', arrancar);
      if (!movil) {
        addEventListener('pointermove', function (e) {
          tx = (e.clientX / innerWidth) * 2 - 1;
          ty = (e.clientY / innerHeight) * 2 - 1;
        }, { passive: true });
      }
      cv.addEventListener('webglcontextlost', function (e) {
        e.preventDefault();
        vis = 0;
        cv.classList.remove('ew-on');
        sec.classList.remove('ew-gl');
      });
    };
    // El sombreador se compila en paralelo si el navegador lo permite: así no traba la página mientras tanto.
    var esperar = function () {
      if (ext && !gl.getProgramParameter(pr, ext.COMPLETION_STATUS_KHR)) return setTimeout(esperar, 40);
      empezar();
    };
    esperar();
  }

  window.__ewEscena = function (api) {
    var anclas = api.anclas();
    anclas.forEach(function (ancla, i) {
      var forma = ancla.getAttribute('data-forma') === 'anillo' ? 1 : 0;
      // La primera (portada) arranca ya; las demás cuando están por verse.
      if (i === 0) return lienzo(api, ancla, forma);
      var hecho = 0;
      var io = api.observar(ancla.closest('section') || ancla, function (si) {
        if (!si || hecho) return;
        hecho = 1;
        io.disconnect();
        lienzo(api, ancla, forma);
      }, '700px 0px');
    });
  };
})();
