import React from 'react';
import { Sparkles, CheckCircle2, Clock, XCircle, Search, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ status, type = 'item' }) => {
  const normalized = status ? status.toUpperCase() : 'OPEN';

  let config = {
    label: normalized,
    bg: 'bg-amber-100',
    text: 'text-amber-900',
    border: 'border-amber-300',
    icon: <Search className="w-3.5 h-3.5" />
  };

  switch (normalized) {
    case 'OPEN':
      config = {
        label: 'Open',
        bg: 'bg-amber-100/80',
        text: 'text-amber-900',
        border: 'border-amber-300',
        icon: <Search className="w-3.5 h-3.5" />
      };
      break;
    case 'MATCHED':
      config = {
        label: 'Matched',
        bg: 'bg-sky-100',
        text: 'text-sky-900',
        border: 'border-sky-300',
        icon: <Sparkles className="w-3.5 h-3.5" />
      };
      break;
    case 'CLAIM_PENDING':
    case 'PENDING':
      config = {
        label: 'Claim Pending',
        bg: 'bg-orange-100',
        text: 'text-orange-900',
        border: 'border-orange-300',
        icon: <Clock className="w-3.5 h-3.5" />
      };
      break;
    case 'CLAIM_APPROVED':
    case 'APPROVED':
      config = {
        label: 'Claim Approved',
        bg: 'bg-emerald-100',
        text: 'text-emerald-900',
        border: 'border-emerald-300',
        icon: <ShieldCheck className="w-3.5 h-3.5" />
      };
      break;
    case 'RECOVERED':
      config = {
        label: 'Recovered',
        bg: 'bg-emerald-800',
        text: 'text-emerald-50',
        border: 'border-emerald-700',
        icon: <CheckCircle2 className="w-3.5 h-3.5" />
      };
      break;
    case 'CLOSED':
      config = {
        label: 'Closed',
        bg: 'bg-stone-200',
        text: 'text-stone-800',
        border: 'border-stone-300',
        icon: <XCircle className="w-3.5 h-3.5" />
      };
      break;
    case 'REJECTED':
    case 'CANCELLED':
      config = {
        label: 'Rejected',
        bg: 'bg-rose-100',
        text: 'text-rose-900',
        border: 'border-rose-300',
        icon: <XCircle className="w-3.5 h-3.5" />
      };
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} transition-colors shadow-xs`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default StatusBadge;
