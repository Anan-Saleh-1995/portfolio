import type { HomeContent } from "../home.types";

export const homeContent = {
  nav: {
    brand: "anan",
    links: [
      { href: "#the-way", label: "The Way" },
      { href: "#arsenal", label: "Arsenal" },
      { href: "#forge", label: "Forge" },
      { href: "#contact", label: "Engagement" },
    ],
    backToTopLabel: "Back to top",
    mainNavigationLabel: "Main navigation",
    mobileNavigationLabel: "Mobile navigation",
    openMenuLabel: "Open menu",
    closeMenuLabel: "Close menu",
  },
  hero: {
    sectionNumber: "01",
    sectionTitle: "Enter",
    title: "The Dojo",
    subtitle: "Mastery through discipline.",
    role: "Full-Stack Developer",
    primaryCta: { href: "#the-way", label: "Explore" },
    secondaryCta: {
      href: "https://github.com/Anan-Saleh-1995",
      label: "GitHub",
    },
    scrollCueLabel: "Scroll down",
  },
  theWay: {
    sectionNumber: "02",
    sectionTitle: "The Way",
    heading: "The Way",
    paragraphs: [
      "Full-stack developer with 3 years shipping production features across React, Meteor, Node.js, MongoDB, and AWS for live web products.",
      "Built secure S3 upload flows, 2FA and passwordless login systems, role-based access strategies, and cron-driven sitemap automation. Improved responsiveness on data-heavy screens by moving pagination to the server.",
      "Currently building a private travel platform for solo travelers and guides with MySQL, Redis, MFA, PayPal webhooks, Docker, and observability tooling.",
    ],
    stats: [
      { value: "3+", label: "Years in production" },
      { value: "3", label: "Languages spoken" },
      { value: "∞", label: "Commits to craft" },
    ],
    resume: {
      href: "https://resume-site-opal-phi.vercel.app/en/",
      label: "View Resume →",
    },
  },
  arsenal: {
    sectionNumber: "03",
    sectionTitle: "Arsenal",
    heading: "Weapons of Choice",
    groups: [
      {
        category: "Backend",
        items: [
          "Node.js",
          "Express",
          "NestJS",
          "REST APIs",
          "OpenAPI",
          "Swagger",
          "Authentication",
        ],
      },
      {
        category: "Frontend",
        items: [
          "React",
          "React Router",
          "TanStack Query",
          "React Hook Form",
          "Vite",
        ],
      },
      {
        category: "UI Systems",
        items: ["Ant Design", "MUI", "shadcn/ui", "Tailwind CSS"],
      },
      {
        category: "Languages",
        items: ["TypeScript", "JavaScript", "SQL", "Bash", "PowerShell"],
      },
      {
        category: "Data",
        items: ["MySQL", "MongoDB", "Redis", "Prisma", "Knex"],
      },
      {
        category: "Cloud & Platform",
        items: [
          "AWS S3",
          "AWS EC2",
          "AWS IAM",
          "Docker",
          "Docker Compose",
          "Linux",
          "SSH",
        ],
      },
      {
        category: "Quality & Workflow",
        items: ["Jest", "Vitest", "Unit Testing", "Git", "Jira", "Agile"],
      },
    ],
  },
  forge: {
    sectionNumber: "04",
    sectionTitle: "Forge",
    heading: "Blades Forged",
    projects: [
      {
        title: "GitHub",
        description:
          "Public code, backend patterns, frontend experiments, and ongoing open-source work that show how I structure real projects.",
        tag: "oss",
        url: "https://github.com/Anan-Saleh-1995",
      },
      {
        title: "Hugo Docs",
        description:
          "Technical writing project focused on clear documentation, structured content, and maintainable docs architecture.",
        tag: "docs",
        url: "https://personal-hugo-docs.vercel.app/docs/",
      },
      {
        title: "Resume Site",
        description:
          "Multilingual resume site built with Hugo to present experience, technical depth, and bilingual content clearly in Hebrew and English.",
        tag: "design",
        url: "https://resume-site-opal-phi.vercel.app/en/",
      },
      {
        title: "Travel Platform",
        description:
          "Private multi-role travel platform with guide and traveler flows, MFA, secure S3 uploads, PayPal webhooks, Redis, and Docker-based monitoring.",
        tag: "wip",
        url: "#",
        private: true,
        statusLabel: "Private build",
      },
    ],
  },
  provingGround: {
    sectionNumber: "06",
    sectionTitle: "Proving Ground",
    heading: "The Proving Ground",
    subheading:
      "Featured build: a private multi-role travel platform for solo travelers and local guides.",
    statusNote: "Still in the forge. A public-facing case study will follow.",
    note: "Private codebase, public proof. This section focuses on system design, product constraints, and the engineering work visible in the implementation.",
    problem:
      "Build a platform that separates traveler, guide, and admin responsibilities while keeping booking, media, and account flows secure enough for production use.",
    role: "Full-stack ownership across application architecture, backend modules, frontend route structure, security-sensitive flows, infrastructure ergonomics, and day-to-day engineering decisions.",
    stack: [
      "React",
      "Node.js",
      "Express",
      "MySQL",
      "Knex",
      "Redis",
      "AWS S3",
      "PayPal",
      "Prometheus",
      "Grafana",
      "Docker",
    ],
    constraints:
      "The hard parts were not just CRUD. The system had to enforce multi-role access, protect private media, recover safely from payment edge cases, keep local development practical, and stay observable enough to debug background and runtime behavior.",
    systems: [
      "Role-segmented frontend routes and layouts for admin, guide, and traveler flows",
      "Server modules for auth, trips, enrollments, favorites, photos, payments, reports, reviews, profiles, and guide applications",
      "TOTP MFA with enrollment, login challenge, recovery codes, password re-authentication, audit logging, and dedicated implementation docs",
      "Protected photo uploads with server-side image validation, opaque file keys, local and S3 storage drivers, and authorized read access",
      "Booking and payment lifecycle with PayPal order creation, capture handling, rollback paths, refund recovery, notifications, and audit trails",
      "Local observability stack with Redis, Prometheus, Grafana, health endpoints, metrics, and one-command dev startup scripts",
    ],
    proofPoints: [
      { value: "14", label: "Backend modules" },
      { value: "3", label: "Role-based app shells" },
      { value: "65", label: "Server test files" },
    ],
    decisions: {
      heading: "Key Engineering Decisions",
      items: [
        "Keep traveler, guide, and admin flows isolated in route structure so permissions are reinforced in both UI and backend design.",
        "Abstract storage behind local and S3 drivers so upload behavior stays consistent across local development and production.",
        "Treat payments as a lifecycle, not a single endpoint, so capture, rollback, refund, and audit paths stay explicit.",
        "Organize the backend around domain modules instead of route sprawl so auth, trips, media, payments, and reports can evolve independently.",
      ],
    },
    impact:
      "The result is a platform with clearer role boundaries, safer upload and payment flows, better operational visibility, and a backend shape that can grow feature-by-feature instead of collapsing into a monolith of route handlers.",
  },
  contact: {
    sectionNumber: "05",
    sectionTitle: "Engagement",
    heading: "State Your Intent",
    subheading:
      "Opportunities, alliances, and worthy challenges are welcome. Send word.",
    channelsLabel: "Direct Channels",
    email: "anansaleh18@gmail.com",
    github: "https://github.com/Anan-Saleh-1995",
    form: {
      labels: {
        name: "Name",
        email: "Email",
        purpose: "Purpose",
        message: "Message",
      },
      liveRegion: {
        pending: "Sending your message...",
      },
      submit: {
        idle: "Send Word",
        pending: "Sending...",
      },
      success: {
        heading: "Word Received",
        message:
          "Your message has been received. I will respond within 48 hours.",
        reset: "Send Another",
      },
      purposeSelect: {
        placeholder: "Select a purpose",
        ariaLabel: "Purpose",
        options: [
          { value: "Hiring Inquiry", label: "Hiring Inquiry" },
          { value: "Collaboration", label: "Collaboration" },
          { value: "General", label: "General" },
        ],
      },
      validation: {
        nameRequired: "State your name",
        emailRequired: "An email is required",
        emailInvalid: "Enter a valid email address",
        messageRequired: "State your message",
        messageTooShort: "Your message must be at least {min} characters",
      },
      delivery: {
        error:
          "Your word could not be delivered. Try again or use a direct channel.",
        defaultSubject: "Portfolio Contact",
      },
    },
  },
  footer: {
    brand: "anan",
    backToTopLabel: "Back to top",
    quote: '"Today is victory over yourself of yesterday."',
    copyrightName: "Anan Saleh",
  },
} satisfies HomeContent;
