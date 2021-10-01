#!/usr/bin/env bash

# load .env file
set -a
[ -f ../../.env ] && . ../../.env
set +a

if [ -z "$POEDITOR_API_TOKEN" ]; then
read -rsp 'Enter your API key:
' POEDITOR_API_TOKEN
fi

downloadJSON() {
  echo "downloading $3"
  curl -s -X POST https://api.poeditor.com/v2/projects/export \
     -d api_token="$POEDITOR_API_TOKEN" \
     -d id="$1" \
     -d language="$2" \
     -d type="key_value_json" | jq -r '.result.url' | xargs curl -s > "$3"
}

downloadJSON 471983 de ./src/messages/de.json
downloadJSON 471983 en ./src/messages/en.json
