# Las 5 plantillas (el diseño de la página)

La plantilla es cómo se **ve** la página, no lo que dice: el mismo plan se pinta con otro diseño cambiando solo
`tema.plantilla`. Todas son responsivas (celular y compu), cargan rápido, respetan los colores de la marca con
contraste legible y tienen movimiento sutil (que se apaga solo si la persona tiene «reducir movimiento» o datos móviles
lentos).

Para que la persona las vea con sus propios ojos: `node "<skill>/scripts/vista.mjs" --plantillas --tipo <su tipo>` (la misma
página de ejemplo con las 5, lado a lado, con «Ver completa» y «En celular»).

| plantilla | `tema.plantilla` | cómo se ve | modo | letras (títulos + texto) |
|---|---|---|---|---|
| **Clásica** | `clasica` | Sobria, rápida y a tu gusto: estilos, bordes y modo claro u oscuro | el del plan | la pareja que elijas (abajo) |
| **Nácar** | `nacar` | Clara y luminosa: brillos de nácar con tus colores, una gota de vidrio que se mueve y tarjetas que se apilan | claro | Instrument Sans + Instrument Sans (resaltados en Fraunces cursiva) |
| **Penumbra** | `penumbra` | Oscura y envolvente: aurora de luz y un orbe de partículas que cambia de forma en cada sección | oscuro | Sora + Inter |
| **Voltaje** | `voltaje` | Póster de alto impacto: títulos enormes, panel de luces, bloques de color y marquesinas | oscuro | Anton (mayúsculas) + Bricolage Grotesque |
| **Prisma** | `prisma` | Luz sobre noche: un prisma de luz o tu foto en la portada, botones de degradado, tarjetas de vidrio y secciones claras que dan ritmo | oscuro | Sora + Manrope (rótulos en Jost) |

## Cuándo recomendar cada una

- **Clásica**: el comodín seguro. Marcas con una identidad muy propia (su paleta y sus letras al pie de la letra), algo
  sobrio y directo, o una **VSL** donde lo único que importa es el video. Si dudas, Clásica.
- **Nácar**: marcas cálidas, cercanas o premium y públicos que valoran lo cuidado: educación, bienestar, belleza,
  salud, consultoría, servicios profesionales, gastronomía de autor y **masterclass gratis**. Va muy bien con marcas
  claras o pastel. No la elijas si la marca pide algo oscuro, agresivo o de póster.
- **Penumbra**: tecnología, IA, software, automatización, finanzas, trading, cripto, marketing digital y lanzamientos
  premium; públicos que compran de noche en el celular. Va con marcas oscuras o de colores vivos (verde, azul, violeta,
  cian). No la elijas si el negocio pide luz, calidez o cercanía (salud, niños, repostería): ahí va Nácar.
- **Voltaje**: retos, eventos y lanzamientos con fecha y cupos, fitness, deportes, barberías y negocios urbanos, marcas
  jóvenes y ofertas con urgencia y energía. Va con marcas de colores vivos o neón y voz directa. No la elijas si la
  marca pide calma, lujo discreto o algo clínico, ni para una VSL donde solo importa el video.
- **Prisma**: eventos presenciales o en vivo, experiencias, retiros, mentorías, comunidades, desarrollo personal,
  espiritualidad, conciencia y bienestar profundo; marcas aspiracionales y premium. Va con marcas violetas, azules, cian
  o de colores vivos y con fotos de escenario o de quien enseña. Es la de **vender entradas** (`tipo: evento`). No la
  elijas para algo rústico, infantil, clínico o de urgencia gritada (Voltaje), ni para tecnología o finanzas (Penumbra).

Reglas rápidas:

1. La marca manda: si su paleta y su voz son de choque (negro con neón, mayúsculas, urgencia), Voltaje; si su
   identidad es muy propia, Clásica.
2. Registro a masterclass, curso o servicio «de confianza» con marca clara o pastel: Nácar.
3. VSL: Clásica, salvo marca cálida o premium (Nácar) o de tecnología, IA o finanzas (Penumbra).
4. Negocio local: Nácar para lo que vende cuidado (spa, odontología, estética, repostería); Voltaje para lo que vende
   fuerza o estilo (barbería urbana, gimnasio, tatuajes, taller); Clásica si dudas.
