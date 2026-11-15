import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Users,
  Image,
  UserCheck,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { dbService } from '../../lib/supabase';
import { useSettings } from '../../context/SettingsContext';

export default function AdminLayout({ children, title, subtitle }) {
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = settings?.business_name || 'Lotus Luxe Spa';

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Services', path: '/admin/services', icon: Sparkles },
    { name: 'Therapists', path: '/admin/therapists', icon: UserCheck },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = async () => {
    await dbService.logoutAdmin();
    navigate('/admin/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-stone-100 flex flex-col md:flex-row font-sans selection:bg-gold-500 selection:text-black">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0d15] border-r border-stone-800/80 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold-500/10 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-stone-100 block leading-tight truncate">
                {brandName}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                Admin Control Center
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-gradient-to-r from-gold-500/20 to-gold-500/5 text-gold-300 border-l-2 border-gold-400 font-semibold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-stone-500'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-gold-300 hover:bg-stone-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </span>
            <ChevronRight className="w-3 h-3 text-stone-600" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#0a0d15]/90 border-b border-stone-800/80 px-4 sm:px-8 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-serif font-bold text-stone-100 leading-none">
                {title || 'Dashboard Overview'}
              </h1>
              {subtitle && (
                <p className="text-xs text-stone-400 font-light mt-1 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Online</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <div className="w-8 h-8 rounded-full bg-stone-800 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-bold">
                AD
              </div>
              <span className="text-xs text-stone-300 font-medium hidden sm:inline">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0d15] border-b border-stone-800 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                    active ? 'bg-gold-500/15 text-gold-400 font-semibold' : 'text-stone-300 hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
              <Link to="/" target="_blank" className="text-xs text-gold-400 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Live Site</span>
              </Link>
              <button onClick={handleLogout} className="text-xs text-red-400 font-semibold flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Page Content */}
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

