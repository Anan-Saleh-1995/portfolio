import { useState } from "react";
import { HeroFallback } from "./HeroFallback";
import { RONIN_HERO_ASSET } from "./heroAssets";
import styles from "./HeroMedia.module.css";

type MediaStatus = "loading" | "loaded" | "failed";

export const HeroMedia = () => {
  const [status, setStatus] = useState<MediaStatus>("loading");

  const handleLoad = () => setStatus("loaded");
  const handleError = () => setStatus("failed");

  return (
    <div
      className={styles.stage}
      data-hero-media
      data-status={status}
      aria-hidden="true"
    >
      {status !== "loaded" && <HeroFallback failed={status === "failed"} />}
      <img
        src={RONIN_HERO_ASSET.src}
        alt=""
        width={RONIN_HERO_ASSET.width}
        height={RONIN_HERO_ASSET.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className={styles.image}
        data-status={status}
        sizes="(max-width: 767px) 94vw, (max-width: 1023px) 48vw, 40vw"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};
