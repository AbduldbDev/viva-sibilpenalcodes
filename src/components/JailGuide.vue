<script setup>
import { JAIL_GUIDE } from "../data/jailguide.js";
</script>

<template>
  <div class="tab-panel scroll-area">
    <div class="section-label">Jail Time Conversion Guide</div>
    <p class="guide-note">
      Reference table para sa pag-convert ng OOC time patungong IC jail
      terminology.
    </p>

    <table class="jail-guide-table">
      <thead>
        <tr>
          <th>OOC Time</th>
          <th>Minutes</th>
          <th>IC Jail Terminology</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in JAIL_GUIDE" :key="row.ooc">
          <td>{{ row.ooc }}</td>
          <td>{{ row.minutes }}</td>
          <td>{{ row.jail }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.guide-note {
  opacity: 0.8;
  margin-bottom: 0.75rem;
}

.jail-guide-table {
  width: 100%;
  border-collapse: collapse;
}

.jail-guide-table th,
.jail-guide-table td {
  padding: 0.5rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.jail-guide-table th {
  font-weight: 600;
  opacity: 0.85;
}
</style>
