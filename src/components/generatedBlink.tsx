'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function GeneratedBlink() {
    const [blinkUrl, setBlinkUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Getting the search parameters directly from the window object
        const params = new URLSearchParams(window.location.search);
        const id = params.get('blinkId');

        if (id) {
            setBlinkUrl(`${window.location.origin}/donate?id=${id}`); // Construct the blink URL
        }
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(blinkUrl);
        setCopied(true);

        // Reset the button text after 3 seconds
        setTimeout(() => setCopied(false), 3000);
    };

    const handleTwitterShare = () => {
        const twitterUrl = `https://x.com/intent/tweet?text=Check%20out%20my%20blink!%20${encodeURIComponent(blinkUrl)}`;
        window.open(twitterUrl, '_blank');
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <Image src="/logo.png" alt="" width={700} height={324} className="rounded-full py-10" />
            </div>
            <div>
                <h2 className="text-3xl">Generated Blink</h2>
            </div>
            <div className="my-4">
                <p className="text-lg">{blinkUrl}</p>
            </div>
            <div className="flex gap-4">
                <button
                    disabled={copied}
                    onClick={handleCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    {copied ? 'Copied ✓' : 'Copy Link'}
                </button>
                <button
                    onClick={handleTwitterShare}
                    className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-blue-500 transition"
                >
                    Share on X
                </button>
            </div>
        </div>
    );
}
