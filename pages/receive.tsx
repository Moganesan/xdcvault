import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { useWalletsContext } from "@/context/walletsContext";

import QRCode from "react-qr-code";

const Receive = () => {
  const [qrData, setQrData] = useState("");

  const { selectedWallet } = useWalletsContext();

  return (
    <Layout>
      <div className="grid place-items-center">
        <div
          style={{ height: 700, width: 500 }}
          className="bg-slate-900 rounded-md flex flex-col items-center justify-center"
        >
          <h1 className="mb-4">Scan this qr code for getting wallet details</h1>
          {selectedWallet ? (
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={selectedWallet?.address}
              viewBox={`0 0 200 200`}
            />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Receive;
