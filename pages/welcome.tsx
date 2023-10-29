import { FC, Fragment, useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import WalletCreationStepper from "@/components/walletCreationSteps";
import { useWalletsContext } from "@/context/walletsContext";
import { getWalletFromPrivateKey, importWallet } from "@/helpers/wallet";

const Welcome = () => {
  const [terms, setTerms] = useState(false);
  const [isShowing, setIsShowing] = useState(true);
  const [enableInput, setEnableInput] = useState(false);
  const { auth, state } = useWalletsContext();
  const [privateKey, setPrivateKey] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (auth) {
      router.push("/");
    }
  }, [auth, state]);
  const changeTerm = () => {
    setTerms(!terms);
  };

  return (
    <div className="h-screen bg-slate-800 grid place-items-center">
      <div
        style={{ width: 550, height: 800 }}
        className="bg-slate-900 rounded-lg flex items-center justify-center"
      >
        {isShowing ? (
          <div className="text-center px-10 flex flex-col items-center">
            <h1 className="text-4xl">Let&lsquo;s get started🚀</h1>
            <h2 className="mt-4">
              Unlock the Future: Your XDC Wallet, where Security Meets
              Innovation.
            </h2>
            <Image src={"/logo.png"} width={400} height={400} alt="Logo" />

            <div className="mt-10">
              <label>
                <input
                  className="mr-2 w-5 h-5"
                  type="checkbox"
                  checked={terms}
                  onChange={changeTerm}
                />
                I agree XDCVault terms and conditions.
              </label>
            </div>
            <div className="flex flex-col mt-5">
              <button
                onClick={() => setIsShowing(false)}
                disabled={terms == false}
                className={`px-1 py-2 w-72 text-md mt-4 ${
                  terms ? "bg-blue-600" : "bg-blue-400"
                } rounded-lg`}
              >
                Create New Wallet
              </button>
              {enableInput && (
                <input
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="Private Key"
                  className="h-12 rounded-md mt-3 px-5 text-black"
                />
              )}
              {enableInput ? (
                <button
                  onClick={() => {
                    importWallet(privateKey);
                    alert("Import Success");
                    router.push("/");
                  }}
                  className={`px-1 py-2 w-72 text-md mt-4 border-2 rounded-lg ${
                    terms ? "border-blue-600" : "border-red-400"
                  } `}
                >
                  Confirm
                </button>
              ) : (
                <button
                  onClick={() => setEnableInput(true)}
                  disabled={terms == false}
                  className={`px-1 py-2 w-72 text-md mt-4 border-2 rounded-lg ${
                    terms ? "border-blue-600" : "border-blue-400"
                  } `}
                >
                  Import an existing wallet
                </button>
              )}
            </div>
          </div>
        ) : (
          <WalletCreationStepper />
        )}
      </div>
    </div>
  );
};

const SetPassword = () => {
  return (
    <div
      style={{ width: 550, height: 800 }}
      className="bg-slate-900 rounded-lg flex items-center justify-center"
    ></div>
  );
};

export default Welcome;
