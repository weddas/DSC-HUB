# Build DSC-HUB React panel on local disk (NAS shares stall npm), copy bundle back.
# Usage: pwsh -File scripts/build-dsc-hub-panel.ps1
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$Src = Join-Path $RepoRoot "homeassistant\custom_components\dsc_hub\frontend"
$Www = Join-Path $RepoRoot "homeassistant\custom_components\dsc_hub\www"
$Work = Join-Path $env:TEMP "dsc-hub-panel-frontend"
$TempWww = Join-Path $env:TEMP "dsc-hub-panel-www"

if (-not (Test-Path $Src)) {
  throw "Frontend source not found: $Src"
}

Write-Host "Staging frontend -> $Work"
if (Test-Path $Work) { Remove-Item -Recurse -Force $Work }
if (Test-Path $TempWww) { Remove-Item -Recurse -Force $TempWww }
New-Item -ItemType Directory -Path $Work | Out-Null
New-Item -ItemType Directory -Path $TempWww | Out-Null

robocopy $Src $Work /E /XD node_modules dist .vite /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) {
  throw "robocopy failed with exit $LASTEXITCODE"
}

$OutDirJson = ($TempWww -replace '\\', '/') | ConvertTo-Json
$ViteCfg = @"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: $OutDirJson,
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "src/panel-element.tsx"),
      name: "DscHubPanel",
      formats: ["es"],
      fileName: () => "dsc-hub-panel.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "dsc-hub-panel.[ext]",
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    target: "es2020",
  },
});
"@
Set-Content -Path (Join-Path $Work "vite.config.ts") -Value $ViteCfg -Encoding UTF8

Push-Location $Work
try {
  if (Test-Path "package-lock.json") {
    Write-Host "npm ci..."
    npm ci
  } else {
    Write-Host "npm install..."
    npm install
  }
  Write-Host "npm run build..."
  npm run build
} finally {
  Pop-Location
}

$Built = Join-Path $TempWww "dsc-hub-panel.js"
if (-not (Test-Path $Built)) {
  throw "Build finished but dsc-hub-panel.js not found under $TempWww"
}

New-Item -ItemType Directory -Path $Www -Force | Out-Null
Write-Host "Copying bundle -> $Www"
Copy-Item -Force $Built (Join-Path $Www "dsc-hub-panel.js")
if (Test-Path "$Built.map") {
  Copy-Item -Force "$Built.map" (Join-Path $Www "dsc-hub-panel.js.map")
}
Get-ChildItem $TempWww -Filter "dsc-hub-panel.*" |
  Where-Object { $_.Name -notin @("dsc-hub-panel.js", "dsc-hub-panel.js.map") } |
  ForEach-Object { Copy-Item -Force $_.FullName (Join-Path $Www $_.Name) }

Write-Host "OK: $(Join-Path $Www 'dsc-hub-panel.js')"
Write-Host "Deploy via scripts/ha-sync.sh. Add-on image rebuild still needed for custom_components sync from git."
