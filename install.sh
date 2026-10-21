#!/usr/bin/env bash
# install.sh — Instala la skill "crear-paginas" en Claude Code (Mac / Linux)
#
# Uso (una línea):
#   curl -fsSL https://raw.githubusercontent.com/Pedro265h/crear-paginas-cloudflare/main/install.sh | bash
#
# O clonando a mano:
#   git clone https://github.com/Pedro265h/crear-paginas-cloudflare.git
#   bash crear-paginas-cloudflare/install.sh

set -euo pipefail

SKILL_NAME="crear-paginas"
REPO_URL="https://github.com/Pedro265h/crear-paginas-cloudflare.git"
TARGET="$HOME/.claude/skills/$SKILL_NAME"

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  Instalador: skill 'crear-paginas'              │"
echo "  │  Páginas de venta publicadas en tu Cloudflare   │"
echo "  └─────────────────────────────────────────────────┘"
echo ""

case "$(uname -s)" in
  Darwin*) OS_NAME="macOS" ;;
  Linux*)  OS_NAME="Linux" ;;
  *)       OS_NAME="Desconocido" ;;
esac
echo "  ✓ Sistema operativo: $OS_NAME"

if ! command -v git >/dev/null 2>&1; then
  echo ""
  echo "  ✗ Necesitas Git instalado."
  echo "    En Mac: ejecuta 'xcode-select --install' o instálalo desde https://git-scm.com"
  echo "    En Linux: 'sudo apt install git' (o el equivalente de tu sistema)"
  exit 1
fi
echo "  ✓ Git listo"

if [ ! -d "$HOME/.claude" ]; then
  echo ""
  echo "  ✗ No encuentro la carpeta ~/.claude"
  echo "    ¿Tienes Claude Code instalado? Instálalo primero desde https://claude.com/code"
  exit 1
fi
echo "  ✓ Claude Code detectado"

if command -v node >/dev/null 2>&1; then
  echo "  ✓ Node $(node --version)"
else
  echo "  ! Todavía no tienes Node: no pasa nada, la skill te ayuda a instalarlo."
fi

mkdir -p "$HOME/.claude/skills"

if [ -d "$TARGET" ]; then
  echo ""
  echo "  ! Ya tienes 'crear-paginas' instalada en $TARGET"
  read -r -p "  ¿La actualizo a la última versión? (s/n): " RESP < /dev/tty || RESP="n"
  if [[ ! "$RESP" =~ ^[Ss]$ ]]; then
    echo "  Instalación cancelada. Tu skill queda como estaba."
    exit 0
  fi
  rm -rf "$TARGET"
fi

echo ""
echo "  → Descargando la skill desde GitHub..."
TMP_DIR=$(mktemp -d)
git clone --depth 1 --quiet "$REPO_URL" "$TMP_DIR/$SKILL_NAME"
rm -rf "$TMP_DIR/$SKILL_NAME/.git"
mv "$TMP_DIR/$SKILL_NAME" "$TARGET"
rm -rf "$TMP_DIR"
echo "  ✓ Skill instalada en: $TARGET"

echo ""
echo "  ┌─────────────────────────────────────────────────┐"
echo "  │  INSTALACIÓN COMPLETA                           │"
echo "  └─────────────────────────────────────────────────┘"
echo ""
echo "  Para usarla:"
echo ""
echo "    1. Abre (o reinicia) Claude Code"
echo "    2. Escribe: /crear-paginas   o   quiero crear mi página"
echo "    3. Claude te guía paso a paso"
echo ""
echo "  La primera vez tarda unos 30 minutos (incluye preparar tu compu y tu Cloudflare)."
echo ""
