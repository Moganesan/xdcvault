import Layout from "@/components/layout";
import { useWalletsContext } from "@/context/walletsContext";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, Fragment } from "react";

const Settings = () => {
  const { state, auth } = useWalletsContext();

  const [walletName, setWalletName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassword2, setConfirmPassword2] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const [selectedWallet, setSelectedWallet] = useState<any | undefined>();
  useEffect(() => {
    if (state != undefined) setSelectedWallet(state[0]);
  }, [state, auth]);

  return (
    <Layout>
      <h1 className="text-xl">Settings</h1>
      <div className="ml-10">
        <div className="mt-10">
          <h1>Add New Wallet</h1>
          <div className="flex flex-col">
            <input
              value={walletName}
              onChange={(e) => setWalletName(e.target.value)}
              placeholder="wallet name"
              className="w-80 mt-5 h-10 rounded-md px-4 text-black"
            />
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Password"
              className="w-80 mt-5 h-10 rounded-md px-4 text-black"
            />
            <button className="w-80 h-10 bg-blue-400 rounded-md mt-5">
              Create
            </button>
          </div>
        </div>
        <div className="mt-10">
          <h1>Export Key</h1>
          <div className="flex flex-col mt-5">
            <Listbox value={selectedWallet} onChange={setSelectedWallet}>
              <div className="relative mt-1 w-80">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate text-black text-md">
                    {selectedWallet?.address.slice(
                      0,
                      selectedWallet.address.length -
                        (selectedWallet.address.length - 10)
                    )}
                    ...
                    {selectedWallet?.address.slice(
                      selectedWallet.address.length - 10,
                      selectedWallet.address.length
                    )}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    onChange={(e) => console.log(e)}
                    className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                  >
                    {state?.map((wallet: any, walletIdx: any) => (
                      <Listbox.Option
                        key={walletIdx}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                        value={wallet}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {wallet.address}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
            <input
              className="w-80 mt-5 h-10 rounded-md px-4 text-black"
              value={confirmPassword2}
              onChange={(e) => setConfirmPassword2(e.target.value)}
              placeholder="Password"
            />
            <button className="w-80 h-10 bg-red-400 rounded-md mt-5">
              Export
            </button>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <h1>Import Wallet</h1>
          <input
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            className="w-80 mt-5 h-10 rounded-md px-4 text-black"
            placeholder="Private Key"
            type="password"
          />
          <button className="w-80 h-10 bg-green-400 rounded-md mt-5">
            Import
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
