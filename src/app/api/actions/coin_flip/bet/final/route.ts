import {
    ActionError,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";

const headers = {
    'Access-Control-Allow-Origin': 'https://dial.to',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...ACTIONS_CORS_HEADERS // Include any other headers you need
};
export const GET = async () => {
    return Response.json({ message: "Method not supported" } as ActionError, {
      status: 403,
      headers,
    });
};
export const OPTIONS = async () => {
    return Response.json(null, { headers });
};
// Second Blink: POST request to handle bet amount selection
export const POST = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const body: ActionPostRequest = await req.json();

        // Extract choice and amount from query parameters
        const choice = url.searchParams.get('choice');
        const amount = url.searchParams.get("amount");
        if (!choice || !amount) {
            return Response.json({ error: 'Choice and Amount parameters are required' }, { status: 400 });
        }

        const amountLamports = Number(amount) * 1e9;

        // Account validation
        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch {
            throw "Invalid account provided, not a real Public Key";
        }

        const connection = new Connection(clusterApiUrl("devnet"));

        const houseAccount = new PublicKey("G76xtuTjgT81ywag7fXjAoQNxv7E6DB3SBs21rSQYgrq");

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account,
                toPubkey: houseAccount,
                lamports: amountLamports,
            })
        );

        // Determine coin flip result with 48% win probability 2% House Advantage
        const win = Math.random() < 0.99;
        const result = win ? choice : (choice === "heads" ? "tails" : "heads"); // User loses if the result is the opposite choice
        const resultMessage = win ? `You won!` : `You lost!`;

        // Transaction to store choice, amount, and result
        transaction.add(
            new TransactionInstruction({
                programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                data: Buffer.from(`Choice: ${choice}, Bet: ${amount} SOL, Result: ${resultMessage}`, "utf-8"),
                keys: [{ pubkey: account, isSigner: true, isWritable: false }],
            })
        );

        transaction.feePayer = account;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Create payload for transaction response
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: 'transaction',
                transaction,
                message: `You chose ${choice} with a bet of ${amount} SOL. The result is ${result}. ${resultMessage}`,
                links: {
                    next: {
                        type: 'post',
                        href: `/api/actions/coin_flip/bet/result?result=${resultMessage}&amount=${amount}`
                    }
                }
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