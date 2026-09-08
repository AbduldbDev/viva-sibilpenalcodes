<script setup>
import { ref, inject } from "vue";
import {
  SIMPLE_CHARGES,
  SIMPLE_LOCATION_TO_CHARGE,
  SIMPLE_LOCATION_DESC,
  SIMPLE_EVIDENCE_OPTIONS,
  SIMPLE_EXTRA_CHARGE_OPTIONS,
  MAX_JAIL_HOURS,
  hoursToJailLabel,
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
  const charges = [];

  if (location.value) {
    const key = SIMPLE_LOCATION_TO_CHARGE[location.value];
    charges.push({ key, desc: SIMPLE_LOCATION_DESC[location.value] });
  }
  for (const [key, on] of Object.entries(evidence.value)) {
    if (on) charges.push({ key, desc: SIMPLE_CHARGES[key].desc });
  }
  if (sedula.value) {
    charges.push({
      key: "walang_sedula",
      desc: SIMPLE_CHARGES.walang_sedula.desc,
    });
  }
  for (const [key, on] of Object.entries(extras.value)) {
    if (on) charges.push({ key, desc: SIMPLE_CHARGES[key].desc });
  }

  charges.sort((a, b) =>
    SIMPLE_CHARGES[a.key].article.localeCompare(SIMPLE_CHARGES[b.key].article),
  );

  let totalFine = 0;
  let totalJailHours = 0;
  const lines = [];

  for (const { key, desc } of charges) {
    const { article, fine, jail } = SIMPLE_CHARGES[key];
    totalFine += fine;
    totalJailHours += jail;
    lines.push(`${article} — $${fine} — ${desc}`);
  }

  const cappedJailHours = Math.min(totalJailHours, MAX_JAIL_HOURS);
  const cappedNote =
    totalJailHours > MAX_JAIL_HOURS
      ? ` (naabot na ang max na ${MAX_JAIL_HOURS} oras)`
      : "";

  const locationText = location.value
    ? `Lugar ng insidente: ${location.value}\n`
    : "";

  report.value =
    `Suspek: ${suspectName.value}\n` +
    `${locationText}\n` +
    "Mga Paglabag:\n" +
    (lines.length ? lines.map((l) => `  • ${l}`).join("\n") : "  - Wala") +
    "\n\n" +
    `Kabuuang Multa: $${totalFine}\n` +
    `Kabuuang taon ng pagkakakulong: ${hoursToJailLabel(cappedJailHours)}${cappedNote}\n`;
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
