# Walkthrough 01 · Instalar Node (Mac, Windows y Linux)

> Node es el motor que corre los programas de la skill (armar la página, la vista previa, publicar). Hace falta la
> versión 20 o más nueva; se instala la **LTS** (la estable). Tú corres los comandos; la persona solo aprueba lo que
> le pida su compu.

Explícaselo así:

```
Para que tu compu pueda armar y publicar la página necesita un programa gratis que se
llama Node. Es como instalar Word para abrir un .docx: sin él, tu compu no entiende los
archivos de la página. Lo instalo yo; tú solo vas a aprobar cuando tu compu te lo pida.
```

## Mac

1. ¿Tiene Homebrew? Corre `brew --version`.
   - **Sí** → `brew install node` (tarda 1 o 2 minutos). Listo, salta a «Comprobar».
   - **No** → sigue con el instalador oficial.
2. Abre la página de descarga: `open "https://nodejs.org/es/download"` y dile:

```
Te abrí la página de Node. Toca el botón verde del "Instalador para macOS (.pkg)" de la
versión LTS. Cuando se descargue, ábrelo y toca "Continuar" hasta "Instalar".

Tu Mac te va a pedir tu contraseña: es la misma con la que prendes la compu. Mientras la
escribes no se ve nada (ni puntitos): es normal, escríbela y presiona Enter.

Cuando diga "La instalación se completó", dime "listo".
```

3. Si la persona prefiere no poner su contraseña, usa nvm (no la pide):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm install --lts
```

## Windows

1. Instálalo con winget (viene con Windows 10 y 11):

```powershell
winget install --id OpenJS.NodeJS.LTS -e --accept-source-agreements --accept-package-agreements
```

2. Antes de correrlo, avísale:

```
Windows te va a preguntar "¿Quieres permitir que esta aplicación haga cambios en el
dispositivo?". Es el instalador de Node: dile que Sí.
```

3. Si no hay winget (`winget` no se reconoce): `start https://nodejs.org/es/download` → «Instalador para Windows
   (.msi)» de la versión LTS → Siguiente, Siguiente… **deja marcadas todas las opciones** (sobre todo «Add to PATH») →
   Instalar → Sí cuando Windows pida permiso.
4. **Muy importante:** las ventanas que ya estaban abiertas no ven a Node hasta que se reabren. Pídele que **cierre
   Claude Code y lo vuelva a abrir** en la misma carpeta, y que te escriba «continuar mi página». Mientras tanto, puedes
   usar la ruta completa: `"C:\Program Files\nodejs\node.exe"`.
5. Si PowerShell dice «la ejecución de scripts está deshabilitada» al usar `npx`: usa `npx.cmd` en vez de `npx`, o
   corre una vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (pídele que diga «S» para aceptar).

## Linux

Sin contraseña, con nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm install --lts
```

(Con contraseña, en Ubuntu o Debian: `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -` y
`sudo apt-get install -y nodejs`. `sudo` pide la contraseña en la terminal de la persona: pídele que lo corra ella.)

## Comprobar

```bash
node --version
npm --version
```

Tiene que decir `v20` o más (por ejemplo `v24.11.0`). Después vuelve a correr `scripts/preparar.mjs`.

Si sigue diciendo que no existe:

- **Mac:** cierra y abre la ventana (o Claude Code). Si usaste nvm: `. "$HOME/.nvm/nvm.sh"`.
- **Windows:** cierra y abre Claude Code. Si aún no, reinicia la compu.
- Si nada funciona: pídele una captura de pantalla del error y mira `99-problemas.md`.

Cuando esté:

```
¡Listo! Ya tienes Node instalado. Esto se hace una sola vez en tu compu.
```
