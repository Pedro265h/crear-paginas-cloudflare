# install.ps1 — Instala la skill "crear-paginas" en Claude Code (Windows)
#
# Uso (PowerShell, una línea):
#   irm https://raw.githubusercontent.com/Pedro265h/crear-paginas-cloudflare/main/install.ps1 | iex
#
# O clonando a mano:
#   git clone https://github.com/Pedro265h/crear-paginas-cloudflare.git
#   .\crear-paginas-cloudflare\install.ps1

$ErrorActionPreference = "Stop"

$SkillName = "crear-paginas"
$RepoUrl = "https://github.com/Pedro265h/crear-paginas-cloudflare.git"
$Target = Join-Path $HOME ".claude\skills\$SkillName"

Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "  │  Instalador: skill 'crear-paginas'              │" -ForegroundColor Cyan
Write-Host "  │  Páginas de venta publicadas en tu Cloudflare   │" -ForegroundColor Cyan
Write-Host "  └─────────────────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""
Write-Host "  ✓ Sistema operativo: Windows"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host ""
  Write-Host "  ✗ Necesitas Git instalado." -ForegroundColor Red
  Write-Host "    Descárgalo de https://git-scm.com/download/win (o: winget install --id Git.Git -e)"
  Write-Host "    Después cierra y vuelve a abrir PowerShell."
  exit 1
}
Write-Host "  ✓ Git listo"

$ClaudeDir = Join-Path $HOME ".claude"
if (-not (Test-Path $ClaudeDir)) {
  Write-Host ""
  Write-Host "  ✗ No encuentro la carpeta ~\.claude" -ForegroundColor Red
  Write-Host "    ¿Tienes Claude Code instalado? Instálalo primero desde https://claude.com/code"
  exit 1
}
Write-Host "  ✓ Claude Code detectado"

if (Get-Command node -ErrorAction SilentlyContinue) {
  Write-Host "  ✓ Node $(node --version)"
} else {
  Write-Host "  ! Todavía no tienes Node: no pasa nada, la skill te ayuda a instalarlo." -ForegroundColor Yellow
}

$SkillsDir = Join-Path $HOME ".claude\skills"
if (-not (Test-Path $SkillsDir)) {
  New-Item -ItemType Directory -Path $SkillsDir -Force | Out-Null
}

if (Test-Path $Target) {
  Write-Host ""
  Write-Host "  ! Ya tienes 'crear-paginas' instalada en $Target" -ForegroundColor Yellow
  $Resp = Read-Host "  ¿La actualizo a la última versión? (s/n)"
  if ($Resp -notmatch "^[Ss]$") {
    Write-Host "  Instalación cancelada. Tu skill queda como estaba."
    exit 0
  }
  Remove-Item -Path $Target -Recurse -Force
}

Write-Host ""
Write-Host "  → Descargando la skill desde GitHub..."
$TmpDir = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
$TmpRepo = Join-Path $TmpDir $SkillName
git clone --depth 1 --quiet $RepoUrl $TmpRepo
Remove-Item -Path (Join-Path $TmpRepo ".git") -Recurse -Force
Move-Item -Path $TmpRepo -Destination $Target
Remove-Item -Path $TmpDir -Recurse -Force
Write-Host "  ✓ Skill instalada en: $Target"

Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────────┐" -ForegroundColor Green
Write-Host "  │  INSTALACIÓN COMPLETA                           │" -ForegroundColor Green
Write-Host "  └─────────────────────────────────────────────────┘" -ForegroundColor Green
Write-Host ""
Write-Host "  Para usarla:"
Write-Host ""
Write-Host "    1. Abre (o reinicia) Claude Code"
Write-Host "    2. Escribe: /crear-paginas   o   quiero crear mi página"
Write-Host "    3. Claude te guía paso a paso"
Write-Host ""
Write-Host "  La primera vez tarda unos 30 minutos (incluye preparar tu compu y tu Cloudflare)."
Write-Host ""
