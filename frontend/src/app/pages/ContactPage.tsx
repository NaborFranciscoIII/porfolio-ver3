import { useState, type ReactNode } from "react";
import { useApp, SocialLink } from "@/context/PortfolioContext";
import { Github, Linkedin, Facebook, Twitter, Instagram, Globe, Mail, ArrowUpRight, Send, CheckCircle } from "lucide-react";

const ICON_MAP: Record<string, ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  facebook: <Facebook size={18} />,
  twitter: <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  email: <Mail size={18} />,
  globe: <Globe size={18} />,
};

function SocialCard({ link }: { link: SocialLink }) {
  const icon = ICON_MAP[link.icon.toLowerCase()] ?? <Globe size={18} />;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-[0_0_16px_var(--glow)] transition-all duration-200 group"
    >
      <span className="text-primary">{icon}</span>
      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
        {link.name}
      </span>
      <ArrowUpRight size={14} className="ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
}

export default function ContactPage() {
  const { data } = useApp();
  const { contacts } = data;

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSending(true);
    // Simulate email dispatch
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

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
        <div className="mb-14 text-center">
          <p className="font-mono text-xs tracking-widest text-primary uppercase mb-3">COMMUNICATION HUB</p>
          <h1 className="text-4xl font-bold">Get In Touch</h1>
        </div>

        {/* Contact form */}
        <section className="mb-16 max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_40px_var(--glow)]">
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle size={48} className="text-primary" />
                <h3 className="text-lg font-semibold">Inquiry Dispatched!</h3>
                <p className="text-sm text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-2 px-5 py-2 bg-muted text-sm rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:shadow-[0_0_10px_var(--glow)] transition-all"
                    style={{ background: "var(--input-background)" }}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:shadow-[0_0_10px_var(--glow)] transition-all"
                    style={{ background: "var(--input-background)" }}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Message content..."
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:shadow-[0_0_10px_var(--glow)] transition-all resize-none"
                    style={{ background: "var(--input-background)" }}
                  />
                </div>

                {error && <p className="text-destructive text-xs font-mono">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all shadow-[0_0_16px_var(--glow)]"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Dispatching...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Dispatch Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Social links */}
        <section className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <p className="font-mono text-xs tracking-widest text-primary uppercase font-semibold">
              EXTERNAL DIRECTORIES
            </p>
            <div className="flex-1 border-t border-dashed border-border" />
          </div>

          {contacts.socialLinks.length > 0 ? (
            <div className="flex flex-col gap-3">
              {contacts.socialLinks.map((link) => (
                <SocialCard key={link.id} link={link} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-mono text-center py-8">
              No social links configured.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
