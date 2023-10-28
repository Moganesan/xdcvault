import React, { FC, ReactNode, useEffect, useState, Fragment } from "react";
import Sidebar from "./sidebar";
import { useWalletsContext } from "@/context/walletsContext";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { addNewWallet, decryptPrivateKey } from "@/helpers/wallet";

import { Wallet } from "ethers";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { state, auth } = useWalletsContext();

  const [selectedWallet, setSelectedWallet] = useState<any | undefined>();

  const { updateSelectedWallet } = useWalletsContext();

  const router = useRouter();
  useEffect(() => {
    if (state != undefined) setSelectedWallet(state[0]);
    if (!auth || state == null) {
      router.push("/welcome");
    }
  }, [state, auth]);

  useEffect(() => {
    updateSelectedWallet(selectedWallet);
  }, [selectedWallet]);
  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <div className="bg-primary flex-1 p-4 text-white">
        <div className="w-full flex items-center justify-end ">
          <Listbox value={selectedWallet} onChange={setSelectedWallet}>
            <div className="relative mt-1">
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
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
