#!/bin/bash
# Usage: ./release-version.sh 1.5
# Sync version fields for 暨阳中学 and run recompile.sh.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="暨阳中学"
STATE_FILE="$SCRIPT_DIR/tavern-cards-state.json"
CARDRC_FILE="$SCRIPT_DIR/.cardrc.json"
RECOMPILE="$SCRIPT_DIR/recompile.sh"

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 1.5"
  exit 1
fi

RAW_VERSION="$1"
VERSION="${RAW_VERSION#v}"
if ! [[ "$VERSION" =~ ^[0-9]+(\.[0-9]+)*$ ]]; then
  echo "Invalid version: $RAW_VERSION"
  echo "Use a version like 1.5 or v1.5"
  exit 1
fi

VERSION_TAG="v$VERSION"
DISPLAY_NAME="${PROJECT}${VERSION_TAG}"
OUTPUT_FILE="${DISPLAY_NAME}.png"
ARTIFACT_PATH="${OUTPUT_FILE}"

if [ ! -f "$STATE_FILE" ]; then
  echo "Missing state file: $STATE_FILE"
  exit 1
fi

if [ ! -f "$CARDRC_FILE" ]; then
  echo "Missing .cardrc.json: $CARDRC_FILE"
  exit 1
fi

if [ ! -x "$RECOMPILE" ]; then
  echo "Missing executable recompile script: $RECOMPILE"
  exit 1
fi

STATE_FILE="$STATE_FILE" CARDRC_FILE="$CARDRC_FILE" PROJECT="$PROJECT" \
DISPLAY_NAME="$DISPLAY_NAME" VERSION_TAG="$VERSION_TAG" OUTPUT_FILE="$OUTPUT_FILE" \
ARTIFACT_PATH="$ARTIFACT_PATH" python3 - <<'PY'
import json
import os
from pathlib import Path

state_path = Path(os.environ["STATE_FILE"])
cardrc_path = Path(os.environ["CARDRC_FILE"])
project = os.environ["PROJECT"]
display_name = os.environ["DISPLAY_NAME"]
version_tag = os.environ["VERSION_TAG"]
output_file = os.environ["OUTPUT_FILE"]
artifact_path = os.environ["ARTIFACT_PATH"]

state = json.loads(state_path.read_text())
state["projectName"] = display_name
state["worldbookName"] = display_name
state["version"] = version_tag
state["avatar"] = output_file
state_path.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")

cardrc = json.loads(cardrc_path.read_text())
cardrc.setdefault("projects", {}).setdefault(project, {})["state_file"] = "tavern-cards-state.json"
cardrc["projects"][project]["artifact"] = artifact_path
cardrc_path.write_text(json.dumps(cardrc, ensure_ascii=False, indent=4) + "\n")
PY

echo "=== 发布 ${DISPLAY_NAME} ==="
echo "  -> state: projectName/worldbookName/version/avatar 已同步"
echo "  -> artifact: ${ARTIFACT_PATH}"
"$RECOMPILE"
