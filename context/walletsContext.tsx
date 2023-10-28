import {
  FC,
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { getWallets } from "@/helpers/wallet";

export type Props = {
  state: Wallet[] | null;
  auth: boolean | null;
  updateState: Function;
};

export type Wallet = {
  name: string;
  address: string;
  privateKey: string;
  iv: any;
  salt: any;
  tag: any;
};
const WalletsContext = createContext<Props>({
  state: null,
  auth: null,
  updateState: () => {},
});

const WalletsContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Wallet[] | null>(null);
  const [auth, setAuth] = useState(false);

  const updateState = (newWallet: Wallet) => {
    if (!newWallet) return;
    setState((prev) => (prev == null ? [newWallet] : [...prev, newWallet]));
  };

  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      const wallets: Wallet[] = getWallets();
      if (wallets.length >= 1) {
        setAuth(true);
        setState(wallets);
      }
    };

    fetchDataFromLocalStorage();
  }, []);

  return (
    <WalletsContext.Provider value={{ state, auth, updateState }}>
      {children}
    </WalletsContext.Provider>
  );
};

const useWalletsContext = () => useContext(WalletsContext);

export { WalletsContextProvider, useWalletsContext };
