'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { FieldClipData } from '@/content/company-media';

// The server-rendered poster is a slot: its image manifest stays outside this client bundle.
export function FieldClip({ clip, children }: { clip: FieldClipData; children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!opened) return;
    const node = video.current;
    if (!node) return;
    node.focus();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) node.pause();
    });
    observer.observe(node);
    const pauseOnHidden = () => { if (document.hidden) node.pause(); };
    document.addEventListener('visibilitychange', pauseOnHidden);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pauseOnHidden); node.pause(); };
  }, [opened]);

  return <article className="field-clip" aria-labelledby={`${clip.id}-title`}>
    <div className="field-clip-player">
      {!opened ? <button className="field-clip-start" onClick={() => setOpened(true)} aria-label={`Open film: ${clip.title}`}>
        {children}<span className="field-clip-play"><span aria-hidden="true">▶</span> Watch film · {clip.duration}</span>
      </button> : <video ref={video} src={clip.src} controls playsInline muted preload="metadata" tabIndex={0} aria-label={clip.title} aria-describedby={`${clip.id}-description`} onError={() => setFailed(true)}>
        Your browser cannot play this film. <a href={clip.src}>Download the film</a>.
      </video>}
    </div>
    <div className="field-clip-copy"><p className="section-label">Field film · Silent</p><h3 id={`${clip.id}-title`}>{clip.title}</h3><p id={`${clip.id}-description`}>{clip.description}</p>
      {failed && <p role="alert">The film could not load. <a href={clip.src}>Download the film</a>.</p>}
      <details><summary>Read visual description</summary><p>{clip.transcript}</p></details>
      <noscript><p><a href={clip.src}>Download the film</a> to watch without JavaScript.</p></noscript>
    </div>
  </article>;
}
