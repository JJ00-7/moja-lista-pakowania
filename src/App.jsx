import React, { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Minus, Trash2, X, Pencil, Loader2, Briefcase, Package, Users, Copy, Check, CheckCircle2, Circle, ArrowLeftRight, ClipboardCopy } from "lucide-react";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ... (SEED_ITEMS, seedItems, makePerson, defaultData, sanitizeCode, luggageIcon, IconBtn, Stripe, ItemRow, AddItemForm, LuggageSection - pozostają bez zmian)
// [Wklej tutaj pozostałe funkcje pomocnicze, które już miałaś, dla oszczędności miejsca wklejam tylko zmiany w funkcjach głównych]

function PersonTag({ person, active, onSelect, onRename, onDelete, onCopyLuggage, removable }) {
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
      <div style={{ width: 1, height: 12, background: "var(--line)" }} />
      <div onClick={onSelect} style={{ position: "relative", cursor: "pointer", background: active ? "var(--mustard)" : "var(--card)", border: `1.5px solid var(--ink)`, borderRadius: "4px 10px 10px 4px", padding: "8px 14px 8px 22px", display: "flex", alignItems: "center", gap: 8, boxShadow: active ? "3px 3px 0 var(--ink)" : "2px 2px 0 var(--line)" }}>
        {editing ? (
          <input autoFocus value={person.name} onChange={(e) => onRename(e.target.value)} onBlur={() => setEditing(false)} style={{ width: 80, border: "none", outline: "none", background: "transparent", fontWeight: 700, fontSize: 14 }} />
        ) : (
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>{person.name}</span>
        )}
        <Pencil size={12} style={{ opacity: 0.5 }} onClick={(e) => { e.stopPropagation(); setEditing(true); }} />
        <ClipboardCopy size={13} style={{ opacity: 0.55 }} title="Kopiuj bagaż" onClick={(e) => { e.stopPropagation(); onCopyLuggage(); }} />
        {removable && <X size={13} style={{ opacity: 0.55 }} onClick={(e) => { e.stopPropagation(); onDelete(); }} />}
      </div>
    </div>
  );
}

// Wewnątrz LuggageSection (zmodyfikuj ItemRow, aby dodać opcję przenoszenia):
function ItemRow({ item, onChange, onDelete, onMove, otherLuggage }) {
  const packed = !!item.packed;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", borderBottom: "1px dashed var(--line)", opacity: packed ? 0.55 : 1 }}>
      {/* ... (zachowaj przycisk check i input) */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {/* Nowy przycisk przenoszenia */}
        <select onChange={(e) => onMove(e.target.value)} style={{ fontSize: 10, padding: 2, background: "transparent", border: "1px solid var(--line)", borderRadius: 4 }}>
          <option value="">Przenieś...</option>
          {otherLuggage.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
        <IconBtn onClick={() => onChange({ ...item, qty: Math.max(0, item.qty - 1) })}><Minus size={14} /></IconBtn>
        <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700, fontSize: 14 }}>{item.qty}</span>
        <IconBtn onClick={() => onChange({ ...item, qty: item.qty + 1 })}><Plus size={14} /></IconBtn>
        <IconBtn danger onClick={onDelete}><Trash2 size={14} /></IconBtn>
      </div>
    </div>
  );
}