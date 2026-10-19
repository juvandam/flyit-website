#!/usr/bin/env bash
# IndexNow ping — Fly It Aviation
# Avisa a Bing, Yandex y otros buscadores compatibles con IndexNow
# que una o varias URLs del sitio son nuevas o cambiaron.
#
# Uso:
#   ./scripts/indexnow.sh                           # pinga todas las URLs del sitemap.xml
#   ./scripts/indexnow.sh https://www.flyit.com.ar/mooney-m20c.html  # pinga una URL
#   ./scripts/indexnow.sh url1 url2 url3            # pinga varias URLs
#
# Compatible con bash 3.2 (macOS por defecto).

set -eu

HOST="www.flyit.com.ar"
KEY="8a7656f4a995918d4aff5df868b4b383ec1f161b447e7217a24c623cc5bbd2a7"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
ENDPOINT="https://api.indexnow.org/IndexNow"

# Carpeta del script → raíz del repo
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "${SCRIPT_DIR}/.." && pwd )"

URLS=()

if [ "$#" -eq 0 ]; then
  SITEMAP="${REPO_ROOT}/sitemap.xml"
  if [ ! -f "${SITEMAP}" ]; then
    echo "ERROR: no se encontró ${SITEMAP} y no se pasaron URLs" >&2
    exit 1
  fi
  # Compatible con bash 3.2: usamos while-read en vez de mapfile
  while IFS= read -r line; do
    URLS+=("$line")
  done < <(grep -oE '<loc>[^<]+</loc>' "${SITEMAP}" | sed -e 's|<loc>||' -e 's|</loc>||')
else
  for u in "$@"; do
    URLS+=("$u")
  done
fi

if [ "${#URLS[@]}" -eq 0 ]; then
  echo "ERROR: ninguna URL para enviar" >&2
  exit 1
fi

# Construir el payload JSON
URL_LIST=""
for u in "${URLS[@]}"; do
  URL_LIST+="\"$u\","
done
URL_LIST="${URL_LIST%,}"

PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [${URL_LIST}]
}
EOF
)

echo "Enviando ${#URLS[@]} URL(s) a IndexNow (Bing + Yandex)..."
for u in "${URLS[@]}"; do echo "  → $u"; done

HTTP_CODE=$(curl -s -o /tmp/indexnow-response.txt -w "%{http_code}" \
  -X POST "${ENDPOINT}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${PAYLOAD}")

echo "---"
echo "HTTP ${HTTP_CODE}"
case "${HTTP_CODE}" in
  200|202) echo "✅ OK: URLs aceptadas por IndexNow" ;;
  400) echo "⚠️  400: formato inválido" ;;
  403) echo "⚠️  403: clave no encontrada en ${KEY_LOCATION}" ;;
  422) echo "⚠️  422: URL no pertenece al host, o la clave no coincide" ;;
  429) echo "⚠️  429: demasiadas peticiones, esperar antes de reintentar" ;;
  *) echo "ℹ️  Respuesta inesperada" ;;
esac
cat /tmp/indexnow-response.txt 2>/dev/null | head -20
echo ""
