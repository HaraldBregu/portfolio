#!/usr/bin/env bash
#
# Auto-commit script.
# Stages all changes (respecting .gitignore) and creates a commit with a
# timestamped message. Optionally pushes to the remote.
#
# Usage:
#   bash .claude/autocommit.sh
#   bash .claude/autocommit.sh --push
#   bash .claude/autocommit.sh -m "custom message"
#   bash .claude/autocommit.sh -m "custom message" --push
#
# To wire this up as a Claude Code Stop hook so it runs automatically at the
# end of each Claude session, add to .claude/settings.json:
#
#   {
#     "hooks": {
#       "Stop": [
#         { "hooks": [{ "type": "command", "command": "bash .claude/autocommit.sh" }] }
#       ]
#     }
#   }

set -euo pipefail

PUSH=0
CUSTOM_MSG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --push)
      PUSH=1
      shift
      ;;
    -m|--message)
      if [[ $# -lt 2 ]]; then
        echo "Error: --message requires a value." >&2
        exit 2
      fi
      CUSTOM_MSG="$2"
      shift 2
      ;;
    -h|--help)
      sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  echo "Not inside a git repository." >&2
  exit 1
fi
cd "$REPO_ROOT"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit."
  exit 0
fi

git add -A

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if [[ -n "$CUSTOM_MSG" ]]; then
  MSG="$CUSTOM_MSG"
else
  NUM_FILES=$(git diff --cached --name-only | wc -l | tr -d ' ')
  if [[ "$NUM_FILES" == "1" ]]; then
    FILE=$(git diff --cached --name-only)
    MSG="chore: update ${FILE} (${TIMESTAMP})"
  else
    MSG="chore: auto-commit ${NUM_FILES} files (${TIMESTAMP})"
  fi
fi

git commit -m "$MSG"
echo "Committed: $MSG"

if [[ "$PUSH" -eq 1 ]]; then
  git push
  echo "Pushed."
fi
