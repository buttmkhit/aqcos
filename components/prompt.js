import { STYLES, PLATFORMS, FORMULAS } from "./constants";

export function buildPrompt({ topic, platform, styleId, formula, notes, sceneCount }) {
  const s = STYLES.find((x) => x.id === styleId);
  const p = PLATFORMS.find((x) => x.id === platform);
  const f = FORMULAS.find((x) => x.id === formula);

  const sceneTemplate = Array.from({ length: sceneCount }, (_, i) => `
[SCENE ${i + 1}]
Durasi: [X detik]
Visual: [deskripsi visual scene]
Shot: [close up / medium shot / wide shot / extreme close up / over shoulder]
Kamera: [push in / pull out / pan / tilt / static / handheld]
Narasi: "[dialog atau narasi talent]"
Voice Over: "[VO jika terpisah dari narasi, atau '-' jika tidak ada]"
Talent: [arahan ekspresi dan gestur]
Mood: [atmosfer/mood scene]`).join("\n");

  return `Kamu adalah AQCOS — AI Quarantine Content Operating System.
Kamu ahli dalam regulasi karantina Indonesia, entomologi, fitopatologi, biosafety, dan produksi konten media sosial.

Buat VIDEO SCRIPT lengkap berdasarkan parameter berikut:

TOPIK       : ${topic}
PLATFORM    : ${p?.label} (${p?.dur})
GAYA        : ${s?.label} — ${s?.desc}
FORMULA     : ${f?.label}
JUMLAH SCENE: ${sceneCount}
${notes ? `CATATAN     : ${notes}` : ""}

Gunakan format OUTPUT berikut PERSIS (tanpa tambahan teks di luar format):

JUDUL: [judul konten menarik, singkat, relevan]

HOOK: [1–2 kalimat pembuka yang langsung menarik perhatian, sesuai gaya ${s?.label}]

CAPTION: [caption siap posting dengan emoji dan 5–8 hashtag relevan karantina Indonesia]

CTA: [call to action sesuai platform ${p?.label}]

---SCRIPT---
${sceneTemplate}
---END SCRIPT---

PROMPT AI IMAGE:
[prompt Inggris sinematik untuk generate gambar referensi scene 1, photorealistic, cinematic lighting, 8K]

PROMPT AI VIDEO:
[prompt Inggris untuk generate video scene 1, camera movement, lighting, mood, ultra realistic]

Pastikan: ilmiah & akurat, sesuai regulasi karantina Indonesia, gaya ${s?.label} konsisten seluruh script.`;
}

export function parseResult(text) {
  const get = (label) => {
    const m = text.match(
      new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n[A-Z À-ÿ]+:|---SCRIPT---|---END SCRIPT---|$)`, "i")
    );
    return m ? m[1].trim() : "";
  };

  const scriptMatch = text.match(/---SCRIPT---\n([\s\S]*?)---END SCRIPT---/);
  const sceneBlocks = scriptMatch
    ? scriptMatch[1].split(/\[SCENE \d+\]/).filter((s) => s.trim())
    : [];

  const promptImg = text.match(/PROMPT AI IMAGE:\n([\s\S]*?)(?=\nPROMPT AI VIDEO:|$)/i)?.[1]?.trim() || "";
  const promptVid = text.match(/PROMPT AI VIDEO:\n([\s\S]*?)$/i)?.[1]?.trim() || "";

  return {
    judul:     get("JUDUL"),
    hook:      get("HOOK"),
    caption:   get("CAPTION"),
    cta:       get("CTA"),
    scenes:    sceneBlocks,
    promptImg,
    promptVid,
  };
}

export function parseSceneFields(raw) {
  const fields = {};
  raw.trim().split("\n").forEach((line) => {
    const i = line.indexOf(":");
    if (i > -1) {
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (k && v) fields[k] = v;
    }
  });
  return fields;
}
