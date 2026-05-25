import { useState } from 'react';

function PositionEditor({ positions, setPositions, nodes, storageKey, onClose }) {
  const [local, setLocal] = useState(() => ({ ...positions }));

  function handleChange(id, axis, value) {
    const num = Number(value);
    setLocal(prev => ({ ...prev, [id]: { ...(prev[id] || { x: 50, y: 50 }), [axis]: Number.isFinite(num) ? num : 0 } }));
  }

  function handleSave() {
    setPositions(local);
    try {
      localStorage.setItem(storageKey, JSON.stringify(local));
    } catch (e) {}
    onClose?.();
  }

  return (
    <section className="section-block" aria-label="座標編輯器">
      <div className="section-head">
        <h2>座標編輯器</h2>
        <span>手動微調每個點的 x%, y%</span>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {nodes.map(node => (
          <div key={node.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <strong style={{ width: 120 }}>{node.label}</strong>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              x
              <input
                type="number"
                value={local[node.id]?.x ?? 50}
                onChange={e => handleChange(node.id, 'x', e.target.value)}
                style={{ width: 80 }}
              />
            </label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              y
              <input
                type="number"
                value={local[node.id]?.y ?? 50}
                onChange={e => handleChange(node.id, 'y', e.target.value)}
                style={{ width: 80 }}
              />
            </label>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="lesson-action" type="button" onClick={handleSave}>存檔</button>
          <button type="button" onClick={onClose}>取消</button>
        </div>
      </div>
    </section>
  );
}

export default PositionEditor;
