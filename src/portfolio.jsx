import { useState, useEffect, useRef } from "react";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap";

const styles = `
  @import url('${FONT_URL}');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0d0d;
    --bg2: #141414;
    --bg3: #1c1c1c;
    --border: rgba(255,255,255,0.07);
    --text: #e8e4dc;
    --muted: #6b6560;
    --accent: #d4a853;
    --accent-dim: rgba(212,168,83,0.12);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Grain overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 999;
    opacity: 0.35;
  }

  .serif { font-family: 'DM Serif Display', serif; }
  .mono  { font-family: 'JetBrains Mono', monospace; }

  /* NAV */
  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 48px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s, backdrop-filter 0.3s, background 0.3s;
  }
  nav.scrolled {
    border-color: var(--border);
    backdrop-filter: blur(12px);
    background: rgba(13,13,13,0.8);
  }
  .nav-logo {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    color: var(--text);
    letter-spacing: 0.02em;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--text); }

  /* SECTIONS */
  section { padding: 96px 48px; max-width: 1100px; margin: 0; text-align: left; }

  /* HERO */
 .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-top: 120px;
    max-width: 100%;
    padding-left: 48px;
    padding-right: 48px;
    text-align: left;
  }
  .hero-tag {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.6s 0.2s forwards;
  }
  .hero-name {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(52px, 8vw, 110px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    color: var(--text);
    text-align: left;
    opacity: 0;
    animation: fadeUp 0.7s 0.4s forwards;
  }
  .hero-name em {
    font-style: italic;
    color: var(--accent);
  }
  .hero-tagline {
    margin-top: 32px;
    font-size: 15px;
    color: var(--muted);
    max-width: 520px;
    line-height: 1.8;
    opacity: 0;
    animation: fadeUp 0.7s 0.6s forwards;
  }
  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background: var(--accent);
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }
  .hero-cta {
    margin-top: 48px;
    display: flex;
    gap: 16px;
    opacity: 0;
    animation: fadeUp 0.7s 0.8s forwards;
  }
  .btn-primary {
    background: var(--accent);
    color: #0d0d0d;
    padding: 12px 28px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: opacity 0.2s, transform 0.2s;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    padding: 12px 28px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid var(--border);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

  .hero-scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 48px;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.1em;
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    animation: fadeUp 0.6s 1.2s forwards;
  }
  .scroll-line {
    width: 40px;
    height: 1px;
    background: var(--border);
    position: relative;
    overflow: hidden;
  }
  .scroll-line::after {
    content: '';
    position: absolute;
    left: -100%; top: 0;
    width: 100%; height: 100%;
    background: var(--accent);
    animation: scanLine 2s 1.5s ease-in-out infinite;
  }

  /* DIVIDER */
  .section-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 56px;
  }
  .section-label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--accent);
    white-space: nowrap;
  }
  .section-line {
    height: 1px;
    flex: 1;
    background: var(--border);
  }
  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(32px, 5vw, 52px);
    line-height: 1.1;
    color: var(--text);
    margin-bottom: 16px;
    text-align: left;
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: start;
  }
  .about-text {
    color: var(--muted);
    line-height: 1.9;
    font-size: 13.5px;
    text-align: left;
  }
  .about-text p + p { margin-top: 16px; }
  .about-text strong { color: var(--text); font-weight: 500; }
  .about-stack { display: flex; flex-direction: column; gap: 20px; }
  .stack-group-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .stack-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
    font-size: 11px;
    padding: 5px 12px;
    border: 1px solid var(--border);
    color: var(--muted);
    letter-spacing: 0.06em;
    transition: border-color 0.2s, color 0.2s;
  }
  .chip:hover { border-color: var(--accent); color: var(--text); }

  /* PROJECTS */
  .projects-section { max-width: 100%; }
  .projects-scroll-wrap {
    overflow-x: auto;
    padding: 0 48px 24px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .projects-track {
    display: flex;
    gap: 24px;
    width: max-content;
  }
  .project-card {
    width: 340px;
    flex-shrink: 0;
    background: var(--bg2);
    border: 1px solid var(--border);
    padding: 32px;
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: border-color 0.3s, transform 0.3s;
  }
  .project-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top left, var(--accent-dim), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
     pointer-events: none;
  }
  .project-card:hover { border-color: rgba(212,168,83,0.35); transform: translateY(-4px); }
  .project-card:hover::before { opacity: 1; }
  .project-num {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.15em;
    margin-bottom: 20px;
  }
  .project-title {
    font-family: 'DM Serif Display', serif;
    font-size: 22px;
    color: var(--text);
    margin-bottom: 12px;
    line-height: 1.2;
  }
  .project-desc {
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.8;
    margin-bottom: 24px;
  }
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 24px;
  }
  .project-tag {
    font-size: 10px;
    padding: 3px 9px;
    border: 1px solid var(--border);
    color: var(--muted);
    letter-spacing: 0.06em;
  }
  .project-links {
    display: flex;
    gap: 16px;
     cursor: pointer;
  }
  .project-link {
    font-size: 11px;
    color: var(--accent);
    text-decoration: none;
    letter-spacing: 0.08em;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: opacity 0.2s;
  }
  .project-link:hover { opacity: 0.7; }
  .project-link-arrow { transition: transform 0.2s; }
  .project-link:hover .project-link-arrow { transform: translate(2px, -2px); }

  /* EXPERIENCE */
  .exp-list { display: flex; flex-direction: column; gap: 0; }
  .exp-item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 32px;
    padding: 32px 0;
    border-bottom: 1px solid var(--border);
  }
  .exp-item:first-child { border-top: 1px solid var(--border); }
  .exp-meta { padding-top: 2px; }
  .exp-period {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    margin-bottom: 6px;
  }
  .exp-company {
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .exp-company:hover { opacity: 0.7; }
  .exp-role {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    color: var(--text);
    margin-bottom: 12px;
    text-align: left;
  }
  .exp-desc {
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.8;
    text-align: left;
  }
  .exp-desc li { margin-left: 16px; margin-top: 6px; }

  /* CONTACT */
  .contact-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
  }
  .contact-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(36px, 5vw, 60px);
    line-height: 1.05;
    color: var(--text);
  }
  .contact-heading em { font-style: italic; color: var(--accent); }
  .contact-links { display: flex; flex-direction: column; gap: 20px; }
  .contact-link {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
    color: var(--muted);
    font-size: 13px;
    padding: 16px 20px;
    border: 1px solid var(--border);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .contact-link:hover {
    border-color: rgba(212,168,83,0.35);
    color: var(--text);
    background: var(--accent-dim);
  }
  .contact-link-icon { color: var(--accent); font-size: 16px; }
  .contact-link-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .contact-link-value { font-size: 13px; }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 24px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.06em;
  }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes scanLine {
    0%   { left: -100%; }
    50%  { left: 100%; }
    100% { left: 100%; }
  }

  /* Responsive */
  @media (max-width: 768px) {
    nav { padding: 16px 24px; }
    .nav-links { display: none; }
    section { padding: 72px 24px; }
    .hero { padding-left: 24px; padding-right: 24px; }
    .about-grid, .contact-inner { grid-template-columns: 1fr; gap: 40px; }
    .exp-item { grid-template-columns: 1fr; gap: 8px; }
    .projects-scroll-wrap { padding: 0 24px 24px; }
    footer { padding: 24px; flex-direction: column; gap: 8px; text-align: center; }
    .hero-scroll-hint { left: 24px; }
  }
`;

