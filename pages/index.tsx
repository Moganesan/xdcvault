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
import { useEffect, useState } from "react";
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
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Layout>
      <div>
        <h6 className="text-slate-400 font-bold text-xl">Portfolio Value</h6>
        <h1 className="font-bold text-4xl mt-5">$400</h1>
        <div>
          <table className="w-full mt-5 bg-slate-800 rounded-md p-20 overflow-hidden">
            <thead className="bg-slate-600">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="p-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr className="p-10" key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    if (cell.id.includes("token")) {
                      const { name, image } = cell.getValue<{
                        name: string;
                        image: string;
                      }>();
                      return (
                        <td className="p-3" key={cell.id}>
                          <div className="flex items-center">
                            <div>
                              <img src={image} />
                            </div>
                            <h1>{name}</h1>
                          </div>
                        </td>
                      );
                    }
                    return (
                      <td className="text-center p-2" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            {/* <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot> */}
          </table>
        </div>
      </div>
    </Layout>
  );
}
