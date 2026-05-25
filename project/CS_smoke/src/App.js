import './App.css';

import { useEffect, useMemo, useState } from 'react';
import MiniMapApp from './MiniMapApp';
import QuickApplyApp from './QuickApplyApp';
import LandingVideoApp from './LandingVideoApp';
import PositionEditor from './PositionEditor';

const dust2Nodes = [
  { id: 'b_site', label: 'B 平台', zone: 'B 區', nearby: ['b_tunnel', 'b_door'] },
  { id: 'b_tunnel', label: 'B 洞', zone: 'B 區', nearby: ['b_site', 'b_door', 'car'] },
  { id: 'b_door', label: 'B 外', zone: 'B 區', nearby: ['b_site', 'b_tunnel', 'mid'] },
  { id: 'car', label: 'B 門', zone: 'B 區', nearby: ['b_tunnel', 'mid', 'short'] },
  { id: 'mid', label: '中門', zone: '控制區', nearby: ['b_door', 'car', 'short', 'ct_spawn'] },
  { id: 'short', label: 'A 上', zone: 'A 區', nearby: ['mid', 'a_short', 'a_site'] },
  { id: 'a_short', label: 'A 小道', zone: 'A 區', nearby: ['short', 'a_site', 'a_long'] },
  { id: 'a_site', label: 'A BB 位', zone: 'A 區', nearby: ['short', 'a_short', 'ct_spawn', 'a_long'] },
  { id: 'ct_spawn', label: 'CT 起點', zone: '防守區', nearby: ['mid', 'a_site', 'a_long'] },
  { id: 'a_long', label: 'A 斜', zone: 'A 區', nearby: ['a_short', 'a_site', 'ct_spawn'] },
];

const routePresets = [
  { label: 'B 洞到 B 平台', from: 'b_tunnel', to: 'b_site', note: '先從 B 洞選點，再看 B 平台的落點。' },
  { label: '中門到 A BB 位', from: 'mid', to: 'a_site', note: '中門控圖後，直接切到 A BB 位的常用點位。' },
  { label: 'A 小道到 A 斜', from: 'a_short', to: 'a_long', note: '從 A 小道切到 A 斜，快速看進攻路線。' },
];

const mediaRoot = '/media/dust2';
const positionsStorageKey = 'dust2-node-positions-v2';

function getRouteSlug(fromId, toId) {
  return `${fromId.replaceAll('_', '-')}-to-${toId.replaceAll('_', '-')}`;
}

