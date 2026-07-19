"use client";

import type Player from "@vimeo/player";
import { ArrowPathIcon, PlayIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

import styles from "./hero-video.module.css";

const vimeoId = "1208955332";
const playerTitle = "Cathedral Life Centre story video";

export function HeroVideo() {
  const [active, setActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ended, setEnded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!active || loaded || failed) return;
    const timeout = window.setTimeout(() => setFailed(true), 15_000);
    return () => window.clearTimeout(timeout);
  }, [active, failed, loaded, attempt]);

  useEffect(() => {
    if (!active || failed || !iframeRef.current) return;

    let disposed = false;
    let player: Player | null = null;
    const handleEnded = () => {
      if (!disposed) setEnded(true);
    };
    const handleError = () => {
      if (!disposed) setFailed(true);
    };

    void (async () => {
      const { default: VimeoPlayer } = await import("@vimeo/player");
      if (disposed || !iframeRef.current) return;

      player = new VimeoPlayer(iframeRef.current);
      playerRef.current = player;
      iframeRef.current.dataset.playerConnected = "true";
      player.on("ended", handleEnded);
      player.on("error", handleError);
      await player.ready();
      if (!disposed) setLoaded(true);
    })().catch(handleError);

    return () => {
      disposed = true;
      if (player) {
        player.off("ended", handleEnded);
        player.off("error", handleError);
        if (playerRef.current === player) playerRef.current = null;
        void player.destroy().catch(() => {
          // Cleanup failures must not update unmounted UI.
        });
      }
    };
  }, [active, attempt, failed]);

  const start = () => {
    setFailed(false);
    setEnded(false);
    setLoaded(false);
    setAttempt((value) => value + 1);
    setActive(true);
  };

  const replay = async () => {
    const player = playerRef.current;
    if (!player) {
      start();
      return;
    }

    setEnded(false);
    try {
      await player.setCurrentTime(0);
      await player.play();
    } catch {
      setFailed(true);
    }
  };

  return (
    <div className={styles.shell} data-hero-video>
      {!active ? (
        <button
          aria-label={`Play ${playerTitle}`}
          className={styles.playTarget}
          onClick={start}
          type="button"
        >
          <span className={styles.playBadge}>
            <PlayIcon aria-hidden="true" />
          </span>
        </button>
      ) : null}

      {active && !failed ? (
        <iframe
          allow="autoplay; fullscreen; picture-in-picture"
          className={styles.frame}
          key={attempt}
          onError={() => setFailed(true)}
          ref={iframeRef}
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://player.vimeo.com/video/${vimeoId}?dnt=1&autoplay=1&playsinline=1&title=0&byline=0&portrait=0&api=1&player_id=clc-home-video`}
          title={playerTitle}
        />
      ) : null}

      {failed ? (
        <div className={styles.fallback} data-video-fallback role="alert">
          <p>The video could not be loaded.</p>
          <button onClick={start} type="button">
            <ArrowPathIcon aria-hidden="true" />
            Retry
          </button>
          <a href={`https://vimeo.com/${vimeoId}`} rel="noopener noreferrer" target="_blank">
            Watch on Vimeo
          </a>
        </div>
      ) : null}

      {ended && !failed ? (
        <button className={styles.replay} onClick={replay} type="button">
          <ArrowPathIcon aria-hidden="true" />
          Replay video
        </button>
      ) : null}
    </div>
  );
}
