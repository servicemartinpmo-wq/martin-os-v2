export interface PricingTier {
  name: string;
  price: string;
  bestFor: string;
  isGlowing?: boolean;
}

export interface Product {
  name: string;
  positioning: string;
  tagline: string;
  overview: string;
  features: string[];
  tiers: PricingTier[];
}

export const products: Product[] = [
  {
    name: "PMO-Ops",
    positioning: "The Autonomous Brain for High-Stakes Operations.",
    tagline: "Know what matters. We support leaders who do it all.",
    overview: "PMO-Ops is a high-fidelity operational command center that transforms fragmented organizational noise into structured intelligence. It is designed for founders and executives who require absolute clarity across complex initiatives.",
    features: [
      "Project & Program Coordination: Planning, tracking, and cross-functional team collaboration.",
      "Operational Mapping: SOP creation, software implementation, and data management.",
      "Administrative Support: Virtual assistant services, calendar management, and event planning.",
      "Quality Control & Risk Mitigation: Monitoring progress and implementing mitigation strategies.",
      "Vendor & Budget Management: Negotiation, procurement, and financial reporting.",
      "Industries Served: Marketing, HR, Healthcare, Industrial/Engineering, and Non-Profits."
    ],
    tiers: [
      { name: "Personal Command", price: "$0", bestFor: "Solo operators tracking 3 projects with manual intake." },
      { name: "Professional Operator", price: "$30", bestFor: "Teams needing G-Suite/Office integration and 10 active automations." },
      { name: "Workflow Builder", price: "$50", bestFor: "Organizations automating SOPs, approval flows, and API integrations." },
      { name: "Command Flagship", price: "$199", bestFor: "Full AI Autonomy. WhatsApp intelligence, org diagnostics, and custom branding.", isGlowing: true },
      { name: "Enterprise", price: "$2,000", bestFor: "Unlimited scale. PMO-as-a-Service with continuous configuration and audits." }
    ]
  },
  {
    name: "Tech-Ops",
    positioning: "Unified IT Operations. Autonomous Technical Resolution.",
    tagline: "Production-grade diagnostics at the speed of thought.",
    overview: "Powered by the Apphia Engine, Tech-Ops bridges the gap between technical failure and business continuity. It automates the Tier 1–5 support lifecycle, resolving issues before they impact the bottom line.",
    features: [
      "12-Stage Diagnostic Pipeline: Automated root cause ranking and resolution synthesis.",
      "Vector-Search Knowledge Base: Semantic retrieval of past fixes to solve new problems instantly.",
      "Automation Center: Custom triggers that execute system actions (e.g., clearing caches or restarting APIs) autonomously.",
      "Secure Vault: AES-256-GCM encrypted storage for sensitive infrastructure credentials."
    ],
    tiers: [
      { name: "Individual", price: "$9", bestFor: "Freelancers managing up to 10 cases with 1 connector." },
      { name: "Professional", price: "$29", bestFor: "Power users requiring batch execution and 50 monthly cases." },
      { name: "Business", price: "$99", bestFor: "Full Tiers 1–5 autonomy, 200 cases, and the Automation Center.", isGlowing: true },
      { name: "Enterprise", price: "$499", bestFor: "Unlimited access, SOC 2 compliance, and custom API integrations." }
    ]
  },
  {
    name: "miidle",
    positioning: "The Proof-of-Work Protocol and Build Story Engine.",
    tagline: "See how things actually get built.",
    overview: "miidle is a Work Graph and Execution Capture engine. It records the invisible work—decisions, pivots, and technical wins—and transforms them into structured narratives and networking assets.",
    features: [
      "Execution Capture: Passive logging of workflow actions to build a Build Story.",
      "Work Graph Identity: A dynamic map of skills, projects, and verified outcomes.",
      "Story Generator: AI-powered conversion of raw data into video, audio, and cinematic write-ups.",
      "Network Interaction Layer: Deployable Games, Quizzes, and Polls to benchmark performance against a global network."
    ],
    tiers: [
      { name: "Community", price: "$0", bestFor: "Observers, bookmarks, and basic networking access." },
      { name: "Contributor", price: "$20", bestFor: "Full Build Story generation, premium exports, and auto-capture." },
      { name: "Agency Studio", price: "$99", bestFor: "Professional client showcasing, verified badges, and custom branding." },
      { name: "Enterprise", price: "Custom", bestFor: "Full organizational visibility and verified team trust-badges." }
    ]
  }
];

export const bundle = {
  name: "The MARTIN OS Suite",
  price: "$249 / month",
  description: "Complete organizational, technical, and storytelling autonomy for the price of a single executive assistant.",
  includes: "PMO-Ops Command Flagship + Tech-Ops Business + miidle Contributor"
};
