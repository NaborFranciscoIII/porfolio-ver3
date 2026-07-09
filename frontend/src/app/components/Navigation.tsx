import { useState } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useApp } from "@/context/PortfolioContext";
import { useNavigate, useLocation } from "react-router-dom";

// 1. Add explicit paths to your links so the router knows exactly where to go!
const NAV_LINKS = [
  { id: "home", label: "Home", path: "/" },
  { id: "projects", label: "Projects", path: "/projects" },
  { id: "services", label: "Services", path: "/services" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export default function Navigation() {
  const { theme, toggleTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // 2. Initialize the navigator and the location listener
  const routerNavigate = useNavigate();
  const location = useLocation(); // This constantly watches your URL!

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border"
      style={{ background: "color-mix(in srgb, var(--background) 85%, transparent)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <span
          className="font-mono text-sm font-medium tracking-widest text-primary cursor-pointer select-none"
          onClick={() => routerNavigate("/home")} // Changed from "home" to "/"
        >
          SKILLSET{" "}
          <span className="text-muted-foreground">//</span>{" "}
          PORTFOLIO
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            // 3. Check if the current URL matches this button's path
            const isActive = location.pathname === link.path;
            
            return (
              <button
                key={link.id}
                onClick={() => routerNavigate(link.path)}
                className={[
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  isActive
                    ? "text-primary bg-primary/10" // Restores your Active state!
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {link.label}
              </button>
            );
          })}

          <div className="w-px h-4 bg-border mx-2" />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            
            return (
              <button
                key={link.id}
                onClick={() => {
                  routerNavigate(link.path);
                  setMobileOpen(false); // Closes the mobile menu automatically
                }}
                className={[
                  "w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}