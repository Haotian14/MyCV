#!/usr/bin/env bash
# resume.md -> resume.html (pandoc) -> resume.pdf (Playwright)
set -euo pipefail
cd "$(dirname "$0")/.."
pandoc resume.md -f gfm -t html5 --metadata pagetitle="骆皓天 简历" -o body.tmp.html
{
  printf '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>骆皓天 简历</title>\n'
  cat build/style.html
  printf '</head>\n<body><main>\n'
  cat body.tmp.html
  printf '</main></body>\n</html>\n'
} > resume.html
rm body.tmp.html
node build/pdf.js
