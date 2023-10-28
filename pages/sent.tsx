import Layout from "@/components/layout";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/solid";
import { useWalletsContext } from "@/context/walletsContext";
import { sendTXDC } from "@/helpers/wallet";

import Image from "next/image";
import { getBalance } from "@/helpers/wallet";

const Sent = () => {
  const { state, selectedWallet: SelectedWallet } = useWalletsContext();
  const [selectedWallet, setSelectedWallet] = useState<any | undefined>();
  const [balance, setBalance] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [password, setPassword] = useState("");
  const [txHash, setTxHash] = useState("");
  const [loading, setLoading] = useState(false);

  const [receiverWallet, setReceiverWallet] = useState("");

  const [amount, setAmount] = useState("");

  useEffect(() => {
    setSelectedWallet(SelectedWallet);
  }, []);

  const fetchBalance = async () => {
    if (selectedWallet) {
      const balance = await getBalance(selectedWallet.address);
      setBalance(balance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [selectedWallet]);

  const signTransaction = async () => {
    setLoading(true);
    const res = await sendTXDC(
      password,
      amount,
      receiverWallet,
      selectedWallet
    );

    if (!res) {
      alert("Insufficient Funds");
      return;
    }

    setTxHash(res.transactionHash);
    setLoading(false);
  };

  return (
    <Layout>
      <div className="grid place-items-center">
        <div
          style={{ height: 700, width: 500 }}
          className="bg-slate-900 rounded-md"
        >
          <form onSubmit={(e) => e.preventDefault()} className="mt-10 px-10">
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
                    <span>Balance: {balance}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex mt-10 flex-row justify-center">
              <ArrowsUpDownIcon className="w-10 h-10" />
            </div>
            <div>
              <div className="mt-5">
                <label>Receiver:</label>
                <div>
                  <input
                    value={receiverWallet}
                    onChange={(e) => setReceiverWallet(e.target.value)}
                    placeholder="Wallet address"
                    className="w-full text-black h-14 rounded-md px-4 text-blacks mt-4"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label>Amount:</label>
                <div>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    placeholder="Amount"
                    className="w-full text-black h-14 rounded-md px-4 text-blacks mt-4"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpenModal(true)}
              className="w-full h-14 bg-blue-500 rounded-md mt-10"
            >
              SENT
            </button>
          </form>
        </div>
      </div>
      <Transition appear show={openModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpenModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Transaction ✅
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      type="password"
                      className="h-14 w-full px-4 outline-none text-black border-2"
                    />
                  </div>

                  {txHash && (
                    <div className="text-black">
                      <h1>View your tx on the explorer:</h1>
                      <br />
                      <a
                        href={`https://explorer.apothem.network/txs/${txHash}`}
                      >
                        https://explorer.apothem.network/txs/{txHash}
                      </a>
                    </div>
                  )}
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => signTransaction()}
                    >
                      {loading ? "Loading..." : "Confirm"}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Layout>
  );
};

export default Sent;
