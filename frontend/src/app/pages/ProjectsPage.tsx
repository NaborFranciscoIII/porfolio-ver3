import { useState } from "react";
import { useApp, Project } from "@/context/PortfolioContext";
import { Github, ImageIcon, X, ZoomIn } from "lucide-react";

// ─── Interactive Node Component ───────────────────────────────────────────────
function ProjectNode({ project, index, onImageClick }: { project: Project; index: number; onImageClick: (url: string) => void }) {
  const [showMedia, setShowMedia] = useState(false);
  
  const isEven = index % 2 === 0;
  const hasMedia = project.imageUrls && project.imageUrls.length > 0;

  return (
    <div className={`relative flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'} items-center justify-between w-full my-16 md:my-24 group`}>
      
      {/* The Central Node Dot (Desktop Only) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full z-10 shadow-[0_0_15px_var(--glow)]" />

      {/* The Connecting Data Wire */}
      {showMedia && (
        <div className="hidden md:block absolute top-1/2 left-0 w-full border-t-2 border-dashed border-primary/40 -z-10 animate-pulse" />
      )}

      {/* The Project Data Card */}
      <div className="w-full md:w-[45%] bg-card border border-border p-6 md:p-8 rounded-3xl shadow-[0_0_30px_var(--glow)] z-10 hover:border-primary/40 transition-colors duration-300 flex flex-col h-full">
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
          {project.description}
        </p>

        {/* Card Footer: Repo Link & Media Toggle */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
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
              {showMedia ? <><X size={16} /> Close Media</> : <><ImageIcon size={16} /> View Media</>}
            </button>
          )}
        </div>
      </div>

      {/* The Media Display */}
      <div className={`w-full md:w-[45%] mt-8 md:mt-0 z-10 transition-all duration-500 origin-center ${showMedia ? 'opacity-100 scale-100' : 'opacity-0 scale-95 hidden md:block md:pointer-events-none'}`}>
        {showMedia && (
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 no-scrollbar scroll-smooth">
            {project.imageUrls.map((url, idx) => (
              <div 
                key={idx} 
                className="relative w-full sm:w-[90%] h-56 md:h-72 flex-shrink-0 snap-center rounded-2xl overflow-hidden cursor-pointer group/img border border-border/20 bg-muted/5 shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => onImageClick(url)}
              >
                {/* Changed to object-contain to prevent awkward cropping */}
                <img
                  src={url}
                  alt={`${project.title} media ${idx + 1}`}
                  className="w-full h-full object-contain group-hover/img:scale-[1.02] transition-transform duration-500"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                
                {/* Zoom Hover Overlay */}
                <div className="absolute inset-0 bg-background/0 group-hover/img:bg-background/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                  <div className="bg-background/80 text-foreground p-3 rounded-full backdrop-blur-sm shadow-lg border border-border/50">
                    <ZoomIn size={20} />
                  </div>
                </div>
              </div>
            ))}
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
  
  // State for the full-screen lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="pt-24 pb-16 min-h-screen overflow-x-hidden relative">
      
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-4">Architecture</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Engineered Systems</h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed mx-auto md:mx-0">
            Mapping out the architecture, workflows, and frontend interfaces of my recent deployments and academic prototypes.
          </p>
        </div>

        {/* Milestones Section */}
        {milestones.length > 0 && (
          <section className="mb-24 md:mb-32 relative">
            <div className="flex items-center gap-4 mb-8 md:mb-16">
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Academic Milestones</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            
            <div className="flex flex-col">
              {milestones.map((project, index) => (
                <ProjectNode key={project.id} project={project} index={index} onImageClick={setSelectedImage} />
              ))}
            </div>
          </section>
        )}

        {/* Explorations Section */}
        {explorations.length > 0 && (
          <section className="relative">
            <div className="flex items-center gap-4 mb-8 md:mb-16">
              <h2 className="text-xl md:text-2xl font-semibold tracking-wide">Personal Explorations</h2>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            
            <div className="flex flex-col">
              {explorations.map((project, index) => (
                <ProjectNode key={project.id} project={project} index={index} onImageClick={setSelectedImage} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ─── Full-Screen Image Lightbox Modal ─── */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-muted-foreground hover:text-foreground bg-card/50 hover:bg-card p-3 rounded-full transition-all border border-border/50 shadow-lg z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          
          <img
            src={selectedImage}
            alt="Expanded view"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevents clicking the image from closing the modal
          />
        </div>
      )}
    </div>
  );
}