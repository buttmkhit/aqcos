import { useRef, useEffect } from "react";
import { C, STYLES, PLATFORMS, FORMULAS, TOPIC_CHIPS } from "./constants";
import { Chip, Label, Card } from "./ui";

export default function InputPanel({
  topic, setTopic,
  platform, setPlatform,
  styleId, setStyleId,
  formula, setFormula,
  sceneCount, setSceneCount,
  notes, setNotes,
  onGenerate,
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 130) + "px";
  }, [topic]);

  return (
    <div style={{ display: "grid", gap: "18px" }}>

      {/* ── Topik ── */}
      <Card>
        <Label>📋 Topik Konten</Label>
        <textarea
          ref={textareaRef}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onGenerate();
          }}
          placeholder={
            "Tulis topik konten karantinamu di sini...\n" +
            "Contoh: Cara petugas karantina mendeteksi hama gudang pada beras impor"
          }
          rows={2}
          style={{
            width: "100%",
            background: "rgba(2,6,23,0.7)",
            border: `1px solid ${topic ? C.borderHover : C.border}`,
            borderRadius: "8px",
            color: C.text,
            padding: "13px 14px",
            fontSize: "14px",
            outline: "none",
            resize: "none",
            lineHeight: "1.55",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />

        {/* Quick-fill chips */}
        <div style={{ marginTop: "11px" }}>
          <div
            style={{
              fontSize: "10px",
              color: C.muted,
              marginBottom: "7px",
              letterSpacing: "0.07em",
            }}
          >
            TOPIK POPULER — klik untuk isi otomatis
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {TOPIC_CHIPS.map((t) => (
              <Chip
                key={t}
                small
                active={topic === t}
                onClick={() => setTopic(t)}
              >
                {t}
              </Chip>
            ))}
          </div>
        </div>

        {topic && (
          <div style={{ marginTop: "9px", fontSize: "11px", color: C.muted }}>
            💡 Tekan{" "}
            <kbd
              style={{
                background: C.bg0,
                border: `1px solid ${C.border}`,
                borderRadius: "3px",
                padding: "1px 5px",
                fontSize: "10px",
              }}
            >
              Ctrl+Enter
            </kbd>{" "}
            untuk generate
          </div>
        )}
      </Card>

      {/* ── Platform ── */}
      <Card>
        <Label>📱 Platform Target</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {PLATFORMS.map((p) => (
            <Chip
              key={p.id}
              active={platform === p.id}
              onClick={() => setPlatform(p.id)}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span>
                  {p.icon} {p.label}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    opacity: 0.6,
                    color: platform === p.id ? "inherit" : C.muted,
                  }}
                >
                  {p.dur}
                </span>
              </span>
            </Chip>
          ))}
        </div>
      </Card>

      {/* ── Gaya ── */}
      <Card>
        <Label>🎭 Gaya Penyampaian</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
          {STYLES.map((s) => (
            <Chip
              key={s.id}
              active={styleId === s.id}
              color={s.color}
              onClick={() => setStyleId(s.id)}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "15px" }}>{s.icon}</span>
                <span>
                  <div style={{ fontWeight: styleId === s.id ? "600" : "400" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "10px", color: C.muted, marginTop: "1px" }}>
                    {s.desc}
                  </div>
                </span>
              </span>
            </Chip>
          ))}
        </div>
      </Card>

      {/* ── Formula ── */}
      <Card>
        <Label>⚗️ Formula Konten</Label>
        <div style={{ display: "grid", gap: "7px" }}>
          {FORMULAS.map((f) => (
            <Chip
              key={f.id}
              active={formula === f.id}
              onClick={() => setFormula(f.id)}
            >
              {f.icon} {f.label}
            </Chip>
          ))}
        </div>
      </Card>

      {/* ── Scene count + notes ── */}
      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
          }}
        >
          <div>
            <Label>🎬 Jumlah Scene: {sceneCount}</Label>
            <input
              type="range"
              min={3}
              max={10}
              value={sceneCount}
              onChange={(e) => setSceneCount(Number(e.target.value))}
              style={{ width: "100%", accentColor: C.teal, marginBottom: "4px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: C.muted,
              }}
            >
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          <div>
            <Label>📝 Catatan (opsional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: sertakan data statistik, gunakan POV petugas lapangan..."
              rows={3}
              style={{
                width: "100%",
                background: "rgba(2,6,23,0.7)",
                border: `1px solid ${C.border}`,
                borderRadius: "7px",
                color: C.text,
                padding: "9px 11px",
                fontSize: "12px",
                outline: "none",
                resize: "none",
                lineHeight: "1.5",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
