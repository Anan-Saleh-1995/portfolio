interface ArsenalGroup {
  id: string;
  category: string;
  items: readonly string[];
  concepts?: readonly string[];
}

export const arsenalGroups: readonly ArsenalGroup[] = [
  {
    id: "interfaces",
    category: "Interface engineering",
    items: [
      "React",
      "TypeScript",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "React Hook Form",
      "Tailwind CSS",
      "CSS Modules",
      "Emotion",
    ],
  },
  {
    id: "mobile",
    category: "Mobile & native bridges",
    items: [
      "React Native",
      "Expo",
      "Android",
      "Kotlin",
      "JNI",
      "Rust",
      "OpenMLS",
    ],
  },
  {
    id: "backend",
    category: "Backend & contracts",
    items: ["Node.js", "Express", "Fastify", "Hono", "Bun.serve", "Zod"],
  },
  {
    id: "data",
    category: "Data & background work",
    items: [
      "PostgreSQL",
      "Drizzle ORM",
      "MySQL",
      "Knex",
      "MongoDB",
      "Redis",
      "BullMQ",
    ],
  },
  {
    id: "protocols",
    category: "Wallets & protocols",
    items: [
      "TronWeb",
      "viem",
      "Solana Kit",
      "bitcoinjs-lib",
      "JSON-RPC",
      "REST APIs",
      "Webhooks",
    ],
  },
  {
    id: "identity",
    category: "Security & identity",
    items: [
      "TOTP MFA",
      "Argon2",
      "Session authentication",
      "Role-based access",
      "CSRF protection",
      "Upload validation",
      "Rate limiting",
    ],
  },
  {
    id: "operations",
    category: "Observability & operations",
    items: [
      "Docker",
      "Docker Compose",
      "Prometheus",
      "Grafana",
      "Pino",
      "Health checks",
    ],
    concepts: ["OpenTelemetry", "Sentry"],
  },
  {
    id: "quality",
    category: "Quality, docs & tooling",
    items: [
      "Vitest",
      "Playwright",
      "Testing Library",
      "ESLint",
      "Prettier",
      "Git",
      "Hugo",
      "Shiki",
    ],
  },
];
