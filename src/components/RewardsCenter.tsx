import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Copy,
  Check,
  Users,
  Lock,
  Unlock,
  Twitter,
  Linkedin,
} from 'lucide-react';
import { useReferral } from '@/contexts/ReferralContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface RewardsCenterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CREDITS_TO_UNLOCK = 10;

// Mini resume preview components
const ExecutivePreview = () => (
  <svg viewBox="0 0 60 80" className="w-full h-full">
    {/* Sidebar */}
    <rect x="0" y="0" width="20" height="80" fill="#f0f4f8" />
    {/* Profile circle */}
    <circle cx="10" cy="12" r="6" fill="#cbd5e1" />
    {/* Sidebar lines */}
    <rect x="3" y="22" width="14" height="2" rx="1" fill="#94a3b8" />
    <rect x="3" y="27" width="10" height="1.5" rx="0.75" fill="#cbd5e1" />
    <rect x="3" y="31" width="12" height="1.5" rx="0.75" fill="#cbd5e1" />
    <rect x="3" y="38" width="14" height="2" rx="1" fill="#94a3b8" />
    <rect x="3" y="43" width="11" height="1.5" rx="0.75" fill="#cbd5e1" />
    <rect x="3" y="47" width="13" height="1.5" rx="0.75" fill="#cbd5e1" />
    {/* Main content */}
    <rect x="24" y="6" width="28" height="3" rx="1.5" fill="#64748b" />
    <rect x="24" y="12" width="20" height="2" rx="1" fill="#94a3b8" />
    <rect x="24" y="20" width="32" height="2" rx="1" fill="#e2e8f0" />
    <rect x="24" y="25" width="30" height="2" rx="1" fill="#e2e8f0" />
    <rect x="24" y="30" width="28" height="2" rx="1" fill="#e2e8f0" />
    <rect x="24" y="40" width="18" height="2.5" rx="1" fill="#94a3b8" />
    <rect x="24" y="46" width="32" height="2" rx="1" fill="#e2e8f0" />
    <rect x="24" y="51" width="28" height="2" rx="1" fill="#e2e8f0" />
    <rect x="24" y="56" width="30" height="2" rx="1" fill="#e2e8f0" />
  </svg>
);

const TechnicalPreview = () => (
  <svg viewBox="0 0 60 80" className="w-full h-full">
    {/* Terminal-like header */}
    <rect x="0" y="0" width="60" height="10" fill="#1e293b" />
    <circle cx="5" cy="5" r="1.5" fill="#ef4444" />
    <circle cx="10" cy="5" r="1.5" fill="#eab308" />
    <circle cx="15" cy="5" r="1.5" fill="#22c55e" />
    {/* Content area */}
    <rect x="0" y="10" width="60" height="70" fill="#f8fafc" />
    {/* Name with code style */}
    <rect x="4" y="16" width="2" height="3" fill="#3b82f6" />
    <rect x="8" y="16" width="24" height="3" rx="1" fill="#334155" />
    {/* Contact as inline code */}
    <rect x="4" y="23" width="36" height="2" rx="1" fill="#e2e8f0" />
    {/* Section with bracket */}
    <rect x="4" y="32" width="1.5" height="8" fill="#3b82f6" />
    <rect x="8" y="32" width="16" height="2" rx="1" fill="#64748b" />
    <rect x="8" y="37" width="40" height="1.5" rx="0.75" fill="#cbd5e1" />
    {/* Skills as tags */}
    <rect x="4" y="48" width="12" height="4" rx="2" fill="#dbeafe" />
    <rect x="18" y="48" width="14" height="4" rx="2" fill="#dbeafe" />
    <rect x="34" y="48" width="10" height="4" rx="2" fill="#dbeafe" />
    <rect x="4" y="54" width="16" height="4" rx="2" fill="#dbeafe" />
    <rect x="22" y="54" width="12" height="4" rx="2" fill="#dbeafe" />
    {/* More content */}
    <rect x="4" y="64" width="1.5" height="8" fill="#3b82f6" />
    <rect x="8" y="64" width="20" height="2" rx="1" fill="#64748b" />
    <rect x="8" y="69" width="44" height="1.5" rx="0.75" fill="#cbd5e1" />
  </svg>
);

