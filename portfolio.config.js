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
  role: "video editor, full stack developer",
  tagline: "I craft fast, beautiful, and purposeful digital experiences.",
  bio: "I'm a polymath who loves solving real problems with clean code and thoughtful design. When I'm not building things, I'm probably reading about systems design or tinkering with side projects.",
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
      title: "AI Goal Scheduler",
      description:
        "A smart daily planner that uses AI to help you prioritize goals, set reminders, and track progress over time.",
      tags: ["React", "Node.js", "PostgreSQL", "OpenAI"],
      liveUrl: "https://your-scheduler.vercel.app",
      githubUrl: "https://github.com/you/scheduler",
      image: "/projects/p1.png", // place screenshot in /public/projects/
      featured: true,
    },
    {
      title: "Portfolio Website",
      description:
        "This portfolio - designed from scratch to feel personal and human, built with Next.js and deployed on Vercel.",
      tags: ["Next.js", "CSS", "Vercel"],
      liveUrl: "",
      githubUrl: "https://github.com/you/portfolio",
      image: "/projects/p2.png",
      featured: true,
    },
    {
      title: "Side Project 3",
      description: "Describe what this project does and what problem it solves.",
      tags: ["Tag1", "Tag2"],
      liveUrl: "",
      githubUrl: "",
      image: "",
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
