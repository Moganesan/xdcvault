import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { ethers } from "ethers";
type Props = {
  state: ethers.providers.JsonRpcProvider | null;
};

const NetworkContext = createContext<Props>({ state: null });

const NetworkContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ethers.providers.JsonRpcProvider | null>(
    null
  );

  useEffect(() => {
    const provider: ethers.providers.JsonRpcProvider =
      new ethers.providers.JsonRpcProvider("https://erpc.apothem.network");

    provider.getNetwork().then((network) => {
      console.log("Chain Id", network.chainId);
    });
    setState(provider);
  }, []);

  return (
    <NetworkContext.Provider value={{ state }}>
      {children}
    </NetworkContext.Provider>
  );
};

const useNetworkContext = () => useContext(NetworkContext);

export { NetworkContextProvider, useNetworkContext };
