import { C, STYLES, PLATFORMS } from "./constants";

export default function SidePanel({
  topic, platform, styleId, sceneCount,
  loading, parsed, rawText,
  copied, onCopy, onGenerate, error,
}) {
  const selStyle = STYLES.find((s) => s.id === styleId);
  const selPlat  = PLATFORMS.find((p) => p.id === platform);
  const canGenerate = topic.trim().length > 0 && !loading;

  return (
    <div style={{ display: "grid", gap: "14px", position: "sticky", top: "72px" }}>

      {/* ── Config summary ── */}
      <div
        style={{
          background: `${selStyle.color}10`,
          border: `1px solid ${selStyle.color}30`,
          borderRadius: "10px",
          padding: "16px 18px",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            color: selStyle.color,
            letterSpacing: "0.1em",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          RINGKASAN KONFIGURASI
        </div>

        {[
          ["Topik",    topic || <span style={{ color: C.muted, fontStyle: "italic" }}>Belum diisi</span>],
          ["Platform", `${selPlat?.icon} ${selPlat?.label}`],
          ["Gaya",     `${selStyle.icon} ${selStyle.label}`],
          ["Scene",    `${sceneCount} scene`],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "7px",
              alignItems: "flex-start",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: C.muted,
                minWidth: "60px",
                paddingTop: "2px",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                flexShrink: 0,
              }}
            >
              {k}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: C.text,
                flex: 1,
                lineHeight: "1.4",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* ── Generate button ── */}
      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        style={{
          width: "100%",
          padding: "15px",
          background: canGenerate
            ? "linear-gradient(135deg, #0D9488, #0369A1)"
            : "rgba(20,184,166,0.07)",
          border: `1px solid ${canGenerate ? C.teal : C.border}`,
          borderRadius: "10px",
          color: canGenerate ? C.white : C.muted,
          fontSize: "14px",
          fontWeight: "800",
          cursor: canGenerate ? "pointer" : "not-allowed",
          letterSpacing: "0.05em",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "9px",
          boxShadow: canGenerate ? "0 4px 24px rgba(13,148,136,0.3)" : "none",
        }}
      >
        {loading ? (
          <>
            <span style={{ display: "inline-block", animation: "spin 0.9s linear infinite" }}>
              ⚙️
            </span>
            Memproses...
          </>
        ) : (
          <>🚀 GENERATE SCRIPT</>
        )}
      </button>

      {!topic.trim() && (
        <div style={{ textAlign: "center", fontSize: "11px", color: C.muted }}>
          ↑ Isi topik konten untuk mulai
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "8px",
            padding: "12px 14px",
            fontSize: "12px",
            color: "#FCA5A5",
            lineHeight: "1.5",
            whiteSpace: "pre-line",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* ── Loading steps ── */}
      {loading && (
        <div
          style={{
            background: "rgba(20,184,166,0.06)",
            border: `1px solid ${C.border}`,
            borderRadius: "8px",
            padding: "14px 16px",
          }}
        >
          {[
            "🔍 Menganalisis topik...",
            "✍️ Menyusun script...",
            "🎬 Memformat scene...",
          ].map((s, i) => (
            <div
              key={i}
              style={{
                fontSize: "11px",
                color: C.teal,
                marginBottom: i < 2 ? "7px" : 0,
                display: "flex",
                alignItems: "center",
                gap: "7px",
                animation: `pulse ${1 + i * 0.35}s ease-in-out infinite`,
              }}
            >
              <span>●</span> {s}
            </div>
          ))}
        </div>
      )}

      {/* ── Quick copy ── */}
      {parsed && !loading && (
        <div style={{ display: "grid", gap: "7px" }}>
          <div
            style={{
              fontSize: "10px",
              color: C.muted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            QUICK COPY
          </div>

          {[
            { label: "📋 Copy Hook",        val: parsed.hook,      id: "qhook" },
            { label: "📣 Copy Caption",     val: parsed.caption,   id: "qcap"  },
            { label: "🤖 Copy Image Prompt",val: parsed.promptImg, id: "qpimg" },
            { label: "📄 Copy Full Output", val: rawText,          id: "qfull" },
          ].map(({ label, val, id }) =>
            val ? (
              <button
                key={id}
                onClick={() => onCopy(val, id)}
                style={{
                  background: copied === id ? "rgba(20,184,166,0.12)" : "rgba(2,6,23,0.6)",
                  border: `1px solid ${copied === id ? C.teal : C.border}`,
                  borderRadius: "6px",
                  padding: "8px 12px",
                  color: copied === id ? C.teal : C.muted,
                  fontSize: "11px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
              >
                {copied === id ? "✓ Tersalin!" : label}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
