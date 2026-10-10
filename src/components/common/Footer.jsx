import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-brand-dark text-brand-beige pt-16 pb-12 border-t border-brand-secondary/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-brand-secondary/40">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-caramel p-2 shadow-xs flex items-center justify-center">
                <img src="/logo.svg" alt="Retrievo Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">Retrievo</span>
            </div>
            <p className="text-xs text-brand-beige/80 leading-relaxed">
              AI-powered lost & found recovery system for campuses, offices, public venues, and communities. Reuniting people with their precious belongings.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-brand-caramel">
              <Sparkles className="w-4 h-4" />
              <span>Smart AI Matching Engine Enabled</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-brand-beige/80 hover:text-white transition-colors">
                  Home Landing Page
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-brand-beige/80 hover:text-white transition-colors">
                  Browse Lost & Found Directory
                </Link>
              </li>
              <li>
                <Link to="/report/lost" className="text-brand-beige/80 hover:text-white transition-colors">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report/found" className="text-brand-beige/80 hover:text-white transition-colors">
                  Report a Found Item
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Support & Info</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="text-brand-beige/80 hover:text-white transition-colors">
                  How It Works & Verification
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-brand-beige/80 hover:text-white transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <span className="text-brand-beige/80 cursor-pointer hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </span>
              </li>
              <li>
                <span className="text-brand-beige/80 cursor-pointer hover:text-white transition-colors">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          {/* Target Venues & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Contact & Venues</h4>
            <div className="space-y-2 text-xs text-brand-beige/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                Universities, Hostels & Public Spaces
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                support@retrievo.app
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                Protected End-to-End Recovery
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-beige/60">
          <p>© {new Date().getFullYear()} Retrievo — Smart Lost & Found System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-brand-caramel fill-brand-caramel" /> for Academic Full-Stack Demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
