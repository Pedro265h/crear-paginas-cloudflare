# Cómo se escribe una página que vende

Léelo antes de escribir o reescribir cualquier texto de la página. Son las mismas reglas con que el motor y sus
plantillas se pensaron.

## 1. Reglas que no se negocian

1. **Nada inventado.** Ni precios, ni cifras, ni testimonios, ni nombres, ni logros, ni medios, ni garantías, ni fechas,
   ni cupos, ni links que la persona no dio. Si una sección lo necesita y no está, va **por completar**:
   - campo entero: `{ "porCompletar": "tu precio" }`
   - dentro de un texto: `[[POR COMPLETAR: cuántos alumnos has tenido]]`
   Mejor un hueco honesto que una mentira que tumba la cuenta publicitaria y la marca. La página no se publica con
   huecos (`publicar.mjs` se niega): o la persona da el dato, o la sección se quita (`"oculta": true` o se borra).
2. **Cero promesas de ingresos garantizados**: nada de «hazte rico», «dinero fácil», «resultados garantizados», antes y
   después de cuerpos, ni ataques a características personales del lector («¿eres gordo?»). Meta además lo rechaza.
   Se habla del resultado posible y del proceso.
3. **Una página, una acción.** Todo empuja al mismo botón (registrarse, comprar, escribir por WhatsApp o agendar).
   Nada de links que saquen a la persona antes de convertir (Instagram, el sitio de la marca, «conoce más»). Mapas y
   redes solo en negocio local o en la página de gracias.
4. **El botón se ve sin bajar en el celular.** La portada tiene que caber: antetítulo corto, título, subtítulo de una o
   dos líneas, botón.
5. **Especificidad mata humo.** Números, plazos, nombres propios y escenas concretas, siempre que sean reales.
   «Aprende marketing» no; «Monta tu primera campaña que vende en 7 días, aunque nunca hayas abierto el Administrador
   de Anuncios» sí.
6. **Beneficio antes que característica.** Cada ítem dice qué gana la persona («Sabes qué anuncio apagar cada
   mañana»), no qué trae el producto («Módulo de métricas»).
7. **La voz es la de la marca.** Si no hay una definida: cercana, directa, frases cortas.
8. **Español neutro latinoamericano, con tuteo.** Nada de voseo ni modismos de un solo país (parce, che, güey, tío),
   salvo que la marca los pida para su público local. Ortografía impecable: tildes y signos de apertura (¿¡).

## 2. La portada (lo que más pesa)

- **Antetítulo:** quién, qué o cuándo en 2 a 6 palabras («Masterclass gratis · En vivo», «Para dueños de restaurantes»).
- **Título:** la promesa. Fórmulas que funcionan:
  - resultado deseado + sin el obstáculo que más odian: «Llena tu agenda de pacientes sin depender del boca a boca»;
  - la habilidad u oportunidad + para quién + diferencia;
  - contradicción de una creencia del nicho: «Deja de publicar todos los días: así consiguen clientes los consultorios que crecen»;
  - número + plazo + resultado (solo si es real).
- **Frase resaltada (`resaltado`):** 1 a 4 palabras del título que cargan la promesa; tienen que estar tal cual en el título.
- **Subtítulo:** quita la objeción principal («sin saber programar», «aunque empieces de cero», «en 15 minutos al día»).
- **Puntos clave (opcional):** 3, cortos y concretos (máx. 6 palabras cada uno).
- **Botón:** verbo en primera persona + lo que recibe: «Reservar mi cupo gratis», «Quiero mi acceso», «Agendar mi
  cita», «Escribir por WhatsApp», «Quiero mi entrada». Nunca «Enviar» ni «Clic aquí». Máximo 32 caracteres.
- **Nota bajo el botón:** quita el miedo con 2 o 3 datos separados por « · »: «100% gratis · En vivo · Queda grabada»,
  «Pago seguro · Acceso inmediato», «Respondemos en minutos». Solo datos ciertos: «Cupos limitados» únicamente si la
  persona dijo que hay cupos.

## 3. Recetas por tipo de página

### Registro a una clase o evento gratis (`registro`)
Aviso con la fecha → portada con formulario → **lo que vas a descubrir** (3 a 5 puntos, cada uno un mini resultado) →
**por qué ahora** (la ventana que se cierra; cifras solo con fuente real) → **comparación** (esta clase vs. otros
cursos o hacerlo solo) → **para quién es / no es** → **quién te enseña** (historia corta en primera persona + logros
reales) → testimonios (si hay) → formulario → preguntas frecuentes (¿cuesta?, ¿necesito saber X?, ¿queda grabada?,
¿cuánto dura?) → cierre que repite la promesa → pie.
- El formulario pide lo mínimo: nombre, correo y WhatsApp (el WhatsApp sube la asistencia: ahí van los recordatorios).
- La página de gracias confirma con el nombre (`"¡Listo{nombre}! Tu cupo está confirmado"`), dice qué hacer ahora
  (entrar al grupo de WhatsApp, agendar, preparar algo) y no vende nada.

