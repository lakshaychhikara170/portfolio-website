/**
 * ============================================================
 *  PORTFOLIO CONFIG — Edit this file to update your portfolio
 * ============================================================
 *
 *  HOW TO UPDATE:
 *  1. Edit any value below
 *  2. Save the file
 *  3. git add . && git commit -m "update" && git push
 *  4. Vercel auto-deploys in ~30 seconds ✅
 *
 */

const portfolio = {
  // ── Personal Info ────────────────────────────────────────────
  name: "Lakshay Chhikara",
  role: "Engineer • Dev",
  tagline: "I craft fast, beautiful, and purposeful digital experiences.",
  bio: "I'm a polymath who loves solving real problems with clean code and thoughtful design. When I'm not building things, I'm probably reading about systems design or tinkering with side projects.",
  primaryDisciplines: "Full-Stack Web Development",
  avatar: "/avatar.jpg", // Place your photo in /public/avatar.jpg
  resumeUrl: "/resume.pdf", // Place your resume in /public/resume.pdf
  location: "India",
  availableForWork: true, // shows a green "Open to work" badge

  // ── Skills ───────────────────────────────────────────────────
  // Add or remove skills freely. They'll auto-render as tags.
  skills: {
    "Frontend": ["React", "Next.js", "TypeScript", "CSS / SCSS"],
    "Backend": ["Node.js", "Python", "REST APIs", "PostgreSQL"],
    "Tools": ["Git", "Docker", "Vercel", "Figma"],
  },

  // ── Projects ─────────────────────────────────────────────────
  // To add a new project, copy one block and paste it below.
  projects: [
    {
      title: "Journi",
      description:
        "A personal journaling app with a clean login flow, mood tracking, and daily reflection prompts to help you build a consistent writing habit.",
      tags: ["React", "Node.js", "Supabase", "Vercel"],
      liveUrl: "https://journaling-d949wsyvh-lakshaychhikara170s-projects.vercel.app/login",
      githubUrl: "https://github.com/lakshaychhikara170/journi",
      image: "https://image.thum.io/get/width/900/crop/600/https://journaling-d949wsyvh-lakshaychhikara170s-projects.vercel.app/login",
      featured: true,
    },
    {
      title: "Execute Pro",
      description:
        "A productivity-focused daily planner built to help you execute your goals with structured task lists, priority management, and a distraction-free interface.",
      tags: ["React", "CSS", "Vercel"],
      liveUrl: "https://daily-planner-rh7k.vercel.app/#/",
      githubUrl: "https://github.com/lakshaychhikara170/daily-planner",
      image: "https://image.thum.io/get/width/900/crop/600/https://daily-planner-rh7k.vercel.app/%23/",
      featured: true,
    },
    {
      title: "BMS Protector",
      description:
        "Battery Management System dashboard for monitoring real-time cell data, fault detection, and protection logic for lithium-ion battery packs.",
      tags: ["React", "Next.js", "Vercel"],
      liveUrl: "https://bms-protector.vercel.app/",
      githubUrl: "https://github.com/lakshaychhikara170/bms-protector",
      image: "https://image.thum.io/get/width/900/crop/600/https://bms-protector.vercel.app/",
      featured: false,
    },
    {
      title: "AR Cursed Energy Engine",
      description:
        "Augmented reality hand tracking engine inspired by Jujutsu Kaisen. Detects hand gestures in real-time using computer vision and overlays cursed energy visual effects.",
      tags: ["JavaScript", "MediaPipe", "WebGL", "AR"],
      liveUrl: "https://ar-cursed-engine.vercel.app/",
      githubUrl: "https://github.com/lakshaychhikara170/AR-Hand-Tracker-project-",
      image: "https://image.thum.io/get/width/900/crop/600/https://ar-cursed-engine.vercel.app/",
      featured: false,
    },
  ],

  // ── Experience ────────────────────────────────────────────────
  // Leave empty array [] if you have no work experience yet.
  experience: [
    {
      company: "Company Name",
      role: "Software Engineer",
      period: "Jan 2024 - Present",
      location: "Remote",
      bullets: [
        "Built and shipped Feature X used by 10k+ users",
        "Reduced API response time by 40% through caching",
        "Collaborated with design team to revamp the dashboard UI",
      ],
    },
    {
      company: "Another Company",
      role: "Frontend Intern",
      period: "Jun 2023 - Dec 2023",
      location: "Bangalore, India",
      bullets: [
        "Developed reusable React component library",
        "Integrated third-party payment gateway",
      ],
    },
  ],

  // ── Education ────────────────────────────────────────────────
  education: [
    {
      institution: "Your University",
      degree: "B.Tech in Computer Science",
      period: "2020 - 2024",
    },
  ],

  // ── Contact / Social ─────────────────────────────────────────
  email: "you@email.com",
  social: {
    github: "https://github.com/yourhandle",
    linkedin: "https://linkedin.com/in/yourhandle",
    twitter: "https://twitter.com/yourhandle",
  },

  // ── Contact Form ─────────────────────────────────────────────
  // Admin password to view your list of contact submissions at /admin
  adminPassword: "change-this-password",
};

module.exports = portfolio;
