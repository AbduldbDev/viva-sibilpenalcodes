<script setup>
import { ref, provide, computed } from "vue";
import SimpleTab from "./components/SimpleTab.vue";
import AdvancedTab from "./components/AdvancedTab.vue";
import PenalCodeTab from "./components/Penalcodetab.vue";
import SettingsTab from "./components/SettingsTab.vue";
import UpdateGate from "./components/UpdateGate.vue";
import VersionOverlay from "./components/VersionOverlay.vue";

const TABS = [
  { id: "simple", label: "Simple", component: SimpleTab },
  { id: "advanced", label: "Advanced", component: AdvancedTab },
  { id: "penal-code", label: "Penal Code", component: PenalCodeTab },
];

const activeTab = ref(TABS[0].id);
const showSettings = ref(false);
const sidebarOpen = ref(false);

const currentPageTitle = computed(() => {
  if (showSettings.value) return "Settings";
  return TABS.find((t) => t.id === activeTab.value)?.label ?? "";
});

function selectTab(id) {
  activeTab.value = id;
  sidebarOpen.value = false;
}

const toastMessage = ref("");
let toastTimer = null;
function notify(message) {
  toastMessage.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastMessage.value = ""), 2600);
}
provide("notify", notify);
</script>

<template>
  <UpdateGate>
    <div class="app-shell">
      <!-- Sidebar toggle button (top-left) -->
      <button
        class="sidebar-toggle-btn"
        title="Menu"
        @click="sidebarOpen = !sidebarOpen"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- Sidebar -->
      <aside class="sidebar" :class="{ open: sidebarOpen }">
        <div class="sidebar-header">
          <span>Mga Pahina</span>
          <button
            class="sidebar-close-btn"
            title="Isara"
            @click="sidebarOpen = false"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
        <nav class="sidebar-nav">
          <button
            v-for="tab in TABS"
            :key="tab.id"
            class="sidebar-btn"
            :class="{ active: activeTab === tab.id && !showSettings }"
            @click="
              selectTab(tab.id);
              showSettings = false;
            "
          >
            {{ tab.label }}
          </button>
          <div class="sidebar-divider"></div>
          <button
            class="sidebar-btn"
            :class="{ active: showSettings }"
            @click="
              showSettings = true;
              sidebarOpen = false;
            "
          >
            ⚙ Settings
          </button>
        </nav>
      </aside>

      <!-- Backdrop when sidebar is open, click to close -->
      <div
        v-if="sidebarOpen"
        class="sidebar-backdrop"
        @click="sidebarOpen = false"
      ></div>

      <div class="ledger">
        <header class="ledger-header">
          <!-- <img class="home_logo" src="./assets/icon.ico" alt="VIVA! Sibil" /> -->
          <img
            class="home_logo"
            src="./assets/Viva_Icon.gif"
            alt="VIVA! Sibil"
          />
          <h1>VIVA! Sibil</h1>
          <p>Talaan ng Kawal at Serbisyong Bayan</p>
          <p class="current-page-title">{{ currentPageTitle }}</p>
        </header>

        <template v-if="showSettings">
          <nav class="tab-row">
            <button
              class="tab-btn active"
              style="flex: none; padding-left: 22px; padding-right: 22px"
            >
              Settings
            </button>
            <button
              class="tab-btn"
              style="flex: none; padding-left: 16px; padding-right: 16px"
              @click="showSettings = false"
            >
              ← Balik
            </button>
          </nav>
          <SettingsTab />
        </template>

        <template v-else>
          <keep-alive>
            <component :is="TABS.find((t) => t.id === activeTab).component" />
          </keep-alive>
        </template>
      </div>

      <transition name="fade">
        <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
      </transition>
    </div>
    <VersionOverlay />
  </UpdateGate>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Toggle button, top-left */
.sidebar-toggle-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  cursor: pointer;
  z-index: 10;
}
.sidebar-toggle-btn:hover {
  color: var(--red-bright);
  border-color: var(--red-bright);
}
.sidebar-toggle-btn svg {
  width: 18px;
  height: 18px;
}

/* Sidebar panel - collapsed (off-canvas) by default */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 240px;
  background: var(--bg-raised);
  border-right: 1px solid var(--border);
  transform: translateX(-100%);
  transition: transform 0.25s ease;
  z-index: 35;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px 12px 16px;
  font-size: 0.85rem;
  color: var(--brass);
  border-bottom: 1px solid var(--border);
}

.sidebar-close-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  cursor: pointer;
  flex-shrink: 0;
}
.sidebar-close-btn:hover {
  color: var(--red-bright);
  border-color: var(--red-bright);
}
.sidebar-close-btn svg {
  width: 14px;
  height: 14px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
}

.sidebar-btn {
  text-align: left;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius);
  color: var(--text);
  cursor: pointer;
  font-size: 0.9rem;
}
.sidebar-btn:hover {
  border-color: var(--border);
  background: var(--bg-inset);
}
.sidebar-btn.active {
  background: var(--bg-inset);
  border-color: var(--red-bright);
  color: var(--red-bright);
}

.sidebar-divider {
  height: 1px;
  background: var(--border);
  margin: 6px 4px;
}

/* Backdrop overlay when open */
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 30;
}

/* Current page title under the subtitle */
.current-page-title {
  margin-top: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--brass);
}
</style>
