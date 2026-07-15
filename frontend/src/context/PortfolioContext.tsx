import { useState, useEffect, createContext, useContext } from "react";
import Navigation from "@/app/components/Navigation";
import HomePage from "@/app/pages/HomePage";
import ProjectsPage from "@/app/pages/ProjectsPage";
import ServicesPage from "@/app/pages/ServicesPage";
import ContactPage from "@/app/pages/ContactPage";
import AdminPage from "@/app/pages/AdminPage";
import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = "tech" | "va" | "admin-role";
export type Theme = "dark" | "light";
export type Page = "home" | "projects" | "services" | "contact" | "admin";

export interface TechSkills {
  software: string[];
  languages: string[];
  frontend: string[];
  backend: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface HomeData {
  name: string;
  tagline: string;
  intro1: string;
  intro2: string;
  vaIntro1: string;
  vaIntro2: string;
  adminIntro1: string;
  adminIntro2: string;
  profilePhotoUrl: string | null;
  techSkills: TechSkills;
  vaSkills: SkillCategory[];
  adminRoleSkills: SkillCategory[];
}

export interface Project {
  id: string;
  title: string;
  tags: string[];
  description: string;
  repoUrl: string;
  imageUrl?: string;
}

export interface ProjectsData {
  milestones: Project[];
  explorations: Project[];
}

export interface ServiceCard {
  id: string;
  category: string;
  positions: string[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price?: string;
}

export interface ServicesData {
  openToWork: ServiceCard[];
  servicesMenu: ServiceItem[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface ContactsData {
  socialLinks: SocialLink[];
}

export interface PortfolioData {
  home: HomeData;
  projects: ProjectsData;
  services: ServicesData;
  contacts: ContactsData;
}

// ─── Default Data ─────────────────────────────────────────────────────────────

export const defaultData: PortfolioData = {
  home: {
    name: "Francis",
    tagline: "Full-Stack Developer & CS Graduate",
    intro1:
      "I'm a graduate of Bachelor of Science in Computer Science and full-stack builder specializing in computer science systems, application networking infrastructure, and secure algorithmic pipelines.",
    intro2:
      "Passionate about solving complex problems, building clean user interfaces, and ensuring robust backend system communications.",
    vaIntro1: "I provide reliable and efficient virtual assistance services.",
    vaIntro2: "With strong organizational skills and a detail-oriented approach, I help streamline day-to-day operations.",
    adminIntro1: "I bring structured administrative expertise to support smooth and efficient workflows.",
    adminIntro2: "My background in Computer Science helps me combine process discipline with practical digital solutions.",
    profilePhotoUrl: "",
    techSkills: {
      software: ["MS Word", "MS Excel", "MS PowerPoint", "Cisco Packet Tracer", "Visual Studio Code", "Git"],
      languages: ["Python", "Java", "C++"],
      frontend: ["HTML", "CSS", "JavaScript"],
      backend: ["MySQL / SQLite", "Laravel", "PHP"],
    },
    vaSkills: [
      { name: "Administrative Tools", skills: ["Google Workspace", "MS Office Suite", "Notion", "Trello"] },
      { name: "Communication", skills: ["Email Management", "Scheduling", "Customer Support", "Calendar Management"] },
      { name: "Data Entry", skills: ["Spreadsheet Management", "Database Entry", "Report Generation"] },
    ],
    adminRoleSkills: [
      { name: "Operations", skills: ["Project Management", "Team Coordination", "SOP Development", "Budget Tracking"] },
      { name: "Systems", skills: ["Workflow Automation", "Process Optimization", "Documentation"] },
      { name: "Analytics", skills: ["Data Analysis", "KPI Tracking", "Performance Reports"] },
    ],
  },
  projects: {
    milestones: [
      {
        id: "m1",
        title: "Library Hybrid Book Recommender System",
        tags: ["Python", "Streamlit", "MySQL", "Git"],
        description:
          "A specialized data intelligence prototype engine designed for academic library tracking. Uses collaborative-filtering algorithms along with a dynamic user weighting balance ratio matrix to surface context-aware book suggestions.",
        repoUrl: "#",
        imageUrl: "",
      },
    ],
    explorations: [
      {
        id: "e1",
        title: "Generic Expense Tracker",
        tags: ["Vite", "TypeScript", "Prisma", "Tauri", "React", "Android", "Windows"],
        description:
          "A responsive, offline-first personal finance platform engineered with React, TypeScript, Tauri, and Capacitor to deliver synchronized double-entry accounting frameworks across native Android and Windows Desktop platforms.",
        repoUrl: "#",
        imageUrl: "",
      },
    ],
  },
  services: {
    openToWork: [],
    servicesMenu: [],
  },
  contacts: {
    socialLinks: [
      { id: "s1", name: "GitHub", url: "https://github.com", icon: "github" },
      { id: "s2", name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { id: "s3", name: "Facebook", url: "https://facebook.com", icon: "facebook" },
    ],
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  role: Role;
  setRole: (r: Role) => void;
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  currentPage: Page;
  navigate: (p: Page) => void;
  adminAuthed: boolean;
  setAdminAuthed: (v: boolean) => void;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);

// ─── Secret admin hash ────────────────────────────────────────────────────────

const ADMIN_HASH = "#/ctrl/sys-admin-7z9k";

function hashToPage(hash: string): Page {
  if (hash === ADMIN_HASH) return "admin";
  if (hash === "#projects") return "projects";
  if (hash === "#services") return "services";
  if (hash === "#contact") return "contact";
  return "home";
}

// ─── AppProvider ──────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("pf-theme") as Theme) || "dark"
  );
  const [role, setRole] = useState<Role>("tech");
  const [adminAuthed, setAdminAuthed] = useState(() => sessionStorage.getItem("pf-admin") === "1");
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // 1. Start with default data so the site has structure while loading
  const [data, setDataState] = useState<PortfolioData>(defaultData);

  // 2. Fetch live data from Supabase when the app mounts
  useEffect(() => {
    async function loadPortfolioData() {
      try {
        // Fetch ALL FIVE tables simultaneously for maximum speed
        const [projectsRes, openToWorkRes, servicesMenuRes, socialLinksRes, profileRes] = await Promise.all([
          supabase.from("projects").select("*"),
          supabase.from("open_to_work").select("*"),
          supabase.from("services_menu").select("*"),
          supabase.from("social_links").select("*"),
          supabase.from("profile_data").select("*").limit(1) // <-- Added Profile Data!
        ]);

        const allProjects = projectsRes.data || [];
        const milestones = allProjects
          .filter((p) => p.category === "milestone")
          .map((p) => ({ id: p.id, title: p.title, tags: p.tags, description: p.description, repoUrl: p.repo_url, imageUrl: p.image_url }));

        const explorations = allProjects
          .filter((p) => p.category === "exploration")
          .map((p) => ({ id: p.id, title: p.title, tags: p.tags, description: p.description, repoUrl: p.repo_url, imageUrl: p.image_url }));

        // Safely extract profile data if it exists
        const pData = profileRes.data?.[0];

        // 3. Inject the live database data into your application state
        setDataState((prev) => ({
          ...prev,
          home: pData
            ? {
                ...prev.home,
                name: pData.name,
                tagline: pData.tagline,
                intro1: pData.intro1,
                intro2: pData.intro2,
                vaIntro1: pData.va_intro1 || "I provide reliable and efficient virtual assistance services...",
                vaIntro2: pData.va_intro2 || "With strong organizational skills...",
                adminIntro1: pData.admin_intro1 || "I bring structured administrative expertise...",
                adminIntro2: pData.admin_intro2 || "My background in Computer Science...",
                profilePhotoUrl: pData.profile_photo_url,
                techSkills: pData.tech_skills,
                vaSkills: pData.va_skills,
                adminRoleSkills: pData.admin_skills,
              }
            : prev.home,
          projects: { milestones, explorations },
          services: {
            openToWork: openToWorkRes.data || [],
            servicesMenu: servicesMenuRes.data || [],
          },
          contacts: {
            socialLinks: socialLinksRes.data || [],
          },
        }));

      } catch (error) {
        console.error("Failed to fetch Supabase data:", error);
      }
    }

    loadPortfolioData();
  }, []);

  // Handle theme switching
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pf-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  // We keep this signature so the Admin page doesn't break, but local storage is no longer our source of truth
  const setData = (d: PortfolioData) => {
    setDataState(d);
  };

  return (
    <AppContext.Provider
      value={{ theme, toggleTheme, role, setRole, data, setData, currentPage, navigate, adminAuthed, setAdminAuthed }}
    >
      {children}
    </AppContext.Provider>
  );
}