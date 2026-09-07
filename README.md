# VIVA! Sibil Penal Codes — Vue + Tauri

A Vue 3 + Tauri rewrite of the original Tkinter "Ulat ng Kaso" tool, restyled
around a Red Dead Redemption 2–inspired black-and-red frontier-ledger theme.
All charge tables, fines, jail values and report wording are ported 1:1 from
the Python source (`SIMPLE_*` and `ADV_*` dictionaries), so generated reports
match the original app.

## What changed from the Python version

- **Framework**: Tkinter → Vue 3 (Composition API), packaged as a native
  desktop app with Tauri (Rust shell + system webview) instead of PyInstaller.
- **UI**: dark leather/black chrome, deep-red accents, "Rye" (wood-type
  western display font) for headings and "Special Elite" (typewriter) for
  body text. The generated report renders as an aged-parchment "case file"
  with a faint red wax-seal mark, instead of a plain text box.
- **Popups → toast**: `messagebox.showinfo/showwarning` calls became a small
  inline toast at the bottom of the window.
- **Scrolling**: the Advanced tab's long form uses a normal scrollable
  container instead of a manually wired Tkinter `Canvas` + `Scrollbar`.
- The optional "Officer In-charge" field and its validation were left
  commented out in the original source, so they're omitted here too.

## Project layout

```
├── index.html
├── src/
│   ├── main.js
│   ├── App.vue              # header, tab switcher, toast host
│   ├── style.css            # theme tokens + component styles
│   ├── data/charges.js      # ported SIMPLE_*/ADV_* tables + helpers
│   └── components/
│       ├── SimpleTab.vue
│       └── AdvancedTab.vue
└── src-tauri/                # Rust shell (Tauri)
    ├── Cargo.toml
    ├── tauri.conf.json
    ├── build.rs
    ├── src/main.rs
    └── icons/app-icon.png    # placeholder — regenerate before shipping
```

## Prerequisites

- Node.js 18+ and npm
- Rust (stable) + `cargo` — https://www.rust-lang.org/tools/install
- Tauri's platform prerequisites (WebView2 on Windows, WebKitGTK on Linux,
  Xcode command line tools on macOS) — see
  https://tauri.app/v1/guides/getting-started/prerequisites

## Setup

```bash
npm install
```

Generate a full icon set from the placeholder (or swap in your own square
PNG first) — this fills in `icons/32x32.png`, `128x128.png`, `.ico`, `.icns`:

```bash
npx tauri icon src-tauri/icons/app-icon.png
```

## Run in development

```bash
npm run tauri dev
```

This starts the Vite dev server on port 1420 and opens it in a Tauri window
with hot reload.

## Build a distributable

```bash
npm run tauri build
```

Produces a platform-native installer/bundle (`.msi`/`.exe` on Windows,
`.dmg`/`.app` on macOS, `.deb`/`.AppImage` on Linux) under
`src-tauri/target/release/bundle/`.

## Notes

- Copy is done via `navigator.clipboard.writeText`, which works out of the
  box in the Tauri webview; the `clipboard-all` Tauri allowlist feature is
  also enabled in case you later want to call the native clipboard APIs
  from Rust instead.
- All report-generation logic lives in the two tab components — no backend
  calls are made, so `src-tauri/src/main.rs` is intentionally minimal. Add
  `#[tauri::command]` functions there if you want native features later
  (e.g. saving the report straight to a file, printing, or reading data
  from a local database).