const premiumTemplates = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sidebar layout for professionals',
    Preview: ExecutivePreview,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-inspired design',
    Preview: TechnicalPreview,
  },
];

export default function RewardsCenter({ open, onOpenChange }: RewardsCenterProps) {
  const { user } = useAuth();
  const { 
    referralStats,
    loading,
    getReferralLink, 
    isTemplateUnlocked, 
    unlockTemplate,
    canAffordUnlock,
    credits,
  } = useReferral();
  const [copied, setCopied] = useState(false);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  const referralLink = getReferralLink();

  // Generate a fallback referral link using user's uid if userProfile hasn't loaded yet
  const displayReferralLink = referralLink || (loading ? 'Loading...' : 'Unable to load referral link');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'whatsapp') => {
    const text = encodeURIComponent('Build your perfect resume in minutes with Resumae! 🚀');
    const url = encodeURIComponent(referralLink);
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
  };

  const handleUnlockTemplate = async (templateId: string) => {
    if (!canAffordUnlock) {
      toast.error('Not enough credits. Invite friends to earn more!');
      return;
    }

    setUnlocking(templateId);
    const success = await unlockTemplate(templateId);
    setUnlocking(null);

    if (success) {
      toast.success(`${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template unlocked!`);
    } else {
      toast.error('Failed to unlock template');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 border border-[#e2e8f0] bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#f1f5f9]">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-[#1e293b] flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#fef9c3] flex items-center justify-center">
                <svg
      width={16}
      height={16}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path fill="#EFB832" d="M256,512C114.841,512,0,397.159,0,256S114.841,0,256,0s256,114.841,256,256S397.159,512,256,512z" />
        <g opacity="0.2">
          <g>
            <path fill="#FFFFFF" d="M331.858,278.511c-2.639-7.713-6.907-14.208-12.786-19.487 c-4.679-4.679-10.266-8.329-16.762-10.969c-6.496-2.639-14.723-4.679-24.68-6.102l-1.92-0.291l-23.978-3.668 c-4.662-0.6-8.57-1.628-11.723-3.051c-1.32-0.583-2.554-1.234-3.719-1.936c-1.611-0.977-3.051-2.057-4.353-3.24 c-2.245-2.228-3.805-4.662-4.73-7.301c-0.908-2.639-1.371-5.382-1.371-8.227c0-7.524,2.691-13.968,8.073-19.35 c0.737-0.737,1.525-1.423,2.382-2.04c5.348-4.028,12.94-6.033,22.761-6.033c5.33,0,10.883,0.48,16.659,1.457 c1.936,0.326,3.891,0.703,5.879,1.131c7.918,1.731,15.237,5.844,21.938,12.34l26.806-26.514 c-9.341-9.135-19.59-15.631-30.765-19.487c-7.164-2.468-15.133-4.165-23.875-5.039c-4.884-0.514-10.026-0.754-15.425-0.754 c-8.638,0-16.642,0.874-23.978,2.639c-2.657,0.634-5.227,1.371-7.713,2.245c-9.341,3.24-17.259,7.764-23.755,13.54 c-6.496,5.793-11.484,12.7-14.928,20.721c-3.462,8.021-5.176,16.917-5.176,26.669c0,18.476,5.176,32.702,15.528,42.642 c4.885,4.679,10.66,8.484,17.362,11.432c5.296,2.314,11.5,4.165,18.681,5.519c1.937,0.377,3.925,0.72,5.999,1.028l25.897,3.959 c2.913,0.428,5.416,0.891,7.524,1.371c1.868,0.446,3.428,0.891,4.662,1.371c2.639,1.011,5.073,2.537,7.318,4.559 c4.456,4.473,6.701,10.472,6.701,17.979c0,8.741-3.256,15.442-9.752,20.104c-2.502,1.817-5.484,3.274-8.929,4.37 c-5.484,1.765-12.151,2.639-20.018,2.639c-6.684,0-13.163-0.6-19.402-1.8c-3.034-0.583-5.999-1.303-8.929-2.159 c-8.929-2.639-16.848-7.404-23.755-14.311l-27.423,27.405c10.558,10.78,22.281,18.236,35.187,22.401 c7.678,2.485,15.991,4.216,24.938,5.21c6.067,0.686,12.443,1.029,19.093,1.029c7.061,0,13.831-0.566,20.31-1.714 c3.942-0.686,7.781-1.594,11.517-2.708c9.855-2.931,18.373-7.198,25.589-12.786c7.216-5.587,12.854-12.443,16.917-20.567 c4.062-8.124,6.085-17.465,6.085-28.022C335.817,294.964,334.497,286.24,331.858,278.511z" />
          </g>
          <path fill="#FFFFFF" d="M275.71,151.407v36.866c-5.776-0.977-11.329-1.457-16.659-1.457 c-9.821,0-17.413,2.005-22.761,6.033v-41.442c0-10.849,8.878-19.71,19.71-19.71c5.416,0,10.352,2.211,13.917,5.793 c3.428,3.411,5.605,8.073,5.776,13.214C275.71,150.944,275.71,151.167,275.71,151.407z" />
          <path fill="#FFFFFF" d="M275.71,241.662v40.054c-2.108-0.48-4.61-0.943-7.524-1.371l-25.897-3.959 c-2.074-0.309-4.062-0.651-5.999-1.028v-42.351c1.165,0.703,2.399,1.354,3.719,1.936c3.154,1.423,7.061,2.451,11.723,3.051 L275.71,241.662z" />
          <path fill="#FFFFFF" d="M255.692,332.739c7.867,0,14.534-0.874,20.018-2.639v38.974c0,10.832-8.861,19.71-19.71,19.71 c-10.695,0-19.487-8.655-19.693-19.299c-0.017-0.137-0.017-0.274-0.017-0.411v-38.135 C242.529,332.139,249.007,332.739,255.692,332.739z" />
        </g>
        <g opacity="0.5">
          <path fill="#AE8132" d="M256.001,472.633c-119.452,0-216.633-97.181-216.633-216.633s97.18-216.633,216.633-216.633 c119.452,0,216.633,97.18,216.633,216.633S375.453,472.633,256.001,472.633z M256.001,94.604 c-88.994,0-161.396,72.402-161.396,161.396s72.402,161.396,161.396,161.396c88.994,0,161.396-72.402,161.396-161.396 S344.994,94.604,256.001,94.604z" />
        </g>
        <g>
          <path fill="#EFB832" d="M184,82.265c0.458,1.164,0.856,2.222,1.187,3.17c0.334,0.946,0.576,1.846,0.725,2.697 c0.15,0.847,0.19,1.669,0.117,2.461c-0.069,0.789-0.291,1.617-0.664,2.474c-0.497,1.144-1.183,2.144-2.057,3.002 c-0.874,0.854-2.02,1.563-3.434,2.118c-1.411,0.555-2.736,0.819-3.972,0.791c-1.236-0.028-2.425-0.287-3.572-0.786 c-0.855-0.376-1.579-0.827-2.17-1.359c-0.593-0.529-1.119-1.161-1.572-1.89c-0.461-0.729-0.888-1.553-1.29-2.473 c-0.405-0.924-0.833-1.965-1.291-3.129c-0.456-1.162-0.851-2.217-1.183-3.166c-0.336-0.95-0.582-1.846-0.745-2.692 c-0.16-0.841-0.208-1.661-0.134-2.453c0.069-0.791,0.293-1.617,0.664-2.474c0.499-1.144,1.189-2.146,2.077-3.009 c0.885-0.861,2.034-1.568,3.45-2.123c1.414-0.558,2.733-0.819,3.957-0.786c1.221,0.031,2.408,0.295,3.552,0.791 c0.857,0.373,1.581,0.829,2.172,1.359c0.591,0.532,1.118,1.161,1.59,1.884c0.469,0.724,0.905,1.548,1.307,2.466 C183.114,80.06,183.547,81.104,184,82.265z M179.247,84.134c-0.458-1.162-0.86-2.116-1.204-2.861 c-0.347-0.745-0.665-1.35-0.954-1.817c-0.289-0.467-0.566-0.825-0.836-1.07c-0.27-0.253-0.567-0.459-0.893-0.619 c-0.495-0.255-1.047-0.396-1.653-0.437c-0.608-0.039-1.241,0.074-1.902,0.336c-0.66,0.257-1.205,0.611-1.622,1.05 c-0.419,0.444-0.736,0.926-0.947,1.457c-0.128,0.343-0.208,0.697-0.233,1.062c-0.028,0.365,0.011,0.817,0.117,1.356 c0.108,0.538,0.294,1.195,0.559,1.973c0.268,0.778,0.629,1.749,1.088,2.912c0.456,1.162,0.851,2.119,1.187,2.867 c0.334,0.753,0.645,1.354,0.929,1.81s0.559,0.807,0.826,1.055c0.272,0.252,0.569,0.454,0.898,0.618 c0.514,0.241,1.08,0.39,1.694,0.438c0.611,0.05,1.246-0.056,1.91-0.318c0.659-0.26,1.198-0.613,1.612-1.068 c0.412-0.453,0.715-0.941,0.904-1.461c0.13-0.341,0.208-0.695,0.236-1.06c0.026-0.367-0.009-0.813-0.112-1.34 c-0.101-0.525-0.279-1.177-0.534-1.961C180.059,86.273,179.704,85.297,179.247,84.134z" />
          <path fill="#EFB832" d="M208.075,89.001l-14.273-12.715l4.284,15.481l-4.922,1.363l-6.984-25.224l4.395-1.215 l14.263,12.682l-4.276-15.446l4.927-1.361l6.981,25.22L208.075,89.001z" />
          <path fill="#EFB832" d="M217.723,86.957l-3.763-25.9l17.059-2.478l0.655,4.511l-12.002,1.744l0.88,6.072l10.224-1.482 l0.652,4.506l-10.219,1.486l0.915,6.295l12.004-1.744l0.657,4.508L217.723,86.957z" />
          <path fill="#EFB832" d="M266.141,65.704c-0.005,1.105-0.205,2.15-0.602,3.141c-0.396,0.993-0.962,1.859-1.7,2.604 c-0.738,0.744-1.649,1.33-2.728,1.753c-1.081,0.428-2.293,0.637-3.638,0.632l-5.039-0.022l-0.038,9.852l-5.108-0.018 l0.101-26.174l10.144,0.04c1.348,0.005,2.562,0.224,3.64,0.657c1.076,0.431,1.979,1.026,2.712,1.774 c0.731,0.752,1.293,1.624,1.68,2.617C265.954,63.557,266.144,64.599,266.141,65.704z M261.031,65.686 c0.006-1.078-0.329-1.95-1-2.613c-0.671-0.665-1.596-1.002-2.771-1.003l-4.78-0.02l-0.026,7.165l4.78,0.02 c1.173,0.004,2.101-0.316,2.776-0.962C260.685,67.627,261.027,66.764,261.031,65.686z" />
          <path fill="#EFB832" d="M269.683,84.046l2.934-26.005l17.129,1.93l-0.51,4.529l-12.054-1.357l-0.686,6.1l10.263,1.155 l-0.512,4.531l-10.264-1.158l-0.712,6.319l12.054,1.357l-0.51,4.531L269.683,84.046z" />
          <path fill="#EFB832" d="M306.119,90.148l-6.472-17.989l-3.624,15.652l-4.979-1.154l5.906-25.498l4.439,1.029l6.484,17.953 l3.615-15.613l4.979,1.154l-5.904,25.496L306.119,90.148z" />
          <path fill="#EFB832" d="M330.211,98.029l-4.201-18.647l-5.531,15.08l-4.798-1.762l9.015-24.567l4.277,1.571l4.212,18.615 l5.521-15.048l4.796,1.762l-9.015,24.572L330.211,98.029z" />
          <path fill="#EFB832" d="M353.133,96.742l-4.795,9.6l-4.539-2.264l4.795-9.604l-0.141-17.323l4.964,2.478l-0.337,11.622 l9.022-7.288l4.964,2.478L353.133,96.742z" />
        </g>
        <g>
          <path fill="#EFB832" d="M331.201,432.648c-0.458-1.165-0.856-2.222-1.187-3.17c-0.334-0.946-0.576-1.846-0.725-2.697 c-0.149-0.846-0.19-1.669-0.117-2.46c0.069-0.789,0.291-1.617,0.664-2.475c0.497-1.144,1.183-2.144,2.057-3.002 c0.874-0.854,2.02-1.563,3.434-2.118c1.412-0.555,2.736-0.819,3.972-0.791c1.237,0.028,2.425,0.287,3.572,0.786 c0.855,0.376,1.579,0.827,2.17,1.359c0.593,0.529,1.118,1.161,1.572,1.89c0.461,0.729,0.888,1.553,1.29,2.473 c0.405,0.924,0.832,1.965,1.291,3.129c0.456,1.162,0.851,2.217,1.183,3.165c0.336,0.95,0.582,1.846,0.745,2.692 c0.16,0.841,0.208,1.661,0.134,2.453c-0.069,0.792-0.293,1.617-0.664,2.474c-0.499,1.144-1.189,2.146-2.077,3.01 c-0.885,0.861-2.034,1.568-3.45,2.123c-1.414,0.558-2.733,0.819-3.957,0.786c-1.221-0.031-2.408-0.294-3.552-0.792 c-0.857-0.373-1.582-0.829-2.172-1.359c-0.591-0.532-1.119-1.161-1.59-1.884c-0.469-0.724-0.905-1.548-1.307-2.466 C332.087,434.852,331.655,433.808,331.201,432.648z M335.954,430.778c0.458,1.162,0.86,2.116,1.204,2.861 c0.347,0.745,0.665,1.35,0.954,1.817c0.289,0.467,0.566,0.825,0.836,1.071c0.27,0.253,0.567,0.459,0.893,0.619 c0.495,0.256,1.047,0.396,1.653,0.437c0.608,0.039,1.241-0.073,1.902-0.336c0.659-0.257,1.204-0.611,1.622-1.05 c0.42-0.444,0.736-0.926,0.947-1.457c0.128-0.343,0.208-0.697,0.234-1.062c0.028-0.365-0.011-0.817-0.117-1.355 c-0.108-0.539-0.294-1.195-0.559-1.973c-0.267-0.778-0.629-1.749-1.088-2.912c-0.456-1.162-0.851-2.119-1.187-2.867 c-0.334-0.753-0.645-1.353-0.929-1.81c-0.284-0.456-0.559-0.807-0.826-1.055c-0.272-0.252-0.569-0.454-0.898-0.618 c-0.514-0.241-1.08-0.39-1.694-0.438c-0.611-0.05-1.246,0.056-1.91,0.318c-0.659,0.26-1.198,0.613-1.612,1.068 c-0.412,0.453-0.715,0.941-0.905,1.461c-0.13,0.341-0.208,0.695-0.236,1.06c-0.026,0.367,0.009,0.813,0.112,1.34 c0.101,0.525,0.279,1.177,0.534,1.961C335.143,428.639,335.498,429.616,335.954,430.778z" />
          <path fill="#EFB832" d="M307.126,425.912l14.273,12.715l-4.284-15.481l4.922-1.363l6.984,25.224l-4.395,1.215 l-14.263-12.682l4.276,15.446l-4.927,1.361l-6.981-25.22L307.126,425.912z" />
          <path fill="#EFB832" d="M297.479,427.955l3.763,25.9l-17.059,2.478l-0.655-4.511l12.002-1.744l-0.88-6.072l-10.224,1.482 l-0.652-4.506l10.219-1.486l-0.915-6.295l-12.004,1.744l-0.657-4.508L297.479,427.955z" />
          <path fill="#EFB832" d="M249.06,449.208c0.005-1.105,0.205-2.15,0.602-3.141c0.396-0.993,0.962-1.859,1.7-2.603 c0.738-0.744,1.649-1.33,2.728-1.753c1.081-0.428,2.293-0.637,3.638-0.632l5.038,0.022l0.038-9.852l5.108,0.018l-0.101,26.174 l-10.144-0.04c-1.348-0.005-2.562-0.224-3.64-0.657c-1.076-0.431-1.979-1.026-2.712-1.774c-0.731-0.752-1.293-1.624-1.68-2.617 C249.248,451.355,249.058,450.313,249.06,449.208z M254.171,449.226c-0.006,1.078,0.329,1.95,1,2.613 c0.671,0.665,1.596,1.001,2.771,1.003l4.78,0.02l0.026-7.165l-4.78-0.02c-1.172-0.004-2.101,0.316-2.776,0.962 C254.516,447.285,254.174,448.148,254.171,449.226z" />
          <path fill="#EFB832" d="M245.519,430.866l-2.934,26.005l-17.129-1.93l0.51-4.529l12.054,1.357l0.686-6.1l-10.264-1.155 l0.512-4.531l10.264,1.158l0.712-6.319l-12.054-1.357l0.51-4.531L245.519,430.866z" />
          <path fill="#EFB832" d="M209.083,424.764l6.472,17.989l3.624-15.652l4.979,1.154l-5.906,25.498l-4.439-1.029 l-6.484-17.953l-3.615,15.613l-4.979-1.154l5.904-25.496L209.083,424.764z" />
          <path fill="#EFB832" d="M184.991,416.883l4.2,18.647l5.531-15.08l4.798,1.762l-9.015,24.567l-4.277-1.571l-4.213-18.616 l-5.521,15.048l-4.796-1.762l9.015-24.572L184.991,416.883z" />
          <path fill="#EFB832" d="M162.068,418.17l4.795-9.6l4.539,2.264l-4.795,9.604l0.141,17.323l-4.964-2.478l0.337-11.622 l-9.022,7.288l-4.964-2.478L162.068,418.17z" />
        </g>
        <g>
          <g>
            <path fill="#CC9322" d="M331.858,274.27c-2.639-7.713-6.907-14.208-12.786-19.487 c-4.679-4.679-10.266-8.329-16.762-10.969c-6.496-2.639-14.723-4.679-24.68-6.102l-1.92-0.292l-23.978-3.668 c-4.662-0.6-8.57-1.628-11.723-3.051c-1.32-0.583-2.554-1.234-3.719-1.936c-1.611-0.977-3.051-2.057-4.353-3.24 c-2.245-2.228-3.805-4.662-4.73-7.301c-0.908-2.639-1.371-5.382-1.371-8.227c0-7.524,2.691-13.968,8.073-19.35 c0.737-0.737,1.525-1.423,2.382-2.04c5.348-4.028,12.94-6.033,22.761-6.033c5.33,0,10.883,0.48,16.659,1.457 c1.936,0.326,3.891,0.703,5.879,1.131c7.918,1.731,15.237,5.844,21.938,12.34l26.806-26.514 c-9.341-9.135-19.59-15.631-30.765-19.487c-7.164-2.468-15.133-4.165-23.875-5.039c-4.884-0.514-10.026-0.754-15.425-0.754 c-8.638,0-16.642,0.874-23.978,2.64c-2.657,0.634-5.227,1.371-7.713,2.245c-9.341,3.239-17.259,7.764-23.755,13.54 c-6.496,5.793-11.484,12.7-14.928,20.721c-3.462,8.021-5.176,16.917-5.176,26.669c0,18.476,5.176,32.701,15.528,42.642 c4.885,4.679,10.66,8.484,17.362,11.432c5.296,2.314,11.5,4.165,18.681,5.519c1.937,0.377,3.925,0.72,5.999,1.028l25.897,3.959 c2.913,0.428,5.416,0.891,7.524,1.371c1.868,0.446,3.428,0.891,4.662,1.371c2.639,1.011,5.073,2.537,7.318,4.559 c4.456,4.474,6.701,10.472,6.701,17.979c0,8.741-3.256,15.442-9.752,20.104c-2.502,1.817-5.484,3.274-8.929,4.37 c-5.484,1.765-12.151,2.639-20.018,2.639c-6.684,0-13.163-0.6-19.402-1.8c-3.034-0.583-5.999-1.303-8.929-2.16 c-8.929-2.639-16.848-7.404-23.755-14.311l-27.423,27.405c10.558,10.78,22.281,18.236,35.187,22.401 c7.678,2.485,15.991,4.216,24.938,5.21c6.067,0.686,12.443,1.029,19.093,1.029c7.061,0,13.831-0.566,20.31-1.714 c3.942-0.686,7.781-1.594,11.517-2.708c9.855-2.931,18.373-7.198,25.589-12.786c7.216-5.587,12.854-12.443,16.917-20.567 c4.062-8.124,6.085-17.465,6.085-28.022C335.817,290.724,334.497,282,331.858,274.27z" />
          </g>
          <path fill="#CC9322" d="M275.71,147.167v36.866c-5.776-0.977-11.329-1.457-16.659-1.457 c-9.821,0-17.413,2.005-22.761,6.033v-41.442c0-10.849,8.878-19.71,19.71-19.71c5.416,0,10.352,2.211,13.917,5.793 c3.428,3.411,5.605,8.072,5.776,13.214C275.71,146.704,275.71,146.927,275.71,147.167z" />
          <path fill="#CC9322" d="M275.71,237.421v40.054c-2.108-0.48-4.61-0.943-7.524-1.371l-25.897-3.959 c-2.074-0.309-4.062-0.651-5.999-1.028v-42.351c1.165,0.703,2.399,1.354,3.719,1.936c3.154,1.423,7.061,2.451,11.723,3.051 L275.71,237.421z" />
          <path fill="#CC9322" d="M255.692,328.498c7.867,0,14.534-0.874,20.018-2.639v38.974c0,10.832-8.861,19.71-19.71,19.71 c-10.695,0-19.487-8.655-19.693-19.299c-0.017-0.137-0.017-0.274-0.017-0.411v-38.134 C242.529,327.898,249.007,328.498,255.692,328.498z" />
        </g>
        <g>
          <circle fill="#EFB832" cx="65.963" cy="256" r="9.56" />
          <circle fill="#EFB832" cx="444.121" cy="256" r="9.56" />
        </g>
      </g>
      <path opacity="0.06" fill="#040000" d="M256.12,511.759c65.556,0,131.113-24.952,181.02-74.859 c99.814-99.814,99.814-262.225,0-362.038C387.232,24.953,321.676,0,256.12,0L256.12,511.759z" />
    </svg>
              </div>
              Credits
            </DialogTitle>
          </DialogHeader>
        </div>
        
        <div className="px-6 py-5 space-y-5">
          {/* Credits Balance */}
          <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-xl border border-[#e2e8f0]">
            <div>
              <p className="text-xs text-[#64748b] mb-0.5">Your Balance</p>
              <p className="text-2xl font-semibold text-[#0f172a]">{credits}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#94a3b8]">Referrals</p>
              <div className="flex items-center gap-1.5 justify-end">
                <Users className="h-3.5 w-3.5 text-[#64748b]" />
                <span className="text-lg font-medium text-[#475569]">{referralStats?.referralCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Info text */}
          <p className="text-xs text-[#64748b] flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#fef9c3] text-[10px] font-medium text-[#ca8a04]">+10</span>
            credits for each friend who signs up
          </p>

          {/* Share Link */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-[#334155]">Invite friends</p>
            <div className="flex gap-2">
              <Input
                value={displayReferralLink}
                readOnly
                className="text-xs bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] h-9"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                disabled={!referralLink}
                className={cn(
                  "px-3 h-9 border-[#e2e8f0] transition-all",
                  copied ? "bg-[#dcfce7] border-[#86efac]" : "hover:bg-[#f8fafc]"
                )}
              >
                {copied ? <Check className="h-4 w-4 text-[#22c55e]" /> : <Copy className="h-4 w-4 text-[#64748b]" />}
              </Button>
            </div>
            
            {/* Share buttons with icons */}
            <div className="pt-1">
              <p className="text-[11px] text-[#94a3b8] mb-2">Share via</p>
              <div className="flex gap-2">
                {/* WhatsApp */}
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#dcfce7] hover:border-[#25d366] transition-all group"
                >
                  <svg className="h-4 w-4 text-[#64748b] group-hover:text-[#25d366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="text-xs font-medium text-[#64748b] group-hover:text-[#25d366]">WhatsApp</span>
                </button>
                
                {/* Twitter/X */}
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#e8f5fd] hover:border-[#1da1f2] transition-all group"
                >
                  <Twitter className="h-4 w-4 text-[#64748b] group-hover:text-[#1da1f2]" />
                  <span className="text-xs font-medium text-[#64748b] group-hover:text-[#1da1f2]">Twitter</span>
                </button>
                
                {/* LinkedIn */}
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#e2e8f0] bg-white hover:bg-[#e8f4fc] hover:border-[#0077b5] transition-all group"
                >
                  <Linkedin className="h-4 w-4 text-[#64748b] group-hover:text-[#0077b5]" />
                  <span className="text-xs font-medium text-[#64748b] group-hover:text-[#0077b5]">LinkedIn</span>
                </button>
              </div>
            </div>
          </div>

          {/* Premium Templates */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#334155]">Premium Templates</p>
              <span className="text-[10px] text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-full">{CREDITS_TO_UNLOCK} credits each</span>
            </div>
            
            <div className="space-y-2.5">
              {premiumTemplates.map((template) => {
                const isUnlocked = isTemplateUnlocked(template.id);
                const Preview = template.Preview;
                
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all",
                      isUnlocked
                        ? "border-[#bbf7d0] bg-[#f0fdf4]"
                        : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                    )}
                  >
                    {/* Resume Preview Icon */}
                    <div className={cn(
                      "w-10 h-14 rounded-md overflow-hidden border flex-shrink-0",
                      isUnlocked ? "border-[#86efac]" : "border-[#e2e8f0]"
                    )}>
                      <Preview />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1e293b]">{template.name}</p>
                        {isUnlocked && (
                          <Unlock className="h-3 w-3 text-[#22c55e]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748b]">{template.description}</p>
                    </div>
                    
                    {/* Action */}
                    {isUnlocked ? (
                      <span className="text-[11px] text-[#22c55e] font-medium px-2 py-1 bg-[#dcfce7] rounded-full">Unlocked</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnlockTemplate(template.id)}
                        disabled={!canAffordUnlock || unlocking === template.id}
                        className={cn(
                          "h-7 px-2.5 text-[11px] border-[#e2e8f0] rounded-lg",
                          canAffordUnlock 
                            ? "hover:bg-[#f8fafc] text-[#475569]" 
                            : "opacity-50 cursor-not-allowed text-[#94a3b8]"
                        )}
                      >
                        {unlocking === template.id ? (
                          <span className="flex items-center gap-1">
                            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            {CREDITS_TO_UNLOCK}
                          </span>
                        )}
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Help text */}
          <AnimatePresence>
            {!canAffordUnlock && credits < CREDITS_TO_UNLOCK && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-[11px] text-[#94a3b8] text-center pt-1"
              >
                Invite friends to earn credits and unlock premium templates
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
