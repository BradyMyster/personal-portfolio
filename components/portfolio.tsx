"use client";

import { useEffect } from "react";

import ContactForm from "./contact-form";

function loadParticlesScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject();
    if ((window as any).particlesJS) return resolve();
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

export default function Portfolio() {
  useEffect(() => {
    let particlesInitialized = false;
    loadParticlesScript()
      .then(() => {
        if (
          typeof window !== "undefined" &&
          (window as any).particlesJS &&
          !particlesInitialized
        ) {
          (window as any).particlesJS("particles-js", {
            particles: {
              number: { value: 80, density: { enable: true, value_area: 800 } },
              color: { value: "#00ffcc" },
              shape: { type: "circle" },
              opacity: { value: 0.5, random: false },
              size: { value: 3, random: true },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#00ffcc",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 6,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true,
              },
            },
            retina_detect: true,
          });
          particlesInitialized = true;
        }
      })
      .catch(() => {
        /* fail silently */
      });

    // Mobile menu toggle
    const hamburger = document.getElementById("hamb-menu");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
      });
    }

    // Close mobile menu when clicking on a link
    if (navMenu) {
      navMenu.addEventListener("click", (e) => {
        if ((e.target as HTMLElement).tagName === "A") {
          if (hamburger) hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document
      .querySelectorAll(".skill, .project, .timeline-item, .stat-box")
      .forEach((el) => {
        observer.observe(el);
      });

    // Add some dynamic effects
    document.addEventListener("mousemove", (e) => {
      const cursor = document.querySelector(".cursor") as HTMLElement | null;
      if (cursor) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      }
    });

    // Animate stats on scroll
    const animateStats = () => {
      const statsSection = document.getElementById("skills");
      if (!statsSection) return;
      const rect = statsSection.getBoundingClientRect();

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        document.querySelectorAll(".stat-number").forEach((stat, index) => {
          setTimeout(() => {
            (stat as HTMLElement).style.animation = "none";
            (stat as HTMLElement).offsetHeight; // Trigger reflow
            (stat as HTMLElement).style.animation = "pulse 1s ease-in-out";
          }, index * 200);
        });
      }
    };

    window.addEventListener("scroll", animateStats);
  }, []);

  return (
    <>
      <header>
        <div className="logo">
          DEV<span>ROCKSTAR</span>
        </div>
        <nav id="nav-menu" className="nav-menu">
          <ul>
            <li>
              <a href="#hero">Home</a>
            </li>
            <li>
              <a href="#skills">Skills</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
        <div id="hamb-menu" className="hamb-menu">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </header>
      <section id="hero">
        <div id="particles-js"></div>
        <div className="hero-content">
          <h1 className="hero-title typing-text">Quinten Brady</h1>
          <p className="hero-subtitle">
            Full Stack Developer & Software Architect with a passion for
            building scalable, elegant solutions to complex problems.
          </p>
          <a href="#projects" className="cta-btn">
            See My Work
          </a>
        </div>
      </section>
      <section id="skills">
        <h2 className="section-title">Technical Arsenal</h2>
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-number">19+</div>
            <div className="stat-title">Years Experience</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">50+</div>
            <div className="stat-title">Projects Completed</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">25+</div>
            <div className="stat-title">Happy Clients</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">12+</div>
            <div className="stat-title">Technologies Mastered</div>
          </div>
        </div>
        <div className="skills-container">
          <div className="skill">
            <h3>Frontend Development</h3>
            <p>
              React, Vue.js, Angular, JavaScript, TypeScript, HTML5, CSS3, SASS, Tailwind
            </p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "95%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
          <div className="skill">
            <h3>Backend Development</h3>
            <p>Node.js, Express, .NET Core, Ruby on Rails, PHP, Go, NestJS, C++</p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "90%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
          <div className="skill">
            <h3>Database Systems</h3>
            <p>
              MS SQL Server, MongoDB, PostgreSQL, MySQL, Redis, 
              GraphQL
            </p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "85%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
          <div className="skill">
            <h3>DevOps & Cloud</h3>
            <p>
              Azure, AWS, GCP, Docker, Kubernetes, CI/CD, Jenkins, GitHub Actions,
              Terraform
            </p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "80%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
          <div className="skill">
            <h3>Mobile Development</h3>
            <p>React Native, Iconic, Flutter, Swift, Kotlin</p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "75%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
          <div className="skill">
            <h3>Machine Learning & AI</h3>
            <p>
              TensorFlow, PyTorch, Scikit-learn, Natural Language Processing
            </p>
            <div className="skill-level">
              <span
                style={{ "--skill-width": "70%" } as React.CSSProperties}
              ></span>
            </div>
          </div>
        </div>
      </section>
      <section id="projects">
        <h2 className="section-title">Featured Projects</h2>
        <div className="project-container">
          <div className="project">
            <a
              href="https://github.com/BradyMyster/personal-portfolio"
              aria-label="Source Code For Personal Portfolio Website"
            >
              <div className="project-img">🚀</div>
              <div className="project-content">
                <h3 className="project-title">Portfolio Website</h3>
                <p>
                  A personal portfolio website showcasing my projects, skills,
                  and experience.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">Next.js</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">CSS3</span>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a
              href="https://github.com/BradyMyster/send-secure-email"
              aria-label="Source Code For Azure Function to Send Secure Email"
            >
              <div className="project-img">&#9993;</div>
              <div className="project-content">
                <h3 className="project-title">Send Secure Email</h3>
                <p>
                  A Secure Azure Function for sending emails with multiple
                  layers of security protection.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">C#</span>
                  <span className="tech-tag">.NET 8</span>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a
              href="https://github.com/BradyMyster/task-manager"
              aria-label="Source Code For A Task Manager Application"
            >
              <div className="project-img">&#9874;</div>
              <div className="project-content">
                <h3 className="project-title">Task Manager Application</h3>
                <p>
                  A complete task management solution with create, read, and
                  update operations, modern UI with Adobe React Spectrum, and
                  enterprise-grade security features.
                </p>
                <div className="project-tech">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">Relay(GraphQL)</span>
                  <span className="tech-tag">C#</span>
                  <span className="tech-tag">Hot Chocolate (GraphQL)</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section id="experience">
        <h2 className="section-title">Professional Journey</h2>
        <div className="experience-timeline">
          <div className="timeline-line"></div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">2012 - 2025</div>
              <h3>Senior Full Software Engineer</h3>
              <h4>Modere</h4>
              <p>
                Led full-stack development projects with globally dispersed
                teams for an international ecommerce company, creating and
                maintaining robust, user-friendly technical solutions and
                features across multiple markets.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">2012 - 2010</div>
              <h3>Lead Developer</h3>
              <h4>Ipayables</h4>
              <p>
                Directed a development team in creating enterprise-level
                financial processing solutions for international clients.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <div className="timeline-date">2006 - 2010</div>
              <h3>Programmer Analyst II</h3>
              <h4>University of California of Riverside</h4>
              <p>
                Developed and maintained educational technology systems for
                faculty and staff use.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
      <footer>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/qbrady/" className="social-link">
            in
          </a>
          <a href="https://github.com/BradyMyster" className="social-link">
            gh
          </a>          
        </div>
        <p>&copy; 2025 Quinten Brady. All rights reserved.</p>
      </footer>
      <div id="back-to-top">↑</div>
    </>
  );
}
