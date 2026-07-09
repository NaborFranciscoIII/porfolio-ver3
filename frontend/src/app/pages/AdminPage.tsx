import { useState, type ReactNode } from "react";
import { useApp, PortfolioData, Project, ServiceCard, ServiceItem, SocialLink, SkillCategory, defaultData } from "@/context/PortfolioContext";
import {
  Lock, LogOut, Home, FolderOpen, Briefcase, Mail, Plus, Trash2, Edit3, Check, X,
  Save, RotateCcw, ChevronRight, Eye, EyeOff, AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

// ─── Auth screen ──────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    // Call Supabase to verify the credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });

    if (error) {
      setErr(error.message); // Displays Supabase's exact error (e.g. "Invalid login credentials")
      setLoading(false);
    } else if (data.session) {
      // Success! Grant access to the dashboard
      sessionStorage.setItem("pf-admin", "1");
      onAuth();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-[0_0_40px_var(--glow)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Lock size={24} />
          </div>
          <h2 className="text-xl font-bold">Admin Access</h2>
          <p className="text-sm text-muted-foreground mt-1">Authorized personnel only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message Display */}
          {err && <p className="text-sm text-destructive text-center">{err}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background rounded-xl py-2 text-sm font-medium hover:bg-foreground/90 transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Unlock Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <p className="font-mono text-xs tracking-widest text-primary uppercase font-semibold">{label}</p>
      <div className="flex-1 border-t border-dashed border-border" />
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-mono text-muted-foreground mb-1.5 uppercase tracking-wide">{children}</label>;
}

function TextInput({
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}) {
  const cls =
    "w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all";
  const bg = { background: "var(--input-background)" };
  return multiline ? (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls + " resize-none"}
      style={bg}
    />
  ) : (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
      style={bg}
    />
  );
}

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 bg-muted border border-border rounded-md text-xs font-mono"
          >
            {tag}
            <button onClick={() => onChange(value.filter((t) => t !== tag))} className="text-muted-foreground hover:text-destructive transition-colors">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Add tag + Enter"
          className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
          style={{ background: "var(--input-background)" }}
        />
        <button onClick={add} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs hover:bg-primary/20 transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

function StringListInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t) { onChange([...value, t]); setInput(""); }
  };
  return (
    <div>
      <div className="flex flex-col gap-1 mb-2">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg border border-border">
            <span className="text-sm flex-1">{item}</span>
            <button onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors">
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder={placeholder || "Add item + Enter"}
          className="flex-1 px-3 py-1.5 border border-border rounded-lg text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
          style={{ background: "var(--input-background)" }}
        />
        <button onClick={add} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs hover:bg-primary/20 transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Home ────────────────────────────────────────────────────────────────

function HomeTab() {
  const { data, setData } = useApp();
  const [home, setHome] = useState(() => JSON.parse(JSON.stringify(data.home)));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. Cloud Image Upload Handler
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      // Create a unique filename so old images aren't overwritten
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;

      // Upload directly to your Supabase bucket
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Ask Supabase for the new Public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      // Instantly update the local form state with the new URL
      setHome((h: typeof home) => ({ ...h, profilePhotoUrl: publicUrlData.publicUrl }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  // 2. Cloud Database Save Handler
  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        name: home.name,
        tagline: home.tagline,
        intro1: home.intro1,
        intro2: home.intro2,
        profile_photo_url: home.profilePhotoUrl,
        tech_skills: home.techSkills,
        va_skills: home.vaSkills,
        admin_skills: home.adminRoleSkills,
      };

      // Check if your profile row already exists
      const { data: existingRows } = await supabase.from("profile_data").select("id").limit(1);

      if (existingRows && existingRows.length > 0) {
        // Update the existing row
        await supabase.from("profile_data").update(payload).eq("id", existingRows[0].id);
      } else {
        // Fallback: Insert a new row if none exists
        await supabase.from("profile_data").insert(payload);
      }

      // Update the global React state so the live site reflects changes instantly
      setData({ ...data, home });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save to database.");
    } finally {
      setLoading(false);
    }
  };

  const updateSkillList = (field: keyof typeof home.techSkills, value: string[]) => {
    setHome((h: typeof home) => ({ ...h, techSkills: { ...h.techSkills, [field]: value } }));
  };

  const updateSkillCat = (
    key: "vaSkills" | "adminRoleSkills",
    idx: number,
    updated: SkillCategory
  ) => {
    setHome((h: typeof home) => {
      const arr = [...h[key]];
      arr[idx] = updated;
      return { ...h, [key]: arr };
    });
  };

  const addSkillCat = (key: "vaSkills" | "adminRoleSkills") => {
    setHome((h: typeof home) => ({
      ...h,
      [key]: [...h[key], { name: "New Category", skills: [] }],
    }));
  };

  const removeSkillCat = (key: "vaSkills" | "adminRoleSkills", idx: number) => {
    setHome((h: typeof home) => ({ ...h, [key]: h[key].filter((_: SkillCategory, i: number) => i !== idx) }));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Basic info */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Basic Info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Name</FieldLabel>
            <TextInput value={home.name} onChange={(v) => setHome((h: typeof home) => ({ ...h, name: v }))} placeholder="Your name" />
          </div>
          <div>
            <FieldLabel>Tagline</FieldLabel>
            <TextInput value={home.tagline} onChange={(v) => setHome((h: typeof home) => ({ ...h, tagline: v }))} placeholder="Short tagline" />
          </div>
          
          {/* New Profile Photo Uploader */}
          <div className="md:col-span-2">
            <FieldLabel>Profile Photo</FieldLabel>
            <div className="flex items-center gap-4 mt-2">
              {home.profilePhotoUrl ? (
                <img src={home.profilePhotoUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-border shadow-sm" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border border-border shadow-sm">None</div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer disabled:opacity-50"
                />
                {uploading && <p className="text-xs text-primary mt-1 animate-pulse">Uploading to Supabase Bucket...</p>}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <FieldLabel>Introduction Paragraph 1</FieldLabel>
            <TextInput value={home.intro1} onChange={(v) => setHome((h: typeof home) => ({ ...h, intro1: v }))} multiline rows={3} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Introduction Paragraph 2</FieldLabel>
            <TextInput value={home.intro2} onChange={(v) => setHome((h: typeof home) => ({ ...h, intro2: v }))} multiline rows={3} />
          </div>
        </div>
      </div>

      {/* Tech skills */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Tech Skills" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(["software", "languages", "frontend", "backend"] as const).map((field) => (
            <div key={field}>
              <FieldLabel>{field}</FieldLabel>
              <StringListInput value={home.techSkills[field]} onChange={(v) => updateSkillList(field, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* VA skills */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Virtual Assistant Skills" />
        <div className="flex flex-col gap-4">
          {home.vaSkills.map((cat: SkillCategory, i: number) => (
            <div key={i} className="border border-border rounded-xl p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <TextInput value={cat.name} onChange={(v) => updateSkillCat("vaSkills", i, { ...cat, name: v })} placeholder="Category name" />
                <button onClick={() => removeSkillCat("vaSkills", i)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
              <StringListInput value={cat.skills} onChange={(v) => updateSkillCat("vaSkills", i, { ...cat, skills: v })} placeholder="Add skill..." />
            </div>
          ))}
          <button onClick={() => addSkillCat("vaSkills")} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit">
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      {/* Admin role skills */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Administrative Skills" />
        <div className="flex flex-col gap-4">
          {home.adminRoleSkills.map((cat: SkillCategory, i: number) => (
            <div key={i} className="border border-border rounded-xl p-4 bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <TextInput value={cat.name} onChange={(v) => updateSkillCat("adminRoleSkills", i, { ...cat, name: v })} placeholder="Category name" />
                <button onClick={() => removeSkillCat("adminRoleSkills", i)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
              <StringListInput value={cat.skills} onChange={(v) => updateSkillCat("adminRoleSkills", i, { ...cat, skills: v })} placeholder="Add skill..." />
            </div>
          ))}
          <button onClick={() => addSkillCat("adminRoleSkills")} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit">
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} loading={loading} />
    </div>
  );
}

// ─── Tab: Projects ────────────────────────────────────────────────────────────

function emptyProject(): Project {
  // We use a "temp_" prefix so our save function knows this is a brand new entry!
  return { id: `temp_${Date.now()}`, title: "", tags: [], description: "", repoUrl: "", imageUrl: "" };
}

function ProjectForm({ project, onChange, onRemove }: { project: Project; onChange: (p: Project) => void; onRemove: () => void }) {
  // Add a localized loading state just for this specific project's image upload
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `project-${Date.now()}.${fileExt}`;

      // Upload directly to your Supabase bucket
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Ask Supabase for the new Public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      // Update the project's imageUrl with the new live link
      onChange({ ...project, imageUrl: publicUrlData.publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload project image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-muted/30 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-primary">{project.title || "Untitled Project"}</span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div>
        <FieldLabel>Title</FieldLabel>
        <TextInput value={project.title} onChange={(v) => onChange({ ...project, title: v })} placeholder="Project title" />
      </div>
      
      {/* ─── NEW: File Uploader instead of Text URL ─── */}
      <div>
        <FieldLabel>Project Image</FieldLabel>
        <div className="flex items-center gap-4 mt-1">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt="Project" className="w-16 h-12 rounded-md object-cover border border-border shadow-sm" />
          ) : (
            <div className="w-16 h-12 rounded-md bg-muted flex items-center justify-center text-[10px] uppercase tracking-wider text-muted-foreground border border-border shadow-sm">No Image</div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer disabled:opacity-50"
            />
            {uploading && <p className="text-xs text-primary mt-1 animate-pulse">Uploading to bucket...</p>}
          </div>
        </div>
      </div>
      {/* ────────────────────────────────────────────── */}

      <div>
        <FieldLabel>Tags</FieldLabel>
        <TagsInput value={project.tags} onChange={(v) => onChange({ ...project, tags: v })} />
      </div>
      <div>
        <FieldLabel>Description</FieldLabel>
        <TextInput value={project.description} onChange={(v) => onChange({ ...project, description: v })} multiline rows={3} />
      </div>
      <div>
        <FieldLabel>Repository URL</FieldLabel>
        <TextInput value={project.repoUrl} onChange={(v) => onChange({ ...project, repoUrl: v })} placeholder="https://github.com/..." />
      </div>
    </div>
  );
}

function ProjectsTab() {
  const { data, setData } = useApp();
  const [projects, setProjects] = useState(() => JSON.parse(JSON.stringify(data.projects)));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const save = async () => {
    setLoading(true);

    try {
      // 1. Delete removed projects from Supabase
      if (deletedIds.length > 0) {
        await supabase.from("projects").delete().in("id", deletedIds);
      }

      // 2. Format local data for the database
      const allProjects = [
        ...projects.milestones.map((p: Project) => ({ ...p, category: "milestone" })),
        ...projects.explorations.map((p: Project) => ({ ...p, category: "exploration" }))
      ];

      // 3. Upsert into Supabase
      for (const p of allProjects) {
        const payload = {
          title: p.title,
          description: p.description,
          tags: p.tags,
          repo_url: p.repoUrl,
          image_url: p.imageUrl,
          category: p.category
        };

        if (p.id.startsWith("temp_")) {
          // Brand new project: Insert it!
          await supabase.from("projects").insert(payload);
        } else {
          // Existing project: Update it!
          await supabase.from("projects").update(payload).eq("id", p.id);
        }
      }

      // 4. Fetch fresh data so our local UI has the real UUIDs from the database
      const { data: freshProjects } = await supabase.from("projects").select("*");
      
      if (freshProjects) {
        const milestones = freshProjects
          .filter((p) => p.category === "milestone")
          .map((p) => ({ id: p.id, title: p.title, tags: p.tags, description: p.description, repoUrl: p.repo_url, imageUrl: p.image_url }));

        const explorations = freshProjects
          .filter((p) => p.category === "exploration")
          .map((p) => ({ id: p.id, title: p.title, tags: p.tags, description: p.description, repoUrl: p.repo_url, imageUrl: p.image_url }));

        // Update the global state so the public portfolio updates instantly
        setData({ ...data, projects: { milestones, explorations } });
        // Update local form state
        setProjects({ milestones, explorations });
      }

      setDeletedIds([]); // Clear deletion queue
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save projects:", error);
      alert("Failed to save to database. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const updateList = (key: "milestones" | "explorations", idx: number, updated: Project) => {
    setProjects((p: typeof projects) => {
      const arr = [...p[key]];
      arr[idx] = updated;
      return { ...p, [key]: arr };
    });
  };

  const removeItem = (key: "milestones" | "explorations", idx: number) => {
    const item = projects[key][idx];
    // If it's a real project from the database, track its ID so we can delete it on Save
    if (!item.id.startsWith("temp_")) {
      setDeletedIds((prev) => [...prev, item.id]);
    }
    setProjects((p: typeof projects) => ({ ...p, [key]: p[key].filter((_: Project, i: number) => i !== idx) }));
  };

  const addItem = (key: "milestones" | "explorations") => {
    setProjects((p: typeof projects) => ({ ...p, [key]: [...p[key], emptyProject()] }));
  };

  return (
    <div className="flex flex-col gap-8">
      {(["milestones", "explorations"] as const).map((key) => (
        <div key={key} className="bg-card border border-border rounded-2xl p-6">
          <SectionTitle label={key === "milestones" ? "Work & Academic Milestones" : "Personal Explorations & Tools"} />
          <div className="flex flex-col gap-4">
            {projects[key].map((p: Project, i: number) => (
              <ProjectForm
                key={p.id}
                project={p}
                onChange={(updated) => updateList(key, i, updated)}
                onRemove={() => removeItem(key, i)}
              />
            ))}
            <button
              onClick={() => addItem(key)}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
        </div>
      ))}
      <SaveBar onSave={save} saved={saved} loading={loading} />
    </div>
  );
}

// ─── Tab: Services ────────────────────────────────────────────────────────────

function ServicesTab() {
  const { data, setData } = useApp();
  const [services, setServices] = useState(() => JSON.parse(JSON.stringify(data.services)));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Track deletions for both tables independently
  const [deletedWorkIds, setDeletedWorkIds] = useState<string[]>([]);
  const [deletedMenuIds, setDeletedMenuIds] = useState<string[]>([]);

  const save = async () => {
    setLoading(true);

    try {
      // 1. Delete removed items from Supabase
      if (deletedWorkIds.length > 0) {
        await supabase.from("open_to_work").delete().in("id", deletedWorkIds);
      }
      if (deletedMenuIds.length > 0) {
        await supabase.from("services_menu").delete().in("id", deletedMenuIds);
      }

      // 2. Upsert Open To Work Cards
      for (const card of services.openToWork) {
        const payload = { category: card.category, positions: card.positions };
        if (card.id.startsWith("temp_")) {
          await supabase.from("open_to_work").insert(payload);
        } else {
          await supabase.from("open_to_work").update(payload).eq("id", card.id);
        }
      }

      // 3. Upsert Services Menu Items
      for (const item of services.servicesMenu) {
        const payload = { name: item.name, description: item.description, price: item.price };
        if (item.id.startsWith("temp_")) {
          await supabase.from("services_menu").insert(payload);
        } else {
          await supabase.from("services_menu").update(payload).eq("id", item.id);
        }
      }

      // 4. Fetch fresh data so our local UI has the real UUIDs
      const [workRes, menuRes] = await Promise.all([
        supabase.from("open_to_work").select("*"),
        supabase.from("services_menu").select("*")
      ]);

      if (workRes.data && menuRes.data) {
        const freshOpenToWork = workRes.data;
        const freshServicesMenu = menuRes.data;

        // Update the global state so the public portfolio updates instantly
        setData({ ...data, services: { openToWork: freshOpenToWork, servicesMenu: freshServicesMenu } });
        // Update local form state
        setServices({ openToWork: freshOpenToWork, servicesMenu: freshServicesMenu });
      }

      // Clear deletion queues
      setDeletedWorkIds([]);
      setDeletedMenuIds([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save services:", error);
      alert("Failed to save to database. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const updateCard = (idx: number, card: ServiceCard) => {
    setServices((s: typeof services) => {
      const arr = [...s.openToWork];
      arr[idx] = card;
      return { ...s, openToWork: arr };
    });
  };

  const removeCard = (idx: number) => {
    const item = services.openToWork[idx];
    if (!item.id.startsWith("temp_")) {
      setDeletedWorkIds((prev) => [...prev, item.id]);
    }
    setServices((s: typeof services) => ({ ...s, openToWork: s.openToWork.filter((_: ServiceCard, i: number) => i !== idx) }));
  };

  const addCard = () => {
    setServices((s: typeof services) => ({
      ...s,
      openToWork: [...s.openToWork, { id: `temp_${Date.now()}`, category: "", positions: [] }],
    }));
  };

  const updateMenuItem = (idx: number, item: ServiceItem) => {
    setServices((s: typeof services) => {
      const arr = [...s.servicesMenu];
      arr[idx] = item;
      return { ...s, servicesMenu: arr };
    });
  };

  const removeMenuItem = (idx: number) => {
    const item = services.servicesMenu[idx];
    if (!item.id.startsWith("temp_")) {
      setDeletedMenuIds((prev) => [...prev, item.id]);
    }
    setServices((s: typeof services) => ({ ...s, servicesMenu: s.servicesMenu.filter((_: ServiceItem, i: number) => i !== idx) }));
  };

  const addMenuItem = () => {
    setServices((s: typeof services) => ({
      ...s,
      servicesMenu: [...s.servicesMenu, { id: `temp_${Date.now()}`, name: "", description: "", price: "" }],
    }));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Open to Work */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Open to Work" />
        <div className="flex flex-col gap-4">
          {services.openToWork.map((card: ServiceCard, i: number) => (
            <div key={card.id} className="border border-border rounded-xl p-4 bg-muted/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">{card.category || "Untitled"}</span>
                <button onClick={() => removeCard(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <FieldLabel>Category</FieldLabel>
                <TextInput value={card.category} onChange={(v) => updateCard(i, { ...card, category: v })} placeholder="e.g. Software Development" />
              </div>
              <div>
                <FieldLabel>Job Positions</FieldLabel>
                <StringListInput value={card.positions} onChange={(v) => updateCard(i, { ...card, positions: v })} placeholder="Add position..." />
              </div>
            </div>
          ))}
          <button onClick={addCard} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit">
            <Plus size={14} /> Add Work Card
          </button>
        </div>
      </div>

      {/* Services Menu */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Services Menu" />
        <div className="flex flex-col gap-4">
          {services.servicesMenu.map((item: ServiceItem, i: number) => (
            <div key={item.id} className="border border-border rounded-xl p-4 bg-muted/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">{item.name || "Untitled"}</span>
                <button onClick={() => removeMenuItem(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Service Name</FieldLabel>
                  <TextInput value={item.name} onChange={(v) => updateMenuItem(i, { ...item, name: v })} placeholder="Service name" />
                </div>
                <div>
                  <FieldLabel>Price / Rate (optional)</FieldLabel>
                  <TextInput value={item.price || ""} onChange={(v) => updateMenuItem(i, { ...item, price: v })} placeholder="e.g. $50/hr" />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <TextInput value={item.description} onChange={(v) => updateMenuItem(i, { ...item, description: v })} multiline rows={2} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addMenuItem} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit">
            <Plus size={14} /> Add Service
          </button>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} loading={loading} />
    </div>
  );
}

// ─── Tab: Contacts ────────────────────────────────────────────────────────────

const ICON_OPTIONS = ["github", "linkedin", "facebook", "twitter", "instagram", "email", "globe"];

function ContactsTab() {
  const { data, setData } = useApp();
  const [contacts, setContacts] = useState(() => JSON.parse(JSON.stringify(data.contacts)));
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const save = async () => {
    setLoading(true);

    try {
      // 1. Delete removed links from Supabase
      if (deletedIds.length > 0) {
        await supabase.from("social_links").delete().in("id", deletedIds);
      }

      // 2. Upsert Social Links
      for (const link of contacts.socialLinks) {
        const payload = { name: link.name, url: link.url, icon: link.icon };
        
        if (link.id.startsWith("temp_")) {
          // Insert brand new link
          await supabase.from("social_links").insert(payload);
        } else {
          // Update existing link
          await supabase.from("social_links").update(payload).eq("id", link.id);
        }
      }

      // 3. Fetch fresh data so our local UI has the real UUIDs
      const { data: freshLinks } = await supabase.from("social_links").select("*");
      
      if (freshLinks) {
        // Update the global state so the public portfolio updates instantly
        setData({ ...data, contacts: { socialLinks: freshLinks } });
        // Update local form state
        setContacts({ socialLinks: freshLinks });
      }

      // 4. Cleanup deletion queue
      setDeletedIds([]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save contacts:", error);
      alert("Failed to save to database. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const updateLink = (idx: number, link: SocialLink) => {
    setContacts((c: typeof contacts) => {
      const arr = [...c.socialLinks];
      arr[idx] = link;
      return { ...c, socialLinks: arr };
    });
  };

  const removeLink = (idx: number) => {
    const item = contacts.socialLinks[idx];
    if (!item.id.startsWith("temp_")) {
      setDeletedIds((prev) => [...prev, item.id]);
    }
    setContacts((c: typeof contacts) => ({ ...c, socialLinks: c.socialLinks.filter((_: SocialLink, i: number) => i !== idx) }));
  };

  const addLink = () => {
    setContacts((c: typeof contacts) => ({
      ...c,
      socialLinks: [...c.socialLinks, { id: `temp_${Date.now()}`, name: "", url: "", icon: "globe" }],
    }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-card border border-border rounded-2xl p-6">
        <SectionTitle label="Social Media Links" />
        <div className="flex flex-col gap-4">
          {contacts.socialLinks.map((link: SocialLink, i: number) => (
            <div key={link.id} className="border border-border rounded-xl p-4 bg-muted/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-primary">{link.name || "Untitled"}</span>
                <button onClick={() => removeLink(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <FieldLabel>Display Name</FieldLabel>
                  <TextInput value={link.name} onChange={(v) => updateLink(i, { ...link, name: v })} placeholder="e.g. GitHub" />
                </div>
                <div>
                  <FieldLabel>Icon</FieldLabel>
                  <select
                    value={link.icon}
                    onChange={(e) => updateLink(i, { ...link, icon: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-primary/60 transition-all capitalize"
                    style={{ background: "var(--input-background)", color: "var(--foreground)" }}
                  >
                    {ICON_OPTIONS.map((ico) => (
                      <option key={ico} value={ico}>{ico}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>URL</FieldLabel>
                  <TextInput value={link.url} onChange={(v) => updateLink(i, { ...link, url: v })} placeholder="https://..." />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addLink} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors w-fit">
            <Plus size={14} /> Add Social Link
          </button>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} loading={loading} />
    </div>
  );
}

// ─── Save Bar ─────────────────────────────────────────────────────────────────

function SaveBar({ onSave, saved, loading = false }: { onSave: () => void; saved: boolean; loading?: boolean }) {
  return (
    <div className="flex justify-end">
      <button
        onClick={onSave}
        disabled={loading}
        className={[
          "flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all",
          saved
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-primary text-primary-foreground shadow-[0_0_12px_var(--glow)] hover:opacity-90 disabled:opacity-50",
        ].join(" ")}
      >
        {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> {loading ? "Saving..." : "Save Changes"}</>}
      </button>
    </div>
  );
}

// ─── Admin page ───────────────────────────────────────────────────────────────

type TabId = "home" | "projects" | "services" | "contacts";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "home", label: "Home", icon: <Home size={15} /> },
  { id: "projects", label: "Projects", icon: <FolderOpen size={15} /> },
  { id: "services", label: "Services", icon: <Briefcase size={15} /> },
  { id: "contacts", label: "Contacts", icon: <Mail size={15} /> },
];

export default function AdminPage() {
  const { adminAuthed, setAdminAuthed, navigate, data, setData } = useApp();
  const [tab, setTab] = useState<TabId>("home");
  const [showReset, setShowReset] = useState(false);
  const routerNavigate = useNavigate();

  if (!adminAuthed) {
    return <AuthScreen onAuth={() => setAdminAuthed(true)} />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("pf-admin");
    setAdminAuthed(false);
    routerNavigate("/"); // Redirects to the public home page
  };

  const handleReset = () => {
    setData(defaultData);
    setShowReset(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Admin header */}
      <div className="relative sticky top-0 z-50 backdrop-blur-md border-b border-border" style={{ background: "color-mix(in srgb, var(--background) 90%, transparent)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm font-semibold text-primary tracking-widest">ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => routerNavigate("/")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 rounded-lg transition-all"
            >
              <Eye size={12} /> View Site
            </button>
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-destructive border border-border hover:border-destructive/40 rounded-lg transition-all"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-all"
            >
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card border border-border rounded-xl mb-8 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-[0_0_10px_var(--glow)]"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === "home" && <HomeTab />}
        {tab === "projects" && <ProjectsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "contacts" && <ContactsTab />}
      </div>

      {/* Reset confirm modal */}
      {showReset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-7 max-w-sm w-full mx-6 shadow-[0_0_40px_var(--glow)]">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={20} className="text-destructive" />
              <h3 className="font-semibold">Reset All Data?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This will restore all portfolio content to the default values. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-2 border border-border rounded-xl text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