function App() {
  const [showEditor, setShowEditor] = useState(false);
  const [fromSpotId, setFromSpotId] = useState('a_short');
  const [toSpotId, setToSpotId] = useState('a_long');
  const [videoRoute, setVideoRoute] = useState(null);
  const [positions, setPositions] = useState(() => {
    try {
      const raw = localStorage.getItem(positionsStorageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // default percentages roughly matching the map
    return {
      // B 區
      b_site: { x: 12, y: 12 }, // B 平台 (左上)
      b_tunnel: { x: 18, y: 36 }, // B 洞 (偏上靠中)
      b_door: { x: 30, y: 34 }, // B 外 (中左)
      car: { x: 28, y: 50 }, // B 門 / 車位 (左中偏下)

      // 中路
      mid: { x: 50, y: 36 }, // 中門 (中央偏上)

      // A 區
      short: { x: 62, y: 46 }, // A 上 (靠中右)
      a_short: { x: 72, y: 60 }, // A 小道 (中偏右下)
      a_site: { x: 84, y: 22 }, // A BB 位 (右上)
      ct_spawn: { x: 68, y: 22 }, // CT 起點 (右上偏中)
      a_long: { x: 84, y: 72 }, // A 斜 (右下)
    };
  });

  const [draggingId, setDraggingId] = useState(null);

  // runtime-loaded nodes / presets (fallback to bundled arrays)
  const [nodes, setNodes] = useState(dust2Nodes);
  const [presets, setPresets] = useState(routePresets);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);

  const activeSource = nodeById[fromSpotId];
  const nearbyTargets = useMemo(
    () => (activeSource?.nearby ?? []).map(targetId => nodeById[targetId]).filter(Boolean),
    [activeSource, nodeById]
  );

  useEffect(() => {
    if (!nearbyTargets.length) {
      return;
    }

    if (!nearbyTargets.some(node => node.id === toSpotId)) {
      setToSpotId(nearbyTargets[0].id);
    }
  }, [nearbyTargets, toSpotId]);

  const activeTarget = nodeById[toSpotId] ?? nearbyTargets[0];
  const activePreset = routePresets.find(
    preset => preset.from === fromSpotId && preset.to === toSpotId
  );

  // if we loaded presets from API replace activePreset lookup
  const activePresetFromApi = presets.find(p => p.from === fromSpotId && p.to === toSpotId);
  const chosenActivePreset = activePresetFromApi ?? activePreset;

  const routeSlug = getRouteSlug(fromSpotId, activeTarget?.id ?? toSpotId);
  const activeMediaPath = `${mediaRoot}/videos/${routeSlug}.mp4`;
  const activePosterPath = `${mediaRoot}/posters/${routeSlug}.jpg`;

  function savePositions(nextPositionsOrUpdater) {
    setPositions(prevPositions => {
      const nextPositions =
        typeof nextPositionsOrUpdater === 'function'
          ? nextPositionsOrUpdater(prevPositions)
          : nextPositionsOrUpdater;

      try {
        localStorage.setItem(positionsStorageKey, JSON.stringify(nextPositions));
      } catch (e) {}

      return nextPositions;
    });
  }

  function handleSourceSelect(nodeId) {
    setFromSpotId(nodeId);
    setVideoRoute(null);
  }

  function handleTargetSelect(nodeId) {
    setToSpotId(nodeId);
    setVideoRoute({ from: fromSpotId, to: nodeId });
  }

  function handlePresetApply(preset) {
    setFromSpotId(preset.from);
    setToSpotId(preset.to);
    setVideoRoute({ from: preset.from, to: preset.to });
  }

  // fetch points and routes from backend on mount
  useEffect(() => {
    let mounted = true;

    async function loadBackend() {
      try {
        const base = 'http://127.0.0.1:8000';
        const [pRes, rRes] = await Promise.all([
          fetch(`${base}/api/points/`),
          fetch(`${base}/api/routes/`),
        ]);

        if (!pRes.ok || !rRes.ok) throw new Error('API error');

        const pJson = await pRes.json();
        const rJson = await rRes.json();

        if (!mounted) return;

        // map backend points to node shape
        const loadedNodes = pJson.map(pt => ({
          id: pt.slug,
          label: pt.name,
          zone: pt.zone,
          nearby: [],
          note: pt.note || '',
        }));

        // build a positions map (use percent x/y from DB)
        const loadedPositions = {};
        pJson.forEach(pt => {
          if (pt.x != null && pt.y != null) loadedPositions[pt.slug] = { x: Number(pt.x), y: Number(pt.y) };
        });

        // routes
        const loadedPresets = rJson.map(r => ({ label: r.label, from: r.source, to: r.target, note: r.note }));

        setNodes(loadedNodes.length ? loadedNodes : dust2Nodes);
        setPresets(loadedPresets.length ? loadedPresets : routePresets);

        // only override positions if user hasn't saved any
        try {
          const raw = localStorage.getItem(positionsStorageKey);
          if (!raw && Object.keys(loadedPositions).length) {
            setPositions(prev => ({ ...prev, ...loadedPositions }));
          }
        } catch (e) {}
      } catch (e) {
        // ignore and keep defaults
        console.warn('Failed to load backend points/routes', e);
      }
    }

    loadBackend();

    return () => {
      mounted = false;
    };
  }, []);

  function handlePointerDown(e, nodeId) {
    e.preventDefault();
    setDraggingId(nodeId);

    const onPointerMove = ev => {
      ev.preventDefault();
      const board = document.querySelector('.map-board');
      if (!board) return;
      const r = board.getBoundingClientRect();
      const nx = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
      const ny = Math.max(0, Math.min(100, ((ev.clientY - r.top) / r.height) * 100));
      savePositions(prevPositions => ({ ...prevPositions, [nodeId]: { x: nx, y: ny } }));
    };

    const onPointerUp = () => {
      setDraggingId(null);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  return (
    <main className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <section className="phone-frame">
        <header className="topbar">
          <div>
            <p className="eyebrow">CS2 Dust2 mini map</p>
            <h1>CS_smoke</h1>
          </div>
          <div>
            <button type="button" className="pill-button" onClick={() => setShowEditor(s => !s)}>
              {showEditor ? '關閉座標編輯' : '編輯座標'}
            </button>
          </div>
        </header>

        <MiniMapApp
          activeSource={activeSource}
          activeTarget={activeTarget}
          draggingId={draggingId}
          nearbyTargets={nearbyTargets}
          nodes={nodes}
          onPointerDown={handlePointerDown}
          onSourceSelect={handleSourceSelect}
          onTargetSelect={handleTargetSelect}
          positions={positions}
          fromSpotId={fromSpotId}
          toSpotId={toSpotId}
        />

        {showEditor && (
          <PositionEditor
            positions={positions}
            setPositions={savePositions}
            nodes={dust2Nodes}
            storageKey={positionsStorageKey}
            onClose={() => setShowEditor(false)}
          />
        )}

        <QuickApplyApp
          fromSpotId={fromSpotId}
          onApplyPreset={handlePresetApply}
          routePresets={presets}
          toSpotId={toSpotId}
        />

        <LandingVideoApp
          activeMediaPath={activeMediaPath}
          activePosterPath={activePosterPath}
          activePreset={chosenActivePreset}
          activeSource={activeSource}
          activeTarget={activeTarget}
          onCloseVideo={() => setVideoRoute(null)}
          videoRoute={videoRoute}
        />
      </section>
    </main>
  );
}

export default App;
