import {
  FC,
  useState,
  useContext,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import { getBalance, getWallets } from "@/helpers/wallet";

export type Props = {
  state: Wallet[] | null;
  auth: boolean | null;
  selectedWallet: Wallet | null;
  updateSelectedWallet: Function;
  updateState: Function;
};

export type Wallet = {
  name: string;
  balance: number;
  address: string;
  privateKey: string;
  iv: any;
  salt: any;
  tag: any;
};
const WalletsContext = createContext<Props>({
  state: null,
  auth: null,
  selectedWallet: null,
  updateSelectedWallet: () => {},
  updateState: () => {},
});

const WalletsContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Wallet[] | null>(null);
  const [auth, setAuth] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState("");

  const updateState = (newWallet: Wallet) => {
    if (!newWallet) return;
    setState((prev) => (prev == null ? [newWallet] : [...prev, newWallet]));
  };

  const updateSelectedWallet = (wallet: Wallet) => {
    if (!wallet) return;
    const updateWallet = wallet;
    updateWallet.balance = Number(balance);
    setSelectedWallet(wallet);
  };

  const GetBalance = async () => {
    if (selectedWallet != null) {
      const balance = await getBalance(selectedWallet?.address);
      setBalance(balance);
    }
  };

  useEffect(() => {
    GetBalance();
  }, [selectedWallet]);
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
    <WalletsContext.Provider
      value={{ state, auth, selectedWallet, updateState, updateSelectedWallet }}
    >
      {children}
    </WalletsContext.Provider>
  );
};

const useWalletsContext = () => useContext(WalletsContext);

export { WalletsContextProvider, useWalletsContext };
