// This app is pure frontend logic (report generation happens in Vue),
// so the Rust side just hosts the webview. Add #[tauri::command]
// functions here later if you want native file export, printing, etc.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running VIVA! Sibil Penal Codes");
}
