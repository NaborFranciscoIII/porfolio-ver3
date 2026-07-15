import { type ReactNode } from "react";
import { useApp, Role } from "@/context/PortfolioContext";
import { useNavigate } from "react-router-dom";
import { 
  Monitor, Headset, Briefcase, ChevronRight, 
  FileText, Table, Presentation, Network, Code2 
} from "lucide-react";

const ROLE_OPTIONS: { id: Role; label: string; icon: ReactNode; desc: string }[] = [
  { id: "tech", label: "Tech", icon: <Monitor size={15} />, desc: "Developer & Engineer" },
  { id: "va", label: "Virtual Assistant", icon: <Headset size={15} />, desc: "Remote Support" },
  { id: "admin-role", label: "Administrative", icon: <Briefcase size={15} />, desc: "Operations & Admin" },
];

// ─── Smart Icon Resolver ──────────────────────────────────────────────────────
const getIconForSkill = (name: string) => {
  // 1. Check for Devicon brand logos 
  const devicons: Record<string, string> = {
    "Python": "devicon-python-plain colored",
    "Java": "devicon-java-plain colored",
    "C++": "devicon-cplusplus-plain colored",
    "HTML": "devicon-html5-plain colored",
    "CSS": "devicon-css3-plain colored",
    "JavaScript": "devicon-javascript-plain colored",
    "TypeScript": "devicon-typescript-plain colored", // <-- New!
    "React": "devicon-react-original colored",        // <-- New!
    "Tailwind CSS": "devicon-tailwindcss-original colored", // <-- New!
    "MySQL / SQLite": "devicon-mysql-plain colored",
    "Laravel": "devicon-laravel-original colored",
    "PHP": "devicon-php-plain colored",
    "Git": "devicon-git-plain colored",
    "Visual Studio Code": "devicon-vscode-plain colored",
  };

  if (devicons[name]) {
    return <i className={`${devicons[name]} text-lg drop-shadow-sm`} />;
  }

  // 2. Fallbacks for proprietary software using Lucide icons
  const fallbacks: Record<string, ReactNode> = {
    "MS Word": <FileText size={18} className="text-blue-500" />,
    "MS Excel": <Table size={18} className="text-green-600" />,
    "MS PowerPoint": <Presentation size={18} className="text-orange-500" />,
    "Cisco Packet Tracer": <Network size={18} className="text-cyan-500" />,
  };

  return fallbacks[name] || <Code2 size={18} className="text-muted-foreground" />;
};

function SkillItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 py-1.5 group">
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
        {getIconForSkill(name)}
      </div>
      <span className="text-sm text-foreground group-hover:text-primary transition-colors">{name}</span>
    </div>
  );
}

function SkillBox({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300">
      <p className="font-mono text-xs font-semibold text-primary tracking-widest uppercase mb-4">{title}</p>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <SkillItem key={item} name={item} />
        ))}
      </div>
    </div>
  );
}

function CategorySkillBox({ name, skills }: { name: string; skills: string[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300">
      <p className="font-mono text-xs font-semibold text-primary tracking-widest uppercase mb-4">{name}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground border border-border"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { role, setRole, data } = useApp();
  const routerNavigate = useNavigate(); // Hooked up the real router!
  const { home } = data;

  return (
    <div className="pt-16 min-h-screen">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        {/* Role toggle */}
        <div className="flex items-center gap-1 mb-14 p-1 bg-card border border-border rounded-xl w-fit shadow-sm">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setRole(opt.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                role === opt.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_12px_var(--glow)]"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Introduction */}
        <section className="mb-20">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-4">INTRODUCTION</p>

          <div className="flex flex-col-reverse md:flex-row md:items-start gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Hello, I&apos;m{" "}
                <span
                  className="underline decoration-primary underline-offset-4"
                  style={{ textShadow: "0 0 30px var(--glow)" }}
                >
                  {home.name}
                </span>
              </h1>

              {role === "tech" && (
                <>
                  <p className="text-muted-foreground leading-relaxed mb-4">{home.intro1}</p>
                  <p className="text-muted-foreground leading-relaxed">{home.intro2}</p>
                </>
              )}

              {role === "va" && (
                <>
                  <p className="text-muted-foreground leading-relaxed mb-4">{home.vaIntro1}</p>
                  <p className="text-muted-foreground leading-relaxed">{home.vaIntro2}</p>
                </>
              )}

              {role === "admin-role" && (
                <>
                  <p className="text-muted-foreground leading-relaxed mb-4">{home.adminIntro1}</p>
                  <p className="text-muted-foreground leading-relaxed">{home.adminIntro2}</p>
                </>
              )}
            </div>

            {/* Profile photo */}
            <div className="flex-shrink-0 flex justify-center md:justify-end">
              <div
                className="w-44 h-52 md:w-52 md:h-64 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_var(--glow)] relative group"
                style={{ background: "var(--card)" }}
              >
                {/* Dynamically loads from your Supabase URL! */}
                {home.profilePhotoUrl ? (
                  <img src={home.profilePhotoUrl} 
                    alt={`${home.name} - Profile Photo`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-muted">
                    <div
                      className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center text-2xl font-bold text-primary"
                      style={{ boxShadow: "0 0 20px var(--glow)" }}
                    >
                      {home.name.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">Profile Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Skills section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              {role === "tech" ? "TECHNICAL MATRIX" : role === "va" ? "VIRTUAL ASSISTANT SKILLS" : "ADMINISTRATIVE SKILLS"}
            </p>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>

          {role === "tech" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SkillBox title="Software" items={home.techSkills.software} />
              <SkillBox title="Languages" items={home.techSkills.languages} />
              <SkillBox title="Frontend" items={home.techSkills.frontend} />
              <SkillBox title="Backend" items={home.techSkills.backend} />
            </div>
          )}

          {role === "va" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {home.vaSkills.map((cat) => (
                <CategorySkillBox key={cat.name} name={cat.name} skills={cat.skills} />
              ))}
            </div>
          )}

          {role === "admin-role" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {home.adminRoleSkills.map((cat) => (
                <CategorySkillBox key={cat.name} name={cat.name} skills={cat.skills} />
              ))}
            </div>
          )}
        </section>

        {/* CTA strip */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => routerNavigate("/projects")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-all shadow-[0_0_16px_var(--glow)] w-full sm:w-auto"
          >
            View Projects <ChevronRight size={16} />
          </button>
          <button
            onClick={() => routerNavigate("/contact")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-medium text-sm hover:border-primary/40 transition-all w-full sm:w-auto"
          >
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  );
}