const projects = [
  {
    num: "01",
    title: "Kisaan Dost",
    desc: "Crop yield prediction platform for Pakistani farmers using Random Forest and LSTM models on satellite and climate data.",
    tags: ["Python", "Random Forest", "LSTM", "Streamlit", "Plotly"],
    links: [{ label: "GitHub →", href: "https://github.com/Usman-Javaid1234/Kissan-Dost" }, { label: "Live Demo →", href: "https://kissan-dost-ekjs3enydkymoze3lgkdzd.streamlit.app/" }],
  },
  {
    num: "02",
    title: "InterviewAI",
    desc: "AI-powered technical interview platform with real-time code evaluation, adaptive questioning, and voice agent integration.",
    tags: ["React", "Node.js","MongoDB", "Vapi", "Express.js", "OpenAI", "Typescript"],
    links: [{ label: "GitHub →", href: "https://github.com/Usman-Javaid1234/InterviewAICombined" }, { label: "Live Demo →", href: "https://interview-ai-client-nine.vercel.app" }],
  },
  {
    num: "03",
    title: "RL Escape Room",
    desc: "AI-powered escape room demonstrating Deep Reinforcement Learning in practice. A DQN agent navigates three levels — dodging hazards, solving lever puzzles, and surviving a maze — while outmaneuvering adversarial enemies. 90% bullet avoidance across 1,000 training episodes.",
    tags: ["PyTorch", "Gymnasium", "Python", "Deep Q-Learning", "A* Pathfinding"],
    links: [{ label: "GitHub →", href: "https://github.com/Usman-Javaid1234/Escape-game-rl" }],
  },
];

