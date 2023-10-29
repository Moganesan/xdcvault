import Layout from "@/components/layout";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Image from "next/image";

const Bridge = () => {
  const [senderAddress, setSenderAddress] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <Layout>
      <div className="grid place-items-center">
        <div
          style={{ height: 700, width: 500 }}
          className="bg-slate-900 rounded-md"
        >
          <div className="grid place-items-center">
            <div
              style={{ height: 700, width: 500 }}
              className="bg-slate-900 rounded-md"
            >
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-10 px-10"
              >
                <div className="flex items-center justify-around">
                  <Image
                    src={"/XDC-logo.png"}
                    alt="XDC"
                    width={100}
                    height={100}
                  />

                  <Image
                    src={"/wanchain-wan-logo.png"}
                    alt="XDC"
                    width={100}
                    height={100}
                  />
                </div>

                <div className="flex mt-10 flex-row justify-center">
                  <ArrowsUpDownIcon className="w-10 h-10" />
                </div>
                <div>
                  <div className="mt-5">
                    <label>Receiver:</label>
                    <div>
                      <input
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
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
                <button className="w-full h-14 bg-blue-500 rounded-md mt-10">
                  SENT
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Bridge;
