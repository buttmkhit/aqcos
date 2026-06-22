/**
• AQCOS — Secure API Route
• Proxy ke Google Gemini API dengan auto retry.
*/

const GEMINI_MODEL = "gemini-3-flash-preview";
const MAX_RETRY = 5;
const RETRY_DELAY_MS = 2000;

function sleep(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
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

const url = https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey};

let lastError = null;

for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
try {
const response = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(geminiBody),
});

if (response.status === 429) {
console.warn(Attempt ${attempt}: rate limited, retrying...`);
await sleep(RETRY_DELAY_MS * attempt);
lastError = "Rate limit (429). Coba lagi sebentar.";
continue;
}

if (!response.ok) {
const errText = await response.text();
console.error("Gemini error:", response.status, errText);
return res.status(response.status).json({
error: Gemini API error:${response.status}`,
detail: errText,
});
}

const data = await response.json();
const text =
data?.candidates?.[0]?.content?.parts
?.map((p) => p.text || "")
.join("") || "";

return res.status(200).json({ text });
} catch (err) {
console.error(Attempt ${attempt}:, err);
lastError = err.message;
await sleep(RETRY_DELAY_MS);
}
}

return res.status(429).json({
error: lastError || "Gagal menghubungi Gemini API. Coba lagi.",
});
}
