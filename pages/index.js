import { useState, useCallback } from "react";
import Head from "next/head";
import { C } from "../components/constants";
import { buildPrompt, parseResult } from "../components/prompt";
import InputPanel from "../components/InputPanel";
import SidePanel from "../components/SidePanel";
import ResultArea from "../components/ResultArea";

export default function Home() {
  // ── Form state ──
  const [topic,      setTopic]      = useState("");
  const [platform,   setPlatform]   = useState("REELS");
  const [styleId,    setStyleId]    = useState("HUMAS_KEKINIAN");
  const [formula,    setFormula]    = useState("HOOK_PROBLEM");
  const [sceneCount, setSceneCount] = useState(5);
  const [notes,      setNotes]      = useState("");

  // ── Result state ──
  const [loading,  setLoading]  = useState(false);
  const [rawText,  setRawText]  = useState("");
  const [parsed,   setParsed]   = useState(null);
  const [error,    setError]    = useState(null);

  // ── Copy state ──
  const [copied, setCopied] = useState(null);
  const handleCopy = useCallback((text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }, []);

  // ── Generate ──
  async function handleGenerate() {
    if (!topic.trim() || loading) return;

    setLoading(true);
    setRawText("");
    setParsed(null);
    setError(null);

    const prompt = buildPrompt({ topic: topic.trim(), platform, styleId, formula, notes, sceneCount });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system:
            "Kamu adalah AQCOS — AI Quarantine Content Operating System. " +
            "Pakar konten karantina Indonesia: entomologi, fitopatologi, biosafety, regulasi, dan produksi media sosial. " +
            "Selalu hasilkan script ilmiah, akurat, kreatif, dan menarik. " +
            "Ikuti format output yang diminta PERSIS tanpa teks tambahan.",
          prompt,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();
      const text = data.text || "";

      setRawText(text);
      setParsed(parseResult(text));
    } catch (err) {
      console.error(err);
      setError(err.message || "Koneksi ke AI gagal. Coba lagi dalam beberapa saat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>AQCOS — AI Quarantine Content OS</title>
      </Head>

      {/* ── Top bar ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 99,
          background: "rgba(2,6,23,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "13px 28px",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            background: "linear-gradient(135deg,#14B8A6,#0EA5E9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
            flexShrink: 0,
          }}
        >
          🔬
        </div>
        <div>
          <div
            style={{
              fontWeight: "800",
              fontSize: "14px",
              letterSpacing: "0.06em",
              color: C.white,
            }}
          >
            AQCOS
          </div>
          <div
            style={{
              fontSize: "10px",
              color: C.muted,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            AI Quarantine Content OS · Script Generator
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10B981",
              boxShadow: "0 0 7px #10B981",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              color: C.muted,
              letterSpacing: "0.08em",
            }}
          >
            ENGINE AKTIF
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "28px 22px 80px",
        }}
      >
        {/* Two-column layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: "22px",
            alignItems: "start",
          }}
        >
          <InputPanel
            topic={topic}         setTopic={setTopic}
            platform={platform}   setPlatform={setPlatform}
            styleId={styleId}     setStyleId={setStyleId}
            formula={formula}     setFormula={setFormula}
            sceneCount={sceneCount} setSceneCount={setSceneCount}
            notes={notes}         setNotes={setNotes}
            onGenerate={handleGenerate}
          />

          <SidePanel
            topic={topic}
            platform={platform}
            styleId={styleId}
            sceneCount={sceneCount}
            loading={loading}
            parsed={parsed}
            rawText={rawText}
            copied={copied}
            onCopy={handleCopy}
            onGenerate={handleGenerate}
            error={error}
          />
        </div>

        {/* Result area — full width below */}
        <ResultArea
          parsed={parsed}
          rawText={rawText}
          loading={loading}
          styleId={styleId}
          platform={platform}
          sceneCount={sceneCount}
          topic={topic}
          copied={copied}
          onCopy={handleCopy}
        />

        {/* Empty state */}
        {!rawText && !loading && (
          <div
            style={{
              marginTop: "40px",
              textAlign: "center",
              padding: "50px 20px",
              border: `1px dashed ${C.border}`,
              borderRadius: "12px",
              background: "rgba(20,184,166,0.02)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>🔬</div>
            <div
              style={{
                color: C.muted,
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              Isi topik konten, pilih konfigurasi,
              <br />
              lalu tekan{" "}
              <strong style={{ color: C.teal }}>GENERATE SCRIPT</strong> untuk
              memulai.
            </div>
          </div>
        )}
      </div>

      {/* Inline keyframes (Next.js pages dir doesn't need styled-jsx for globals) */}
      <style jsx global>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        textarea, input { outline: none !important; }
        button:focus-visible { outline: 2px solid #14B8A6; outline-offset: 2px; }
      `}</style>
    </>
  );
}
