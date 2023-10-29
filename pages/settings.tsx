import Layout from "@/components/layout";
import { useWalletsContext } from "@/context/walletsContext";
import { Listbox, Transition, Dialog } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, Fragment } from "react";
import {
  decryptPrivateKey,
  addNewWallet,
  importWallet,
} from "@/helpers/wallet";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

import { Token } from "@/helpers/models/token";

const columnHelper = createColumnHelper<Token>();

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
  { name: "Tanya Fox" },
  { name: "Hellen Schmidt" },
];

const columns = [
  columnHelper.accessor("token", {
    cell: (info) => info.getValue(),
    header: () => <span>Token</span>,
  }),
  columnHelper.accessor("portfolio", {
    cell: (info) => info.getValue(),
    header: () => <span>Portfolio</span>,
  }),
  columnHelper.accessor("price", {
    cell: (info) => info.getValue(),
    header: () => <span>Price</span>,
  }),
  columnHelper.accessor("holders", {
    cell: (info) => info.getValue(),
    header: () => <span>Holders</span>,
  }),
  columnHelper.accessor("balance", {
    cell: (info) => info.getValue(),
    header: () => <span>Balance</span>,
  }),
];

const data: Token[] = [
  {
    id: 1,
    token: {
      name: "Token1",
      image: "token1.png",
    },
    price: "10.00 USD",
    balance: "1000.00",
    holders: ["holder1", "holder2"],
    portfolio: 50000,
  },
  {
    id: 2,
    token: {
      name: "Token2",
      image: "token2.png",
    },
    price: "5.50 USD",
    balance: "500.50",
    holders: ["holder3", "holder4"],
    portfolio: 25000,
  },
];

const Settings = () => {
  const { state, auth } = useWalletsContext();

  const [walletName, setWalletName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassword2, setConfirmPassword2] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [addWalletModal, setAddWalletModal] = useState(false);
  const [exportKeyModal, setExportKeyModal] = useState(false);
  const [importKeyModal, setImportKeyModal] = useState(false);
  const [key, setKey] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { selectedWallet: SelectedWallet } = useWalletsContext();
  const [selectedWallet, setSelectedWallet] = useState<any | undefined>();
  useEffect(() => {
    if (state != undefined) setSelectedWallet(SelectedWallet);
  }, [state, auth]);

  return (
    <Layout>
      <div>
        <div>
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
                <button
                  onClick={() => {
                    const status = addNewWallet(walletName, confirmPassword);

                    if (!status) {
                      alert("Something went wrong try again");
                      return;
                    }

                    setAddWalletModal(true);
                  }}
                  className="w-80 h-10 bg-blue-400 rounded-md mt-5"
                >
                  Create
                </button>
              </div>
            </div>
            <div className="mt-10">
              <h1>Export Key</h1>
              <div className="flex flex-col mt-5">
                <Listbox value={selectedWallet} onChange={setSelectedWallet}>
                  <div className="relative mt-1 w-80">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 border-2  focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate text-white text-md">
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
                <button
                  onClick={() => {
                    const key = decryptPrivateKey(
                      confirmPassword2,
                      selectedWallet.privateKey,
                      selectedWallet.salt,
                      selectedWallet.iv,
                      selectedWallet.tag
                    );
                    if (!key) {
                      alert("Invalid Password");
                      return;
                    }

                    setKey(key);
                    setExportKeyModal(true);
                    setConfirmPassword2("");
                  }}
                  className="w-80 h-10 bg-red-400 rounded-md mt-5"
                >
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
              <button
                onClick={() => {
                  const status = importWallet(privateKey);
                  if (!status) {
                    alert("Something went wrong try again");
                    return;
                  }
                  setImportKeyModal(true);
                }}
                className="w-80 h-10 bg-green-400 rounded-md mt-5"
              >
                Import
              </button>
            </div>
          </div>
        </div>
        <Transition appear show={addWalletModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setAddWalletModal(false)}
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
                      New Wallet Added Successfully ✅
                    </Dialog.Title>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setAddWalletModal(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={exportKeyModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setExportKeyModal(false)}
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
                      Password Verified ✅
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Private Key : <br></br>
                        {key}
                      </p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setExportKeyModal(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={importKeyModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setImportKeyModal(false)}
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
                      Account Added ✅
                    </Dialog.Title>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setImportKeyModal(false)}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </Layout>
  );
};

export default Settings;
