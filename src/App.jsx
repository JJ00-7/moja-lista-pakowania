import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Minus, Trash2, X, Pencil, Loader2, Briefcase, Package, Users, Copy, Check, CheckCircle2, Circle } from "lucide-react";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const SEED_ITEMS = [
  { name: "Koszulki", qty: 4 },
  { name: "Spodnie długie", qty: 1 },
  { name: "Spodenki", qty: 1 },
  { name: "Dresy", qty: 1 },
  { name: "Bluza", qty: 1 },
  { name: "Majtki", qty: 4 },
  { name: "Skarpety", qty: 4 },
  { name: "Pasek do spodni", qty: 1 },
  { name: "Piżama", qty: 1 },
  { name: "Kurtka przeciwdeszczowa", qty: 1 },
  { name: "Suplementy", qty: 1 },
  { name: "Dezodorant", qty: 1 },
  { name: "Krem do twarzy", qty: 1 },
  { name: "Perfumy", qty: 1 },
  { name: "Mugga", qty: 1 },
  { name: "Kapelusz", qty: 1 },
  { name: "Chusta na głowę", qty: 1 },
  { name: "Poduszka podróżna", qty: 1 },
];

function seedItems() {
  return SEED_ITEMS.map((it) => ({ id: uid(), name: it.name, qty: it.qty, packed: false }));
}

function makePerson(name) {
  return {
    id: uid(),
    name,
    luggage: [
      { id: "cabin", type: "cabin", label: "Bagaż podręczny", items: [] },
      { id: "suitcase", type: "suitcase", label: "Walizka", items: [] },
    ],
  };
}

function defaultData() {
  const p1 = makePerson("Osoba 1");
  const p2 = makePerson("Osoba 2");
  p1.luggage[1].items = seedItems();
  p2.luggage[1].items = seedItems();
  return {
    tripName: "Nasza podróż",
    activePersonId: p1.id,
    people: [p1, p2],
  };
}

function sanitizeCode(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "wspolna-podroz";
}

const luggageIcon = (type) => (type === "cabin" ? Briefcase : Package);

function IconBtn({ onClick, title, children, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "1px solid var(--line)",
        background: danger ? "transparent" : "var(--paper)",
        color: danger ? "var(--rust)" : "var(--ink)",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function Stripe({ height = 6 }) {
  return (
    <div
      style={{
        height,
        width: "100%",
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--rust) 0px, var(--rust) 9px, var(--paper) 9px, var(--paper) 18px, var(--teal) 18px, var(--teal) 27px, var(--paper) 27px, var(--paper) 36px)",
        flexShrink: 0,
      }}
    />
  );
}

function ItemRow({ item, onChange, onDelete }) {
  const packed = !!item.packed;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "1px dashed var(--line)", opacity: packed ? 0.55 : 1 }}>
      <button
        onClick={() => onChange({ ...item, packed: !packed })}
        style={{ border: "none", background: "transparent", color: packed ? "var(--teal)" : "var(--ink-soft)", cursor: "pointer", display: "flex", padding: 2 }}
      >
        {packed ? <CheckCircle2 size={19} /> : <Circle size={19} />}
      </button>
      <input
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder="Nazwa przedmiotu"
        style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", fontFamily: "'Karla', sans-serif", fontSize: 15, color: "var(--ink)", padding: "4px 2px", outline: "none", textDecoration: packed ? "line-through" : "none" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <IconBtn onClick={() => onChange({ ...item, qty: Math.max(0, item.qty - 1) })}><Minus size={14} /></IconBtn>
        <span style={{ minWidth: 24, textAlign: "center", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: "var(--teal)" }}>{item.qty}</span>
        <IconBtn onClick={() => onChange({ ...item, qty: item.qty + 1 })}><Plus size={14} /></IconBtn>
        <IconBtn danger onClick={onDelete}><Trash2 size={14} /></IconBtn>
      </div>
    </div>
  );
}

function AddItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: uid(), name: trimmed, qty: Math.max(1, qty), packed: false });
    setName("");
    setQty(1);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 10 }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Dodaj przedmiot…"
        style={{ flex: 1, minWidth: 0, border: "1px solid var(--line)", borderRadius: 8, background: "var(--paper)", fontFamily: "'Karla', sans-serif", fontSize: 14, padding: "8px 10px", outline: "none", color: "var(--ink)" }}
      />
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(parseInt(e.target.value) || 1)}
        style={{ width: 52, border: "1px solid var(--line)", borderRadius: 8, background: "var(--paper)", fontFamily: "'Space Mono', monospace", fontSize: 14, padding: "8px 6px", textAlign: "center", outline: "none", color: "var(--ink)" }}
      />
      <button onClick={submit} style={{ border: "none", borderRadius: 8, background: "var(--mustard)", color: "var(--ink)", fontWeight: 700, fontSize: 14, padding: "8px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        <Plus size={15} /> Dodaj
      </button>
    </div>
  );
}

