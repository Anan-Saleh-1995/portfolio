interface ArsenalEvidence {
  description: string;
  label: string;
  href: string;
  related?: {
    label: string;
    href: string;
  };
}

export const arsenalEvidence: Record<string, ArsenalEvidence> = {
  interfaces: {
    description:
      "Nexzon puts typed routes, query-owned catalog reads, and local cart, wishlist, and comparison state into a working commerce demo. Anan.dev explores a different frontend surface with server rendering and Emotion.",
    label: "Explore Nexzon",
    href: "#work-nexzon",
    related: { label: "Anan.dev", href: "#work-anan-dev" },
  },
  mobile: {
    description:
      "Learning Space connects Expo and React Native role-based screens to Android device capabilities and a Rust/OpenMLS group-encryption bridge through Kotlin and JNI. The native encryption bridge is under development and has not been audited or released.",
    label: "Inspect Learning Space",
    href: "#work-learning-space",
  },
  backend: {
    description:
      "The travel platform uses Express domain modules for bookings, media, identity, and payments. Anan.dev uses Bun.serve and Hono; Nexzon currently has a Fastify health and configuration baseline, with commerce authority still ahead.",
    label: "Inspect the travel platform",
    href: "#work-travel",
    related: { label: "Anan.dev", href: "#work-anan-dev" },
  },
  data: {
    description:
      "Dokimi Ledger uses PostgreSQL and Drizzle for wallet operations and indexed network evidence. The travel platform uses MySQL, Knex, and Redis; Learning Space adds BullMQ password-reset email jobs and Redis workers. MongoDB appears in my previous production work.",
    label: "Inspect Dokimi Ledger",
    href: "#work-dokimi",
    related: { label: "Learning Space", href: "#work-learning-space" },
  },
  protocols: {
    description:
      "Dokimi Ledger implements distinct wallet and provider flows for TRON Shasta, Ethereum Sepolia, Solana devnet, and Bitcoin testnet. The work separates an application operation from the network evidence that confirms it. Test networks only.",
    label: "Explore the testnet workspace",
    href: "#work-dokimi",
  },
  identity: {
    description:
      "The travel platform includes MFA enrollment and recovery, role-guarded app shells, protected photo uploads, and payment webhook boundaries. Focused tests and implementation notes accompany the ongoing hardening work.",
    label: "Follow the identity and access work",
    href: "#work-travel",
  },
  operations: {
    description:
      "The travel platform has a local Docker workflow with Redis, Prometheus, Grafana, health endpoints, and structured logging. My next learning focus is tracing and error monitoring through OpenTelemetry and Sentry.",
    label: "See the operational context",
    href: "#work-travel",
  },
  quality: {
    description:
      "Tests and static checks accompany the applications. Tanto focuses on read-only project readiness diagnostics; the documentation projects and Anan.dev explore how technical knowledge is structured and presented.",
    label: "Inspect Tanto",
    href: "#work-tanto",
    related: { label: "Browse the documentation work", href: "#work-docs" },
  },
};
