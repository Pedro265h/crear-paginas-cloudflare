// Atajos para describir los campos de cada sección. El estudio arma los formularios con esto y la IA lo recibe como
// contrato de lo que puede llenar.
//   t: 'texto' (una línea) · 'largo' (párrafo) · 'imagen' · 'lista' (ítems con sus propios campos)
//   ayuda: lo que se le explica a la IA y a la persona · max: largo sugerido · min/max en listas: cuántos ítems

export const texto = (etiqueta, o = {}) => ({ t: 'texto', etiqueta, ...o });
export const largo = (etiqueta, o = {}) => ({ t: 'largo', etiqueta, ...o });
export const imagen = (etiqueta, o = {}) => ({ t: 'imagen', etiqueta, ...o });
export const lista = (etiqueta, campos, o = {}) => ({ t: 'lista', etiqueta, campos, ...o });

// Cabecera que repiten casi todas las secciones.
export const CABECERA = {
  antetitulo: texto('Antetítulo', { max: 50, ayuda: 'Etiqueta corta arriba del título, ej. "Lo que vas a descubrir"' }),
  titulo: texto('Título', { max: 110 }),
  resaltado: texto('Frase resaltada', { max: 40, ayuda: 'Parte del título que va en color de acento. Debe aparecer tal cual en el título.' }),
  subtitulo: largo('Subtítulo', { max: 220 }),
};

export const BOTON = {
  boton: texto('Texto del botón', { max: 32, ayuda: 'Verbo + beneficio, ej. "Reservar mi cupo gratis". Vacío = el de la página.' }),
  nota: texto('Nota bajo el botón', { max: 80, ayuda: 'Quita miedo: "Gratis · 100% online · Cupos limitados"' }),
};