function LuggageSection({ luggage, onUpdate, onDelete, removable }) {
  const Icon = luggageIcon(luggage.type);
  const totalCount = luggage.items.length;
  const packedCount = luggage.items.filter((i) => i.packed).length;

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", boxShadow: "3px 3px 0 var(--line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "var(--ink)", color: "var(--paper)" }}>
        <Icon size={18} />
        {luggage.type === "extra" ? (
          <input
            value={luggage.label}
            onChange={(e) => onUpdate({ ...luggage, label: e.target.value })}
            style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: "var(--paper)", fontWeight: 700, fontSize: 15 }}
          />
        ) : (
          <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{luggage.label}</span>
        )}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, opacity: 0.85, background: "rgba(255,255,255,0.12)", borderRadius: 6, padding: "2px 8px" }}>
          {packedCount}/{totalCount} spakowane
        </span>
        {removable && <button onClick={onDelete} style={{ border: "none", background: "transparent", color: "var(--paper)", cursor: "pointer", display: "flex" }}><X size={16} /></button>}
      </div>
      <div style={{ padding: "6px 14px 14px" }}>
        {luggage.items.map((item) => (
          <ItemRow key={item.id} item={item} onChange={(updated) => onUpdate({ ...luggage, items: luggage.items.map(i => i.id === updated.id ? updated : i) })} onDelete={() => onUpdate({ ...luggage, items: luggage.items.filter(i => i.id !== item.id) })} />
        ))}
        <AddItemForm onAdd={(item) => onUpdate({ ...luggage, items: [...luggage.items, item] })} />
      </div>
    </div>
  );
}

