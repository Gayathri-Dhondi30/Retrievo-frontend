import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Lock, Award, Heart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-brand-beige text-brand-dark text-xs font-bold border border-brand-caramel/20">
          About Retrievo Platform
        </span>
        <h1 className="text-4xl font-extrabold text-brand-dark">
          Reuniting Belongings With Their Rightful Owners
        </h1>
        <p className="text-base text-brand-muted leading-relaxed">
          Retrievo is an AI-assisted Lost & Found system designed for modern campuses, educational institutions, hostels, shopping malls, and public spaces.
        </p>
      </div>

      {/* Verification Standard */}
      <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-8 shadow-md grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-beige text-brand-caramel flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-brand-dark">AI Matching Engine</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Combines image visual features with category, keyword, date, and location proximity scoring.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-beige text-brand-caramel flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-brand-dark">Claim Verification</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Claimants provide secret proof details (wallpaper images, serial numbers) for finder approval.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-brand-beige text-brand-caramel flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-brand-dark">Privacy Protection</h3>
          <p className="text-xs text-brand-muted leading-relaxed">
            Personal emails and phone numbers are protected from public search indexing.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-secondary text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold">Ready to Report or Recover an Item?</h2>
        <p className="text-xs text-brand-beige/80 max-w-xl mx-auto">
          Start browsing discovered items or report a lost belonging today.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            to="/report/lost"
            className="px-5 py-2.5 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md"
          >
            Report Lost Item
          </Link>
          <Link
            to="/browse"
            className="px-5 py-2.5 rounded-xl bg-brand-beige text-brand-dark font-bold text-xs shadow-md"
          >
            Browse Directory
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
