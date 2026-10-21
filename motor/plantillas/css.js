// `css` para escribir el CSS de una plantilla legible (con saltos, sangrías y comentarios) y guardarlo compacto: quita
// comentarios y espacios de más al cargar el módulo (una vez). Solo toca espacios: nunca dentro de calc() ni de las
// cadenas, porque no quita espacios alrededor de + y -.
export function css(partes, ...valores) {
  const crudo = String.raw({ raw: partes }, ...valores);
  return crudo
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/\s+!important/g, '!important')
    .replace(/;}/g, '}')
    .trim();
}