export default function PackingListApp() {
  const [tripCode, setTripCode] = useState("wspolna-podroz");
  const [codeInput, setCodeInput] = useState("wspolna-podroz");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [addingLuggage, setAddingLuggage] = useState(false);
  const [newLuggageName, setNewLuggageName] = useState("");

  const saveTimeout = useRef(null);
  const skipNextSave = useRef(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/lists/${tripCode}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Błąd pobierania listy");
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json && json.people) {
          skipNextSave.current = true;
          setData(json);
        } else {
          const fresh = defaultData();
          skipNextSave.current = true;
          setData(fresh);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fresh = defaultData();
        skipNextSave.current = true;
        setData(fresh);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [tripCode]);

  useEffect(() => {
    if (!data) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(() => {
      fetch(`/api/lists/${tripCode}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).catch(() => setError("Nie udało się zapisać zmian w chmurze."));
    }, 500);

    return () => clearTimeout(saveTimeout.current);
  }, [data, tripCode]);

  const update = useCallback((fn) => {
    setData((prev) => (prev ? fn(prev) : prev));
  }, []);

  const activePerson = data && data.people.find((p) => p.id === data.activePersonId);

  const loadCode = () => {
    const clean = sanitizeCode(codeInput);
    setCodeInput(clean);
    setTripCode(clean);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(tripCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  return (
    <div style={{ fontFamily: "'Karla', sans-serif", background: "var(--bg)", minHeight: "100vh", color: "var(--ink)", "--ink": "#1B2A41", "--ink-soft": "#6b6650", "--paper": "#EFE6CF", "--card": "#F7F1DF", "--bg": "#E7DBB4", "--mustard": "#D9AC4F", "--rust": "#BF4342", "--teal": "#2B6777", "--line": "#C9BB93" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Space+Mono:wght@400;700&family=Karla:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>
      <Stripe height={8} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 22 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--rust)", letterSpacing: 1 }}>LISTA PAKOWANIA</span>
          {data && (
            <input
              value={data.tripName}
              onChange={(e) => update((d) => ({ ...d, tripName: e.target.value }))}
              style={{ fontFamily: "'Abril Fatface', serif", fontSize: "clamp(32px, 6vw, 48px)", color: "var(--ink)", background: "transparent", border: "none", width: "100%", padding: "2px 0" }}
            />
          )}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 13, color: "var(--ink-soft)" }}>
            <Users size={14} />
            <span>Kod podróży:</span>
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadCode()}
              style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "7px 10px", fontFamily: "'Space Mono', monospace", fontSize: 13, background: "var(--card)", color: "var(--ink)", width: 220 }}
            />
            <button onClick={loadCode} style={{ border: "1px solid var(--ink)", borderRadius: 8, padding: "7px 12px", background: "var(--teal)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Wczytaj listę</button>
            <button onClick={copyCode} style={{ border: "1px solid var(--line)", borderRadius: 8, padding: "7px 12px", background: "var(--card)", color: "var(--ink)", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Skopiowano kod" : "Kopiuj kod"}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "40px 0", color: "var(--ink-soft)" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Wczytywanie listy z chmury…
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {error && <div style={{ background: "#F6DEDD", border: "1px solid var(--rust)", color: "var(--rust)", borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>{error}</div>}

        {!loading && data && (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 18, flexWrap: "wrap", marginBottom: 26 }}>
              {data.people.map((p) => {
                const [editing, setEditing] = useState(false);
                const active = p.id === data.activePersonId;
                return (
                  <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 1, height: 12, background: "var(--line)" }} />
                    <div
                      onClick={() => update((d) => ({ ...d, activePersonId: p.id }))}
                      style={{
                        position: "relative", cursor: "pointer", background: active ? "var(--mustard)" : "var(--card)",
                        border: `1.5px solid var(--ink)`, borderRadius: "4px 10px 10px 4px", padding: "8px 14px 8px 22px",
                        display: "flex", alignItems: "center", gap: 8, boxShadow: active ? "3px 3px 0 var(--ink)" : "2px 2px 0 var(--line)"
                      }}
                    >
                      {editing ? (
                        <input
                          autoFocus value={p.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            update((d) => ({ ...d, people: d.people.map(item => item.id === p.id ? { ...item, name } : item) }));
                          }}
                          onBlur={() => setEditing(false)}
                          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: 80, border: "none", outline: "none", background: "transparent", fontWeight: 700, fontSize: 14, color: "var(--ink)" }}
                        />
                      ) : (
                        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{p.name}</span>
                      )}
                      <Pencil size={12} style={{ opacity: 0.5 }} onClick={(e) => { e.stopPropagation(); setEditing(true); }} />
                      {data.people.length > 1 && (
                        <X size={13} style={{ opacity: 0.55 }} onClick={(e) => {
                          e.stopPropagation();
                          update((d) => ({
                            ...d,
                            people: d.people.filter(item => item.id !== p.id),
                            activePersonId: d.activePersonId === p.id ? d.people[0].id : d.activePersonId
                          }));
                        }} />
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => update((d) => { const p = makePerson(`Osoba ${d.people.length + 1}`); return { ...d, people: [...d.people, p], activePersonId: p.id }; })}
                style={{ border: "1.5px dashed var(--ink)", borderRadius: "4px 10px 10px 4px", padding: "8px 14px", background: "transparent", color: "var(--ink)", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={14} /> Osoba
              </button>
            </div>

            {activePerson && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {activePerson.luggage.map((l) => (
                  <LuggageSection
                    key={l.id} luggage={l}
                    onUpdate={(updated) => update((d) => ({ ...d, people: d.people.map(p => p.id !== activePerson.id ? p : { ...p, luggage: p.luggage.map(lug => lug.id === l.id ? updated : lug) }) }))}
                    onDelete={() => update((d) => ({ ...d, people: d.people.map(p => p.id !== activePerson.id ? p : { ...p, luggage: p.luggage.filter(lug => lug.id !== l.id) }) }))}
                    removable={l.type === "extra"}
                  />
                ))}
                {addingLuggage ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      autoFocus value={newLuggageName} onChange={(e) => setNewLuggageName(e.target.value)} placeholder="np. Torba sportowa"
                      style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 8, padding: "9px 12px", background: "var(--card)" }}
                    />
                    <button onClick={() => { if (!newLuggageName.trim()) return; update((d) => ({ ...d, people: d.people.map(p => p.id !== activePerson.id ? p : { ...p, luggage: [...p.luggage, { id: uid(), type: "extra", label: newLuggageName.trim(), items: [] }] }) })); setNewLuggageName(""); setAddingLuggage(false); }} style={{ border: "none", borderRadius: 8, background: "var(--mustard)", fontWeight: 700, padding: "9px 14px", cursor: "pointer" }}>Dodaj</button>
                    <button onClick={() => setAddingLuggage(false)} style={{ border: "1px solid var(--line)", borderRadius: 8, background: "transparent", padding: "9px 12px", cursor: "pointer" }}>Anuluj</button>
                  </div>
                ) : (
                  <button onClick={() => setAddingLuggage(true)} style={{ border: "1.5px dashed var(--line)", borderRadius: 12, padding: "12px", background: "transparent", color: "var(--ink-soft)", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Plus size={16} /> Dodaj dodatkowy bagaż
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <Stripe height={8} />
    </div>
  );
}