import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Moon,
  Sun,
  TerminalSquare,
} from "lucide-react";

export default function PortfolioTemplate() {
  const [theme, setTheme] = useState("dark");
  const [hasBooted, setHasBooted] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [currentOutput, setCurrentOutput] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("shell");
  const [suggestedCommand, setSuggestedCommand] = useState("help");
  const [commandIndex, setCommandIndex] = useState(0);
  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  const commandMap = useMemo(function createCommandMap() {
    return {
      help: {
        title: "command registry",
        lines: [
          "Available commands:",
          "",
          "help                show available commands",
          "whoami              show quick introduction",
          "about               show detailed profile",
          "skills              list technical strengths",
          "projects            list featured projects",
          "experience          show career history",
          "education           show academic background",
          "stats               show engineering telemetry",
          "contact             show contact payload",
          "resume              open resume path",
          "linkedin            open LinkedIn profile",
          "clear               clear terminal output",
        ],
      },
      whoami: {
        title: "identity",
        lines: [
          "Jeteish Pratap Singh",
          "Software Engineering Graduate Student",
          "Tempe, Arizona",
          "",
          "Backend and cloud-native systems focused engineer building distributed services,",
          "microservice platforms, and reliability-oriented backend infrastructure.",
          "",
          "status: seeking software engineering opportunities",
        ],
      },
      about: {
        title: "about module",
        lines: [
          "Software engineering graduate student specializing in backend and cloud-native systems.",
          "",
          "Experienced in designing scalable customer-facing SaaS services, distributed microservices,",
          "and reliability-focused backend platforms. Strong in C++, Java, and Python with hands-on",
          "ownership of service debugging, CI/CD automation, and cross-team integration.",
        ],
      },
      skills: {
        title: "skills inventory",
        lines: [
          "languages: C++, C, C#, Java, Python, JavaScript",
          "backend: REST APIs, microservices, multithreading, Linux, memory management",
          "cloud: Docker, Kubernetes, CI/CD, cloud-native services",
          "ml: TensorFlow, PyTorch, Scikit-learn",
          "focus: distributed systems, backend reliability, event-driven pipelines",
        ],
      },
      projects: {
        title: "project index",
        lines: [
          "[01] Distributed Face Recognition Pipeline (AWS Edge & Cloud)",
          "     stack: AWS, edge systems, containerized microservices, cloud services",
          "     impact: built a distributed cloud-native pipeline for real-time inference workloads",
          "",
          "[02] Software Quality Metrics Platform",
          "     stack: Flask, REST APIs, GitHub Actions, microservices",
          "     impact: reduced build and test feedback time by 50% and improved team onboarding",
          "",
          "[03] Virtual Machine",
          "     stack: low-level systems, instruction decoding, memory access, I/O operations",
          "     impact: improved runtime correctness, stability, and fault handling",
        ],
      },
      experience: {
        title: "career log",
        lines: [
          "[internship] Software Developer Intern @ Indovators Technologies Pvt. Ltd.",
          "- designed and customized application modules aligned to client requirements",
          "- created and executed 200+ automated test cases for feature compliance and software quality",
          "- collaborated cross-functionally to debug backend issues and improve stability and delivery",
          "",
          "[publication] Contributing Author",
          "- Analyzing Accessible Learning Using Summarization for Communities",
          "- studied summarization techniques for accessible digital learning environments",
        ],
      },
      education: {
        title: "education log",
        lines: [
          "M.S. in Software Engineering",
          "Arizona State University",
          "Expected: May 2026",
          "",
          "B.Tech. in Computer Science Engineering",
          "Amity University",
          "Graduated: June 2024",
        ],
      },
      stats: {
        title: "developer telemetry",
        lines: [
          "education_target=May 2026",
          "test_cases_written=200+",
          "build_feedback_improvement=50%",
          "architecture_walkthroughs=10+ teammates",
          "core_focus=backend + cloud-native systems + distributed services",
        ],
      },
      contact: {
        title: "contact payload",
        lines: [
          "{",
          '  "phone": "602-736-5357",',
          '  "email": "jeteish.pratap@gmail.com",',
          '  "linkedin": "https://www.linkedin.com/in/jeteish-pratap-singh",',
          '  "resume": "/resume.pdf",',
          '  "availability": "Open to software engineering opportunities"',
          "}",
        ],
      },
      resume: {
        title: "resume path",
        lines: [
          "resume available at:",
          "/resume.pdf",
          "",
          "Use the resume button in the header to download.",
        ],
      },
      linkedin: {
        title: "external profile",
        lines: [
          "LinkedIn:",
          "https://www.linkedin.com/in/jeteish-pratap-singh",
        ],
      },
    };
  }, []);

  const quickCommands = [
    "help",
    "whoami",
    "about",
    "skills",
    "projects",
    "experience",
    "education",
    "stats",
    "contact",
    "resume",
  ];

  useEffect(function bindNavigationKeys() {
    function onKeyDown(e) {
      if (!hasBooted) return;
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea";

      if (e.key === "ArrowDown" && !isTyping) {
        e.preventDefault();
        setCommandIndex(function updateIndex(prev) {
          return (prev + 1) % quickCommands.length;
        });
      }

      if (e.key === "ArrowUp" && !isTyping) {
        e.preventDefault();
        setCommandIndex(function updateIndex(prev) {
          return (prev - 1 + quickCommands.length) % quickCommands.length;
        });
      }

      if (e.key === "Tab" && !isTyping) {
        e.preventDefault();
        setInput(quickCommands[commandIndex]);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }

      if (e.key === "Enter" && !isTyping) {
        e.preventDefault();
        runCommand(quickCommands[commandIndex]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return function cleanup() {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hasBooted, commandIndex, quickCommands]);

  useEffect(function loadTheme() {
    const storedTheme = typeof window !== "undefined"
      ? localStorage.getItem("terminal-portfolio-theme")
      : null;
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(function persistTheme() {
    if (typeof window !== "undefined") {
      localStorage.setItem("terminal-portfolio-theme", theme);
    }
  }, [theme]);

  useEffect(function bootTerminal() {
    const sequence = [
      "$ boot portfolio.system",
      "> loading shell",
      "> loading profile",
      "> loading command registry",
      "> ready",
    ];

    if (!hasBooted) {
      let i = 0;
      const interval = setInterval(function appendBootLine() {
        setBootLines(function updateBootLines(prev) {
          return prev.concat(sequence[i]);
        });
        i += 1;
        if (i >= sequence.length) {
          clearInterval(interval);
          setHasBooted(true);
          setHistory(["$ help"]);
          setCurrentTitle(commandMap.help.title);
          setCurrentOutput(commandMap.help.lines);
          setSuggestedCommand("help");
        }
      }, 220);
      return function cleanup() {
        clearInterval(interval);
      };
    }
    return undefined;
  }, [hasBooted, commandMap]);

  useEffect(function scrollTerminal() {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [bootLines, history, currentOutput]);

  useEffect(function focusInputAfterBoot() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasBooted]);

  function runCommand(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    if (command === "clear") {
      setHistory([]);
      setCurrentTitle("shell cleared");
      setCurrentOutput(["Terminal output cleared.", "Type 'help' to view commands."]);
      setSuggestedCommand("help");
      setInput("");
      return;
    }

    if (commandMap[command]) {
      setHistory(function updateHistory(prev) {
        return prev.concat(`$ ${command}`).slice(-18);
      });
      setCurrentTitle(commandMap[command].title);
      setCurrentOutput(commandMap[command].lines);
      setSuggestedCommand(command);
      setInput("");
      return;
    }

    setHistory(function updateHistory(prev) {
      return prev.concat(`$ ${command}`).slice(-18);
    });
    setCurrentTitle("command error");
    setCurrentOutput([
      `Command not found: ${command}`,
      "",
      "Type 'help' to view available commands.",
    ]);
    setSuggestedCommand("help");
    setInput("");
  }

  const isDark = theme === "dark";

  const themeClasses = isDark
    ? {
        shell: "bg-zinc-950 text-zinc-100",
        pageGlowA: "bg-emerald-500/10",
        pageGlowB: "bg-cyan-500/10",
        nav: "border-zinc-800 bg-zinc-950/85",
        terminalFrame: "border-zinc-800 bg-zinc-900/95 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_30px_120px_rgba(0,0,0,0.55)]",
        terminalPanel: "border-zinc-800 bg-zinc-950/80",
        sidebar: "border-zinc-800 bg-zinc-900/80",
        textPrimary: "text-zinc-100",
        textSoft: "text-zinc-300",
        textMuted: "text-zinc-500",
        accent: "text-emerald-400",
        accentBg: "bg-emerald-400/10",
        accentBorder: "border-emerald-400/20",
        button: "border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-100",
        selectionLine: "text-zinc-300",
      }
    : {
        shell: "bg-stone-100 text-zinc-950",
        pageGlowA: "bg-emerald-400/10",
        pageGlowB: "bg-cyan-400/10",
        nav: "border-zinc-200 bg-white/85",
        terminalFrame: "border-zinc-200 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_30px_120px_rgba(0,0,0,0.14)]",
        terminalPanel: "border-zinc-200 bg-zinc-50",
        sidebar: "border-zinc-200 bg-white/85",
        textPrimary: "text-zinc-950",
        textSoft: "text-zinc-700",
        textMuted: "text-zinc-500",
        accent: "text-emerald-700",
        accentBg: "bg-emerald-50",
        accentBorder: "border-emerald-200",
        button: "border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-950",
        selectionLine: "text-zinc-700",
      };

  return (
    <div className={"min-h-screen overflow-hidden transition-colors duration-300 " + themeClasses.shell}>
      <style>{`
        html { scroll-behavior: smooth; }
        .terminal-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .crt::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent 3px, transparent 6px);
          background-size: 100% 6px;
          opacity: 0.18;
          pointer-events: none;
        }
        .crt::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.15) 100%);
          pointer-events: none;
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 0.7ch;
          animation: blink 1s step-end infinite;
        }
      `}</style>

      <div className="relative min-h-screen">
        <div className={"absolute -left-20 top-16 h-72 w-72 rounded-full blur-3xl " + themeClasses.pageGlowA} />
        <div className={"absolute right-0 top-28 h-80 w-80 rounded-full blur-3xl " + themeClasses.pageGlowB} />
        <div className="absolute inset-0 terminal-grid opacity-40" />

        <header className={"sticky top-0 z-40 border-b backdrop-blur-xl " + themeClasses.nav}>
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className={"rounded-xl border p-2 " + themeClasses.accentBorder + " " + themeClasses.accentBg}>
                <TerminalSquare className={"h-4 w-4 " + themeClasses.accent} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-400">Jeteish Pratap Singh</p>
                <p className={"text-sm " + themeClasses.textMuted}>developer shell</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/resume.pdf"
                download
                className={"inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition " + themeClasses.button}
              >
                <Download className="h-4 w-4" /> Resume
              </a>
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={function toggleTheme() {
                  setTheme(isDark ? "light" : "dark");
                }}
                className={"rounded-xl border p-2 transition " + themeClasses.button}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          <div className={"rounded-[28px] border " + themeClasses.terminalFrame}>
            <div className="flex items-center justify-between border-b border-inherit px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className={"font-mono text-xs " + themeClasses.textMuted}>jeteish@portfolio:~</div>
              <div className={"text-xs " + themeClasses.textMuted}>interactive shell v2.0</div>
            </div>

            <div className="grid min-h-[78vh] lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className={"border-b p-4 lg:border-b-0 lg:border-r " + themeClasses.sidebar}>
                <div className={"rounded-2xl border p-4 " + themeClasses.terminalPanel}>
                  <p className={"font-mono text-xs uppercase tracking-[0.2em] " + themeClasses.textMuted}>
                    quick commands
                  </p>
                  <div className="mt-4 font-mono text-sm leading-7">
                    <div className={themeClasses.textMuted}>Use arrow keys to navigate, Enter to run, Tab to stage.</div>
                    <div className="mt-3 space-y-1">
                      {quickCommands.map(function renderCommand(command, index) {
                        const isActive = index === commandIndex;
                        return (
                          <div
                            key={command}
                            onMouseEnter={function onHover() {
                              setCommandIndex(index);
                            }}
                            onClick={function onClickCommand() {
                              runCommand(command);
                            }}
                            className={"cursor-pointer select-none " + themeClasses.selectionLine}
                          >
                            <span className="mr-2 text-zinc-500">{isActive ? ">" : " "}</span>
                            <span className={isActive ? "text-emerald-400" : ""}>{command}</span>
                            {isActive ? <span className="ml-2 text-zinc-500">[enter]</span> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={"mt-4 rounded-2xl border p-4 " + themeClasses.terminalPanel}>
                  <p className={"font-mono text-xs uppercase tracking-[0.2em] " + themeClasses.textMuted}>
                    identity
                  </p>
                  <div className="mt-3 space-y-2 font-mono text-sm">
                    <div><span className="text-emerald-400">name</span>: Jeteish Pratap Singh</div>
                    <div><span className="text-emerald-400">role</span>: Software Engineering Graduate Student</div>
                    <div><span className="text-emerald-400">location</span>: Tempe, Arizona</div>
                    <div><span className="text-emerald-400">focus</span>: backend / cloud-native / distributed systems</div>
                  </div>
                </div>

                <div className={"mt-4 rounded-2xl border p-4 " + themeClasses.terminalPanel}>
                  <p className={"font-mono text-xs uppercase tracking-[0.2em] " + themeClasses.textMuted}>
                    external
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <a href="mailto:jeteish.pratap@gmail.com" target="_blank" rel="noopener noreferrer"className="inline-flex items-center gap-2 text-emerald-400 hover:opacity-80">
                      <Mail className="h-4 w-4" /> Email <ExternalLink className="h-4 w-4" />
                    </a>
                    <a href="https://github.com/jeteish-pratap-singh" className="inline-flex items-center gap-2 text-emerald-400 hover:opacity-80">
                      <Github className="h-4 w-4" /> GitHub <ExternalLink className="h-4 w-4" />
                    </a>
                    <a href="https://www.linkedin.com/in/jeteish-pratap-singh" className="inline-flex items-center gap-2 text-emerald-400 hover:opacity-80">
                      <Linkedin className="h-4 w-4" /> LinkedIn <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </aside>

              <section className="relative p-4 sm:p-5 lg:p-6">
                <div className={"crt relative h-full rounded-2xl border " + themeClasses.terminalPanel}>
                  <div className="flex h-full flex-col p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3 border-b border-dashed border-zinc-700/50 pb-3">
                      <div>
                        <p className={"font-mono text-xs uppercase tracking-[0.22em] " + themeClasses.textMuted}>
                          current module
                        </p>
                        <div className={"mt-2 rounded-xl border px-3 py-2 font-mono text-xs " + themeClasses.accentBorder + " " + themeClasses.accentBg + " " + themeClasses.accent}>
                          {currentTitle}
                        </div>
                      </div>
                      <div className={"font-mono text-xs " + themeClasses.textMuted}>
                        suggested: {suggestedCommand}
                      </div>
                    </div>

                    <div ref={terminalBodyRef} className="min-h-0 flex-1 overflow-auto pr-2 font-mono text-sm leading-7">
                      {!hasBooted ? (
                        <div className={themeClasses.textMuted}>
                          {bootLines.map(function renderBootLine(line, index) {
                            return <div key={line + "-" + index}>{line}</div>;
                          })}
                        </div>
                      ) : (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentTitle + "-" + history.join("|")}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={"mb-5 " + themeClasses.textMuted}>
                              {history.map(function renderHistory(entry, index) {
                                return <div key={entry + "-" + index}>{entry}</div>;
                              })}
                            </div>

                            <div className={"mb-3 " + themeClasses.textPrimary}>
                              <span className="text-emerald-400">&gt;</span> output
                            </div>

                            <div className={"space-y-1 whitespace-pre-wrap break-words " + themeClasses.textSoft}>
                              {currentOutput.map(function renderOutputLine(line, index) {
                                return (
                                  <motion.div
                                    key={currentTitle + "-" + index + "-" + line}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                  >
                                    {line || " "}
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      )}
                    </div>

                    <form
                      onSubmit={function onSubmit(e) {
                        e.preventDefault();
                        runCommand(input);
                      }}
                      className="mt-4 border-t border-dashed border-zinc-700/50 pt-4"
                    >
                      <label className="sr-only" htmlFor="terminal-input">
                        Terminal input
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-zinc-700/60 bg-zinc-950/60 px-4 py-3">
                        <span className="font-mono text-emerald-400">jeteish@portfolio:~$</span>
                        <input
                          id="terminal-input"
                          ref={inputRef}
                          value={input}
                          onChange={function onChange(e) {
                            setInput(e.target.value);
                          }}
                          placeholder="type a command, e.g. help"
                          className="w-full bg-transparent font-mono text-sm outline-none placeholder:text-zinc-500"
                          autoComplete="off"
                          spellCheck={false}
                        />
                        <span className="cursor font-mono text-emerald-400">|</span>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