### VSL (`vsl`)
Arriba: antetítulo que llama al avatar («Si tienes un negocio y vendes por WhatsApp…»), el título con la promesa, el
video y el botón (que puede aparecer en el minuto en que el video presenta la oferta: `video.ctaSegundos`). Debajo,
para quien no ve el video completo: beneficios, testimonios, la oferta con todo lo que incluye y su precio, garantía,
preguntas y cierre. Sin precio dado: la oferta va sin precio y el botón dice «Quiero aplicar» o «Ver la oferta».

### Página de ventas larga (`ventas`)
Portada con la promesa → **el problema** en palabras del cliente (4 a 6 dolores concretos + una frase que quita la
culpa: «No es tu culpa: nadie te enseñó…») → **el método** con nombre propio y 3 pasos → beneficios → quién lo enseña →
testimonios → temario (cada módulo con el resultado que deja) → bonos (cada uno ataca un riesgo distinto) → oferta con
el valor de cada cosa, el total y el precio real → garantía → preguntas → cierre con decisión («puedes seguir igual o
empezar hoy»).

### Entradas para un evento presencial (`evento`)
Barra con la fecha → **portada** (foto o el prisma de luz, quién/qué, el nombre del evento, la promesa, el botón, la
fecha y la ciudad) → **cifras** (solo reales) → **el problema** → **la idea que lo explica** → **qué es y qué no es** →
**el día paso a paso** (3 a 5 momentos con nombre propio) → **la transformación** → **dos caminos** (el costo de no ir
frente a lo que cambia) → **para quién es / no es** → **quiénes guían** (foto, nombre, rol e historia) → **por qué esta
edición** → **las entradas** (cada nivel con su precio, lo que incluye y lo que no, sus cupos solo si los dio, una
«Recomendada», su link de pago y la cuenta regresiva) → **dudas por WhatsApp** → **experiencias exclusivas** →
**logística** (fecha, horario, lugar, formato) → **preguntas** (¿puedo ir con alguien?, ¿vengo de otra ciudad?,
cambios y reembolsos) → **cierre** → pie.
- Con varias entradas, el botón principal lleva a elegirlas (`#entradas`).
- «Más elegida» solo si la persona dijo que es la que más se vende; si no, «Recomendada».
- Cada entrada sin precio, sin cupos o sin link de pago queda por completar.

### Negocio local o servicios (`local`)
Portada: qué hace + dónde + para quién, con foto real del lugar o del trabajo y botón a WhatsApp con mensaje listo
(«Hola, vi su página y quiero información sobre…»). Servicios con precio «desde» si lo dio. Cifras solo reales (años,
clientes atendidos), cómo funciona en 3 pasos, reseñas reales, galería, ubicación con horarios y el link de Google Maps,
preguntas (¿domicilios?, ¿formas de pago?, ¿necesito cita?) y cierre.

## 4. Copy de cada sección

- **Títulos de sección:** afirman algo, no etiquetan. «En una hora te llevas el sistema completo» en vez de
  «Beneficios». El antetítulo sí puede etiquetar («Lo que vas a descubrir»).
- **Listas:** paralelas (todas empiezan igual), cortas, una idea por ítem.
- **Para quién es:** perfiles concretos y reconocibles, no adjetivos («personas motivadas»).
- **Preguntas frecuentes:** las objeciones reales en la voz del cliente; respuestas de 1 a 3 frases que cierran la duda.
- **Cierre:** repite la promesa en una frase, nombra lo que se pierde si no actúa y vuelve el botón.
- **Testimonios:** solo los que dio la persona, citados tal cual (se pueden acortar sin cambiar el sentido). Sin
  testimonios reales, la sección se quita (no se rellena con ejemplos).
- **Quién te enseña:** su historia en primera persona y logros que la persona contó. Foto: si te la va a pasar, por
  completar; si no tiene, `imagen: ""` (la sección se ve bien sin foto).
- **Pie (`pie.texto`):** en cursos y mentorías, el aviso «Esta formación es educativa y no garantiza resultados ni
  ingresos específicos.»

## 5. Fórmulas de apoyo

- **AIDA** (páginas cortas o tráfico frío): atención → interés → deseo → acción.
- **PAS** (dolor claro): problema → agitación → solución.
- **4 P** (un problema fuerte): problema → promesa → prueba → propuesta.
- **4 pasos** (marca nueva): qué tienes → qué hace por ellos → quién eres → qué hacer ahora.

## 6. Ritmo

- Alterna secciones de texto con secciones visuales (tarjetas, cifras, comparación, foto).
- En páginas largas, un botón intermedio cada 2 o 3 secciones (no en todas).
- Horas: el motor pinta la fecha y la hora del evento solo, en formato de 24 horas («16:00 (hora de Colombia)»). En
  tus textos escribe la hora igual, para no mezclar «4:00 p. m.» con «16:00».
- El SEO también se escribe: `seo.titulo` (máx. 70) y `seo.descripcion` (máx. 160) son lo que se ve al compartir el
  link en WhatsApp o redes.
