'use client';

import { useState } from 'react';
import { SolanaGuide } from "@/components/solana-guide"
import Footer from "@/components/Footer"
import CoolHeading from "@/components/CoolHeading"

export default function Page() {
  const [currentStep, setCurrentStep] = useState(0);  // Changed from 1 to 0

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <CoolHeading
        title="Welcome to Solana"
        subtitle="Your journey on-chain starts here"
        visible={currentStep === 0}  // Changed from 1 to 0
      />
      <SolanaGuide onStepChange={handleStepChange} />
      <Footer />
    </>
  )
}