<script setup>
import { ref, inject, computed } from "vue";
import {
  ADV_CHARGES,
  ADV_CHECKBOX_SECTIONS,
  ADV_LOCATION_TO_CHARGE,
  ADV_RECKLESS_RIDING_TIERS,
  ADV_NARCOTICS_TIERS,
  ADV_BANDITRY_TIERS,
  NONE_LABEL,
  MAX_JAIL_HOURS,
  hoursToJailLabel,
  formatG,
} from "../data/charges.js";
const notify = inject("notify");

const suspectName = ref("");
const location = ref(NONE_LABEL);
const reckless = ref(NONE_LABEL);
const narcotics = ref(NONE_LABEL);
const banditry = ref(NONE_LABEL);
const paghahanap = ref("");

const allCheckboxKeys = ADV_CHECKBOX_SECTIONS.flatMap(([, keys]) => keys);
const checkboxes = ref(
  Object.fromEntries(allCheckboxKeys.map((k) => [k, false])),
);

const report = ref("");

// Sinasala ang mga seksyon ayon sa hinahanap na salita (artikulo o paglalarawan),
// para mas mabilis makita ang paglabag kahit dumami pa ang listahan.
const filteredSections = computed(() => {
  const term = paghahanap.value.trim().toLowerCase();
  if (!term) return ADV_CHECKBOX_SECTIONS;

  return ADV_CHECKBOX_SECTIONS.map(([title, keys]) => {
    const tugma = keys.filter((key) => {
      const charge = ADV_CHARGES[key];
      return (
        charge.article.toLowerCase().includes(term) ||
        charge.desc.toLowerCase().includes(term)
      );
    });
    return [title, tugma];
  }).filter(([, keys]) => keys.length > 0);
});

// Kinukuha ang lahat ng napiling paglabag (checkbox + dropdown), pinagsunod-sunod
// ayon sa numerong "order" ng bawat artikulo — hindi umaasa sa text ng label,
// kaya laging tama ang pagkakasunod kahit anong wika ang gamitin sa pangalan.
const selectedCharges = computed(() => {
  const napili = [];

  for (const [key, on] of Object.entries(checkboxes.value)) {
    if (on) napili.push(ADV_CHARGES[key]);
  }

  const locationKey = ADV_LOCATION_TO_CHARGE[location.value];
  if (locationKey) napili.push(ADV_CHARGES[locationKey]);

  const recklessCharge = ADV_RECKLESS_RIDING_TIERS[reckless.value];
  if (recklessCharge) napili.push(recklessCharge);

  const narcoticsCharge = ADV_NARCOTICS_TIERS[narcotics.value];
  if (narcoticsCharge) napili.push(narcoticsCharge);

  const banditryCharge = ADV_BANDITRY_TIERS[banditry.value];
  if (banditryCharge) napili.push(banditryCharge);

  napili.sort((a, b) => a.order - b.order);
  return napili;
});

function clearForm() {
  suspectName.value = "";
  location.value = NONE_LABEL;
  reckless.value = NONE_LABEL;
  narcotics.value = NONE_LABEL;
  banditry.value = NONE_LABEL;
  paghahanap.value = "";
  for (const key of Object.keys(checkboxes.value))
    checkboxes.value[key] = false;
  report.value = "";
}

function copyReport() {
  const text = report.value.trim();
  if (!text) {
    notify("Wala pang Ulat — buuin muna ang ulat bago kopyahin.");
    return;
  }
  navigator.clipboard
    ?.writeText(text)
    .then(() => notify("Nakopya na ang ulat."))
    .catch(() =>
      notify("Hindi makopya — subukang piliin at i-copy nang manu-mano."),
    );
}

function generateReport() {
  const napili = selectedCharges.value;
  if (!napili.length) {
    notify("Kulang na Impormasyon — pumili ng kahit isang paglabag.");
    return;
  }

  let totalFine = 0;
  let totalJailHours = 0;
  const lines = [];
  const specialNotes = [];

  for (const charge of napili) {
    const fine = charge.fine ?? 0;
    totalFine += fine;
    totalJailHours += charge.jail_hours ?? 0;

    const fineText = charge.fine_note
      ? `$${fine} (${charge.fine_note})`
      : `$${fine}`;

    let line = `• ${charge.article} — ${fineText} — ${charge.desc}`;
    if (charge.jail_note) {
      line += ` [${charge.jail_note}]`;
    }
    lines.push(line);

    if (charge.jail_special) {
      specialNotes.push(`  ⚠ ${charge.article}: ${charge.jail_special}`);
    }
  }

  const cappedJailHours = Math.min(totalJailHours, MAX_JAIL_HOURS);
  const cappedNote =
    totalJailHours > MAX_JAIL_HOURS
      ? ` (naabot na ang max na ${MAX_JAIL_HOURS} oras)`
      : "";

  const parts = [];

  if (specialNotes.length) {
    parts.push("");
    parts.push("Espesyal na Parusa:");
    parts.push(...specialNotes);
  }
  parts.push("Suspek: " + (suspectName.value.trim() || "Hindi Kilala"));
  parts.push("");
  parts.push("Mga Paglabag:");
  parts.push(...lines);
  parts.push("");

  parts.push(`Kabuuang Multa: $${formatG(totalFine)}`);
  parts.push(
    `Kabuuang Taon ng Pagkakakulong: ${hoursToJailLabel(cappedJailHours)}${cappedNote}`,
  );

  report.value = parts.join("\n") + "\n";
}
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="field">
      <label for="a-suspect">Pangalan ng Suspek</label>
      <input
        id="a-suspect"
        type="text"
        v-model="suspectName"
        placeholder="Juan dela Cruz"
      />
    </div>

    <div class="field-grid">
      <div class="field">
        <label for="a-location">Lugar ng Pagnanakaw</label>
        <select id="a-location" v-model="location">
          <option
            v-for="key in Object.keys(ADV_LOCATION_TO_CHARGE)"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="a-reckless"
          >Pagmamaneho nang Pabaya (Artikulo 100 Seksyon 3)</label
        >
        <select id="a-reckless" v-model="reckless">
          <option
            v-for="key in Object.keys(ADV_RECKLESS_RIDING_TIERS)"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="a-narcotics"
          >Ipinagbabawal na Gamot (Artikulo 106 Seksyon 2)</label
        >
        <select id="a-narcotics" v-model="narcotics">
          <option
            v-for="key in Object.keys(ADV_NARCOTICS_TIERS)"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>
      </div>

      <div class="field">
        <label for="a-banditry">Pandarambong (Artikulo 108 Seksyon 3)</label>
        <select id="a-banditry" v-model="banditry">
          <option
            v-for="key in Object.keys(ADV_BANDITRY_TIERS)"
            :key="key"
            :value="key"
          >
            {{ key }}
          </option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="a-search">Maghanap ng Paglabag</label>
      <input
        id="a-search"
        type="text"
        v-model="paghahanap"
        placeholder="Hal. 'pagnanakaw' o 'Artikulo 106'"
      />
    </div>

    <template
      v-for="[sectionTitle, keys] in filteredSections"
      :key="sectionTitle"
    >
      <div class="section-label">{{ sectionTitle }}</div>
      <label class="check-row" v-for="key in keys" :key="key">
        <input type="checkbox" v-model="checkboxes[key]" />
        {{ ADV_CHARGES[key].article }} — {{ ADV_CHARGES[key].desc }}
      </label>
    </template>
    <p v-if="filteredSections.length === 0" class="empty-note">
      Walang paglabag na tumugma sa "{{ paghahanap }}".
    </p>

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
