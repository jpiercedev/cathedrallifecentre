"use client";

import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

import styles from "./grace-garage.module.css";

type GraceGarageVideoProps = {
  id: string;
  poster: string;
  title: string;
};

export function GraceGarageVideo({ id, poster, title }: GraceGarageVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.videoBorder} data-grace-garage-video>
      <div className={styles.videoShell}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.videoPoster}
          fill
          quality={85}
          sizes="(max-width: 767px) calc(100vw - 52px), 631px"
          src={poster}
        />
        {playing ? (
          <iframe
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
            referrerPolicy="strict-origin-when-cross-origin"
            src={`https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0&playsinline=1`}
            title={title}
          />
        ) : (
          <button
            aria-label={`Play ${title}`}
            className={styles.videoPlay}
            onClick={() => setPlaying(true)}
            type="button"
          >
            <PlayIcon aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
