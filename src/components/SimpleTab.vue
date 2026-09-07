<script setup>
import { ref, inject } from "vue";
import {
  SIMPLE_CHARGES,
  SIMPLE_LOCATION_TO_CHARGE,
  SIMPLE_EVIDENCE_OPTIONS,
  SIMPLE_EXTRA_CHARGE_OPTIONS,
  MAX_JAIL_YEARS,
} from "../data/charges.js";

const notify = inject("notify");

const suspectName = ref("");
const location = ref("");
const sedula = ref(false);
const evidence = ref(
  Object.fromEntries(SIMPLE_EVIDENCE_OPTIONS.map(([, key]) => [key, false])),
);
const extras = ref(
  Object.fromEntries(
    SIMPLE_EXTRA_CHARGE_OPTIONS.map(([, key]) => [key, false]),
  ),
);

const report = ref("");

function clearForm() {
  suspectName.value = "";
  location.value = "";
  sedula.value = false;
  for (const key of Object.keys(evidence.value)) evidence.value[key] = false;
  for (const key of Object.keys(extras.value)) extras.value[key] = false;
  report.value = "";
}

function copyReport() {
  const text = report.value.trim();
  if (!text) {
    notify("Wala pang Ulat — buuin muna ang ulat bago kopyahin.");
    return;
  }
  navigator.clipboard?.writeText(text);
  notify("Nakopya na ang ulat sa clipboard.");
}

function generateReport() {
  const chargeKeys = [];

  if (location.value) {
    chargeKeys.push(SIMPLE_LOCATION_TO_CHARGE[location.value]);
  }
  for (const [key, on] of Object.entries(evidence.value)) {
    if (on) chargeKeys.push(key);
  }
  if (sedula.value) chargeKeys.push("walang_sedula");
  for (const [key, on] of Object.entries(extras.value)) {
    if (on) chargeKeys.push(key);
  }

  chargeKeys.sort((a, b) =>
    SIMPLE_CHARGES[a].article.localeCompare(SIMPLE_CHARGES[b].article),
  );

  let totalFine = 0;
  let totalJail = 0;
  const lines = [];

  for (const key of chargeKeys) {
    const { article, fine, jail, desc } = SIMPLE_CHARGES[key];
    totalFine += fine;
    totalJail += jail;
    lines.push(`${article} — $${fine} — ${desc}`);
  }

  const cappedJail = Math.min(totalJail, MAX_JAIL_YEARS);
  const cappedNote =
    totalJail > MAX_JAIL_YEARS ? " (naabot na ang max na 6 taon)" : "";
  const locationText = location.value
    ? `Lugar ng insidente: ${location.value}\n`
    : "";

  report.value =
    `Suspek: ${suspectName.value}\n` +
    `${locationText}\n` +
    "Mga Paglabag:\n" +
    (lines.length ? lines.map((l) => `  - ${l}`).join("\n") : "  - Wala") +
    "\n\n" +
    `Total Fines: $${totalFine}\n` +
    `Total Jail: ${cappedJail} years${cappedNote}\n`;
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="s-suspect">Pangalan ng Suspek</label>
      <input
        id="s-suspect"
        type="text"
        v-model="suspectName"
        placeholder="Juan dela Cruz"
      />
    </div>

    <div class="field">
      <label for="s-location">Lugar ng Krimen</label>
      <select id="s-location" v-model="location">
        <option value=""></option>
        <option
          v-for="key in Object.keys(SIMPLE_LOCATION_TO_CHARGE)"
          :key="key"
          :value="key"
        >
          {{ key }}
        </option>
      </select>
    </div>

    <label class="check-row">
      <input type="checkbox" v-model="sedula" />
      Walang sedula
    </label>

    <div class="section-label">Ebidensyang Nakuha</div>
    <label
      class="check-row"
      v-for="[label, key] in SIMPLE_EVIDENCE_OPTIONS"
      :key="key"
    >
      <input type="checkbox" v-model="evidence[key]" />
      {{ label }}
    </label>

    <div class="section-label">Karagdagang Paglabag</div>
    <label
      class="check-row"
      v-for="[label, key] in SIMPLE_EXTRA_CHARGE_OPTIONS"
      :key="key"
    >
      <input type="checkbox" v-model="extras[key]" />
      {{ label }}
    </label>

    <div class="btn-row">
      <button class="btn btn-primary" @click="generateReport">Submit</button>
      <button class="btn" @click="clearForm">Clear Form</button>
      <button class="btn" @click="copyReport">Copy</button>
    </div>

    <div class="case-file" :class="{ empty: !report }">
      <h3>Resulta</h3>
      <pre v-if="report">{{ report }}</pre>
      <pre v-else>Wala pang nabuong ulat.</pre>
    </div>
  </div>
</template>
