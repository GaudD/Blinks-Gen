import {
    ActionError,
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
  createPostResponse
} from "@solana/actions";
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

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

      const choice = url.searchParams.get('choice');
      const amount = url.searchParams.get('amount');
      if (!choice || !amount) {
          return Response.json({ error: 'Both choice and amount parameters are required' }, { status: 400 });
      }

      let account: PublicKey;
      try {
          account = new PublicKey(body.account);
      } catch {
          throw "Invalid account provided, not a real Public Key";
      }

      const connection = new Connection(clusterApiUrl("devnet"));

      // Transaction to store the bet amount
      const transaction = new Transaction().add(
          ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
          new TransactionInstruction({
              programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
              data: Buffer.from(`${choice},${amount}`, "utf-8"),
              keys: [],
          })
      );

      transaction.feePayer = account;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      // Generate the result of the coin flip
      const result = Math.random() < 0.5 ? 'heads' : 'tails'; // Random result for demonstration
      const resultMessage = `You chose ${choice}. The result is ${result}. Bet amount was ${amount} SOL.`;

      const payload: ActionPostResponse = await createPostResponse({
          fields: {
              type: 'transaction',
              transaction,
              message: resultMessage,
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
