/**
 * AQCOS — Secure API Route
 * Proxy ke Google Gemini API. API key disimpan di server, tidak pernah expose ke browser.
 *
 * Strategi anti-404 / anti-limit:
 * 1. Coba daftar kandidat model berurutan (FALLBACK_MODELS).
 * 2. Kalau semua kandidat gagal dengan 404, panggil ListModels untuk cari
 *    model nyata yang didukung oleh API key ini, lalu coba model tersebut.
 * 3. Kalau gagal karena rate-limit/quota (429), otomatis lanjut ke kandidat
 *    berikutnya di daftar (bukan langsung gagal total).
 */

const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

const API_BASE = "https://generativelanguage.googleapis.com/v1beta";

async function callGemini(model, apiKey, geminiBody) {
  const url = `${API_BASE}/models/${model}:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(geminiBody),
  });
  return response;
}

async function findWorkingModel(apiKey) {
  // Tanya langsung ke Google: model apa saja yang valid untuk key ini.
  const res = await fetch(`${API_BASE}/models`, {
  headers: { "x-goog-api-key": apiKey },
});
  if (!res.ok) return null;
  const data = await res.json();
  const models = data?.models || [];

  // Cari model yang (a) support generateContent, (b) bukan varian
  // image/audio/embedding/tts, (c) prioritaskan yang ada kata "flash".
  const candidates = models.filter(
    (m) =>
      m.supportedGenerationMethods?.includes("generateContent") &&
      /gemini/i.test(m.name) &&
      !/image|audio|tts|embedding|live|vision-only/i.test(m.name)
  );

  if (candidates.length === 0) return null;

  const flashFirst =
    candidates.find((m) => /flash/i.test(m.name)) || candidates[0];

  // Nama dari ListModels selalu berformat "models/xxxx" — buang prefixnya.
  return flashFirst.name.replace(/^models\//, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY belum dikonfigurasi di environment variables.",
    });
  }

  const { system, prompt } = req.body;

  const geminiBody = {
    system_instruction: {
      parts: [{ text: system }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.85,
      maxOutputTokens: 8192,
    },
  };

  const attempts = [];
  let modelsToTry = [...FALLBACK_MODELS];

  try {
    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];
      let response;

      try {
        response = await callGemini(model, apiKey, geminiBody);
      } catch (networkErr) {
        attempts.push({ model, error: "network: " + networkErr.message });
        continue;
      }

      if (response.ok) {
        const data = await response.json();
        const text =
          data?.candidates?.[0]?.content?.parts
            ?.map((p) => p.text || "")
            .join("") || "";
        return res.status(200).json({ text, modelUsed: model });
      }

      const errText = await response.text();
      attempts.push({ model, status: response.status, detail: errText });
      console.error(`Gemini error on ${model}:`, response.status, errText);

      // 404 = model tidak ada/tidak didukung -> coba kandidat selanjutnya.
      // 429 = rate limit/quota habis -> coba kandidat selanjutnya juga.
      // Selain itu (400 bad request, 500 server) -> stop, beritahu user.
      if (response.status !== 404 && response.status !== 429 && response.status !== 400 && response.status !== 503) {
        return res.status(response.status).json({
          error: `Gemini API error: ${response.status}`,
          detail: errText,
          attempts,
        });
      }

      // Kalau ini kandidat terakhir di daftar dan masih 404 semua,
      // coba auto-discovery sekali sebagai upaya terakhir.
      if (i === modelsToTry.length - 1 && response.status === 404) {
        const discovered = await findWorkingModel(apiKey);
        if (discovered && !modelsToTry.includes(discovered)) {
          modelsToTry.push(discovered);
        }
      }
    }

    // Semua kandidat (termasuk hasil auto-discovery) gagal.
    return res.status(404).json({
      error:
        "Gemini API error: 404 — tidak ada model yang cocok untuk API key ini setelah mencoba semua kandidat.",
      attempts,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error: " + err.message, attempts });
  }
}
