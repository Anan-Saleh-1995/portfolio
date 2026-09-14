import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Layers,
  LockKeyhole,
  Search,
  Send,
  Wallet,
} from "lucide-react";
import type { PortfolioProject } from "./projects.content";
import styles from "./ProjectPreview.module.css";

const LearningSpacePreview = () => (
  <div className={styles.learningScene}>
    <div className={styles.sceneNote}>
      Learning Space <span>Learn / Connect</span>
    </div>
    <div className={styles.phones}>
      <div className={styles.phone}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneHeader}>
          <span className={styles.appMark}>L.</span>
          <span>My space</span>
          <span className={styles.avatar}>A</span>
        </div>
        <div className={styles.phoneBody}>
          <span className={styles.miniEyebrow}>Your learning space</span>
          <strong className={styles.phoneTitle}>
            Make room
            <br />
            to learn.
          </strong>
          <div className={styles.learningBanner}>
            <BookOpen size={24} strokeWidth={1} />
            <span>
              Your assignments<small>Keep learning in view</small>
            </span>
          </div>
          <span className={styles.smallHeading}>Your groups</span>
          <div className={styles.groupRow}>
            <span className={styles.groupMark}>01</span>
            <span>
              My learning group<small>Work, learn, connect</small>
            </span>
            <ChevronRight size={11} />
          </div>
          <div className={styles.groupRow}>
            <span className={styles.groupMark}>02</span>
            <span>
              Group conversations<small>A shared place to discuss</small>
            </span>
            <ChevronRight size={11} />
          </div>
        </div>
        <div className={styles.phoneNav}>
          <span>Home</span>
          <span>Groups</span>
          <span>Profile</span>
        </div>
      </div>
      <div className={`${styles.phone} ${styles.chatPhone}`}>
        <div className={styles.phoneNotch} />
        <div className={styles.phoneHeader}>
          <span>‹</span>
          <span>Group conversation</span>
          <LockKeyhole size={11} />
        </div>
        <div className={styles.chatBody}>
          <div className={styles.chatDate}>A shared space</div>
          <div className={styles.chatBubble}>
            A place for questions.<small>Group conversation</small>
          </div>
          <div className={`${styles.chatBubble} ${styles.ownMessage}`}>
            And ideas worth exploring together.
          </div>
          <div className={styles.chatBubble}>
            One group.
            <br />
            Many perspectives.
          </div>
        </div>
        <div className={styles.chatInput}>
          <span>Write a message</span>
          <Send size={12} />
        </div>
      </div>
    </div>
  </div>
);

const DokimiPreview = () => (
  <div className={styles.ledgerScene}>
    <div className={styles.sceneNote}>
      Dokimi Ledger <span>Testnet workspace</span>
    </div>
    <div className={styles.ledgerWindow}>
      <div className={styles.windowBar}>
        <span className={styles.ledgerBrand}>
          <Layers size={13} />
          dokimi
        </span>
        <span>
          Wallets <span className={styles.windowActive}>Workspace</span>
        </span>
        <span className={styles.testnetLabel}>TESTNET</span>
      </div>
      <div className={styles.ledgerMain}>
        <div className={styles.ledgerSidebar}>
          <span className={styles.sidebarActive}>Overview</span>
          <span>Wallets</span>
          <span>Activity</span>
          <span>Networks</span>
        </div>
        <div className={styles.ledgerContent}>
          <div className={styles.ledgerTitle}>
            <span>Your workspace</span>
            <Wallet size={16} />
          </div>
          <div className={styles.walletPanel}>
            <span className={styles.miniEyebrow}>Learn by doing</span>
            <strong>
              One wallet.
              <br />A closer look.
            </strong>
            <div className={styles.walletActions}>
              <span>Receive ↙</span>
              <span>Send ↗</span>
            </div>
          </div>
          <div className={styles.networkList}>
            <div>
              <span className={styles.chainSymbol}>T</span>
              <span>
                TRON<small>Shasta</small>
              </span>
              <span>↗</span>
            </div>
            <div>
              <span className={styles.chainSymbol}>Ξ</span>
              <span>
                Ethereum<small>Sepolia</small>
              </span>
              <span>↗</span>
            </div>
            <div>
              <span className={styles.chainSymbol}>◎</span>
              <span>
                Solana<small>Devnet</small>
              </span>
              <span>↗</span>
            </div>
            <div>
              <span className={styles.chainSymbol}>₿</span>
              <span>
                Bitcoin<small>Testnet</small>
              </span>
              <span>↗</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.transactionPath}>
        <span>Prepare</span>
        <i />
        <span>Review</span>
        <i />
        <span>Submit</span>
      </div>
    </div>
  </div>
);

const NexzonPreview = ({ project }: { project: PortfolioProject }) => (
  <div className={styles.commerceScene}>
    <div className={styles.commerceWindow}>
      <div className={styles.commerceNav}>
        <strong>
          NEXZON<span>®</span>
        </strong>
        <span>Discover · Collections</span>
        <Search size={13} />
      </div>
      <div className={styles.commerceHero}>
        {project.preview.image && (
          <img
            src={project.preview.image.src}
            alt=""
            loading="lazy"
            width="1600"
            height="986"
          />
        )}
        <div className={styles.commerceHeroCopy}>
          <span>Thoughtfully selected.</span>
          <strong>
            Better things.
            <br />
            Every day.
          </strong>
          <span className={styles.shopAction}>Explore the collection ↗</span>
        </div>
      </div>
      <div className={styles.commerceCategories}>
        <span>Audio</span>
        <span>Technology</span>
        <span>Workspace</span>
        <ArrowUpRight size={14} />
      </div>
    </div>
  </div>
);

