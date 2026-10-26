#!/usr/bin/env bash
# Build static site and upload to an existing Hugging Face Space (sdk: static).
# Usage: ./scripts/deploy-hf.sh YOUR_USER/YOUR_SPACE [--dry-run]
#
# Upload is a sync, not an append: DELETE_PATTERNS below tells the Hub to drop
# remote files matching those globs that this build did not produce. Without it
# every renamed chunk (assets/index-<hash>.js) leaves its predecessor behind
# forever. The patterns deliberately do not match .gitattributes, and README.md
# is republished each run, so Space metadata survives.
#
# --dry-run builds, then prints what would be uploaded/deleted without writing.
set -euo pipefail

SPACE=""
DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) SPACE="$arg" ;;
  esac
done

if [[ -z "$SPACE" ]]; then
  echo "Usage: $0 YOUR_USER/YOUR_SPACE [--dry-run]"
  echo "Example: $0 pz1130/Know-Your-AI"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/web"

# Remote files matching these globs are removed when this build does not produce
# them. Note the Hub matches with fnmatch, where * also crosses '/'.
DELETE_PATTERNS='["assets/*", "docs/*", "*.html", "*.css", "*.js", "*.svg"]'

echo "→ Building…"
cd "$WEB"
npm install
npm run build

cp "$WEB/README.md" "$WEB/dist/README.md"

echo "→ Uploading dist/ to hf.co/spaces/$SPACE …"
python3 - <<PY
from huggingface_hub import HfApi
from huggingface_hub.utils import filter_repo_objects
from pathlib import Path

repo_id = "${SPACE}"
dist = Path(r"${WEB}/dist")
delete_patterns = ${DELETE_PATTERNS}
dry_run = ${DRY_RUN}

api = HfApi()
me = api.whoami()["name"]
print(f"  logged in as: {me}")
info = api.space_info(repo_id)
print(f"  sdk: {info.sdk}  host: {info.host}")
if str(info.sdk) != "static":
    print("  warning: Space sdk is not static; this project is a static site.")

# Preview the deletions the upload will perform, using the Hub's own matcher.
remote = [s.rfilename for s in (info.siblings or [])]
local = {str(p.relative_to(dist)) for p in dist.rglob("*") if p.is_file()}
stale = sorted(set(filter_repo_objects(remote, allow_patterns=delete_patterns)) - local)
if stale:
    print(f"  pruning {len(stale)} stale remote file(s):")
    for f in stale:
        print(f"    - {f}")
else:
    print("  no stale remote files")

if dry_run:
    print(f"  dry-run: would upload {len(local)} file(s); nothing written.")
    raise SystemExit(0)

api.upload_folder(
    folder_path=str(dist),
    repo_id=repo_id,
    repo_type="space",
    delete_patterns=delete_patterns,
)
print("✓ Done.")
print(f"  https://huggingface.co/spaces/{repo_id}")
if info.host:
    print(f"  {info.host}")
PY
