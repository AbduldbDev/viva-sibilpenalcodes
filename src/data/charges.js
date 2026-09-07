// Direct port of the SIMPLE_* and ADV_* tables from the original
// Tkinter app. Keys, labels, fines, jail values and descriptions are
// preserved as-is so generated reports match the original tool.

export const MAX_JAIL_YEARS = 6; // Simple tab only
export const NONE_LABEL = "Wala / Hindi Aplikable";

// ============================================================
// SIMPLE TAB
// key -> { article, fine, jail, desc }
// ============================================================
export const SIMPLE_CHARGES = {
  pangungulo: {
    article: "Artikulo 100 Seksyon 1",
    fine: 150,
    jail: 0,
    desc: "Pangugulo sa pampublikong lugar",
  },
  walang_sedula: {
    article: "Artikulo 100 Seksyon 2",
    fine: 200,
    jail: 0,
    desc: "Hindi pagdadala ng sedula",
  },
  nakaw_small: {
    article: "Artikulo 101 Seksyon 1",
    fine: 200,
    jail: 0,
    desc: "Pagnanakaw sa Banyaga/Sampayan/Sementeryo",
  },
  nakaw_bahay: {
    article: "Artikulo 101 Seksyon 2",
    fine: 1500,
    jail: 6,
    desc: "Pagnanakaw sa Bahay/Rancho/Trespassing/Government Establishment + (6years)",
  },
  nakaw_estab: {
    article: "Artikulo 101 Seksyon 3",
    fine: 500,
    jail: 6,
    desc: "Pagnanakaw sa tindahan/bangko/korrigan + (6years)",
  },
  tangkang_patay: {
    article: "Artikulo 102 Seksyon 2",
    fine: 1500,
    jail: 4,
    desc: "Tangkang pagpatay at pananakit sa mga alagad ng batas + (4years)",
  },
  nakaw_bagon: {
    article: "Artikulo 105 Seksyon 1",
    fine: 500,
    jail: 6,
    desc: "Pagnanakaw sa bagon + (6years)",
  },
  high_risk: {
    article: "Artikulo 106 Seksyon 1",
    fine: 500,
    jail: 6,
    desc: "Pagdadala ng TNT/Dynamite/Molotov + (6years)",
  },
  illegal_droga: {
    article: "Artikulo 106 Seksyon 2",
    fine: 200,
    jail: 2,
    desc: "Pagdadala ng illegal na droga + (2years)",
  },
  ninakaw_gamit: {
    article: "Artikulo 106 Seksyon 4",
    fine: 200,
    jail: 0,
    desc: "Pagdadala ng mga ninakaw na kagamitan",
  },
  banditry: {
    article: "Artikulo 108 Seksyon 1",
    fine: 250,
    jail: 0,
    desc: "Pagsasagawa ng organisadong krimen (Banditry)",
  },
  illegal_baril: {
    article: "Artikulo 200 Seksyon 1",
    fine: 500,
    jail: 0,
    desc: "Pagdadala ng hindi awtorisadong baril (Pistol/Revolver)",
  },
  illegal_baril2: {
    article: "Artikulo 200 Seksyon 2",
    fine: 1500,
    jail: 0,
    desc: "Pagdadala ng hindi awtorisadong baril (Repeaters)",
  },
};

export const SIMPLE_LOCATION_TO_CHARGE = {
  Bangko: "nakaw_estab",
  Tindahan: "nakaw_estab",
  Korrigan: "nakaw_estab",
  Bagon: "nakaw_bagon",
  Banyaga: "nakaw_small",
  Sampayan: "nakaw_small",
  Sementeryo: "nakaw_small",
  "Bahay/Rancho": "nakaw_bahay",
  Trespassing: "nakaw_bahay",
};

export const SIMPLE_EVIDENCE_OPTIONS = [
  ["May illegal na droga", "illegal_droga"],
  ["May dalang baril (pistol/Revolver)", "illegal_baril"],
  ["May dalang baril (Mahaba)", "illegal_baril2"],
  ["May dalang ninakaw na kagamitan", "ninakaw_gamit"],
  ["May dalang TNT/Dynamite/Molotov", "high_risk"],
];

export const SIMPLE_EXTRA_CHARGE_OPTIONS = [
  ["Pangungulo sa pampublikong lugar", "pangungulo"],
  ["Tangkang pagpatay/pananakit sa pulis", "tangkang_patay"],
  ["Organisadong krimen (Banditry)", "banditry"],
];