const TravelPreview = () => (
  <div className={styles.travelScene}>
    <div className={styles.sceneNote}>
      Travel Platform <span>Traveler / Guide</span>
    </div>
    <div className={styles.travelWindow}>
      <div className={styles.travelNav}>
        <strong>Wander further.</strong>
        <span>Explore · My trips</span>
        <span className={styles.travelAvatar}>A</span>
      </div>
      <div className={styles.travelHero}>
        <div className={styles.landscape}>
          <div />
          <div />
          <div />
          <span />
        </div>
        <div className={styles.travelHeroCopy}>
          <span>People. Places. Possibilities.</span>
          <strong>
            Take the
            <br />
            scenic route.
          </strong>
          <span className={styles.tripSearch}>
            <Search size={12} /> Find your next experience
          </span>
        </div>
      </div>
      <div className={styles.travelFlow}>
        <span>
          <Check size={11} />
          Explore a trip
        </span>
        <span>
          <Check size={11} />
          Meet a guide
        </span>
        <span>
          <Check size={11} />
          Plan your booking
        </span>
      </div>
    </div>
  </div>
);

const WorkbenchPreview = ({
  kind,
}: {
  kind: PortfolioProject["preview"]["kind"];
}) => {
  if (kind === "terminal") {
    return (
      <div className={styles.terminalScene}>
        <div className={styles.terminalTop}>tanto / workstation</div>
        <div className={styles.terminalCommand}>
          <span>›</span> tanto nodejs
        </div>
        <div className={styles.terminalTools}>
          <span>Git</span>
          <span>Node.js</span>
          <span>npm</span>
        </div>
        <div className={styles.terminalFooter}>
          Locate → Inspect → Understand
        </div>
      </div>
    );
  }
  if (kind === "bloom") {
    return (
      <div className={styles.bloomScene}>
        <div>
          <span className={styles.miniEyebrow}>An interactive field guide</span>
          <strong>
            A World
            <br />
            in Bloom.
          </strong>
          <span>Small wings. A living world.</span>
        </div>
        <svg viewBox="0 0 150 150" fill="none">
          <g stroke="currentColor" strokeWidth="1">
            <ellipse cx="75" cy="52" rx="16" ry="31" />
            <ellipse
              cx="75"
              cy="52"
              rx="16"
              ry="31"
              transform="rotate(60 75 75)"
            />
            <ellipse
              cx="75"
              cy="52"
              rx="16"
              ry="31"
              transform="rotate(120 75 75)"
            />
            <ellipse
              cx="75"
              cy="52"
              rx="16"
              ry="31"
              transform="rotate(180 75 75)"
            />
            <ellipse
              cx="75"
              cy="52"
              rx="16"
              ry="31"
              transform="rotate(240 75 75)"
            />
            <ellipse
              cx="75"
              cy="52"
              rx="16"
              ry="31"
              transform="rotate(300 75 75)"
            />
            <circle cx="75" cy="75" r="13" fill="currentColor" />
          </g>
        </svg>
      </div>
    );
  }
  return (
    <div className={styles.docsScene}>
      <div className={styles.docsSidebar}>
        <span>{kind === "portfolio" ? "EXPLORER" : "CONTENTS"}</span>
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className={styles.docsContent}>
        <span className={styles.miniEyebrow}>
          {kind === "portfolio" ? "anan.dev / workbench" : "Hugo Docs / guides"}
        </span>
        <strong>
          {kind === "portfolio" ? "A place for ideas." : "Knowledge, kept."}
        </strong>
        <div className={styles.documentLines}>
          <i />
          <i />
          <i />
        </div>
        <div className={styles.codePreview}>
          <span>const</span> next = learn();
          <br />
          <span>await</span> build(next);
        </div>
      </div>
    </div>
  );
};

export const ProjectPreview = ({
  project,
  compact,
}: {
  project: PortfolioProject;
  compact: boolean;
}) => {
  const { kind, image } = project.preview;
  if (
    image &&
    (kind !== "nexzon" || project.preview.label === "Project capture")
  ) {
    return (
      <div className={`${styles.preview} ${compact ? styles.compact : ""}`}>
        <img
          className={styles.projectCapture}
          src={image.src}
          alt={image.alt}
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div
      className={`${styles.preview} ${compact ? styles.compact : ""}`}
      aria-hidden="true"
    >
      {kind === "learning-space" ? (
        <LearningSpacePreview />
      ) : kind === "dokimi" ? (
        <DokimiPreview />
      ) : kind === "nexzon" ? (
        <NexzonPreview project={project} />
      ) : kind === "travel" ? (
        <TravelPreview />
      ) : (
        <WorkbenchPreview kind={kind} />
      )}
    </div>
  );
};
