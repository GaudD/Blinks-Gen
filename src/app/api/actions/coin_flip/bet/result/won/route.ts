import { ActionError, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { PublicKey, Connection, Transaction, SystemProgram, clusterApiUrl, Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";


export const GET = async () => {
    return Response.json({ message: "Method not supported" } as ActionError, {
        status: 403,
        headers: ACTIONS_CORS_HEADERS,
    });
};

export const OPTIONS = async () => {
    return Response.json(null, { headers: ACTIONS_CORS_HEADERS });
};


export const POST = async (req: Request) => {
    try {        
        const url = new URL(req.url);
        const body: { account: string; amount: string } = await req.json();

        const result = url.searchParams.get('result');
        if (result !== 'You won!') {
            return Response.json({ error: 'Claim action is only allowed if the user won.' }, { status: 400 });
        }

        const amountSol = url.searchParams.get('amount');
        if (!amountSol) {
            return Response.json({ error: 'A parameter is required' }, { status: 400 });
        }

        const rewardAmountLamports = Number(amountSol) * 2 * 1e9;

        // Validate user account (where the winnings will be sent)
        let userAccount: PublicKey;
        try {
            userAccount = new PublicKey(body.account);
        } catch {
            throw new Error("Invalid account provided, not a valid Public Key");
        }

        const houseAccountSecretPhrase = ""; // Replace this with the actual phrase

        // Derive the keypair from the secret phrase
        const seed = mnemonicToSeedSync(houseAccountSecretPhrase);
        const secretKey = seed.slice(0, 32); // Get the first 32 bytes for the keypair
        const houseAccount = Keypair.fromSecretKey(secretKey);
        const connection = new Connection(clusterApiUrl("devnet"));

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: houseAccount.publicKey,
                toPubkey: userAccount,
                lamports: rewardAmountLamports,
            })
        );

        transaction.feePayer = houseAccount.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        await transaction.sign(houseAccount);

        // Payload for the response after successful transaction creation
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: 'transaction',
                transaction,
                message: `Congratulations! You've claimed ${Number(amountSol) * 2} SOL as your reward.`,
            }
        });

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS
        });

    } catch (error) {
        console.error('Error occurred', error);
        return Response.json({ error: 'Error occurred' }, { status: 500 });
    }
};
