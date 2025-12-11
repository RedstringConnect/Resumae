import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  UserProfile, 
  ReferralStats, 
  initUserProfile, 
  getReferralStats, 
  unlockTemplate as apiUnlockTemplate 
} from '@/services/api';

interface ReferralContextType {
  userProfile: UserProfile | null;
  referralStats: ReferralStats | null;
  loading: boolean;
  error: string | null;
  credits: number;
  refreshProfile: () => Promise<void>;
  unlockTemplate: (templateId: string) => Promise<boolean>;
  isTemplateUnlocked: (templateId: string) => boolean;
  isPremiumTemplate: (templateId: string) => boolean;
  canAffordUnlock: boolean;
  getReferralLink: () => string;
}

const PREMIUM_TEMPLATES = ['executive', 'technical'];
const CREDITS_TO_UNLOCK = 10;

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeProfile = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      setReferralStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check for referral code in URL or localStorage
      const urlParams = new URLSearchParams(window.location.search);
      let referralCode = urlParams.get('ref') || localStorage.getItem('pendingReferralCode');
      
      // Clear the pending referral code from localStorage
      if (referralCode) {
        localStorage.removeItem('pendingReferralCode');
        // Clean URL if ref param exists
        if (urlParams.has('ref')) {
          urlParams.delete('ref');
          const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
          window.history.replaceState({}, '', newUrl);
        }
      }

      const profile = await initUserProfile(referralCode || undefined);
      setUserProfile(profile);

      const stats = await getReferralStats();
      setReferralStats(stats);
    } catch (err) {
      console.error('Error initializing profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    initializeProfile();
  }, [initializeProfile]);

  const refreshProfile = async () => {
    await initializeProfile();
  };

  const unlockTemplate = async (templateId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const result = await apiUnlockTemplate(templateId);
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, credits: result.credits, unlockedTemplates: result.unlockedTemplates });
      }
      if (referralStats) {
        setReferralStats({
          ...referralStats,
          credits: result.credits,
          unlockedTemplates: result.unlockedTemplates,
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error unlocking template:', err);
      return false;
    }
  };

  const isTemplateUnlocked = (templateId: string): boolean => {
    if (!PREMIUM_TEMPLATES.includes(templateId)) return true; // Not a premium template
    if (!userProfile) return false;
    return userProfile.unlockedTemplates.includes(templateId);
  };

  const isPremiumTemplate = (templateId: string): boolean => {
    return PREMIUM_TEMPLATES.includes(templateId);
  };

  const credits = userProfile?.credits || referralStats?.credits || 0;
  const canAffordUnlock = credits >= CREDITS_TO_UNLOCK;

  const getReferralLink = (): string => {
    if (!userProfile?.referralCode) return '';
    return `https://resumae.in?ref=${userProfile.referralCode}`;
  };

  const value = {
    userProfile,
    referralStats,
    loading,
    error,
    credits,
    refreshProfile,
    unlockTemplate,
    isTemplateUnlocked,
    isPremiumTemplate,
    canAffordUnlock,
    getReferralLink,
  };

  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>;
};
