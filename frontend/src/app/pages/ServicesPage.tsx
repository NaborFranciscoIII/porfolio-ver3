import { useState, type ReactNode } from "react";
import { useApp, ServiceCard, ServiceItem } from "@/context/PortfolioContext";
import { ChevronDown, ChevronUp, Briefcase, Layers, Plus } from "lucide-react";

function OpenToWorkCard({ card }: { card: ServiceCard }) {
  const [expanded, setExpanded] = useState(false);
  const showToggle = card.positions.length > 3;
  const visible = expanded ? card.positions : card.positions.slice(0, 3);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-semibold text-base text-foreground">{card.category}</h3>
        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded-md border border-primary/20">
          Open
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {visible.map((pos, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
            {pos}
          </div>
        ))}
      </div>

      {showToggle && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 flex items-center gap-1.5 text-xs font-mono text-primary hover:text-accent transition-colors"
        >
          {expanded ? (
            <><ChevronUp size={12} /> Show less</>
          ) : (
            <><ChevronDown size={12} /> +{card.positions.length - 3} more positions</>
          )}
        </button>
      )}
    </div>
  );
}

function ServiceItemCard({ item }: { item: ServiceItem }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-[0_0_20px_var(--glow)] transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-base text-foreground">{item.name}</h3>
        {item.price && (
          <span className="px-2.5 py-0.5 bg-accent/10 text-accent text-xs font-mono rounded-md border border-accent/20 flex-shrink-0">
            {item.price}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
    </div>
  );
}

function SectionHeader({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-primary">{icon}</span>
      <p className="font-mono text-xs tracking-widest text-primary uppercase font-semibold">{label}</p>
      <div className="flex-1 border-t border-dashed border-border" />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-muted-foreground/40">
      <div className="w-16 h-16 rounded-2xl border border-dashed border-border flex items-center justify-center">
        <Plus size={24} />
      </div>
      <p className="text-sm font-mono">{label}</p>
    </div>
  );
}

export default function ServicesPage() {
  const { data } = useApp();
  const { services } = data;

  return (
    <div className="pt-16 min-h-screen">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-3">OFFERINGS</p>
          <h1 className="text-4xl font-bold">Services & Availability</h1>
        </div>

        {/* Open to Work */}
        <section className="mb-16">
          <SectionHeader icon={<Briefcase size={14} />} label="Open to Opportunities" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.openToWork.length > 0 ? (
              services.openToWork.map((card) => <OpenToWorkCard key={card.id} card={card} />)
            ) : (
              <EmptyState label="No positions listed yet" />
            )}
          </div>
        </section>

        {/* Services Menu */}
        <section>
          <SectionHeader icon={<Layers size={14} />} label="SERVICES MENU" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.servicesMenu.length > 0 ? (
              services.servicesMenu.map((item) => <ServiceItemCard key={item.id} item={item} />)
            ) : (
              <EmptyState label="No services listed yet" />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
