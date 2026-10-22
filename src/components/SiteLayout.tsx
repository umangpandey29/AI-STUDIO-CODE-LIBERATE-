/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarNav, 
  SidebarSection, 
  SidebarItem, 
  SidebarFooter, 
  SidebarToggle, 
  useSidebar 
} from './ui/sidebar';
import { 
  IconHome, 
  IconBriefcase, 
  IconShieldCheck, 
  IconCpu, 
  IconTag, 
  IconHelpCircle, 
  IconMail, 
  IconSparkles,
  IconMenu2,
  IconX,
  IconArrowUpRight
} from '@tabler/icons-react';
import { Footer } from '../MarketingSite';
import { motion, AnimatePresence } from 'motion/react';

const BRAND_LOGO = '/logo.png';
const BRAND_EMAIL = 'codeliberate0812@gmail.com';

function WorkspaceMark() {
  const { collapsed } = useSidebar();
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gold-400/30 blur-md rounded-full animate-pulse" />
        <img src={BRAND_LOGO} alt="Code Liberate" className="relative size-9 shrink-0 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-black uppercase tracking-[0.2em] text-white font-serif italic">Code Liberate</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="truncate text-[7.5px] uppercase tracking-[0.3em] text-gold-400/90 font-bold">Available Q2</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarUserFooter() {
  const { collapsed } = useSidebar();
  return (
    <div className="flex items-center gap-2.5 w-full p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-gold-400/30 transition-all">
      <div className="size-7 shrink-0 rounded-lg bg-gradient-to-br from-gold-400/30 to-gold-600/30 border border-gold-400/40 flex items-center justify-center text-gold-300 font-black text-xs">
        CL
      </div>
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-bold leading-tight text-white flex items-center gap-1">
            Client Portal <IconArrowUpRight className="size-3 text-gold-400" />
          </div>
          <div className="truncate text-[9.5px] leading-tight text-gray-400 font-mono">Secure Direct</div>
        </div>
      )}
    </div>
  );
}

export default function SiteLayout({
  onOpenMenu,
  onOpenPortal,
}: {
  onOpenMenu: () => void;
  onOpenPortal: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: <IconHome className="size-[18px]" stroke={1.75} /> },
    { label: 'Work', path: '/work', icon: <IconBriefcase className="size-[18px]" stroke={1.75} /> },
    { label: 'Why Us', path: '/why', icon: <IconShieldCheck className="size-[18px]" stroke={1.75} /> },
    { label: 'Process', path: '/process', icon: <IconCpu className="size-[18px]" stroke={1.75} /> },
    { label: 'Pricing', path: '/pricing', icon: <IconTag className="size-[18px]" stroke={1.75} /> },
    { label: 'FAQ', path: '/faq', icon: <IconHelpCircle className="size-[18px]" stroke={1.75} /> },
    { label: 'Contact', path: '/contact', icon: <IconMail className="size-[18px]" stroke={1.75} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex overflow-x-hidden selection:bg-gold-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-gold-500/5 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-600/5 blur-[160px] pointer-events-none -z-10" />

      {/* Desktop Sidebar Navigation */}
      <div className="hidden md:flex h-screen sticky top-0 z-40 border-r border-gold-500/15 bg-[#070707]/90 backdrop-blur-2xl">
        <Sidebar variant="collapsible" width={250} aria-label="Main navigation">
          <SidebarHeader>
            <WorkspaceMark />
            <SidebarToggle className="ml-auto text-gold-400 hover:text-gold-300" />
          </SidebarHeader>
          <SidebarNav>
            <SidebarSection label="Navigation">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  icon={item.icon}
                  active={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection label="Priority Action">
              <SidebarItem
                icon={<IconSparkles className="size-[18px] text-gold-400 animate-pulse" />}
                onClick={onOpenPortal}
                className="bg-gradient-to-r from-gold-500/15 to-gold-400/5 border border-gold-400/30 text-gold-200 hover:text-white"
              >
                Client Request
              </SidebarItem>
            </SidebarSection>
          </SidebarNav>
          <SidebarFooter>
            <SidebarUserFooter />
          </SidebarFooter>
        </Sidebar>
      </div>

      {/* Mobile Glassmorphic Floating Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-gold-500/20 px-4 h-18 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <img src={BRAND_LOGO} alt="Code Liberate" className="w-9 h-9 object-contain" />
          <div className="leading-tight">
            <span className="font-black text-xs uppercase tracking-[0.18em] text-white font-serif italic">Code Liberate</span>
            <span className="block text-[7px] uppercase tracking-[0.25em] text-gold-400 font-bold">Premium Agency</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPortal}
            className="bg-gold-400 text-black text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-2 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-transform"
          >
            Portal
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2.5 border border-gold-400/30 bg-white/5 rounded-full text-gold-300 hover:text-white hover:border-gold-400 transition-colors"
            aria-label="Open mobile menu"
          >
            <IconMenu2 className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col p-6 md:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <img src={BRAND_LOGO} alt="Code Liberate" className="w-10 h-10 object-contain" />
                <span className="font-black text-sm uppercase tracking-widest text-white font-serif italic">Code Liberate</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 border border-white/20 rounded-full text-white hover:bg-white/10"
              >
                <IconX className="size-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4 my-auto">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left text-xl font-serif italic font-bold transition-all ${
                    location.pathname === item.path
                      ? 'bg-gold-400/20 border border-gold-400/40 text-gold-300'
                      : 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className="text-gold-400">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4">
              <button
                onClick={() => {
                  onOpenPortal();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gold-400 text-black font-extrabold uppercase tracking-widest py-4 rounded-2xl text-center shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
              >
                Open Client Portal / Request
              </button>
              <a
                href={`mailto:${BRAND_EMAIL}`}
                className="text-center text-xs text-gold-400 font-mono tracking-widest uppercase hover:underline"
              >
                {BRAND_EMAIL}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pt-0 pt-18">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
