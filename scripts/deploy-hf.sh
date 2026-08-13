#!/usr/bin/env bash
# Build static site and upload to an existing Hugging Face Space (sdk: static).
# Usage: ./scripts/deploy-hf.sh YOUR_USER/YOUR_SPACE
set -euo pipefail

SPACE="${1:-}"
if [[ -z "$SPACE" ]]; then
  echo "Usage: $0 YOUR_USER/YOUR_SPACE"
  echo "Example: $0 pz1130/ai-triage-desk"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"

echo "→ Building…"
cd "$WEB"
npm install
npm run build

cp "$WEB/README.md" "$WEB/dist/README.md"

echo "→ Uploading dist/ to hf.co/spaces/$SPACE …"
python3 - <<PY
from huggingface_hub import HfApi
from pathlib import Path

repo_id = "${SPACE}"
dist = Path(r"${WEB}/dist")
api = HfApi()
me = api.whoami()["name"]
print(f"  logged in as: {me}")
info = api.space_info(repo_id)
print(f"  sdk: {info.sdk}  host: {info.host}")
if str(info.sdk) != "static":
    print("  warning: Space sdk is not static; this project is a static site.")
api.upload_folder(
    folder_path=str(dist),
    repo_id=repo_id,
    repo_type="space",
)
print("✓ Done.")
print(f"  https://huggingface.co/spaces/{repo_id}")
if info.host:
    print(f"  {info.host}")
PY
