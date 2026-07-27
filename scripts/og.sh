#!/usr/bin/env bash
# Regenerates the Open Graph cards in public/og/ with headless Chrome.
# Usage: ./scripts/og.sh   (run from the repo root)
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="public/og"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$OUT"

# name|eyebrow|title|subtitle
CARDS=(
  "default|portfolio|harald bregu|senior lead developer · desktop, web & mobile"
  "posts|posts|writing|notes on software, patterns, and the things i build"
  "friday-desktop-ai-assistant-release|release · jul 2026|Friday 1.0|a local-first desktop AI assistant that runs a real tool loop"
  "will-artificial-intelligence-replace-software-developers|article · dec 2024|Will AI replace software developers?|standardization, architecture, and the future demand for developers"
  "mediator-design-pattern-in-swift|article · feb 2023|Mediator design pattern in Swift|buyers and sellers that talk through an agent, not to each other"
  "monostate-or-singleton-with-a-twist-design-pattern|article · feb 2023|Monostate design pattern|a singleton with a twist: many instances, one shared state"
  "strong-and-weak-references-in-swift|article · feb 2023|Strong and weak references in Swift|how object deallocation changes when references are released"
)

for card in "${CARDS[@]}"; do
  IFS='|' read -r name eyebrow title subtitle <<<"$card"
  cat >"$TMP/$name.html" <<HTML
<!doctype html>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; background: #f6f5f1; color: #18181a;
    font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 68px 76px; border-bottom: 10px solid oklch(58% 0.13 35);
  }
  .bar { display: flex; justify-content: space-between; align-items: center;
    font-size: 20px; letter-spacing: .08em; text-transform: uppercase; color: #a5a5a8;
    padding-bottom: 26px; border-bottom: 2px solid #e2e1da; }
  .mark { display: flex; align-items: center; gap: 14px; color: #18181a; }
  .glyph { width: 22px; height: 22px; background: #18181a; }
  .eyebrow { font-size: 22px; letter-spacing: .08em; text-transform: uppercase; color: #a5a5a8; margin-bottom: 22px; }
  h1 { font-size: 76px; font-weight: 500; line-height: 1.1; letter-spacing: -.01em; max-width: 17ch; }
  h1 .caret { display: inline-block; width: .5em; height: .9em; background: oklch(58% 0.13 35); vertical-align: -.06em; margin-left: 10px; }
  p { font-size: 28px; line-height: 1.5; color: #6b6b6e; margin-top: 26px; max-width: 42ch; }
  .foot { font-size: 24px; color: #6b6b6e; }
</style>
<div class="bar">
  <span class="mark"><span class="glyph"></span>hb</span>
  <span>haraldbregu.com</span>
</div>
<div>
  <div class="eyebrow">$eyebrow</div>
  <h1>$title<span class="caret"></span></h1>
  <p>$subtitle</p>
</div>
<div class="foot">senior lead developer · italy / remote</div>
HTML

  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=1200,630 --default-background-color=00000000 \
    --screenshot="$OUT/$name.png" "file://$TMP/$name.html" 2>/dev/null

  echo "og/$name.png"
done
