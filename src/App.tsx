/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './lib/firebase';
import { emailjs, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } from './lib/emailjs';
import { 
  LayoutDashboard, 
  Plus, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Upload,
  Send,
  X,
  FileText,
  Menu,
  User as UserIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import WhyPage from './pages/WhyPage';
import ProcessPage from './pages/ProcessPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import DashboardLayout from './dashboard/DashboardLayout';
import OrdersListPage from './dashboard/OrdersListPage';
import OrderDetailPage from './dashboard/OrderDetailPage';
import ActivityPage from './dashboard/ActivityPage';
import ProfilePage from './dashboard/ProfilePage';
import { createOrder } from './lib/orders';

// --- Branding ---
const BRAND_LOGO = '/logo.png';
const BRAND_EMAIL = 'codeliberate0812@gmail.com';

// --- Default Guest User ---
const DEFAULT_USER = {
  uid: 'client-guest-user',
  displayName: 'Valued Client',
  email: 'client@codeliberate.com',
  photoURL: '',
};

interface Project {
  id: string;
  title: string;
  status: 'Active' | 'Completed' | 'In Review' | 'Planning';
  description: string;
  updatedAt: any;
}

// --- Components ---

const RequestModal = ({ 
  user, 
  onClose, 
  onSubmitSuccess 
}: { 
  user: typeof DEFAULT_USER; 
  onClose: () => void;
  onSubmitSuccess: (orderId: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    type: 'Design Change',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create order + seed conversation in Firestore
      const orderDocId = await createOrder({
        userId: user.uid,
        userName: user.displayName || 'Client',
        userEmail: user.email || '',
        projectName: formData.projectName,
        type: formData.type,
        description: formData.message,
      });

      // 2. Send via EmailJS - configured with live credentials in src/lib/emailjs.ts
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: user.displayName || 'Client',
            from_email: user.email,
            project_name: formData.projectName,
            request_type: formData.type,
            message: formData.message,
            to_email: BRAND_EMAIL,
            subject: `New Client Request - ${formData.projectName} (${formData.type})`,
            source: `Client Portal · Order ${orderDocId}`,
          }
        );
      } catch (emailErr) {
        console.warn("EmailJS send failed - order is still saved in Firestore.", emailErr);
      }

      onSubmitSuccess(orderDocId);
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500/20 p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit New Request</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Professional Support</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Project Name</label>
              <input 
                required
                type="text"
                placeholder="e.g. ABC Clinic Website"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Request Type</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Design Change" className="bg-[#0f0f0f]">Design Change</option>
                <option value="Content Update" className="bg-[#0f0f0f]">Content Update</option>
                <option value="Bug Fix" className="bg-[#0f0f0f]">Bug Fix</option>
                <option value="General Question" className="bg-[#0f0f0f]">General Question</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Detailed Message</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your request in detail..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="p-4 bg-gold-500/5 border border-gold-500/10 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-gold-200">Revision Policy</p>
                <p className="text-[10px] text-gray-400">We respond within 24 hours. Each request includes 2 rounds of revisions.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
          >
            {loading ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-5 h-5" />
               </motion.div>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [user] = useState(DEFAULT_USER);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Save/ensure user doc in Firestore on load
    const userRef = doc(db, 'users', user.uid);
    setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      lastLogin: serverTimestamp(),
    }, { merge: true }).catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-gold-500/30 bg-black">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            element={
              <SiteLayout
                onOpenMenu={() => setShowMenu(true)}
                onOpenPortal={() => setShowRequestModal(true)}
              />
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/why" element={<WhyPage />} />
            <Route path="/process" element={<ProcessPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route
              path="/contact"
              element={
                <ContactPage
                  onLeadSubmit={async (lead) => {
                    let emailOk = false;
                    let firestoreOk = false;

                    try {
                      await emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        {
                          from_name: lead.name,
                          from_email: lead.email,
                          project_name: lead.business,
                          request_type: `Free Prototype — ${lead.style}`,
                          message: `New free-prototype request from ${lead.name} (${lead.email}) for "${lead.business}". Preferred design style: ${lead.style}.`,
                          to_email: BRAND_EMAIL,
                          subject: `New Free-Prototype Lead — ${lead.business}`,
                          source: 'Marketing Site /contact',
                        }
                      );
                      emailOk = true;
                    } catch (emailErr) {
                      console.warn('EmailJS lead notification failed.', emailErr);
                    }

                    try {
                      await addDoc(collection(db, 'leads'), {
                        ...lead,
                        userId: user.uid,
                        createdAt: serverTimestamp(),
                        status: 'New',
                        emailSent: emailOk,
                      });
                      firestoreOk = true;
                    } catch (fsErr) {
                      console.warn('Firestore lead save failed.', fsErr);
                    }

                    if (!emailOk && !firestoreOk) {
                      throw new Error('Submission failed on both email and database paths.');
                    }
                  }}
                />
              }
            />
            <Route path="/portal" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {/* Elite Unified Hub Drawer - The 'Merged' Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[110]"
            />
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-10"
            >
              <button 
                onClick={() => setShowMenu(false)} 
                data-testid="menu-close-btn"
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-4"
              >
                <X className="w-10 h-10" />
              </button>

              {/* Unified Navigation List */}
              <nav className="flex flex-col items-center gap-8 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                  <img
                    src={BRAND_LOGO}
                    alt="Code Liberate"
                    data-testid="menu-brand-logo"
                    className="w-20 h-20 object-contain mb-4 filter drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                  />
                  <p className="text-[16px] font-black tracking-[0.1em] text-white uppercase mb-2">Code Liberate</p>
                  <p className="text-gold-500/60 text-[7px] uppercase tracking-[0.4em] font-bold text-center leading-loose">
                    We don't just build website. We build businesses
                  </p>
                  <a
                    href={`mailto:${BRAND_EMAIL}`}
                    data-testid="menu-brand-email"
                    className="mt-3 text-[10px] font-semibold text-gold-400 hover:text-gold-300 uppercase tracking-[0.25em] transition-colors"
                  >
                    {BRAND_EMAIL}
                  </a>
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  {[
                    { label: 'Home', path: '/' },
                    { label: 'Work', path: '/work' },
                    { label: 'Why Us', path: '/why' },
                    { label: 'Process', path: '/process' },
                    { label: 'Pricing', path: '/pricing' },
                    { label: 'FAQ', path: '/faq' },
                    { label: 'Contact', path: '/contact' },
                  ].map((link) => (
                    <button 
                      key={link.label}
                      onClick={() => {
                        window.history.pushState({}, '', link.path);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        setShowMenu(false);
                      }}
                      data-testid={`menu-link-${link.label.toLowerCase().replace(' ', '-')}`}
                      className="text-3xl sm:text-5xl font-black text-white hover:text-gold-400 transition-all uppercase tracking-tighter font-serif italic"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <div className="w-24 h-[1px] bg-gold-500/20 my-8" />

                {/* Portal Specific Hub Links */}
                <div className="flex flex-col items-center gap-6 w-full">
                  <button 
                    onClick={() => {
                      setShowRequestModal(true);
                      setShowMenu(false);
                    }}
                    data-testid="menu-client-portal-btn"
                    className="bg-gold-400 text-black px-12 py-5 rounded-full font-black text-lg hover:bg-gold-300 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.25)] active:scale-95 uppercase tracking-widest"
                  >
                    Client Portal / Request
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRequestModal && (
          <RequestModal 
            user={user} 
            onClose={() => setShowRequestModal(false)}
            onSubmitSuccess={(orderId) => {
              alert(`Request submitted successfully! Order ID: ${orderId}. We will respond within 24 hours.`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