5. Entradas para un evento presencial, retiro o mentoría de desarrollo personal: Prisma.

Recomienda **una** y di por qué en una frase («Te recomiendo Nácar: es clara y cálida, como tu marca de bienestar»).
La persona decide; si cambia de opinión después, es un cambio de una línea.

## Letras

Con una plantilla moderna (Nácar, Penumbra, Voltaje, Prisma) va `"letras": ""` (las de la plantilla). Si la persona
quiere otras, se pone una pareja y ganan las suyas en títulos y texto. Con la Clásica siempre va una pareja:

| `tema.letras` | nombre | títulos + texto | estilo que le va |
|---|---|---|---|
| `impacto` | Impacto | Big Shoulders + Instrument Sans | impacto (mayúsculas, contraste fuerte) |
| `moderno` | Moderno | Space Grotesk + Inter | limpio |
| `editorial` | Editorial | Fraunces + Inter | editorial (serifa, aire de revista) |
| `elegante` | Elegante | Playfair Display + Manrope | editorial |
| `calido` | Cálido | DM Serif Display + DM Sans | editorial |
| `tecnologico` | Tecnológico | Sora + Inter | limpio |
| `amable` | Amable | Nunito + Nunito | limpio |
| `limpio` | Limpio | Plus Jakarta Sans + Plus Jakarta Sans | limpio |
| `potente` | Potente | Anton + Archivo | impacto |
| `creativo` | Creativo | Bricolage Grotesque + Outfit | limpio |

Solo en la Clásica: `tema.estilo` (`impacto`, `editorial`, `limpio`), `tema.radio` (`recto`, `suave`, `redondo`) y
`tema.modo` (`claro`, `oscuro`).

## Colores

- `tema.colores` son los de la **marca** (fondo, texto, primario = botones, acento = resaltados): cada plantilla los
  adapta a su diseño (Nácar los lleva a marfil, Penumbra y Prisma a la noche, Voltaje a su póster negro).
- Si la persona no tiene colores, propón una paleta lista (`fondo`, `texto`, `primario`, `acento`):

| paleta | modo | fondo | texto | primario | acento |
|---|---|---|---|---|---|
| Carbón y lima | oscuro | `#0d0f0c` | `#f2f5ee` | `#d4ff3a` | `#ff7a45` |
| Noche violeta | oscuro | `#0a0910` | `#f6f4ff` | `#7a4eff` | `#3fd0c8` |
| Negro y oro | oscuro | `#0b0b0b` | `#f4efe6` | `#d4a84b` | `#f4efe6` |
| Océano | oscuro | `#06141b` | `#e6f4f8` | `#22c3e6` | `#ffd166` |
| Rojo impacto | oscuro | `#0e0e0e` | `#fafafa` | `#ff3b30` | `#ffd60a` |
| Blanco y azul | claro | `#ffffff` | `#0f172a` | `#2563eb` | `#f59e0b` |
| Crema y terracota | claro | `#f6f1e8` | `#1d1a16` | `#c4532c` | `#2f5d50` |
| Bosque | claro | `#f3f6f1` | `#14211a` | `#1f7a4d` | `#c98a12` |
| Rosa suave | claro | `#fff6f8` | `#2b1220` | `#d6336c` | `#7c3aed` |
| Arena | claro | `#faf7f2` | `#2a2522` | `#8a5a44` | `#5c7c66` |

- Si pide colores exactos para la página («fondo blanco», «botones rojos»), van en `tema.propios` y se respetan tal cual
  en cualquier plantilla: ver [colores-y-cambios.md](colores-y-cambios.md).

## Las variantes de la portada

- `evento`: con el formulario al lado (registro con fecha).
- `video`: el video arriba (VSL).
- `dividido`: texto y foto (cuando hay una buena foto de la persona o del producto).
- `centrado`: sin foto (o, en Prisma, con la foto de fondo).
