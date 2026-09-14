import { useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "@/shared/lib/useReducedMotion";
import { HeroMedia } from "./HeroMedia";
import { HeroSpecimenPanel } from "./HeroSpecimenPanel";
import { RoninGlyphResolve } from "./RoninGlyphResolve";
import styles from "./HeroOverlay.module.css";

const actionClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-5 py-3 [font-family:var(--font-mono)] text-xs font-medium tracking-[0.08em] no-underline transition-[color,background-color,border-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring,var(--token))]";

export const HeroOverlay = () => {
  const reduceMotion = useReducedMotion();
  const [titleMotionPaused, setTitleMotionPaused] = useState(false);

  return (
    <div className={styles.layout}>
      <div className={`${styles.story} text-start`}>
        <div className={styles.introduction}>
          <p
            className="inline-flex items-center gap-2 [font-family:var(--font-mono)] text-xs font-medium uppercase tracking-[0.16em] text-[var(--token)]"
            data-hero-animate
          >
            <span dir="ltr" translate="no">
              01
            </span>
            <span aria-hidden="true">/</span>
            Enter
          </p>

          <p
            className="mt-4 [font-family:var(--font-mono)] text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]"
            data-hero-animate
          >
            <span className="inline-block" dir="ltr" translate="no">
              Anan Saleh
            </span>
            <span aria-hidden="true"> · </span>
            Full-stack engineer
          </p>

          <h1 id="hero-title" className="sr-only">
            The Way of the Rōnin.
          </h1>

          <div
            className={`${styles.displayTitle} mt-5 [font-family:var(--font-display)] text-[clamp(2.85rem,15vw,6rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-[var(--text)] md:text-[clamp(4.6rem,8vw,6.5rem)] lg:text-[clamp(4.25rem,5.7vw,7rem)] xl:text-[clamp(3.8rem,4.8vw,5rem)] cinema:text-[clamp(4.25rem,5.7vw,7rem)]`}
            aria-hidden="true"
            data-hero-animate
          >
            <span className="block whitespace-nowrap">The Way</span>
            <span className="block whitespace-nowrap">
              of the <RoninGlyphResolve paused={titleMotionPaused} />
            </span>
          </div>
        </div>
        <div className={styles.statement}>
          <p
            className={`${styles.thesis} mt-7 max-w-[34rem] text-base leading-7 text-[var(--text-muted)] sm:text-lg sm:leading-8`}
            data-hero-animate
          >
            I build digital experiences from the system underneath the
            interface.
          </p>

          <div
            className={`${styles.principles} mt-3 flex flex-wrap items-center gap-x-4 gap-y-1`}
            data-hero-animate
          >
            <p className="[font-family:var(--font-mono)] text-xs uppercase tracking-[0.12em] text-[var(--text)]">
              Purpose. Precision. Discipline.
            </p>

            {!reduceMotion && (
              <button
                type="button"
                className={`${styles.motionControl} inline-flex min-h-11 items-center gap-1.5 px-1 [font-family:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.1em] text-[var(--text-muted)] underline decoration-[var(--border)] underline-offset-4 transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring,var(--token))] motion-reduce:transition-none`}
                aria-pressed={titleMotionPaused}
                onClick={() => setTitleMotionPaused((paused) => !paused)}
              >
                {titleMotionPaused ? (
                  <Play size={13} strokeWidth={1.8} aria-hidden="true" />
                ) : (
                  <Pause size={13} strokeWidth={1.8} aria-hidden="true" />
                )}
                {titleMotionPaused ? (
                  <>Resume title signal</>
                ) : (
                  <>Pause title signal</>
                )}
              </button>
            )}
          </div>

          <div className={`${styles.actions} mt-8`} data-hero-animate>
            <a
              href="#forge"
              className={`${styles.action} ${actionClassName} border border-[var(--token)] bg-[var(--token)] text-[var(--text-on-accent)] hover:bg-[var(--accent-deep)]`}
            >
              Explore the work
              <ArrowDown size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/Anan-Saleh-1995"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.action} ${actionClassName} border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--hero-canvas)_86%,transparent)] text-[var(--text)] hover:border-[var(--token)] hover:bg-[var(--hero-canvas)] hover:text-[var(--token)]`}
              aria-label="View Anan's GitHub profile (opens in a new tab)"
            >
              View GitHub
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.mediaClip}>
        <HeroMedia />
      </div>

      <HeroSpecimenPanel />

      <a
        href="#the-way"
        className={`${styles.scrollCue} absolute bottom-4 start-1/2 z-30 min-h-11 -translate-x-1/2 items-center gap-2 px-3 [font-family:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.16em] text-[var(--text-muted)] transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring,var(--token))]`}
        aria-label="Scroll to the next section"
        data-hero-animate
      >
        Enter the record
        <ArrowDown size={15} strokeWidth={1.8} aria-hidden="true" />
      </a>
    </div>
  );
};
