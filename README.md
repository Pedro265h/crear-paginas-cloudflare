# Crear Páginas · Skill para Claude Code

> Tu página de venta con diseño profesional, publicada en tu propio Cloudflare y con tu dominio, en unos 30 minutos.
> Tú le cuentas a Claude tu oferta; Claude escribe, diseña, publica y comprueba que todo funcione.

[![Instalar](https://img.shields.io/badge/instalar-1_comando-cyan)](#instalación)
[![macOS](https://img.shields.io/badge/macOS-✓-blue)](#) [![Windows](https://img.shields.io/badge/Windows-✓-blue)](#) [![Linux](https://img.shields.io/badge/Linux-✓-blue)](#)

---

## ¿Qué hace?

Convierte tu oferta en una **página de venta lista para pauta**, publicada en internet:

- **5 diseños profesionales** (Clásica, Nácar, Penumbra, Voltaje y Prisma), con movimiento sutil, rápidos en el
  celular y adaptados a los colores de tu marca.
- **5 tipos de página** con su receta de venta: registro a una masterclass o evento gratis, VSL (video de ventas),
  página de ventas larga, entradas para un evento presencial y negocio local con WhatsApp.
- **Formulario que guarda tus registros** en tu propia base de datos de Cloudflare, con su página de gracias, freno
  contra robots, las etiquetas de campaña (UTM) de cada persona y exportación a Excel.
- **Páginas legales** (política de privacidad y términos) con la ley de datos de tu país.
- **Tu dominio** (www.tumarca.com) con su candado de seguridad, o la dirección gratis de Cloudflare.
- **Píxel de Meta** y, si quieres, la API de conversiones; **webhook** a GoHighLevel, Zapier o Make.
- **Cambios por órdenes**: «pon el botón rojo», «quita los precios», «pon mi foto». Lo ves al instante en tu navegador.
- **Nada inventado**: ni precios, ni cifras, ni testimonios. Lo que falta queda marcado «por completar» y la página no
  se publica con huecos.

Todo vive en **tu** cuenta de Cloudflare (el plan gratis alcanza). La página, los registros y el dominio son tuyos.

---

## Instalación

### Con un comando (recomendado)

```bash
npx skills add Pedro265h/crear-paginas-cloudflare -g -s crear-paginas -y
```

### Mac / Linux

```bash
curl -fsSL https://raw.githubusercontent.com/Pedro265h/crear-paginas-cloudflare/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Pedro265h/crear-paginas-cloudflare/main/install.ps1 | iex
```

### A mano (cualquier sistema)

```bash
git clone https://github.com/Pedro265h/crear-paginas-cloudflare.git ~/.claude/skills/crear-paginas
```

---

## Cómo se usa

1. Abre **Claude Code** (en cualquier carpeta).
2. Escribe:

   ```
   /crear-paginas
   ```

   o en tus palabras:

   ```
   quiero crear mi página para vender entradas de mi evento
   ```

3. Responde lo que te pregunta, de a una cosa. Claude te dice exactamente qué hacer cuando hace falta que toques algo
   (crear tu cuenta de Cloudflare y darle permiso a tu compu).
4. Al final tienes tu página publicada, con su dirección y su formulario funcionando.

Para volver otro día: abre Claude Code en la carpeta de tu página (`~/mis-paginas/<nombre>`) y escribe
**«continuar mi página»**.

---

## Lo que necesitas

1. **Claude Code**: https://claude.com/code
2. **Una cuenta gratis de Cloudflare**: la creas durante el proceso.
3. **Node.js**: si no lo tienes, la skill te ayuda a instalarlo.

### Costos

| | costo |
|---|---|
| Cloudflare (página, base de registros, candado) | gratis: 100.000 visitas al día al Worker y 5 GB de registros |
| Dominio propio (opcional) | desde ~US$10 al año (un .com en Cloudflare) |
| Claude Code | según tu plan |

---

## ¿Qué viene adentro?

```
crear-paginas/
├── SKILL.md                    # cómo trabaja Claude, fase por fase
├── walkthroughs/               # guías paso a paso (instalar, cuenta, token, dominio, registros, problemas)
├── reference/                  # catálogo de secciones, plantillas, reglas de copy, cambios por órdenes, glosario
├── scripts/                    # preparar, nuevo, vista, armar, revisar, fotos, publicar, registros, token, secreto
├── motor/                      # el motor que convierte el plan de la página en HTML (5 plantillas, letras)
├── plantilla-sitio/            # el sitio en Cloudflare (Worker + base D1) que se copia a cada página
└── ejemplos/                   # 5 páginas de ejemplo de negocios ficticios, una por tipo
```

Cada página queda en su propia carpeta (por defecto `~/mis-paginas/<nombre>`):

```
mi-pagina/
├── plan.json      # la página (textos, secciones, diseño)
├── marca.json     # tus datos para las páginas legales
├── fotos/         # tus fotos
├── sitio/         # lo que se publica
├── src/ · schema.sql · wrangler.jsonc   # el sitio en Cloudflare
└── ESTADO.md      # en qué va todo (para retomar)
```

---

## Si te atoras

1. Pregúntale a Claude: tiene una guía de problemas comunes (`walkthroughs/99-problemas.md`).
2. Pregunta en la comunidad: https://www.skool.com/pedro-hernandez-7383

---

## Licencias

- Código: MIT (ver `LICENSE`).
- Letras: SIL Open Font License 1.1 (`motor/fuentes/licencias/`).
- Fotos de los ejemplos: Licencia de Pexels (`ejemplos/fotos/CREDITOS.md`).

---

## Sobre esta skill

Creada por **Pedro Hernández**: IA aplicada al marketing y la automatización, en español. Sistemas reales con Claude
Code, agentes y páginas que venden.

¿Quieres aprender a crear páginas, agentes y sistemas más avanzados? Súmate a la comunidad:

**https://www.skool.com/pedro-hernandez-7383**

- Instagram: [@pedro.hernandez._](https://instagram.com/pedro.hernandez._)
