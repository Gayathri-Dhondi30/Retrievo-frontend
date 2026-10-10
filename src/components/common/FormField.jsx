import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormField = ({
  label,
  id,
  type = 'text',
  error,
  required = false,
  icon: Icon,
  children,
  helpText,
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-brand-dark uppercase tracking-wider">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          rows={4}
          className={`w-full px-4 py-2.5 rounded-xl border bg-brand-cream text-brand-dark text-sm focus:outline-hidden transition-all ${
            error
              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-brand-caramel/25 focus:border-brand-caramel focus:ring-2 focus:ring-brand-caramel/20'
          }`}
          {...props}
        />
      ) : (
        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-caramel">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <input
            id={id}
            type={type}
            className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2.5 rounded-xl border bg-brand-cream text-brand-dark text-sm focus:outline-hidden transition-all ${
              error
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-brand-caramel/25 focus:border-brand-caramel focus:ring-2 focus:ring-brand-caramel/20'
            }`}
            {...props}
          />
        </div>
      )}

      {helpText && !error && <p className="text-[11px] text-brand-muted">{helpText}</p>}

      {error && (
        <p className="flex items-center gap-1 text-[11px] font-semibold text-rose-600">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormField;
