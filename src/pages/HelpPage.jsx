import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail } from 'lucide-react';

export const HelpPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does the AI visual matching feature work?',
      a: 'When an item report with an image is created, Retrievo compares image features and visual embeddings against eligible opposite-type items. It combines visual similarity with category, location, and date proximity scores to present candidate matches.'
    },
    {
      q: 'Is my personal contact information displayed on public pages?',
      a: 'No. Retrievo protects reporter privacy. Other users communicate with you securely using our internal private messaging system.'
    },
    {
      q: 'What should I do if I find my lost item on the website?',
      a: 'Click on the item page and select "Claim This Item". You will be asked to enter secret identifying proof (e.g., lock screen wallpaper, serial numbers, unique scratches) that the finder can verify.'
    },
    {
      q: 'Can I delete my report after recovering an item?',
      a: 'Yes. You can either mark the item status as RECOVERED or delete your report directly from your user dashboard or item detail page.'
    },
    {
      q: 'What happens if the optional Python AI service is offline?',
      a: 'Retrievo automatically falls back to a weighted keyword, category, location, and date similarity algorithm so matching functionality remains uninterrupted.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-brand-beige text-brand-caramel p-2.5 mx-auto flex items-center justify-center">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-brand-dark">Help Center & Frequently Asked Questions</h1>
        <p className="text-xs text-brand-muted">
          Find quick answers to common questions about reporting, matching, claiming, and recovery workflows.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-5 cursor-pointer transition-all shadow-xs"
              onClick={() => setOpenFaq(isOpen ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-brand-dark">{faq.q}</h3>
                {isOpen ? <ChevronUp className="w-4 h-4 text-brand-caramel" /> : <ChevronDown className="w-4 h-4 text-brand-muted" />}
              </div>
              {isOpen && <p className="text-xs text-brand-muted mt-3 pt-3 border-t border-brand-beige leading-relaxed">{faq.a}</p>}
            </div>
          );
        })}
      </div>

      <div className="bg-brand-beige/50 border border-brand-caramel/20 rounded-3xl p-6 text-center space-y-2">
        <h3 className="font-bold text-base text-brand-dark">Still need help?</h3>
        <p className="text-xs text-brand-muted">Contact our support team at support@retrievo.app</p>
      </div>
    </div>
  );
};

export default HelpPage;
