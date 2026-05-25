function MiniMapApp({
  activeSource,
  activeTarget,
  draggingId,
  nearbyTargets,
  nodes,
  onPointerDown,
  onSourceSelect,
  onTargetSelect,
  positions,
  fromSpotId,
  toSpotId,
}) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>小地圖選點</h2>
        <span>Tap a position, then choose a nearby landing spot</span>
      </div>

      <div className="map-grid">
        <div className="map-board" role="group" aria-label="Dust2 小地圖">
          <img className="map-image" src="/media/dust2/map.webp" alt="Dust2 地圖" />
          <div className="map-zone map-zone-a">A 區</div>
          <div className="map-zone map-zone-mid">Mid</div>
          <div className="map-zone map-zone-b">B 區</div>

          {nodes.map(node => {
            const pos = positions[node.id] || { x: 50, y: 50 };
            const isNearby = nearbyTargets.some(target => target.id === node.id);

            return (
              <button
                key={node.id}
                className={`map-node ${node.id === fromSpotId ? 'map-node-selected' : ''} ${isNearby ? 'map-node-nearby' : ''} ${draggingId === node.id ? 'map-node-dragging' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                type="button"
                onPointerDown={e => onPointerDown(e, node.id)}
                onClick={() => onSourceSelect(node.id)}
                onContextMenu={e => {
                  e.preventDefault();
                  onTargetSelect(node.id);
                }}
                aria-label={node.label}
                title={`${node.label} — ${node.id}`}
              >
                <span>{node.label}</span>
              </button>
            );
          })}

          <div className="map-footer-note">
            <strong>{activeSource?.label}</strong>
            <span>{activeSource?.zone}</span>
          </div>
        </div>

        <div className="nearby-panel">
          <div className="mini-label">附近落點</div>
          <div className="select-grid select-grid-landings">
            {nearbyTargets.map(target => (
              <button
                key={target.id}
                className={`select-card ${toSpotId === target.id ? 'select-card-active' : ''}`}
                type="button"
                onClick={() => onTargetSelect(target.id)}
              >
                {target.label}
              </button>
            ))}
          </div>

          <div className="nearby-help">
            <span>你選的是</span>
            <strong>
              {activeSource?.label} → {activeTarget?.label}
            </strong>
            <p>
              這裡只顯示和目前位置相鄰的落點，讓你在手機上可以更快切換中門、A 小道、A BB 位、B 洞、B 平台這類常用路線。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MiniMapApp;