const stackGroups = [
  { label: "AI / ML", chips: ["LangChain", "RAG", , "OpenAI", "LiveKit"] },
  { label: "Backend", chips: ["FastAPI", "Django", "REST", "PostgreSQL"] },
  { label: "Frontend", chips: ["React", "Next.js", "JavaScript"] },
  { label: "Infrastructure", chips: ["Git", "Linux"] },
];

const experience = [
  {
    period: "May 2025 — Present",
    company: "RAISC →",
    url: "https://raisc.org/",
    role: "Full-Stack AI Engineer",
    bullets: [
      "Built production RAG-based chatbots serving real users, with hybrid search and streaming output",
      "Developed voice agents using LiveKit with sub-300ms latency",
      "Designed AI microservices in FastAPI and Django with async task queues",
    ],
  },
  {
    period: "September 2022 — Present",
    company: "NUST-SEECS",
    role: "B.S. Computer Science",
    bullets: [
      "Graduating 2026 · CGPA 3.53/4.0",
      "Coursework: Data Structures, Algorithms, Databases, Operating Systems, Computer Networks, AI/ML",
      "Leading an AI-powered Final Year Project with a team of three, building a digital twin for an air cooling system",
    ],
  },
];

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-logo serif">
          U<span>.</span>Javaid
        </div>
        <ul className="nav-links">
          {["About", "Projects", "Experience", "Contact"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <div className="hero" style={{ position: "relative" }}>
        <div className="hero-tag">// Full-Stack AI Engineer · Islamabad, PK</div>
        <h1 className="hero-name serif">
          Usman<br />
          <em>Javaid</em>
        </h1>
        <p className="hero-tagline">
          I build production AI systems — RAG pipelines, voice agents,
          and intelligent web applications — from backend to interface
          <span className="cursor" />
        </p>
        <div className="hero-cta">
          <a className="btn-primary" href="#projects">View Work</a>
          <a className="btn-ghost" href="#contact">Get in Touch</a>
          <a
            className="btn-ghost"
            href="/Usman_Javaid_Resume_6th_sem.pdf"
            download="Usman_Javaid_CV.pdf"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <span style={{ fontSize: "13px", lineHeight: 1 }}>↓</span> Download CV
          </a>
        </div>
        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          scroll
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="section-header">
          <span className="section-label">01 — About</span>
          <div className="section-line" />
        </div>
        <div className="about-grid">
          <div>
            <h2 className="section-title serif">
              Engineer at<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>the stack's edge</em>
            </h2>
            <div className="about-text">
              <p>
                I'm a 3rd-year CS student at <strong>NUST-SEECS</strong> and part-time AI Engineer at <strong>RAISC</strong>,
                where I ship AI-powered products in production — not demos.
              </p>
              <p>
                My focus sits at the intersection of <strong>language models and real systems</strong>:
                building RAG chatbots that actually retrieve well, voice agents with real latency budgets,
                and backend APIs that hold up under load.
              </p>
              <p>
                Outside work I go deep on distributed systems, AI agents, and machine learning.
              </p>
            </div>
          </div>
          <div className="about-stack">
            {stackGroups.map((g) => (
              <div key={g.label}>
                <div className="stack-group-label">{g.label}</div>
                <div className="stack-chips">
                  {g.chips.map((c) => (
                    <span className="chip" key={c}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <div id="projects" style={{ paddingTop: "96px" }}>
        <div style={{ padding: "0 48px", textAlign: "left"}}>
          <div className="section-header">
            <span className="section-label">02 — Projects</span>
            <div className="section-line" />
          </div>
          <h2 className="section-title serif" style={{ marginBottom: "40px" }}>
            Things I've<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>actually shipped</em>
          </h2>
        </div>
        <div className="projects-scroll-wrap">
          <div className="projects-track">
            {projects.map((p) => (
              <div className="project-card" key={p.num}>
                <div className="project-num mono">{p.num}</div>
                <div className="project-title serif">{p.title}</div>
                <div className="project-desc">{p.desc}</div>
                <div className="project-tags">
                  {p.tags.map((t) => (
                    <span className="project-tag" key={t}>{t}</span>
                  ))}
                </div>
                <div className="project-links">
                  {p.links.map((l) => (
                    <a className="project-link" href={l.href} key={l.label} target="_blank" rel="noopener noreferrer">
                      <span>{l.label.replace(" →", "")}</span>
                      <span className="project-link-arrow">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPERIENCE */}
      <section id="experience">
        <div className="section-header">
          <span className="section-label">03 — Experience</span>
          <div className="section-line" />
        </div>
        <h2 className="section-title serif" style={{ marginBottom: "40px" }}>
          Where I've<br /><em style={{ fontStyle: "italic", color: "var(--accent)" }}>been building</em>
        </h2>
        <div className="exp-list">
          {experience.map((e) => (
            <div className="exp-item" key={e.role}>
              <div className="exp-meta">
                <div className="exp-period">{e.period}</div>
                {e.url ? (
                  <a className="exp-company" href={e.url} target="_blank" rel="noreferrer">{e.company}</a>
                ) : (
                  <div className="exp-company">{e.company}</div>
                )}
              </div>
              <div>
                <div className="exp-role serif">{e.role}</div>
                <div className="exp-desc">
                  <ul>
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="section-header">
          <span className="section-label">04 — Contact</span>
          <div className="section-line" />
        </div>
        <div className="contact-inner">
          <h2 className="contact-heading serif">
            Let's build<br />something<br /><em>real.</em>
          </h2>
          <div className="contact-links">
            {[
              { icon: "✉", label: "Email", value: "usman_javaid1234@hotmail.com", href: "mailto:usman_javaid1234@hotmail.com" },
              { icon: "in", label: "LinkedIn", value: "linkedin.com/in/usman-javaid", href: "https://www.linkedin.com/in/usman-javaid-35839225b/" },
              { icon: "{}", label: "GitHub", value: "github.com/usman-javaid", href: "https://github.com/Usman-Javaid1234" },
            ].map((c) => (
              <a className="contact-link" href={c.href} key={c.label}>
                <span className="contact-link-icon">{c.icon}</span>
                <div>
                  <div className="contact-link-label">{c.label}</div>
                  <div className="contact-link-value">{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span>© 2026 Usman Javaid</span>
        <span>Built with React · NUST-SEECS</span>
      </footer>
    </>
  );
}