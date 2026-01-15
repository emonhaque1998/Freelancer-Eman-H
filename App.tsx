
import React, { useState, useEffect, Suspense, lazy, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { User, AuthState, UserRole, LocationData, AboutData } from './types';
import { db } from './services/db';
import { detectLocation } from './services/location';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageLoader } from './components/LoadingUI';

// Context for Location
export const LocationContext = createContext<LocationData | null>(null);

// Lazy load main pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ProjectSingle = lazy(() => import('./pages/ProjectSingle').then(m => ({ default: m.ProjectSingle })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));

// Lazy load User Dashboard pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const DashboardProfile = lazy(() => import('./pages/DashboardProfile').then(m => ({ default: m.DashboardProfile })));
const DashboardOrders = lazy(() => import('./pages/DashboardOrders').then(m => ({ default: m.DashboardOrders })));
const DashboardAI = lazy(() => import('./pages/DashboardAI').then(m => ({ default: m.DashboardAI })));

// Lazy load Admin Dashboard pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AdminProjects = lazy(() => import('./pages/AdminProjects').then(m => ({ default: m.AdminProjects })));
const AdminServices = lazy(() => import('./pages/AdminServices').then(m => ({ default: m.AdminServices })));
const AdminMessages = lazy(() => import('./pages/AdminMessages').then(m => ({ default: m.AdminMessages })));
const AdminInquiries = lazy(() => import('./pages/AdminInquiries').then(m => ({ default: m.AdminInquiries })));
const AdminAbout = lazy(() => import('./pages/AdminAbout').then(m => ({ default: m.AdminAbout })));
const AdminSEO = lazy(() => import('./pages/AdminSEO').then(m => ({ default: m.AdminSEO })));
const AdminProfile = lazy(() => import('./pages/AdminProfile').then(m => ({ default: m.AdminProfile })));

/**
 * AnimatedRoute component wraps routes with motion animations.
 */
const AnimatedRoute = ({ children }: { children?: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const Login = ({ onLogin }: { onLogin: (u: User) => void }) => {
  const [email, setEmail] = useState('admin@devport.com');
  const [password, setPassword] = useState('password'); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const users = await db.getUsers();
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (user && user.password === password) {
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        toast.error("Invalid credentials. Please verify your email and password.");
      }
    } catch (err: any) {
      toast.error("Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black mb-4 shadow-xl shadow-indigo-100">EH</div>
          <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition font-medium" placeholder="admin@devport.com" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2 ml-1">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 outline-none transition font-medium" placeholder="••••••••" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const ProtectedRoute = ({ children, user, requiredRole }: { children?: React.ReactNode, user: User | null, requiredRole?: UserRole }) => {
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return <>{children}</>;
};

function RoutesContainer({ authState, onUserUpdate, handleAuthSuccess }: { authState: AuthState, onUserUpdate: (u: User) => void, handleAuthSuccess: (u: User) => void }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
        <Route path="/about" element={<AnimatedRoute><About /></AnimatedRoute>} />
        <Route path="/services" element={<AnimatedRoute><Services /></AnimatedRoute>} />
        <Route path="/projects" element={<AnimatedRoute><Projects /></AnimatedRoute>} />
        <Route path="/projects/:id" element={<AnimatedRoute><ProjectSingle user={authState.user} /></AnimatedRoute>} />
        <Route path="/contact" element={<AnimatedRoute><Contact /></AnimatedRoute>} />
        <Route path="/login" element={authState.isAuthenticated ? <Navigate to={authState.user?.role === UserRole.ADMIN ? '/admin' : '/dashboard'} /> : <AnimatedRoute><Login onLogin={handleAuthSuccess} /></AnimatedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={authState.user}><Dashboard user={authState.user!} /></ProtectedRoute>}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<DashboardProfile user={authState.user!} />} />
          <Route path="orders" element={<DashboardOrders user={authState.user!} />} />
          <Route path="ai" element={<DashboardAI user={authState.user!} />} />
        </Route>
        <Route path="/admin" element={<ProtectedRoute user={authState.user} requiredRole={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="profile" element={<AdminProfile user={authState.user!} onUserUpdate={onUserUpdate} />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="about-me" element={<AdminAbout />} />
          <Route path="seo" element={<AdminSEO />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({ user: null, token: null, isAuthenticated: false, isLoading: true });
  const [location, setLocation] = useState<LocationData | null>(null);
  
  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('devport_session_user');
      if (savedUser) setAuthState({ user: JSON.parse(savedUser), token: 'token', isAuthenticated: true, isLoading: false });
      else setAuthState(p => ({ ...p, isLoading: false }));
      
      const loc = await detectLocation();
      setLocation(loc);

      try {
        const about = await db.getAbout();
        
        // Update Favicon
        if (about.faviconUrl) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) link.href = about.faviconUrl;
        }

        const updateMeta = (property: string, content: string, attr: 'property' | 'name' = 'property') => {
          let meta = document.querySelector(`meta[${attr}='${property}']`);
          if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute(attr, property);
            document.head.appendChild(meta);
          }
          meta.setAttribute('content', content);
        };

        // Google Site Verification (Standard Token injection)
        if (about.googleConsoleToken) {
          updateMeta('google-site-verification', about.googleConsoleToken, 'name');
        }

        // Custom Raw HTML Meta/Script injection
        if (about.googleCustomHtml) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = about.googleCustomHtml;
          const nodes = Array.from(tempDiv.childNodes);
          nodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const el = node as HTMLElement;
              // Avoid duplicates based on name/property if it's a meta
              if (el.tagName === 'META') {
                const name = el.getAttribute('name');
                const prop = el.getAttribute('property');
                const selector = name ? `meta[name='${name}']` : prop ? `meta[property='${prop}']` : null;
                if (selector) {
                  const existing = document.querySelector(selector);
                  if (existing) existing.remove();
                }
              }
              document.head.appendChild(el.cloneNode(true));
            }
          });
        }

        // Update Social Share Meta Tags
        if (about.seoThumbnailUrl) {
          updateMeta('og:image', about.seoThumbnailUrl);
          updateMeta('og:title', about.title);
          updateMeta('og:description', about.overview);
          updateMeta('twitter:image', about.seoThumbnailUrl, 'name');
          updateMeta('twitter:title', about.title, 'name');
          updateMeta('twitter:description', about.overview, 'name');
        }

      } catch (err) {
        console.error("Failed to load global branding:", err);
      }
    };
    init();
  }, []);

  const handleAuthSuccess = (user: User) => { 
    localStorage.setItem('devport_session_user', JSON.stringify(user)); 
    setAuthState({ user, token: 'token', isAuthenticated: true, isLoading: false }); 
  };

  const handleUserUpdate = (user: User) => {
    setAuthState(prev => ({ ...prev, user }));
  };

  const handleLogout = () => { 
    localStorage.removeItem('devport_session_user'); 
    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false }); 
    toast.info("Logged out successfully.");
  };

  if (authState.isLoading) return <PageLoader />;

  return (
    <LocationContext.Provider value={location}>
      <Router>
        <Navbar user={authState.user} onLogout={handleLogout} />
        <main className="min-h-[calc(100vh-64px)] overflow-x-hidden">
          <Suspense fallback={<PageLoader />}>
            <RoutesContainer 
              authState={authState} 
              onUserUpdate={handleUserUpdate} 
              handleAuthSuccess={handleAuthSuccess} 
            />
          </Suspense>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </Router>
    </LocationContext.Provider>
  );
}
