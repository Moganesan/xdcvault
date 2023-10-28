export type Token = {
  id: number;
  token: {
    name: string;
    image: string;
  };
  price: string;
  balance: string;
  holders: string[];
  portfolio: number;
};
