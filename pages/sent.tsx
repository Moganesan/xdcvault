import Layout from "@/components/layout";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { useWalletsContext } from "@/context/walletsContext";
import Image from "next/image";

const Sent = () => {
  const { state, auth, selectedWallet: SelectedWallet } = useWalletsContext();
  const [selectedWallet, setSelectedWallet] = useState<any | undefined>(
    SelectedWallet
  );

  return (
    <Layout>
      <div className="grid place-items-center">
        <div
          style={{ height: 700, width: 500 }}
          className="bg-slate-900 rounded-md"
        >
          <form className="mt-10 px-10">
            <label>Sender:</label>

            <div className="flex items-center justify-between">
              <div>
                <Listbox value={selectedWallet} onChange={setSelectedWallet}>
                  <div className="relative mt-5">
                    <Listbox.Button className="relative w-52  h-14 cursor-default border-2 rounded-lg bg-white text-black py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm">
                      <span className="block truncate text-white text-xl text-md">
                        {selectedWallet?.address.slice(
                          0,
                          selectedWallet.address.length -
                            (selectedWallet.address.length - 10)
                        )}
                        .........
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
              <div>
                <div className="flex w-40 h-16 items-center">
                  <div>
                    <Image
                      src={"/xdcToken.png"}
                      width={50}
                      height={50}
                      alt="token"
                    />
                  </div>
                  <div className="ml-3">
                    <h1>TXDC</h1>
                    <span>Balance: 10</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex mt-10 flex-row justify-center">
              <ArrowsUpDownIcon className="w-10 h-10" />
            </div>
            <div className="mt-5">
              <label>Receiver:</label>
              <div>
                <input
                  placeholder="Wallet address"
                  className="w-full text-black h-14 rounded-md px-4 text-blacks mt-4"
                />
              </div>
            </div>
            <button className="w-full h-14 bg-blue-500 rounded-md mt-10">
              SENT
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Sent;
