#!/usr/bin/env bash
# Install a local pre-commit hook that runs glossary parity check.
# Safe no-op if this directory is not a git repo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ ! -d "$ROOT/.git" ]]; then
  echo "No .git in $ROOT — skip hook install (ok for HF-only clones)."
  exit 0
fi
HOOK="$ROOT/.git/hooks/pre-commit"
mkdir -p "$ROOT/.git/hooks"
cat > "$HOOK" << 'EOF'
#!/usr/bin/env bash
# Auto-installed by scripts/install-git-hooks.sh
set -euo pipefail
ROOT="$(git rev-parse --show-toplevel)"
# Only run when glossary sources change
if git diff --cached --name-only | grep -qE 'glossary\.ts$|概念讲解手册_给IT团队\.md$|sync-glossary\.mjs$|check-glossary\.mjs$'; then
  echo "→ glossary check (staged glossary-related files)"
  node "$ROOT/scripts/check-glossary.mjs"
fi
EOF
chmod +x "$HOOK"
echo "Installed pre-commit hook → $HOOK"
echo "Runs scripts/check-glossary.mjs when glossary-related files are staged."
