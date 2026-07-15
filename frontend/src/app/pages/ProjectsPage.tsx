import { useRef, useState } from "react";
import { useApp, Project } from "@/context/PortfolioContext";
import { ChevronLeft, ChevronRight, Github, ImageIcon, X } from "lucide-react";

// ─── Interactive Node Component ───────────────────────────────────────────────
function ProjectNode({ project, index }: { project: Project; index: number }) {
  const [showMedia, setShowMedia] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  const isEven = index % 2 === 0;
  const hasMedia = project.imageUrls && project.imageUrls.length > 0;

  const scrollToIndex = (targetIndex: number) => {
    if (!mediaRef.current) return;

    const target = mediaRef.current.children[targetIndex] as HTMLElement | undefined;
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActiveIndex(targetIndex);
  };

  const scrollMedia = (direction: "left" | "right") => {
    if (!mediaRef.current) return;

    const amount = mediaRef.current.clientWidth * 0.9;
    mediaRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });

    const nextIndex = direction === "left"
      ? Math.max(activeIndex - 1, 0)
      : Math.min(activeIndex + 1, project.imageUrls.length - 1);

    setActiveIndex(nextIndex);
  };

  const handleMediaScroll = () => {
    if (!mediaRef.current) return;

    const firstChild = mediaRef.current.children[0] as HTMLElement | undefined;
    if (!firstChild) return;

    const step = firstChild.offsetWidth + 16;
    const nextIndex = Math.round(mediaRef.current.scrollLeft / step);
    setActiveIndex(Math.min(Math.max(nextIndex, 0), project.imageUrls.length - 1));
  };

  return (
    <div className={`relative flex flex-col md:flex-row ${isEven ? "" : "md:flex-row-reverse"} items-center justify-between w-full my-16 md:my-24 group`}>
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full z-10 shadow-[0_0_15px_var(--glow)]" />

      {showMedia && (
        <div className="hidden md:block absolute top-1/2 left-0 w-full border-t-2 border-dashed border-primary/40 -z-10 animate-pulse" />
      )}

      <div className="w-full md:w-[45%] bg-card border border-border p-6 md:p-8 rounded-3xl shadow-[0_0_30px_var(--glow)] z-10 hover:border-primary/40 transition-colors duration-300 flex flex-col h-full">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">{project.title}</h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">{project.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 gap-3">
          {project.repoUrl && project.repoUrl !== "#" ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={18} /> Source Code
            </a>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground/40 cursor-not-allowed">
              <Github size={18} /> Unavailable
            </div>
          )}

          {hasMedia && (
            <button
              onClick={() => setShowMedia(!showMedia)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showMedia
                  ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
                  : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              }`}
            >
              {showMedia ? (
                <>
                  <X size={16} /> Close Media
                </>
              ) : (
                <>
                  <ImageIcon size={16} /> View Media
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        className={`w-full md:w-[45%] mt-8 md:mt-0 z-10 transition-all duration-500 origin-center ${
          showMedia ? "opacity-100 scale-100" : "opacity-0 scale-95 hidden md:block md:pointer-events-none"
        }`}
      >
        {showMedia && (
          <div className="relative">
            {project.imageUrls.length > 1 && (
              <div className="absolute -top-4 right-0 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={() => scrollMedia("left")}
                  className="rounded-full border border-border bg-card/90 p-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  aria-label="Previous media"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollMedia("right")}
                  className="rounded-full border border-border bg-card/90 p-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                  aria-label="Next media"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            <div
              ref={mediaRef}
              onScroll={handleMediaScroll}
              className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 no-scrollbar scroll-smooth"
            >
              {project.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="w-[92%] sm:w-[88%] md:w-[90%] flex-shrink-0 snap-center p-2 bg-muted/20 border border-border rounded-3xl backdrop-blur-sm"
                >
                  <div className="overflow-hidden rounded-2xl bg-background/40">
                    <img
                      src={url}
                      alt={`${project.title} media ${idx + 1}`}
                      className="w-full h-auto max-h-[28rem] object-contain rounded-2xl shadow-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {project.imageUrls.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {project.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === idx ? "w-6 bg-primary" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"
                    }`}
                    aria-label={`Go to media ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page Layout ─────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { data } = useApp();
  const { milestones, explorations } = data.projects;

  return (
    <div className="pt-16 min-h-screen overflow-x-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-4">Architecture</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Engineered Systems</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mx-auto md:mx-0">
            Mapping out the architecture, workflows, and frontend interfaces of my recent deployments and academic prototypes.
          </p>
        </div>

        {milestones.length > 0 && (
          <section className="mb-24 md:mb-32 relative">
            <div className="flex items-center gap-4 mb-8 md:mb-16">
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Academic Milestones</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>

            <div className="flex flex-col">
              {milestones.map((project, index) => (
                <ProjectNode key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}

        {explorations.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-4 mb-8 md:mb-16">
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Personal Explorations</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>

            <div className="flex flex-col">
              {explorations.map((project, index) => (
                <ProjectNode key={project.id} project={project} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}