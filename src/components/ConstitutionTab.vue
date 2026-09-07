<script setup>
import { ref, computed } from "vue";
import { CONSTITUTION, PREAMBLE } from "../data/constitution.js";

const paghahanap = ref("");

const flatArticles = CONSTITUTION.flatMap((ch) =>
  ch.articles.map((art) => ({
    ...art,
    chapter: ch.chapter,
    chapterTitle: ch.chapterTitle,
  })),
);

const filteredChapters = computed(() => {
  const term = paghahanap.value.trim().toLowerCase();

  const matches = !term
    ? flatArticles
    : flatArticles.filter(
        (art) =>
          art.number.toLowerCase().includes(term) ||
          art.title.toLowerCase().includes(term) ||
          art.body.toLowerCase().includes(term) ||
          art.chapterTitle.toLowerCase().includes(term),
      );

  const grouped = [];
  for (const art of matches) {
    let group = grouped.find((g) => g.chapterTitle === art.chapterTitle);
    if (!group) {
      group = {
        chapter: art.chapter,
        chapterTitle: art.chapterTitle,
        articles: [],
      };
      grouped.push(group);
    }
    group.articles.push(art);
  }
  return grouped;
});

const totalMatches = computed(() =>
  filteredChapters.value.reduce((sum, g) => sum + g.articles.length, 0),
);

const preambleMatches = computed(() => {
  const term = paghahanap.value.trim().toLowerCase();
  return term ? PREAMBLE.toLowerCase().includes(term) : false;
});

function highlightCount(article) {
  const term = paghahanap.value.trim().toLowerCase();
  if (!term) return 0;
  return article.body.toLowerCase().split(term).length - 1;
}

function articleLabel(article) {
  return article.number
    ? `Artikulo ${article.number} — ${article.title}`
    : article.title;
}

const SECTION_RE = /^(Seksyon|Uri)\s+\d+\s*[:\-–—]/i;

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightLine(text) {
  const term = paghahanap.value.trim();
  const safe = escapeHtml(text);
  if (!term) return safe;
  const re = new RegExp(`(${escapeRegExp(escapeHtml(term))})`, "ig");
  return safe.replace(re, "<mark>$1</mark>");
}

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
  <div class="tab-panel scroll-area constitution">
    <div class="field">
      <label for="const-search">🔍 Maghanap sa Konstitusyon</label>
      <input
        id="const-search"
        type="text"
        v-model="paghahanap"
        placeholder="Hal. 'Artikulo 12', 'habeas corpus', o 'Punong Ministro'"
      />
    </div>

    <details
      class="preamble-acc"
      :open="Boolean(paghahanap) ? preambleMatches : true"
    >
      <summary class="acc-summary">
        <span class="acc-title">Panimula (Preamble)</span>
        <span class="acc-right">
          <span class="burger-icon">☰</span>
        </span>
      </summary>
      <div class="article-body">
        <div class="" v-html="highlightLine(PREAMBLE)"></div>
      </div>
    </details>

    <p class="result-count">
      {{ totalMatches }} artikulo ang natagpuan<span v-if="paghahanap">
        para sa "{{ paghahanap }}"</span
      >.
    </p>

    <p
      v-if="totalMatches === 0 && paghahanap && !preambleMatches"
      class="empty-note"
    >
      Walang nahanap na artikulo. Subukan ang ibang salita.
    </p>

    <section
      v-for="group in filteredChapters"
      :key="group.chapterTitle"
      class="chapter-group"
    >
      <h3 class="chapter-heading">
        <span v-if="group.chapter">{{ group.chapter }}: </span
        >{{ group.chapterTitle }}
      </h3>

      <details
        v-for="article in group.articles"
        :key="group.chapterTitle + '-' + article.number"
        class="acc"
        :open="Boolean(paghahanap)"
      >
        <summary class="acc-summary">
          <span class="acc-title">{{ articleLabel(article) }}</span>
          <span class="acc-right">
            <span
              v-if="highlightCount(article) > 0"
              class="badge count-badge"
              >{{ highlightCount(article) }}</span
            >
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
            <div
              v-else
              class="body-line"
              v-html="highlightLine(line.text)"
            ></div>
          </template>
        </div>
      </details>
    </section>
  </div>
</template>

<style scoped>
.result-count {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin: 0.5rem 0 1rem;
}

.empty-note {
  color: var(--text-muted);
  font-style: italic;
}

.preamble-acc {
  margin: 0 0 20px;
  cursor: default;
  border-bottom: 1px solid var(--border);
  padding-bottom: 14px;
}

.chapter-group {
  margin-bottom: 22px;
}

.chapter-heading {
  font-family: var(--font-display);
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.82rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin: 0 0 10px;
}

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
