'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldClipData } from '@/content/company-media';

// The server-rendered poster is a slot: its image manifest stays outside this client bundle.
export function FieldClip({ clip, children }: { clip: FieldClipData; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const playback = useRef({ visible: false, automatic: false, manual: false });
  const syncPlayback = useRef<() => void>(() => {});
  useEffect(() => {
    const target = frame.current;
    if (!target) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let disposed = false;
    const shouldPlay = () => playback.current.visible && !document.hidden && (playback.current.automatic || playback.current.manual);
    const sync = () => {
      const node = video.current;
      if (!node) return;
      if (!shouldPlay()) { node.pause(); return; }
      node.muted = true;
      void node.play().then(() => {
        if (disposed || !shouldPlay()) node.pause();
        else setPlayBlocked(false);
      }).catch(() => {
        if (!disposed && shouldPlay()) setPlayBlocked(true);
      });
    };
    syncPlayback.current = sync;
    const updatePreference = () => {
      playback.current.automatic = !motion.matches && !connection?.saveData;
      if (playback.current.visible && playback.current.automatic) setOpened(true);
      sync();
    };
    updatePreference();
    const observer = new IntersectionObserver(([entry]) => {
      playback.current.visible = entry.isIntersecting && entry.intersectionRatio >= .35;
      if (!playback.current.visible) playback.current.manual = false;
      if (playback.current.visible && playback.current.automatic) setOpened(true);
      sync();
    }, { threshold: [0, .35], rootMargin: '-90px 0px -24px 0px' });
    observer.observe(target);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', updatePreference);
    const node = video.current;
    if (opened && playback.current.manual) node?.focus({ preventScroll: true });
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', updatePreference);
      node?.pause();
    };
  }, [opened]);

  const playManually = () => {
    playback.current.manual = true;
    setOpened(true);
    syncPlayback.current();
  };

  return <article className="field-clip" aria-labelledby={`${clip.id}-title`}>
    <div className="field-clip-player" ref={frame}>
      {!opened ? <button className="field-clip-start" onClick={playManually} aria-label={`Play film: ${clip.title}`}>
        {children}<span className="field-clip-play"><span aria-hidden="true">▶</span> Watch film · {clip.duration}</span>
      </button> : <>
        {!ready && <div className="field-clip-loading-poster" aria-hidden="true">{children}</div>}
        <video ref={video} src={clip.src} controls playsInline muted loop preload="none" tabIndex={0} className={ready ? 'is-ready' : ''} aria-label={clip.title} aria-describedby={`${clip.id}-description`} onLoadedData={() => setReady(true)} onError={() => setFailed(true)}>
        Your browser cannot play this film. <a href={clip.src}>Download the film</a>.
        </video>
        {playBlocked && !failed && <button className="field-clip-play field-clip-retry" onClick={playManually} aria-label={`Play film: ${clip.title}`}><span aria-hidden="true">▶</span> Play film · {clip.duration}</button>}
      </>}
    </div>
    <div className="field-clip-copy"><p className="section-label">Field film · Silent</p><h3 id={`${clip.id}-title`}>{clip.title}</h3><p id={`${clip.id}-description`}>{clip.description}</p>
      {failed && <p role="alert">The film could not load. <a href={clip.src}>Download the film</a>.</p>}
      <details><summary>Read visual description</summary><p>{clip.transcript}</p></details>
      <noscript><p><a href={clip.src}>Download the film</a> to watch without JavaScript.</p></noscript>
    </div>
  </article>;
}
