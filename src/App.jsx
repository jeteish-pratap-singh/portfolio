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
        table: {
          headers: ["Attribute", "Value"],
          rows: [
            ["Name", "Jeteish Pratap Singh"],
            ["Role", "Software Engineering Graduate Student"],
            ["Location", "Tempe, Arizona"],
            ["Focus", "Backend, Cloud-native, Distributed Systems"],
            ["Status", "Seeking Software Engineering Opportunities"],
          ],
        },
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
        table: {
          headers: ["Name", "Category", "Details"],
          rows: [
            ["languages.conf", "Languages", "C++, Java, Python, JavaScript"],
            ["backend.svc", "Backend", "REST, Microservices, multithreading, Linux"],
            ["cloud-native.yaml", "Cloud", "Docker, Kubernetes, CI/CD, GitHub Actions"],
            ["ml-models.lib", "ML", "TensorFlow, PyTorch, Scikit-learn"],
            ["tools.env", "Tools", "Git, Microservices, Containerized Workflows"],
          ],
        },
      },
      projects: {
        title: "project index",
        table: {
          headers: ["Name", "Date", "Stack", "Impact"],
          rows: [
            ["distributed-face-recognition", "Sept 2025-Dec 2025", "AWS, Edge, Cloud-native", "Designed distributed cloud-native pipeline"],
            ["software-quality-metrics", "Jan 2025-Apr 2025", "Flask, APIs, GitHub Actions", "Built SaaS backend; reduced feedback 50%"],
            ["virtual-machine", "Oct 2024-Nov 2024", "C++, Systems, I/O", "Built custom VM with instruction decoding"],
          ],
        },
      },
      experience: {
        title: "career log",
        table: {
          headers: ["Name", "Date", "Role", "Impact"],
          rows: [
            ["indovators-internship", "Apr 2023-May 2023", "Software Developer Intern", "Created 200+ test cases; improved stability"],
            ["accessibility-publication", "2025", "Contributing Author", "Studied text summarization for learning"],
          ],
        },
      },
      education: {
        title: "education log",
        table: {
          headers: ["Name", "Date", "Degree", "Location"],
          rows: [
            ["arizona-state-university", "Expected May 2026", "M.S. Software Engineering", "Tempe, AZ"],
            ["amity-university", "June 2024", "B.Tech. Computer Science", "Noida, IN"],
          ],
        },
      },
      stats: {
        title: "developer telemetry",
        table: {
          headers: ["Metric", "Value"],
          rows: [
            ["Education Target", "May 2026"],
            ["Automated Test Cases", "200+ Written"],
            ["Architecture Mentorship", "10+ Teammates"],
            ["Primary Stack", "Backend / Cloud-native / Reliability"],
          ],
        },
      },
      contact: {
        title: "contact payload",
        table: {
          headers: ["Channel", "Endpoint"],
          rows: [
            ["Phone", "602-736-5357"],
            ["Email", "jeteish.pratap@gmail.com"],
            ["LinkedIn", "linkedin.com/in/jeteish-pratap-singh"],
            ["GitHub", "github.com/jeteish-pratap-singh"],
            ["Availability", "Open to SWE Opportunities"],
          ],
        },
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
      setCurrentOutput(commandMap[command].table || commandMap[command].lines);
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
                    <a href="mailto:jeteish.pratap@gmail.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-400 hover:opacity-80">
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

                            <div className={themeClasses.textSoft}>
                              {!Array.isArray(currentOutput) && currentOutput.headers ? (
                                <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-700/50 bg-zinc-900/30 p-2">
                                  <table className="w-full border-collapse font-mono text-xs text-left">
                                    <thead>
                                      <tr className="border-b border-dashed border-zinc-700/50">
                                        {currentOutput.headers.map((h) => (
                                          <th key={h} className="px-3 py-2 font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dashed divide-zinc-700/30">
                                      {currentOutput.rows.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-emerald-400/5 transition-colors">
                                          {row.map((cell, i) => (
                                            <td key={i} className="px-3 py-2 align-top">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="space-y-1 whitespace-pre-wrap break-words">
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
                              )}
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
