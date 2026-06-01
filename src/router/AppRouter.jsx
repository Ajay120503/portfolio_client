import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Projects from "../pages/public/Projects";
import ProjectDetail from "../pages/public/ProjectDetail";
import Blog from "../pages/public/Blog";
import BlogPost from "../pages/public/BlogPost";
import Services from "../pages/public/Services";
import Contact from "../pages/public/Contact";
import Skills from "../pages/public/Skills";
import TestimonialsSection from "../pages/public/TestimonialsSection";

// Admin Pages
import AdminLogin from "../pages/admin/Login";
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import ManageProfile from "../pages/admin/ManageProfile";
import ManageAbout from "../pages/admin/ManageAbout";
import ManageSkills from "../pages/admin/ManageSkills";
import ManageExperience from "../pages/admin/ManageExperience";
import ManageEducation from "../pages/admin/ManageEducation";
import ManageProjects from "../pages/admin/ManageProjects";
import ManageServices from "../pages/admin/ManageServices";
import ManageTestimonials from "../pages/admin/ManageTestimonials";
import ManageBlog from "../pages/admin/ManageBlog";
import ManageMessages from "../pages/admin/ManageMessages";
import ManageSettings from "../pages/admin/ManageSettings";
import Experience from "../pages/public/Experience";
import Education from "../pages/public/Education";
import Edits from "../pages/public/Edits";
import ManageEdits from "../pages/admin/ManageEdits";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/testimonials" element={<TestimonialsSection />} />
      <Route path="/education" element={<Education />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/services" element={<Services />} />
      <Route path="/edits" element={<Edits />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<ManageProfile />} />
        <Route path="about" element={<ManageAbout />} />
        <Route path="skills" element={<ManageSkills />} />
        <Route path="experience" element={<ManageExperience />} />
        <Route path="education" element={<ManageEducation />} />
        <Route path="projects" element={<ManageProjects />} />
        <Route path="services" element={<ManageServices />} />
        <Route path="testimonials" element={<ManageTestimonials />} />
        <Route path="blog" element={<ManageBlog />} />
        <Route path="messages" element={<ManageMessages />} />
        <Route path="settings" element={<ManageSettings />} />
        <Route path="edits" element={<ManageEdits />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
