<script setup>
import { ref, onMounted } from "vue";
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

const checking = ref(true);
const updateRequired = ref(false);
const installing = ref(false);
const errored = ref(false);
const version = ref("");
const statusText = ref("Checking for updates...");
const progressLabel = ref(""); // e.g. "Downloading..." / "Installing..."

onMounted(async () => {
  onUpdaterEvent(({ error, status }) => {
    if (error) {
      console.error("Updater error:", error);
      errored.value = true;
      installing.value = false;
      statusText.value = "Update failed";
      progressLabel.value =
        "Please try again, or contact support if this keeps happening.";
      return;
    }
    if (status === "PENDING") {
      statusText.value = "Downloading update";
      progressLabel.value =
        "This may take a minute depending on your connection.";
    }
    if (status === "DONE") {
      statusText.value = "Installing update";
      progressLabel.value = "The app will restart automatically.";
    }
  });

  try {
    const { shouldUpdate, manifest } = await checkUpdate();
    if (shouldUpdate) {
      updateRequired.value = true;
      version.value = manifest?.version ?? "";
    }
  } catch (e) {
    console.error("Update check failed:", e);
    // Fail-open: don't lock users out of the app because the check itself failed.
  } finally {
    checking.value = false;
  }
});

async function doInstall() {
  installing.value = true;
  errored.value = false;
  statusText.value = "Downloading update";
  progressLabel.value = "Starting download...";
  try {
    await installUpdate();
    await relaunch();
  } catch (e) {
    console.error("Install failed:", e);
    errored.value = true;
    installing.value = false;
    statusText.value = "Update failed";
    progressLabel.value =
      "Please try again, or contact support if this keeps happening.";
  }
}
</script>

<template>
  <!-- Checking state -->
  <div
    v-if="checking"
    class="update-gate-screen"
    role="status"
    aria-live="polite"
  >
    <div class="update-gate-card update-gate-card--minimal">
      <div class="update-gate-spinner" aria-hidden="true"></div>
      <p class="update-gate-status">Checking for updates…</p>
    </div>
  </div>

  <!-- Update required state -->
  <div
    v-else-if="updateRequired"
    class="update-gate-screen"
    role="alertdialog"
    aria-live="assertive"
    aria-labelledby="update-gate-title"
  >
    <div class="update-gate-card">
      <img
        class="home_logo"
        src="../assets/Viva_Icon.gif"
        alt="VIVA! Doctors"
      />

      <h2 id="update-gate-title">Update Required</h2>
      <p v-if="version" class="update-gate-version">Version {{ version }}</p>

      <p class="update-gate-status" :class="{ 'is-error': errored }">
        {{ statusText }}
      </p>
      <p v-if="progressLabel" class="update-gate-sublabel">
        {{ progressLabel }}
      </p>

      <button
        v-if="!installing"
        class="update-gate-btn"
        :class="{ 'update-gate-btn--retry': errored }"
        @click="doInstall"
      >
        {{ errored ? "Try Again" : "Update Now" }}
      </button>
      <div v-else class="update-gate-spinner" aria-hidden="true"></div>
    </div>
  </div>

  <!-- Normal app -->
  <slot v-else />
</template>

<style scoped>
.update-gate-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-inset, #111);
  z-index: 9999;
  animation: fade-in 0.15s ease-out;
}

.update-gate-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 36px 40px;
  background: var(--bg-raised, #1a1a1a);
  border: 1px solid var(--border, #333);
  border-radius: var(--radius, 10px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  text-align: center;
  min-width: 300px;
  max-width: 360px;
}

.update-gate-card--minimal {
  padding: 28px 36px;
  gap: 16px;
}

.home_logo {
  width: 56px;
  height: 56px;
  margin-bottom: 4px;
  border-radius: 12px;
}

.update-gate-card h2 {
  margin: 0;
  color: var(--red-bright, #e33);
  font-size: 1.25rem;
  font-weight: 700;
}

.update-gate-version {
  margin: 0 0 6px;
  color: var(--text-muted, #888);
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.update-gate-status {
  margin: 0;
  color: var(--text, #eee);
  font-size: 0.95rem;
  font-weight: 500;
}

.update-gate-status.is-error {
  color: var(--red-bright, #e33);
}

.update-gate-sublabel {
  margin: 0;
  color: var(--text-muted, #888);
  font-size: 0.8rem;
  line-height: 1.4;
}

.update-gate-btn {
  margin-top: 6px;
  padding: 11px 28px;
  background: var(--red-bright, #e33);
  border: none;
  border-radius: var(--radius, 6px);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.1s ease;
}

.update-gate-btn:hover {
  opacity: 0.9;
}

.update-gate-btn:active {
  transform: scale(0.97);
}

.update-gate-btn--retry {
  background: var(--bg-raised, #2a2a2a);
  border: 1px solid var(--red-bright, #e33);
  color: var(--red-bright, #e33);
}

.update-gate-spinner {
  width: 26px;
  height: 26px;
  margin-top: 4px;
  border: 3px solid var(--border, #333);
  border-top-color: var(--red-bright, #e33);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
