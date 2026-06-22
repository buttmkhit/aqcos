import { useState } from "react";
import { C, STYLES, PLATFORMS } from "./constants";
import { CopyBtn, MetaBlock } from "./ui";
import SceneCard from "./SceneCard";

const TABS = [
  { id: "script",  label: "📋 Script"         },
  { id: "meta",    label: "🏷️ Hook & Caption"  },
  { id: "prompts", label: "🤖 AI Prompts"      },
  { id: "raw",     label: "📄 Raw"             },
];

export default function ResultArea({ parsed, rawText, loading, styleId, platform, sceneCount, topic, copied, onCopy }) {
  const [activeTab, setActiveTab] = useState("script");
  const selStyle = STYLES.find((s) => s.id === styleId);
  const selPlat  = PLATFORMS.find((p) => p.id === platform);

  if (!rawText && !loading) return null;

  return (
    <div style={{ marginTop: "28px", animation: "fadeIn 0.3s ease" }}>

      {/* ── Header bar ── */}
      <div
        style={{
          background: `${selStyle.color}10`,
          border: `1px solid ${selStyle.color}28`,
          borderRadius: "10px 10px 0 0",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "20px" }}>{selStyle.icon}</span>
        <div>
          <div style={{ fontWeight: "700", color: C.white, fontSize: "14px" }}>
            {parsed?.judul || (loading ? "Sedang di-generate..." : "Script AQCOS")}
          </div>
          <div style={{ fontSize: "11px", color: C.muted }}>
            {selStyle.label} · {selPlat?.label} · {sceneCount} scene · {topic}
          </div>
        </div>

        {parsed && !loading && (
          <span
            style={{
              marginLeft: "auto",
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "20px",
              padding: "3px 12px",
              fontSize: "11px",
              color: "#10B981",
              fontWeight: "600",
            }}
          >
            ✓ SELESAI
          </span>
        )}
      </div>

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          borderBottom: `1px solid ${C.border}`,
          background: "rgba(11,22,40,0.7)",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "11px 16px",
              background: "none",
              border: "none",
              borderBottom: `2px solid ${activeTab === t.id ? C.teal : "transparent"}`,
              color: activeTab === t.id ? C.teal : C.muted,
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "0.04em",
              transition: "all 0.14s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div
        style={{
          background: "rgba(11,22,40,0.75)",
          border: `1px solid ${C.border}`,
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          padding: "22px",
        }}
      >
        {/* SCRIPT */}
        {activeTab === "script" && (
          <div>
            {loading && !parsed ? (
              <div
                style={{
                  color: C.muted,
                  fontSize: "13px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              >
                ⚙️ Menyusun scene...
              </div>
            ) : parsed?.scenes.length > 0 ? (
              parsed.scenes.map((s, i) => (
                <SceneCard
                  key={i}
                  raw={s}
                  idx={i}
                  styleColor={selStyle.color}
                />
              ))
            ) : (
              <pre
                style={{
                  color: C.muted,
                  fontSize: "12px",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                }}
              >
                {rawText}
              </pre>
            )}
          </div>
        )}

        {/* HOOK & CAPTION */}
        {activeTab === "meta" && parsed && (
          <div style={{ display: "grid", gap: "14px" }}>
            <MetaBlock label="⚡ HOOK"    value={parsed.hook}    color="#F59E0B" id="hook"    copied={copied} onCopy={onCopy} />
            <MetaBlock label="📣 CAPTION" value={parsed.caption} color="#0EA5E9" id="caption" copied={copied} onCopy={onCopy} />
            <MetaBlock label="🎯 CTA"     value={parsed.cta}     color="#10B981" id="cta"     copied={copied} onCopy={onCopy} />
          </div>
        )}

        {/* AI PROMPTS */}
        {activeTab === "prompts" && parsed && (
          <div style={{ display: "grid", gap: "14px" }}>
            <MetaBlock label="🖼️ AI IMAGE PROMPT" value={parsed.promptImg} color="#8B5CF6" id="pimg" copied={copied} onCopy={onCopy} />
            <MetaBlock label="🎬 AI VIDEO PROMPT" value={parsed.promptVid} color="#EC4899" id="pvid" copied={copied} onCopy={onCopy} />
            <div
              style={{
                background: "rgba(20,184,166,0.05)",
                border: `1px solid ${C.border}`,
                borderRadius: "7px",
                padding: "12px 16px",
                fontSize: "11px",
                color: C.muted,
                lineHeight: "1.6",
              }}
            >
              💡 Paste prompt ke{" "}
              <strong style={{ color: "#94A3B8" }}>
                Midjourney, DALL·E, Veo 3, Google Flow, atau Opal
              </strong>{" "}
              untuk generate visual referensi scene 1.
            </div>
          </div>
        )}

        {/* RAW OUTPUT */}
        {activeTab === "raw" && (
          <div>
            <pre
              style={{
                color: "#94A3B8",
                fontSize: "11px",
                lineHeight: 1.75,
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                margin: 0,
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {rawText}
            </pre>
            <CopyBtn
              text={rawText}
              id="raw"
              copied={copied}
              onCopy={onCopy}
              label="Copy Semua"
            />
          </div>
        )}
      </div>
    </div>
  );
}
