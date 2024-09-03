'use client';

import { useState } from 'react';
import { SolanaGuide } from "@/components/solana-guide"
import Footer from "@/components/Footer"
import CoolHeading from "@/components/CoolHeading"

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <CoolHeading
        title="Welcome to Solana"
        subtitle="Your Future in Blockchain"
        visible={currentStep === 1}
      />
      <SolanaGuide onStepChange={handleStepChange} />
      <Footer />
    </>
  )
}