<script setup>
import { ref, inject } from "vue";
import { settings } from "../store/settings.js";

const notify = inject("notify");
const draft = ref(settings.doctorName);

function save() {
  settings.doctorName = draft.value.trim();
  notify("Nai-save ang mga setting.");
}

function reset() {
  draft.value = "";
  settings.doctorName = "";
  notify("Na-clear ang pangalan ng manggagamot.");
}
</script>

<template>
  <div class="tab-panel">
    <div class="section-label" style="margin-top: 0">
      Tagapagpatupad ng Batas
    </div>

    <div class="field">
      <label for="settings-lawman">Pangalan ng Tagapagpatupad ng Batas</label>
      <input
        id="settings-lawman"
        type="text"
        v-model="draft"
        placeholder="hal. Juan Dela Cruz"
        @keyup.enter="save"
      />
    </div>

    <p class="hint">
      Awtomatikong lalabas ang pangalang ito sa bawat ulat at talaan — hindi na
      kailangang i-type paulit-ulit. Naka-save ito sa device na ito lamang.
    </p>

    <div class="btn-row">
      <button class="btn btn-primary" @click="save">I-save</button>
      <button class="btn" @click="reset">Alisin</button>
    </div>
  </div>
</template>

<style scoped>
.hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: -6px 0 4px;
}
</style>
