import { useEffect, useRef } from 'react';

function LandingVideoApp({
  activeMediaPath,
  activePosterPath,
  activePreset,
  activeSource,
  activeTarget,
  onCloseVideo,
  videoRoute,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;

    if (!overlayElement) {
      return undefined;
    }

    const runFullscreen = async () => {
      try {
        if (overlayElement.requestFullscreen) {
          await overlayElement.requestFullscreen();
        }
      } catch (error) {}
    };

    runFullscreen();

    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, []);

  if (!videoRoute) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className="video-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Dust2 影片預覽"
    >
      <button className="video-close" type="button" onClick={onCloseVideo}>
        關閉
      </button>

      <video
        className="video-fullscreen-media"
        controls
        autoPlay
        muted
        playsInline
        poster={activePosterPath}
        src={activeMediaPath}
      />

      <div className="video-fullscreen-overlay">
        <span>Selected route</span>
        <strong>
          {activeSource?.label} → {activeTarget?.label}
        </strong>
        <p>{activePreset?.label ?? 'Manual route'}</p>
      </div>

      <div className="video-fullscreen-meta">
        <div>
          <span>Video</span>
          <code>{activeMediaPath}</code>
        </div>
        <div>
          <span>Poster</span>
          <code>{activePosterPath}</code>
        </div>
      </div>
    </div>
  );
}

export default LandingVideoApp;