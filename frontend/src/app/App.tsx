import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// 1. Import all your pages
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";

// 2. Import your Navigation bar
import Navigation from "./components/Navigation";

// 3. The "Translator" - This catches Figma's old "#" links and uses React Router instead
function RouteTranslator() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#projects") {
      navigate("/projects");
      window.history.replaceState(null, "", "/projects"); // Cleans the # from the URL
    }
    if (hash === "#services") {
      navigate("/services");
      window.history.replaceState(null, "", "/services");
    }
    if (hash === "#contact") {
      navigate("/contact");
      window.history.replaceState(null, "", "/contact");
    }
  }, [location, navigate]);

  return null; // This component works in the background, it doesn't render anything
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Run the translator in the background */}
      <RouteTranslator />
      
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        
        {/* Render the Navigation bar so it appears on EVERY page */}
        <Navigation />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Hidden Admin Route */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}