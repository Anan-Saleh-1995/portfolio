export type ProjectPreviewKind =
  | "learning-space"
  | "dokimi"
  | "nexzon"
  | "travel"
  | "portfolio"
  | "terminal"
  | "bloom"
  | "docs";

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  status: string;
  purpose: string;
  stack: string[];
  featured: boolean;
  liveUrl?: string;
  preview: {
    kind: ProjectPreviewKind;
    label:
      | "Interface study"
      | "System study"
      | "Project capture"
      | "Homepage art direction";
    image?: { src: string; alt: string };
  };
  buildNotes: { scope: string[]; boundary: string };
  links: ProjectLink[];
  related: ProjectLink[];
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "work-learning-space",
    title: "Learning Space",
    category: "Education management & mobile experience",
    status: "In development",
    purpose:
      "An education app being built for private teachers, schools, colleges, and universities to manage learning, communication, and daily operations in one shared space.",
    stack: [
      "Expo / React Native",
      "TypeScript",
      "Express",
      "PostgreSQL",
      "Rust / OpenMLS",
    ],
    featured: true,
    preview: { kind: "learning-space", label: "Interface study" },
    buildNotes: {
      scope: [
        "Groups, assignments, conversations, and account settings bring learning and communication together, with access tailored to each person's responsibilities.",
        "An Express API with authentication, opaque sessions, permissions, Drizzle/PostgreSQL persistence, and observability.",
        "Native group-chat encryption work connects React Native to Kotlin and a Rust OpenMLS bridge, with device registration and group-state handling.",
      ],
      boundary:
        "Learning Space is the working name. The app and its native messaging are in active development toward a public launch.",
    },
    links: [],
    related: [
      { label: "Another full-stack system", href: "#work-dokimi" },
      { label: "Explore the toolkit", href: "#arsenal" },
    ],
  },
  {
    id: "work-dokimi",
    title: "Dokimi Ledger",
    category: "Testnet learning & wallet systems",
    status: "In development",
    purpose:
      "A hands-on workspace for learning wallets, assets, and transaction flows across four blockchain test networks.",
    stack: [
      "React / TypeScript",
      "TanStack",
      "Express",
      "Drizzle / PostgreSQL",
      "Chain SDKs",
    ],
    featured: true,
    preview: { kind: "dokimi", label: "Interface study" },
    buildNotes: {
      scope: [
        "Wallet creation, receive addresses, asset views, and send flows, with routes for TRON Shasta, Ethereum Sepolia, Solana devnet, and Bitcoin testnet.",
        "Chain observation and indexing, including Bitcoin UTXO handling and transaction preparation.",
        "Chain-specific integrations use TronWeb, viem, Solana Kit, and bitcoinjs-lib behind the application experience.",
      ],
      boundary:
        "Built for test networks. The workspace is in development; no public demo is linked yet.",
    },
    links: [],
    related: [
      { label: "State handling in commerce", href: "#work-nexzon" },
      { label: "Explore the toolkit", href: "#arsenal" },
    ],
  },
  {
    id: "work-nexzon",
    title: "Nexzon",
    category: "Commerce experience & frontend systems",
    status: "Portfolio demo",
    purpose:
      "A complete shopping journey from discovery to a considered selection, with search, product variants, comparison, and a persistent cart.",
    stack: [
      "React / TypeScript",
      "TanStack Router",
      "Redux Toolkit",
      "FlexSearch",
      "Fastify",
    ],
    featured: true,
    preview: {
      kind: "nexzon",
      label: "Homepage art direction",
      image: {
        src: "/images/projects/nexzon-workspace.png",
        alt: "Nexzon workspace art direction with headphones, a speaker, a tablet, and desk essentials.",
      },
    },
    buildNotes: {
      scope: [
        "Homepage, departments, collections, searchable catalogue, and product detail pages with variant selection.",
        "Cart, wishlist, and product comparison use Redux Toolkit and versioned local persistence.",
        "A Fastify API foundation exists alongside the frontend. Server-authoritative quotes and Supabase integration are planned.",
      ],
      boundary:
        "A working frontend demo. Checkout is not part of the current experience.",
    },
    links: [],
    related: [
      { label: "Another product journey", href: "#work-travel" },
      { label: "Explore the toolkit", href: "#arsenal" },
    ],
  },
  {
    id: "work-travel",
    title: "Travel Platform",
    category: "Multi-role product & backend engineering",
    status: "Private build",
    purpose:
      "A platform connecting solo travelers and local guides, with separate experiences for travelers, guides, and administrators.",
    stack: ["React", "Node.js / Express", "MySQL", "Redis", "PayPal / AWS S3"],
    featured: true,
    preview: { kind: "travel", label: "Interface study" },
    buildNotes: {
      scope: [
        "Role-specific navigation and routes, booking and cancellation flows, guide earnings, and an administrator payout interface.",
        "MFA enrollment and recovery, protected media uploads, and authorized access through local and S3 storage drivers.",
        "Payment lifecycle handling includes PayPal webhooks, capture, rollback and refund paths, notifications, and audit trails.",
      ],
      boundary:
        "Private and in development. This record presents the implementation without exposing its code.",
    },
    links: [],
    related: [
      { label: "Back to the mobile work", href: "#work-learning-space" },
      { label: "Talk through a project", href: "#contact" },
    ],
  },
  {
    id: "work-anan-dev",
    title: "Anan.dev",
    category: "Developer knowledge workbench",
    status: "In development",
    purpose:
      "An editor-like place to explore technical resources, keep useful references open, and move quickly between ideas.",
    stack: ["React", "Bun / Hono", "TypeScript", "Emotion", "Shiki"],
    featured: false,
    preview: { kind: "portfolio", label: "Interface study" },
    buildNotes: {
      scope: [
        "Explorer and search, preview tabs, pinned and closable tabs, resource rendering, and keyboard quick access.",
        "A Vite client and server-rendering setup with Bun/Hono, Emotion styling, and Shiki code highlighting.",
      ],
      boundary:
        "The workbench is implemented; its resource library is still growing.",
    },
    links: [],
    related: [{ label: "Read the published guides", href: "#work-docs" }],
  },
  {
    id: "work-tanto",
    title: "Tanto",
    category: "Developer tools & platform behavior",
    status: "Early working slice",
    purpose:
      "A read-only workstation CLI that finds development tools, checks their versions, and explains what is ready or missing.",
    stack: ["TypeScript", "Node.js core", "Node test runner"],
    featured: false,
    preview: { kind: "terminal", label: "System study" },
    buildNotes: {
      scope: [
        "The Node.js readiness command checks Git, Node.js, and npm, reporting their locations, versions, and failure states.",
        "Explicit process boundaries and Windows executable handling keep shell assumptions visible and testable.",
      ],
      boundary:
        "The first slice checks readiness. Setup planning and project creation come later.",
    },
    links: [],
    related: [
      { label: "Explore the education app", href: "#work-learning-space" },
    ],
  },
  {
    id: "work-bloom",
    title: "A World in Bloom",
    category: "Interactive editorial & visual storytelling",
    status: "Interactive demo",
    purpose:
      "An illustrated field guide to bees, pollination, and conservation, built around exploration and small discoveries.",
    stack: ["React / TypeScript", "Vite", "Motion", "Radix", "Tailwind CSS"],
    featured: false,
    preview: { kind: "bloom", label: "Interface study" },
    buildNotes: {
      scope: [
        "Species dialogs, anatomy hotspots, pollination steps, a seasonal timeline, and plant filters.",
        "Motion and interactive reading patterns connect editorial material with exploration.",
      ],
      boundary:
        "An interactive editorial demo. Newsletter signup is a demonstration.",
    },
    links: [],
    related: [
      { label: "Explore a different experience", href: "#work-nexzon" },
    ],
  },
  {
    id: "work-docs",
    title: "Hugo Docs",
    category: "Technical writing & documentation",
    status: "Published",
    purpose:
      "A growing collection of practical guides on authentication, shells, Docker, Git, and building sites.",
    stack: ["Hugo Extended", "Sass", "JavaScript", "Pagefind"],
    featured: false,
    preview: { kind: "docs", label: "Interface study" },
    liveUrl: "https://personal-hugo-docs.vercel.app/docs/",
    buildNotes: {
      scope: [
        "Written technical guides with tree navigation, search, table of contents, theme switching, and code-copy controls.",
      ],
      boundary:
        "Published documentation, maintained as the knowledge and projects develop.",
    },
    links: [],
    related: [{ label: "The knowledge workbench", href: "#work-anan-dev" }],
  },
];
