"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainPage() {
  console.log("MainPage rendered")
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [connection, setConnection] = useState(connected);

  useEffect(() => {
    setConnection(connected);
    console.log("Connection Changed");
    
  }, [connected]);
  
  console.log("Connection", connected)

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <Image src="/logo.png" alt="" width={700} height={324} className="rounded-full py-10" />
      </div>
      <div className="font-semibold py-8">
        <h2 className="text-3xl">BLINK Bros</h2>
      </div>
      <div>
        <button
          disabled={!connection}
          onClick={() => { router.push('/generate') }}
          className={`p-[3px] relative ${connection ? '' : 'opacity-50 cursor-not-allowed'}`} // Fixed template literal
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
            Generate
          </div>
        </button>
      </div>
      {connection && publicKey && (
        <div className="py-4 text-center">
          <p className="text-lg">Connected Wallet: {publicKey.toString()}</p>
        </div>
      )}
      {!connection && (
        <div className="py-4 text-center">
          <p className="text-lg">Please Connect a Wallet to Continue</p>
        </div>
      )}
    </div>
  );
}
