import { useState } from "react";
import { C } from "./constants";
import { parseSceneFields } from "./prompt";

const HEADER_KEYS = ["Durasi", "Shot", "Kamera"];

export default function SceneCard({ raw, idx, styleColor }) {
  const [open, setOpen] = useState(true);
  const fields = parseSceneFields(raw);
  const bodyKeys = Object.keys(fields).filter((k) => !HEADER_KEYS.includes(k));

  return (
    <div
      style={{
        background: "rgba(11,22,40,0.9)",
        border: `1px solid ${styleColor}28`,
        borderLeft: `3px solid ${styleColor}`,
        borderRadius: "7px",
        marginBottom: "10px",
        overflow: "hidden",
        animation: "fadeIn 0.25s ease",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "11px 16px",
          cursor: "pointer",
          background: open ? `${styleColor}08` : "transparent",
          userSelect: "none",
        }}
      >
        <span
          style={{
            background: styleColor,
            color: C.bg0,
            fontWeight: "800",
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: "3px",
            letterSpacing: "0.06em",
            flexShrink: 0,
          }}
        >
          SCENE {idx + 1}
        </span>

        {fields["Durasi"] && (
          <span style={{ color: C.muted, fontSize: "11px" }}>
            ⏱ {fields["Durasi"]}
          </span>
        )}
        {fields["Shot"] && (
          <span style={{ color: C.muted, fontSize: "11px" }}>
            📷 {fields["Shot"]}
          </span>
        )}
        {fields["Kamera"] && (
          <span style={{ color: C.muted, fontSize: "11px" }}>
            🎥 {fields["Kamera"]}
          </span>
        )}

        <span style={{ marginLeft: "auto", color: C.muted, fontSize: "12px" }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: "12px 16px 16px", display: "grid", gap: "9px" }}>
          {bodyKeys.map((k) => (
            <div
              key={k}
              style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}
            >
              <span
                style={{
                  color: "#94A3B8",
                  fontSize: "10px",
                  minWidth: "82px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontWeight: "700",
                  paddingTop: "2px",
                  fontFamily: "monospace",
                  flexShrink: 0,
                }}
              >
                {k}
              </span>
              <span
                style={{
                  color: C.text,
                  fontSize: "13px",
                  lineHeight: "1.55",
                  flex: 1,
                }}
              >
                {fields[k]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
