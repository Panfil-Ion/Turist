"use client";

import { useRef, useState } from "react";

interface AudioPronunciationProps {
  src: string;
  label: string;
}

export function AudioPronunciation({ src, label }: AudioPronunciationProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      audio.currentTime = 0;
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-600/50 bg-amber-950/50 text-amber-400 transition hover:bg-amber-900/50"
        aria-label={`Play pronunciation for ${label}`}
      >
        {playing ? "■" : "▶"}
      </button>
    </>
  );
}
