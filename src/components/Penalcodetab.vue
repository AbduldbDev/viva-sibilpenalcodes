<script setup>
import { ref, computed } from "vue";
import { PENAL_CODE } from "../data/penalCode.js";

const paghahanap = ref("");

const filteredCode = computed(() => {
  const term = paghahanap.value.trim().toLowerCase();
  if (!term) return PENAL_CODE;
  return PENAL_CODE.filter(
    (art) =>
      art.number.includes(term) ||
      art.title.toLowerCase().includes(term) ||
      art.body.toLowerCase().includes(term),
  );
});

function highlightCount(article) {
  const term = paghahanap.value.trim().toLowerCase();
  if (!term) return 0;
  return article.body.toLowerCase().split(term).length - 1;
}

// Matches "Seksyon 1:", "Seksyon 2 —", "Uri 1:", etc. (Art. 101 uses "Uri"
// instead of "Seksyon" but plays the same structural role).
const SECTION_RE = /^(Seksyon|Uri)\s+\d+\s*[:\-–—]/i;

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Splits a line's text on the current search term and wraps matches in
// <mark>, escaping everything else so we can safely use v-html.
function highlightLine(text) {
  const term = paghahanap.value.trim();
  const safe = escapeHtml(text);
  if (!term) return safe;
  const re = new RegExp(`(${escapeRegExp(escapeHtml(term))})`, "ig");
  return safe.replace(re, "<mark>$1</mark>");
}

// Turns a raw article body into an array of typed lines so section
// headers ("Seksyon N:" / "Uri N:") can be rendered as their own
// highlighted banners instead of plain text.
function parseBody(body) {
  return body.split("\n").map((line) => {
    const trimmed = line.trim();
    if (SECTION_RE.test(trimmed)) {
      return { type: "section", text: trimmed };
    }
    if (trimmed === "") {
      return { type: "blank", text: "" };
    }
    return { type: "text", text: line };
  });
}
</script>

<template>
  <div class="tab-panel scroll-area penal-code">
    <div class="field">
      <label for="pc-search">🔍 Maghanap sa Batas Penal</label>
      <input
        id="pc-search"
        type="text"
        v-model="paghahanap"
        placeholder="Hal. 'Artikulo 106', 'pandarambong', o '$500'"
      />
    </div>

    <p class="result-count">
      {{ filteredCode.length }} artikulo ang natagpuan<span v-if="paghahanap">
        para sa "{{ paghahanap }}"</span
      >.
    </p>

    <p v-if="filteredCode.length === 0" class="empty-note">
      Walang nahanap na artikulo. Subukan ang ibang salita.
    </p>

    <details
      v-for="article in filteredCode"
      :key="article.number"
      class="acc"
      :open="Boolean(paghahanap)"
    >
      <summary class="acc-summary">
        <span class="acc-title"
          >Artikulo {{ article.number }} — {{ article.title }}</span
        >
        <span class="acc-right">
          <span v-if="highlightCount(article) > 0" class="badge count-badge">{{
            highlightCount(article)
          }}</span>
          <span class="burger-icon">☰</span>
        </span>
      </summary>

      <div class="article-body">
        <template v-for="(line, idx) in parseBody(article.body)" :key="idx">
          <div v-if="line.type === 'section'" class="section-banner">
            <span class="section-icon">✦</span>
            <span v-html="highlightLine(line.text)"></span>
          </div>
          <div v-else-if="line.type === 'blank'" class="blank-line"></div>
          <div v-else class="body-line" v-html="highlightLine(line.text)"></div>
        </template>
      </div>
    </details>
  </div>
</template>

<style scoped>
.penal-header {
  padding: 0 0 18px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}

.help-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 16px;
}

.result-count {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 0.5rem 0 1rem;
}

.empty-note {
  color: var(--text-muted);
  font-style: italic;
}

/* Accordion cards reuse .case-file's paper texture + corner stamp,
   just stacked and collapsible instead of a single block. */
.acc {
  margin-bottom: 14px;
  cursor: default;
}

.acc-summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  list-style: none;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.02em;
  color: var(--red-dim);
}
.acc-summary::-webkit-details-marker {
  display: none;
}

.acc-title {
  flex: 1;
}

.acc-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.burger-icon {
  color: var(--red);
  font-size: 1.1em;
}

.count-badge {
  background: var(--accent);
  color: var(--paper);
  border-radius: 999px;
  min-width: 1.6em;
  height: 1.6em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  padding: 0 0.4em;
  font-family: var(--font-body);
}

.article-body {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--ink-muted);
  line-height: 1.55;
  font-size: 0.86rem;
}

.section-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--red);
  color: var(--paper);
  font-family: var(--font-display);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.88rem;
  padding: 8px 12px;
  margin: 14px 0 6px;
  border-radius: var(--radius);
}

.section-icon {
  color: var(--paper);
}

.body-line {
  white-space: pre-wrap;
  color: var(--ink);
}

.blank-line {
  height: 8px;
}

:deep(mark) {
  background: var(--accent);
  color: var(--paper);
  padding: 0 0.15em;
  border-radius: 2px;
}
</style>
