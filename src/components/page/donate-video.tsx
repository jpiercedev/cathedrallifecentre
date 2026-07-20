import Image from "next/image";

import styles from "./donate-video.module.css";

type DonateVideoProps = {
  id: string;
  poster: string;
  title: string;
};

export function DonateVideo({ id, poster, title }: DonateVideoProps) {
  return (
    <div className={styles.shell} data-donate-video>
      <Image
        alt=""
        aria-hidden="true"
        className={styles.poster}
        fill
        quality={85}
        sizes="(max-width: 991px) calc(100vw - 64px), 528px"
        src={poster}
      />
      <iframe
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        className={styles.frame}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        src={`https://player.vimeo.com/video/${id}?dnt=1&title=0&byline=0&portrait=0&playsinline=1&api=1&player_id=clc-donate-video`}
        title={title}
      />
    </div>
  );
}
