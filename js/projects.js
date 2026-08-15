/**
 * Verified Portfolio Project Dataset
 * Source of Truth: 15 Development Projects + 3 Freelance Projects (Exact URLs confirmed via Screenshots)
 */

window.portfolioData = window.portfolioData || {};

// 3 Real-World Freelance Projects
window.portfolioData.freelanceProjects = [
  {
    id: "glasseria",
    title: "Glasseria — Custom Shopify E-commerce",
    client: "Glasseria",
    category: "Freelance / E-commerce",
    status: "archived",
    badge: "Completed / Archived",
    description:
      "A fully customized Shopify storefront built with custom-coded sections and tailored e-commerce UI for a premium glassware brand.",
    technologies: ["Shopify", "Liquid", "HTML5", "CSS3", "JavaScript", "Custom UI"],
    liveUrl: "",
    linkedinUrl: "https://www.linkedin.com/posts/suryanshhsingh_activity-7494491354538856448-Bvyr",
    featured: true,
    highlights: [
      "Deeply customized Shopify storefront with tailored Liquid architecture",
      "Custom-coded product presentation cards and responsive UI sections",
      "Client-focused e-commerce implementation meeting real commercial requirements"
    ]
  },
  {
    id: "vellora-escapes",
    title: "Vellora Escapes — Travel Experience",
    client: "Vellora Escapes",
    category: "Freelance / Travel",
    status: "live",
    badge: "Live",
    description:
      "A premium travel experience website designed and developed for a real travel business, combining immersive destination storytelling with conversion-focused interfaces.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive UI"],
    liveUrl: "https://www.velloraescapes.com/",
    linkedinUrl: "",
    featured: false,
    highlights: [
      "Production travel company website with destination catalogs and packages",
      "Responsive layout engineered for seamless multi-device browsing",
      "Client-focused design turning travel requirements into interactive UI"
    ]
  },
  {
    id: "dogindeed",
    title: "DogIndeed — Shopify Store",
    client: "DogIndeed",
    category: "Freelance / E-commerce",
    status: "archived",
    badge: "Completed / Archived",
    description:
      "A Shopify-based pet e-commerce storefront enhanced with custom-designed UI cards and tailored storefront sections.",
    technologies: ["Shopify", "Custom UI", "HTML5", "CSS3", "JavaScript"],
    liveUrl: "",
    linkedinUrl: "https://www.linkedin.com/posts/suryanshhsingh_internship-project-activity-7445458786989027328-lJpO",
    featured: false,
    highlights: [
      "Shopify-powered pet e-commerce storefront with custom UI enhancements",
      "Tailored storefront sections and branded card components",
      "Direct integration of real commercial product listings and catalog"
    ]
  }
];

