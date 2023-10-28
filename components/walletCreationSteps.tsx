import { useState, Fragment, useEffect, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { decryptPrivateKey, setWalletPassword } from "@/helpers/wallet";
import "@anima-protocol/personhood-sdk-react/style.css";
import { useRouter } from "next/router";
import { Personhood } from "@anima-protocol/personhood-sdk-react";
import { useWalletsContext } from "@/context/walletsContext";
import { requestAsyncStorage } from "next/dist/client/components/request-async-storage.external";
import { ethers, Wallet } from "ethers";

function WalletCreationStepper() {
  const [currentStep, setCurrentStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [verifiedRecoveryPhrase, setVerifiedRecoveryPhrase] = useState("");
  const [sessionId, setSessionId] = useState("");

  const router = useRouter();

  const { selectedWallet } = useWalletsContext();

  useEffect(() => {
    initSession();
  }, []);

  // useEffect(() => {
  //   fetchSessionDetails();
  // }, [sessionId]);
  const fetchSessionDetails = async () => {
    if (!sessionId) return;
    const myHeaders = new Headers();
    myHeaders.append(
      "Api-Key",
      "test_4ui5nnVlg5ZylpDPaeVfREUD4N5Ogt4zjXAQzVf7ZGelE4W9r1TSjb1SfHzYKqww"
    );
    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `https://api.pop.anima.io/v1/sessions/${sessionId}/details`,
        requestOptions
      );
      console.log("res1", response);
      const result = await response.json();
      console.log("res1", result);
    } catch (error) {
      console.log("Fetch session details error", error);
    }
  };

  const initSession = async () => {
    if (sessionId) return;
    const myHeaders = new Headers();
    myHeaders.append(
      "Api-Key",
      "test_4ui5nnVlg5ZylpDPaeVfREUD4N5Ogt4zjXAQzVf7ZGelE4W9r1TSjb1SfHzYKqww"
    );
    const requestOptions: any = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        "https://api.pop.anima.io/v1/personhood/init",
        requestOptions
      );
      console.log("res", response);
      const result = await response.json();
      console.log("res", result.session_id);
      setSessionId(result?.session_id); // Assuming the response contains a field named 'sessionId'
    } catch (error) {
      console.log("Initialization error", error);
    }
  };

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

  const shared = useCallback((e: { info: string }) => {
    console.log("shared", e.info);
  }, []);

  const sign = async (payload: string) => {
    const privateKey = decryptPrivateKey(
      password,
      selectedWallet?.privateKey,
      selectedWallet?.salt,
      selectedWallet?.iv,
      selectedWallet?.tag
    );

    if (privateKey == false) alert("Decryption Erro");

    console.log("private key", privateKey);
    const wallet = new Wallet(privateKey.toString());

    // Sign the message using ethers.js
    const signature = wallet.signMessage(payload);

    // Return the signature
    return signature;
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
          <div className="text-center px-10 flex flex-col items-center">
            <h2 className="font-bold text-xl">Face Authentication</h2>
            <p className="font-light mt-2">
              Verify your face in the decentralized world.
            </p>
            <div className="mt-4">
              <Personhood
                onFinish={shared}
                sessionId={sessionId}
                signCallback={sign}
                walletAddress={selectedWallet?.address}
              />
            </div>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-blue-500 h-14 rounded-md mt-10"
            >
              Go To Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="text-center">
      <h1 className="mb-10 text-4xl font-bold">Step {currentStep} of 2</h1>
      {renderStep()}
    </div>
  );
}

export default WalletCreationStepper;
