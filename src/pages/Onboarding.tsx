
import React, { useState } from 'react';
import { OnboardingFlow } from '@/components/Onboarding/OnboardingFlow';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';

const Onboarding = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  // If profile is already complete, redirect to home
  React.useEffect(() => {
    if (profile?.daily_calories) {
      navigate('/home');
    }
  }, [profile, navigate]);

  const handleComplete = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <OnboardingFlow onComplete={handleComplete} />
    </div>
  );
};

export default Onboarding;
