import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { setWalletPassword } from "@/helpers/wallet";

function WalletCreationStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [verifiedRecoveryPhrase, setVerifiedRecoveryPhrase] = useState("");

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    if (password === confirmPassword) {
      setWalletPassword(password);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleCondirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const handleRecoveryPhraseChange = (event: any) => {
    setRecoveryPhrase(event.target.value);
  };

  const handleVerifiedRecoveryPhraseChange = (event: any) => {
    setVerifiedRecoveryPhrase(event.target.value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center px-10 flex flex-col items-center">
            <h2 className="font-bold text-xl">Create a password.</h2>
            <p className="font-light mt-2">
              This password will unlock your XDCVault wallet only on this
              device. we can't recover this password.
            </p>
            <div className="mt-10">
              <input
                className="w-full h-10 rounded-md px-3 text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />

              <input
                className="w-full h-10 rounded-md px-3 mt-10 text-black"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleCondirmPasswordChange}
              />
              <button
                className="bg-blue-600 mt-10 h-11 rounded-md w-full"
                onClick={nextStep}
              >
                Create Wallet
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Get Recovery Phrase</h2>
            {/* Display recovery phrase and instructions here */}
            <button onClick={nextStep}>Next</button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Verify Recovery Phrase</h2>
            <input
              type="text"
              value={verifiedRecoveryPhrase}
              onChange={handleVerifiedRecoveryPhraseChange}
            />
            <button onClick={prevStep}>Previous</button>
            <button onClick={nextStep}>Finish</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-10 text-4xl font-bold">Step {currentStep} of 3</h1>
      {renderStep()}
    </div>
  );
}

export default WalletCreationStepper;
