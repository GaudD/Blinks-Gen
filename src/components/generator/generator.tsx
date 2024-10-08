"use client"

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Generator() {

    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <Image src="/logo.png" width={700} height={324} alt="" className="rounded-full py-10" />
            </div>

            <div className="flex justify center">        
                <button onClick={()=> {router.push('/generate/donation')}} className="mx-5 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Donation
                </button>

                <button className="mx-5 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Placeholder
                </button>

                <button className="mx-5 inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    Placeholder
                </button>
                
            </div>
        </div>
    )
}