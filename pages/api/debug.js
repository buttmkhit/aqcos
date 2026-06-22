export default function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  res.json({
    exists: !!key,
    prefix: key ? key.slice(0, 6) : "TIDAK ADA",
    length: key ? key.length : 0,
  });
}
