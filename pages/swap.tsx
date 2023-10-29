import Layout from "@/components/layout";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
const Swap = () => {
  return (
    <Layout>
      <h1>Swap</h1>

      <div className="grid place-items-center">
        <div
          style={{ height: 700, width: 500 }}
          className="bg-slate-900 rounded-md"
        >
          <div className="flex items-center">
            <input
              className="w-full h-20 bg-slate-800 rounded-md mt-5 px-4"
              placeholder="You pay"
            />
            <div className="mt-5">
              <button className="bg-slate-800 h-20 p-0 m-0">AAV</button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-10">
            <ArrowsUpDownIcon className="w-10 h-10" />
          </div>
          <input
            className="w-full h-20 bg-slate-800 rounded-md mt-5 px-4"
            placeholder="You Receive"
          />
          <button className="w-full h-14 mt-10 bg-blue-600">Swap</button>
        </div>
      </div>
    </Layout>
  );
};

export default Swap;
