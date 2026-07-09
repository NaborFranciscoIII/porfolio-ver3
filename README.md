# Modern Developer Portfolio & CMS

A cross-platform, responsive portfolio engine engineered with React, TypeScript, and Vite. This project moves beyond a static site by integrating a custom-built Content Management System (CMS) powered by Supabase, allowing for real-time profile updates, project management, and media uploads without touching the source code.

## 🚀 Features

* **Headless CMS Integration:** Full CRUD (Create, Read, Update, Delete) capabilities via a secure, authenticated Admin Dashboard wired directly to a PostgreSQL cloud database.
* **Role-Based Dynamic Routing:** Utilizes `react-router-dom` to seamlessly toggle between Technical, Virtual Assistant, and Administrative layouts.
* **Cloud Object Storage:** Direct image uploading and hosting via Supabase Storage Buckets for project thumbnails and profile media.
* **Smart Icon Resolver:** A dynamic rendering engine that automatically maps plain-text technology names to their respective Devicon or Lucide SVG brand assets.
* **Figma-to-Code Architecture:** Extracted and refactored from a rigid Figma prototype into a highly modular, component-driven React architecture.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Routing:** React Router v6
* **Backend / Database:** Supabase (PostgreSQL, GoTrue Auth, Storage)
* **Styling:** Tailwind CSS, CSS Variables (for seamless Dark/Light mode)
* **Icons:** Lucide React, Devicon

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
   cd your-repo-name