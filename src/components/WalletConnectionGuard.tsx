"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function WalletConnectionGuard({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/"); // Redirect to home if disconnected
    }
  }, [connected, router]);

  return <>{children}</>; // Render children if wallet is connected
}
