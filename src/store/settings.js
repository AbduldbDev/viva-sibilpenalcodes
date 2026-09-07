import { reactive, watch } from "vue";

const STORAGE_KEY = "viva-sibil-settings";

const defaults = {
  doctorName: "",
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return { ...defaults };
  }
}

export const settings = reactive(load());

watch(
  settings,
  (val) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    } catch {
      // localStorage unavailable (e.g. private mode) — settings just
      // won't persist across restarts, form still works fine.
    }
  },
  { deep: true },
);

export function doctorNameOrPlaceholder() {
  return (
    settings.doctorName.trim() ||
    "(Itakda ang Pangalan ng Manggagamot sa Settings)"
  );
}