// ============================================================
// ADVANCED TAB
// ============================================================
export const ADV_CHARGES = {
  pub_scandal: {
    article: "Artikulo 100 Seksyon 1",
    desc: "Pangugulo sa Pampublikong Lugar (loitering, littering, disorderly conduct, paglapastangan sa makasaysayang lugar, brawling)",
    fine: 150,
    jail_hours: 1,
    jail_note: "Town Jail 1 oras (may hard-labor na alternatibo)",
  },
  noncompliance: {
    article: "Artikulo 100 Seksyon 2",
    desc: "Hindi Pagsunod sa Awtoridad (walang sedula/pasaporte, di-paggalang sa opisyal, pekeng pagkakakilanlan, hindi pagtanggal ng takip sa mukha)",
    fine: 200,
    jail_hours: 1,
    jail_note: "Town Jail 1 oras",
  },
  theft_petty: {
    article: "Artikulo 101 Uri 1",
    desc: "Karaniwang Pagnanakaw (pickpocketing, clothesline robbery, panghuhukay ng libingan, scamming/con-artist)",
    fine: 200,
    jail_hours: 1,
    jail_note: "Town Jail 1 oras",
  },
  theft_qualified: {
    article: "Artikulo 101 Uri 2",
    desc: "Kwalipikadong Pagnanakaw (House/Ranch break-in, Trespassing sa establisimyento)",
    fine: 1500,
    jail_hours: 6,
    jail_note: "Sisika 6 oras",
  },
  theft_major: {
    article: "Artikulo 101 Uri 3",
    desc: "Malaking Robbery (Tindahan, Bangko, Grand Korrigan Robbery, Business Robbery)",
    fine: 500,
    jail_hours: 3,
    jail_note: "Sisika Penitentiary 3 oras",
  },
  highway_robbery: {
    article: "Artikulo 105",
    desc: "Highway Robbery (Stagecoach/Train Heist)",
    fine: 500,
    jail_hours: 6,
    jail_note: "Sisika Penitentiary min. 6 oras",
  },
  assault_health_gov: {
    article: "Artikulo 102 Seksyon 1",
    desc: "Pananakit/ Pagtangkang pag patay / pananakit laban sa Kagawaran ng Kalusugan/Hudikatura/Gobyerno",
    fine: 2000,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  assault_lawmen: {
    article: "Artikulo 102 Seksyon 2",
    desc: "Pananakit / Pagtangkang pag patay / pananakit sa Lawmen",
    fine: 1500,
    jail_hours: 4,
    jail_note: "Sisika hanggang 4 oras",
  },
  assault_pm_cj: {
    article: "Artikulo 102 Seksyon 3",
    desc: "Pananakit / Pagtangkang pag patay / pananakit sa Punong Ministro o Punong Mahistrado",
    fine: 2500,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  impersonation_badge: {
    article: "Artikulo 102 Seksyon 4",
    desc: "Pagpapanggap bilang Awtoridad / Paglapastangan sa Badge of Honor",
    fine: 1500,
    jail_hours: 3,
    jail_note: "Sisika hanggang 3 oras",
  },
  murder: {
    article: "Artikulo 103",
    desc: "Murder — Premeditated o Serial Killing (Permanent Death)",
    fine: 10000,
    jail_hours: 0,
    jail_special: "Life Imprisonment (Sisika Penitentiary)",
  },
  legendary_animal: {
    article: "Artikulo 104",
    desc: "Pagpatay sa Legendary Animal / Pagbebenta ng Peltits o Balat",
    fine: 500,
    jail_hours: 3,
    jail_note: "Sisika min. 3 oras",
  },
  contraband_a: {
    article: "Artikulo 106 Seksyon 1 (Class A)",
    desc: "Kagamitan ng Gobyerno / High-Risk na Sandata (military rifle, TNT, dynamite, molotov, pekeng badge/uniporme/dokumento)",
    fine: 500,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  contraband_c: {
    article: "Artikulo 106 Seksyon 3 (Class C)",
    desc: "Kagamitan sa Krimen (lockpick, skeleton key, posas, gawa-gawang selyo/dokumento)",
    fine: 200,
    jail_hours: 2,
    jail_note: "Sisika min. 2 oras",
  },
  contraband_d: {
    article: "Artikulo 106 Seksyon 4 (Class D)",
    desc: "Ninakaw/Illegal na Hawak na Ari-arian (kagamitan, kabayo, wagon, balahibo na walang patunay ng pagmamay-ari)",
    fine: 100,
    jail_hours: 1,
    jail_note: "Anumang piitan min. 1 oras",
  },
  escape_custody: {
    article: "Artikulo 107",
    desc: "Pagtakas sa Kustodiya / Jailbreak",
    fine: 800,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  armed_robbery_solo: {
    article: "Artikulo 108 Seksyon 1",
    desc: "Armadong Robbery ng Iisang Tao",
    fine: 1250,
    fine_note: "hanggang $1,250",
    jail_hours: 3,
    jail_note: "hanggang 3 oras",
  },
  armed_robbery_group: {
    article: "Artikulo 108 Seksyon 2",
    desc: "Armadong Robbery ng Dalawa o Higit Pa",
    fine: 1500,
    fine_note: "hanggang $1,500",
    jail_hours: 6,
    jail_note: "hanggang 6 oras",
  },
  rebellion: {
    article: "Artikulo 109",
    desc: "Rebelyon / Insurreksyon",
    fine: 0,
    jail_hours: 0,
    jail_special:
      "Death Penalty (kung pinuno) o Life Imprisonment (kung kasapi lamang)",
  },
  corruption: {
    article: "Artikulo 110",
    desc: "Katiwalian ng Lawmen/Gobyerno (suhol, iligal na pagpapalabas ng kriminal, tampering ng ebidensya, pagiging kasapi ng illegal na grupo)",
    fine: 5000,
    jail_hours: 0,
    jail_special:
      "Suspensyon 5–7 araw, demotion, posibleng permanenteng disciplinary action",
  },
  defamation: {
    article: "Artikulo 112",
    desc: "Paninirang Puri (Defamation)",
    fine: 500,
    fine_note: "hanggang $2,000, depende sa hukuman",
    jail_hours: 0,
  },
  threats: {
    article: "Artikulo 113",
    desc: "Pagbabanta (Threats)",
    fine: 500,
    fine_note: "hanggang $2,000, depende sa hukuman",
    jail_hours: 0,
  },
  coercion: {
    article: "Artikulo 114",
    desc: "Koersyon / Pamimilit (Coercion)",
    fine: 500,
    fine_note: "hanggang $2,000, depende sa hukuman",
    jail_hours: 0,
  },
  obstruction_justice: {
    article: "Artikulo 115",
    desc: "Paghadlang sa Katarungan (Obstruction of Justice)",
    fine: 1000,
    fine_note: "hanggang $2,500",
    jail_hours: 2,
    jail_note: "2–6 oras",
  },
  unauthorized_revolver_pistol: {
    article: "Artikulo 200 Seksyon 1",
    desc: "Hindi Awtorisadong Baril — Rebolber at Pistola (tulad ng Schofield)",
    fine: 500,
    jail_hours: 0,
    jail_note: "Dadalhin sa himpilan kung walang Lisensya sa Baril at Sedula",
  },

  unauthorized_repeater: {
    article: "Artikulo 200 Seksyon 2",
    desc: "Hindi Awtorisadong Baril — Repeater (tulad ng Carbine o Winchester)",
    fine: 1500,
    jail_hours: 0,
    jail_note: "Dadalhin sa himpilan kung walang Lisensya sa Baril at Sedula",
  },

  unauthorized_shotgun_rifle: {
    article: "Artikulo 200 Seksyon 3",
    desc: "Hindi Awtorisadong Baril — Shotgun at Rifle (tulad ng Double Barrel Shotgun o Springfield)",
    fine: 5000,
    jail_hours: 0,
    jail_note: "Dadalhin sa himpilan kung walang Lisensya sa Baril at Sedula",
  },
};

export const ADV_CHECKBOX_SECTIONS = [
  ["Kapayapaan at Awtoridad", ["pub_scandal", "noncompliance"]],
  [
    "Karahasan laban sa Gobyerno",
    [
      "assault_health_gov",
      "assault_lawmen",
      "assault_pm_cj",
      "impersonation_badge",
    ],
  ],
  ["Malubhang Krimen", ["murder", "rebellion", "corruption"]],
  ["Kontrabando", ["contraband_a", "contraband_c", "contraband_d"]],
  [
    "Iba Pang Paglabag",
    [
      "legendary_animal",
      "escape_custody",
      "armed_robbery_solo",
      "armed_robbery_group",
    ],
  ],
  [
    "Sibil na Kaso",
    ["defamation", "threats", "coercion", "obstruction_justice"],
  ],
  [
    "Hindi Awtorisadong Baril",
    [
      "unauthorized_revolver_pistol",
      "unauthorized_repeater",
      "unauthorized_shotgun_rifle",
    ],
  ],
];

export const ADV_LOCATION_TO_CHARGE = {
  [NONE_LABEL]: null,
  Banyaga: "theft_petty",
  Sampayan: "theft_petty",
  Sementeryo: "theft_petty",
  "Bahay/Rancho": "theft_qualified",
  "Trespassing (Ari-arian)": "theft_qualified",
  Tindahan: "theft_major",
  Bangko: "theft_major",
  Korrigan: "theft_major",
  "Stagecoach/Tren (Highway Robbery)": "highway_robbery",
};

export const ADV_RECKLESS_RIDING_TIERS = {
  [NONE_LABEL]: null,
  "1st Offense (Reprimand lamang)": {
    article: "Artikulo 100 Seksyon 3 (a)",
    desc: "Reckless Riding — 1st Offense",
    fine: 0,
    jail_hours: 0,
    fine_note: "Opisyal na Reprimand ng Peace Officer lamang",
  },
  "2nd Offense": {
    article: "Artikulo 100 Seksyon 3 (b)",
    desc: "Reckless Riding — 2nd Offense",
    fine: 150,
    jail_hours: 0,
  },
  "3rd Offense": {
    article: "Artikulo 100 Seksyon 3 (c)",
    desc: "Reckless Riding — 3rd Offense",
    fine: 300,
    jail_hours: 0,
  },
  "4th Offense": {
    article: "Artikulo 100 Seksyon 3 (d)",
    desc: "Reckless Riding — 4th Offense",
    fine: 500,
    jail_hours: 0,
  },
  "5th+ Offense": {
    article: "Artikulo 100 Seksyon 3 (e)",
    desc: "Reckless Riding — 5th at Sumunod na Offense",
    fine: 500,
    jail_hours: 0.5,
    jail_note: "30 minuto",
  },
};

export const ADV_NARCOTICS_TIERS = {
  [NONE_LABEL]: null,
  "Tier 1 (1–20 na piraso)": {
    article: "Artikulo 106 Seksyon 2 (Class B) — Tier 1",
    desc: "Pagdadala/Pagbebenta ng Ipinagbabawal na Gamot — 1–20 piraso",
    fine: 200,
    jail_hours: 2,
    jail_note: "min. 2 oras",
  },
  "Tier 2 (21–40 na piraso)": {
    article: "Artikulo 106 Seksyon 2 (Class B) — Tier 2",
    desc: "Pagdadala/Pagbebenta ng Ipinagbabawal na Gamot — 21–40 piraso",
    fine: 1000,
    jail_hours: 4,
  },
  "Tier 3 (41+ na piraso)": {
    article: "Artikulo 106 Seksyon 2 (Class B) — Tier 3",
    desc: "Pagdadala/Pagbebenta ng Ipinagbabawal na Gamot — 41+ piraso",
    fine: 2500,
    jail_hours: 6,
  },
};

export const ADV_BANDITRY_TIERS = {
  [NONE_LABEL]: null,
  "Tier 1 (hanggang 15 crime record)": {
    article: "Artikulo 108 Seksyon 3 — Tier 1",
    desc: "Banditry — hanggang 15 crime record",
    fine: 250,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  "Tier 2 (higit sa 15 crime record)": {
    article: "Artikulo 108 Seksyon 3 — Tier 2",
    desc: "Banditry — higit sa 15 crime record",
    fine: 1500,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
  "Tier 3 (higit sa 30 crime record)": {
    article: "Artikulo 108 Seksyon 3 — Tier 3",
    desc: "Banditry — higit sa 30 crime record",
    fine: 2500,
    jail_hours: 6,
    jail_note: "Sisika hanggang 6 oras",
  },
};

export function formatG(n) {
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toPrecision(12)));
}
