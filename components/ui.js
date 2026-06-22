import { C } from "./constants";

export function Chip({ active, color = C.teal, onClick, children, small }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? `${color}20` : "rgba(2,6,23,0.55)",
        border: `1px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
        borderRadius: small ? "20px" : "7px",
        padding: small ? "5px 11px" : "9px 14px",
        color: active ? color : C.muted,
        fontSize: small ? "11px" : "12px",
        fontWeight: active ? "600" : "400",
        cursor: "pointer",
        transition: "all 0.14s",
        whiteSpace: "nowrap",
        lineHeight: "1.4",
      }}
    >
      {children}
    </button>
  );
}

export function Label({ children }) {
  return (
    <div
      style={{
        fontSize: "10px",
        color: C.teal,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: "700",
        marginBottom: "10px",
      }}
    >
      {children}
    </div>
  );
}

export function Card({ children, style: s }) {
  return (
    <div
      style={{
        background: `${C.bg2}cc`,
        border: `1px solid ${C.border}`,
        borderRadius: "10px",
        padding: "18px 20px",
        ...s,
      }}
    >
      {children}
    </div>
  );
}

export function CopyBtn({ text, id, copied, onCopy, label = "Copy" }) {
  const done = copied === id;
  return (
    <button
      onClick={() => onCopy(text, id)}
      style={{
        background: done ? "rgba(20,184,166,0.15)" : "none",
        border: `1px solid ${done ? C.teal : "rgba(255,255,255,0.1)"}`,
        borderRadius: "5px",
        padding: "4px 11px",
        color: done ? C.teal : C.muted,
        fontSize: "11px",
        cursor: "pointer",
        transition: "all 0.15s",
        marginTop: "10px",
      }}
    >
      {done ? "✓ Tersalin" : `📋 ${label}`}
    </button>
  );
}

export function MetaBlock({ label, value, color, id, copied, onCopy }) {
  if (!value) return null;
  return (
    <div
      style={{
        background: "rgba(2,6,23,0.7)",
        border: `1px solid ${color}20`,
        borderLeft: `3px solid ${color}`,
        borderRadius: "7px",
        padding: "15px 18px",
      }}
    >
      <div
        style={{
          fontSize: "10px",
          color,
          fontWeight: "700",
          letterSpacing: "0.1em",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: C.text,
          fontSize: "13px",
          lineHeight: "1.65",
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </div>
      <CopyBtn text={value} id={id} copied={copied} onCopy={onCopy} />
    </div>
  );
}
