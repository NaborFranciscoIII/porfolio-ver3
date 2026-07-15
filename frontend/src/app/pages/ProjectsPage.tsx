import { useApp, Project } from "@/context/PortfolioContext";
import { FolderGit2, Github } from "lucide-react";

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

      {/* 4. The Media Display (Dynamic Carousel) */}
      <div className="w-full mt-1 mb-5">
        {project.imageUrls && project.imageUrls.length > 0 ? (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 no-scrollbar">
            {project.imageUrls.map((url, idx) => (
              <div
                key={`${project.id}-${idx}`}
                className="w-full sm:w-[85%] flex-shrink-0 snap-center p-2 bg-muted/20 border border-border rounded-3xl backdrop-blur-sm group-hover:border-primary/40 transition-colors duration-300"
              >
                <img
                  src={url}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-48 md:h-64 bg-muted/10 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted-foreground backdrop-blur-sm">
            <FolderGit2 size={40} className="mb-3 opacity-30" />
            <span className="font-mono text-xs tracking-widest uppercase opacity-50">Media Pending</span>
          </div>
        )}
      </div>

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