function QuickApplyApp({ fromSpotId, onApplyPreset, routePresets, toSpotId }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>快速套用</h2>
        <span>Preset routes</span>
      </div>

      <div className="lesson-list">
        {routePresets.map(preset => {
          const isActive = preset.from === fromSpotId && preset.to === toSpotId;

          return (
            <article key={preset.label} className={`lesson-card ${isActive ? 'lesson-card-active' : ''}`}>
              <div className="lesson-badge">{isActive ? 'ACTIVE' : 'PRESET'}</div>
              <div>
                <h3>{preset.label}</h3>
                <p>{preset.note}</p>
              </div>
              <button type="button" className="lesson-action" onClick={() => onApplyPreset(preset)}>
                套用
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default QuickApplyApp;