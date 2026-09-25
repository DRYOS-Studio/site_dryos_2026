#!/usr/bin/env bash
# S3: sem git no PATH e com config vazia, o plugin instala pelo canal do site e carrega os 8 agentes.
# Uso: scripts/check-nogit-install.sh [base-url]   (default: https://www.dryos.com.br)
set -euo pipefail
BASE="${1:-https://www.dryos.com.br}"
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
mkdir -p "$T/bin" "$T/home" "$T/cfg"
ln -s "$(readlink -f "$(command -v claude)")" "$T/bin/claude"
c() { env -i HOME="$T/home" PATH="$T/bin" CLAUDE_CONFIG_DIR="$T/cfg" "$T/bin/claude" "$@"; }
[ -z "$(env -i PATH="$T/bin" sh -c 'command -v git' 2>/dev/null || true)" ] || { echo "S3 FAIL: git no PATH"; exit 1; }
c plugin marketplace add "$BASE/plugins/marketplace.json" >/dev/null
c plugin install agentes-juridicos@dryos >/dev/null
inv=$(c plugin details agentes-juridicos | grep -E '^\s+Agents \(')
echo "$inv" | grep -q 'Agents (8)' || { echo "S3 FAIL: $inv"; exit 1; }
echo "S3 ok: sem git, $BASE → 8 agentes"