// Exactly 15 Verified Live Development Projects (Source of Truth from Screenshot)
window.portfolioData.developmentProjects = [
  {
    id: "productivity-dashboard",
    title: "Productivity Dashboard",
    category: "Web Application / Dashboard",
    description:
      "A comprehensive productivity workspace featuring dynamic task management, workflow analytics, goal tracking, and responsive panel compositions.",
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    liveUrl: "https://suryansh-productivity-dashboard.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: true,
    status: "live",
    highlights: [
      "Dynamic state management with persistent storage",
      "Interactive data cards and metric visualizations",
      "Multi-panel layout optimized for desktop and mobile"
    ]
  },
  {
    id: "responsive-landing-p",
    title: "Responsive Landing Experience",
    category: "Frontend / Landing Page",
    description:
      "A modern conversion-focused product landing page demonstrating crisp typographic hierarchy, responsive layout systems, and smooth micro-interactions.",
    technologies: ["HTML5", "CSS3", "Responsive Design", "Modern CSS"],
    liveUrl: "https://suryansh-singh-responsive-landing-p.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Mobile-first fluid responsive grid architecture",
      "Componentized marketing sections with smooth scroll reveals",
      "Cross-browser tested CSS layout integrity"
    ]
  },
  {
    id: "task-projects-fsw6",
    title: "Task Projects (FSW6)",
    category: "Frontend / Component Architecture",
    description:
      "A structured task iteration interface demonstrating state isolation, component communication, and reliable asynchronous action handling.",
    technologies: ["HTML5", "CSS3", "JavaScript", "DOM Architecture"],
    liveUrl: "https://task-projects-fsw6.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Component-level state isolation",
      "Asynchronous data handling simulation",
      "Semantic HTML5 hierarchy"
    ]
  },
  {
    id: "juice-shop-lota-kohl",
    title: "Juice Artisans Storefront",
    category: "E-Commerce / Concept",
    description:
      "A boutique organic juice eCommerce interface with engaging product showcases, ingredient highlights, and a smooth checkout preview flow.",
    technologies: ["HTML5", "CSS3", "JavaScript", "UI Design"],
    liveUrl: "https://juice-shop-lota-kohl.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Custom product card layout with ingredient tags",
      "Clean visual palette tailored for natural products",
      "Interactive cart drawer and filter states"
    ]
  },
  {
    id: "product-page-eight-nu",
    title: "Product Showcase Page",
    category: "Frontend / Interaction",
    description:
      "An interactive product presentation page highlighting visual storytelling, variant selectors, feature breakdowns, and micro-animated interaction states.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Animations"],
    liveUrl: "https://product-page-eight-nu.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Interactive image and variant selection controls",
      "Sticky CTA buy-box with responsive viewport repositioning",
      "Micro-animations on hover and state transitions"
    ]
  },
  {
    id: "grid-dashboard-chi",
    title: "Grid Analytics Dashboard",
    category: "UI Engineering / CSS Grid",
    description:
      "A multi-panel metric dashboard featuring complex CSS Grid tracks, responsive data cards, and flexible widget positioning for real-time monitoring.",
    technologies: ["HTML5", "CSS3", "CSS Grid", "JavaScript"],
    liveUrl: "https://grid-dashboard-chi.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Advanced 12-column and asymmetric grid patterns",
      "Dynamic widget restructuring across viewports",
      "Theme tokens with high contrast data legibility"
    ]
  },
  {
    id: "blog-dashboard-phi-three",
    title: "Editorial Blog Dashboard",
    category: "Content Management UI",
    description:
      "An author and publication management dashboard providing article authoring interfaces, reading metrics, tag management, and clean typography.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Typography"],
    liveUrl: "https://blog-dashboard-phi-three.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Clean content creation workflow UI",
      "Article performance analytics panel",
      "Structured typography scale for long-form reading"
    ]
  },
  {
    id: "task-projects-eati",
    title: "State Workflow Application (EATI)",
    category: "Frontend / State Management",
    description:
      "A focused frontend workflow application exploring state transitions, input validation patterns, and reactive user feedback mechanisms.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Form Handling"],
    liveUrl: "https://task-projects-eati.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Real-time input validation and feedback",
      "Robust state transition handling",
      "Zero-dependency pure JavaScript execution"
    ]
  },
  {
    id: "task-projects-dnah",
    title: "Component Registry & UI Sandbox (DNAH)",
    category: "UI Sandbox / Experiments",
    description:
      "A developer interface sandbox exploring reusable UI primitive structures, modular styling rules, and layout composition patterns.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Modular CSS"],
    liveUrl: "https://task-projects-dnah.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Reusable UI component primitives",
      "Modular design token scoping",
      "Responsive flex and grid container testing"
    ]
  },
  {
    id: "gaming-dashboard",
    title: "Gaming Dashboard",
    category: "Dashboard / UI Engineering",
    description:
      "An immersive gaming ecosystem dashboard featuring game library browsing, player stat analytics, stream status feeds, and futuristic dark aesthetics.",
    technologies: ["HTML5", "CSS3", "JavaScript", "CSS Grid"],
    liveUrl: "https://gaming-dashboard-red.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Rich media card presentation with hover elevation",
      "Responsive navigation dock and modular widgets",
      "Dynamic activity feed simulation"
    ]
  },
  {
    id: "zoom-clone",
    title: "Zoom Video Meeting UI",
    category: "Web App / Interface Clone",
    description:
      "A high-fidelity video meeting interface replica implementing video grid layouts, participant management, interactive controls bar, and chat panel.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Flexbox/Grid"],
    liveUrl: "https://zoom-clone-nine-cyan.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Adaptive speaker grid responding to participant counts",
      "Interactive control bar with toggle states",
      "Slide-out collapsible chat and participant drawers"
    ]
  },
  {
    id: "shopping-cart",
    title: "Shopping Cart Experience",
    category: "JavaScript / E-commerce",
    description:
      "An interactive e-commerce product and checkout flow with dynamic price calculations, cart drawer state management, and coupon validation logic.",
    technologies: ["JavaScript", "HTML5", "CSS3", "State Management"],
    liveUrl: "https://shopping-cart-jade-delta.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: true,
    status: "live",
    highlights: [
      "Real-time item quantity adjustment & total computation",
      "Cart drawer with smooth slide animations",
      "Robust state sync across product listing and modal views"
    ]
  },
  {
    id: "task-5-suryansh-rajput",
    title: "Task 5 Interface Suite",
    category: "Frontend / UI Layouts",
    description:
      "A clean frontend challenge testing precise typography balancing, card layout structures, and responsive grid reflow behavior.",
    technologies: ["HTML5", "CSS3", "JavaScript", "CSS Transitions"],
    liveUrl: "https://task-5-suryansh-rajput.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Subtle depth and border treatment",
      "Fully responsive breakpoint transitions",
      "Semantic HTML5 document outlining"
    ]
  },
  {
    id: "task-projects",
    title: "Task Projects Central Board",
    category: "Web Application / Productivity",
    description:
      "A centralized multi-project coordination board with category filtering, live preview routing, and browser state management.",
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    liveUrl: "https://task-projects.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Multi-column task coordination",
      "Instant filter and search capabilities",
      "Persistent state via browser storage"
    ]
  },
  {
    id: "task-projects-uasm",
    title: "Async Data Pipeline (UASM)",
    category: "JavaScript / Async Patterns",
    description:
      "An asynchronous processing prototype demonstrating Promise handling, fetch lifecycle tracking, loading skeleton states, and error recovery.",
    technologies: ["JavaScript", "HTML5", "CSS3", "Async/Await"],
    liveUrl: "https://task-projects-uasm.vercel.app/",
    githubUrl: "",
    previewImage: "",
    featured: false,
    status: "live",
    highlights: [
      "Promise lifecycle orchestration and fallback UI",
      "Skeleton loading animations",
      "Error boundaries and user recovery prompts"
    ]
  }
];

// Backward-compatible alias
window.portfolioData.projects = window.portfolioData.developmentProjects;
