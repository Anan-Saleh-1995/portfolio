import { ArrowDown } from "lucide-react";
import { isDarkTheme } from "@/shared/config/theme";
import { useTheme } from "@/shared/lib/useTheme";
import { RONIN_ANATOMY_ASSETS } from "./heroAssets";
import styles from "./HeroSpecimenPanel.module.css";

interface SpecimenDiscipline {
  index: string;
  armor: string;
  label: string;
}

const specimenDisciplines: readonly SpecimenDiscipline[] = [
  {
    index: "01",
    armor: "KABUTO",
    label: "Interface engineering",
  },
  {
    index: "02",
    armor: "MENPŌ",
    label: "Security & identity",
  },
  {
    index: "03",
    armor: "DŌ",
    label: "Backend systems",
  },
  {
    index: "04",
    armor: "KOTE",
    label: "Data & persistence",
  },
  {
    index: "05",
    armor: "KATANA",
    label: "Protocols & tools",
  },
  {
    index: "06",
    armor: "OBI",
    label: "Infrastructure",
  },
];

export const HeroSpecimenPanel = () => {
  const { theme } = useTheme();
  const anatomyAsset = isDarkTheme(theme)
    ? RONIN_ANATOMY_ASSETS.dark
    : RONIN_ANATOMY_ASSETS.light;

  return (
    <aside
      className={`${styles.panel} relative z-20 border-t border-[var(--border)] pt-6 md:col-span-2 md:grid md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:items-start md:gap-8 xl:col-span-1 xl:col-start-3 xl:block xl:self-center xl:border-s xl:border-t-0 xl:ps-6 xl:pt-0 cinema:ps-8`}
      aria-label="Ronin engineering specimen"
      data-hero-animate
    >
      <div className={styles.header}>
        <p
          className={`${styles.specimenLabel} inline-flex items-center gap-2 [font-family:var(--font-mono)] text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-[var(--token)]`}
        >
          Specimen
          <span className="text-[var(--gold)]" aria-hidden="true">
            /
          </span>
          <span dir="ltr" translate="no">
            001
          </span>
        </p>

        <div className={`${styles.identityDetail} me-auto mt-3 w-fit`}>
          <div className="flex flex-col items-start" dir="ltr" translate="no">
            <p
              className={`${styles.title} text-start [font-family:var(--font-display)] text-[clamp(2.4rem,4vw,3.35rem)] leading-none text-[var(--text)]`}
            >
              Rōnin
            </p>
            <p
              className="mt-1 [font-family:var(--font-display)] text-2xl leading-none text-[var(--token)]"
              lang="ja"
            >
              浪人
            </p>
          </div>
        </div>

        <p
          className={`${styles.identityDetail} ${styles.summary} mt-5 max-w-[26rem] text-start text-sm leading-6 text-[var(--text-muted)] xl:mt-4`}
        >
          A warrior without a master. Driven by code. Guided by principle.
        </p>
      </div>

      <div className={`${styles.content} mt-3 md:mt-0 xl:mt-5`}>
        <a
          href="#the-way"
          className={`${styles.action} mb-5 inline-flex min-h-11 items-center gap-2 [font-family:var(--font-mono)] text-[0.6875rem] uppercase tracking-[0.1em] text-[var(--text)] underline decoration-[var(--border)] underline-offset-8 transition-colors hover:text-[var(--token)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--focus-ring,var(--token))] md:mb-0 md:mt-5 xl:mt-3`}
        >
          Inspect the record
          <ArrowDown size={15} strokeWidth={1.8} aria-hidden="true" />
        </a>

        <div className={styles.anatomyMap}>
          <img
            src={anatomyAsset.src}
            alt=""
            width={anatomyAsset.width}
            height={anatomyAsset.height}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={styles.figure}
            aria-hidden="true"
          />

          <svg
            className={styles.schematic}
            viewBox="0 0 317 334"
            fill="none"
            focusable="false"
            aria-hidden="true"
          >
            <path d="M89 46H171V24H194" />
            <path d="M91 70H184V76H194" />
            <path d="M91 112H176V128H194" />
            <path d="M126 158H184V180H194" />
            <path d="M143 181H176V232H194" />
            <path d="M94 141H168V284H194" />
            <circle cx="89" cy="46" r="2.5" />
            <circle cx="91" cy="70" r="2.5" />
            <circle cx="91" cy="112" r="2.5" />
            <circle cx="126" cy="158" r="2.5" />
            <circle cx="143" cy="181" r="2.5" />
            <circle cx="94" cy="141" r="2.5" />
            <circle cx="194" cy="24" r="2" />
            <circle cx="194" cy="76" r="2" />
            <circle cx="194" cy="128" r="2" />
            <circle cx="194" cy="180" r="2" />
            <circle cx="194" cy="232" r="2" />
            <circle cx="194" cy="284" r="2" />
          </svg>

          <ol className={styles.disciplineList}>
            {specimenDisciplines.map(({ index, armor, label }) => (
              <li key={index} className={styles.disciplineItem}>
                <span className={styles.index} dir="ltr" translate="no">
                  {index}
                </span>
                <span className={styles.disciplineCopy}>
                  <span className={styles.armor} dir="ltr" translate="no">
                    {armor}
                  </span>
                  <span className={styles.discipline}>{label}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <dl
          className={`${styles.details} mt-6 grid gap-4 border-t border-[var(--border)] pt-5 text-start xl:mt-4 xl:gap-3 xl:pt-4`}
        >
          <div>
            <dt className="[font-family:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-[var(--token)]">
              Focus
            </dt>
            <dd className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Interfaces · Systems · Protocols
            </dd>
          </div>
          <div>
            <dt className="[font-family:var(--font-mono)] text-[0.625rem] uppercase tracking-[0.14em] text-[var(--token)]">
              Approach
            </dt>
            <dd className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              Design with purpose. Engineer with depth. Ship with discipline.
            </dd>
          </div>
        </dl>
      </div>

      <span className={styles.specimenRule} aria-hidden="true" />
    </aside>
  );
};
