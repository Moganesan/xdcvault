import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "@/components/layout";
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Token } from "@/helpers/models/token";
import { Listbox, Transition } from "@headlessui/react";
import { useWalletsContext } from "@/context/walletsContext";
import { useContext, useEffect, useState } from "react";
import { getBalance } from "@/helpers/wallet";
const inter = Inter({ subsets: ["latin"] });

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

export default function Home() {
  const { selectedWallet: SelectedWallet } = useWalletsContext();
  const [balance, setBalance] = useState("");

  const [selectedWallet, setSelectedWallet] = useState<any | undefined>();

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

  useEffect(() => {
    console.log("Selected Wallet", selectedWallet);
  }, []);

  return (
    <Layout>
      <div>
        <h6 className="text-slate-400 font-bold text-xl">Portfolio Value</h6>
        <h1 className="font-bold text-4xl mt-5">
          TXDC <br></br>
          {balance}
        </h1>
        <div></div>
      </div>
    </Layout>
  );
}
