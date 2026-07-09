import { useApp, Project } from "@/context/PortfolioContext";
import { Github } from "lucide-react";

// ─── Reusable Project Card Component ──────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/40 hover:shadow-[0_0_30px_var(--glow)] transition-all duration-300 group h-full">
      
      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
        {project.title}
      </h3>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span key={tag} className="px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-xs font-medium">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
        {project.description}
      </p>

      {/* Repository Link */}
      {project.repoUrl && project.repoUrl !== "#" && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mt-auto w-fit"
        >
          <Github size={16} /> View Repository
        </a>
      )}
    </div>
  );
}

// ─── Main Page Layout ─────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { data } = useApp();
  const { milestones, explorations } = data.projects;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-4">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Featured Work</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            A collection of my academic milestones, full-stack developments, and personal explorations in software engineering and systems architecture.
          </p>
        </div>

        {/* Milestones Section */}
        {milestones.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-semibold tracking-wide">Work & Academic Milestones</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Explorations Section */}
        {explorations.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-semibold tracking-wide">Personal Explorations & Tools</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {explorations.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}