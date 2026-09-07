<script setup>
import { ref, onMounted } from "vue";
import { getVersion } from "@tauri-apps/api/app";

const version = ref("");

onMounted(async () => {
  try {
    version.value = await getVersion();
  } catch (e) {
    console.error("Failed to get app version:", e);
  }
});
</script>

<template>
  <div v-if="version" class="version-overlay">v{{ version }}</div>
</template>

<style scoped>
.version-overlay {
  position: fixed;
  top: 10px;
  right: 5px;
  font-size: 0.7rem;
  color: var(--text-muted, #888);

  padding: 2px 8px;
  border-radius: var(--radius, 6px);
  border: 1px solid var(--border, transparent);
  pointer-events: none;
  z-index: 20;
  user-select: none;
}
</style>
