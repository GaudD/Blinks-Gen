import {
    ActionGetResponse,
    ActionPostRequest,
    ActionPostResponse,
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    LinkedAction
} from "@solana/actions";
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

const headers = {
    'Access-Control-Allow-Origin': 'https://dial.to',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...ACTIONS_CORS_HEADERS // Include any other headers you need
};

// First Blink: GET request to select "Heads" or "Tails"
export const GET = () => {
    try {
        const actions: LinkedAction[] = [
            {
                href: '/api/actions/coin_flip?choice=heads',
                type: 'post',
                label: 'Heads'
            },
            {
                href: '/api/actions/coin_flip?choice=tails',
                type: 'post',
                label: 'Tails'
            }
        ];
        
        const payload: ActionGetResponse = {
            title: "Coin Flip",
            icon: 'https://avatars.dzeninfra.ru/get-zen_doc/4387099/pub_6414b8e4731cd5494e985337_6414b912dac81b380e5d2a4f/scale_1200',
            description: 'Choose Heads or Tails to start the game',
            label: 'Choose',
            links: {
                actions
            }
        };

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (error) {
        console.error('Error occurred', error);
        return Response.json({ error: 'Error occurred' }, { status: 500 });
    }
};

export const OPTIONS = async () => Response.json(null, { headers });

// First Blink: POST request to store the choice and chain the bet amount selection
export const POST = async (req: Request) => {
    console.log("POST request initiated 1st Blink");
    
    try {
        const url = new URL(req.url);

        const body: ActionPostRequest = await req.json();

        const choice = url.searchParams.get('choice');
        if (!choice) {
            return Response.json({ error: 'Choice parameter is required' }, { status: 400 });
        }

        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch {
            throw "Invalid account provided, not a real Public Key";
        }

        const connection = new Connection(clusterApiUrl("devnet"));

        // Transaction to store the coin choice
        const transaction = new Transaction().add(
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1000 }),
            new TransactionInstruction({
                programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                data: Buffer.from(choice, "utf-8"),
                keys: [],
            })
        );

        transaction.feePayer = account;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        
        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: 'transaction',
                transaction,
                message: 'Select your bet amount.',
                links: {
                    next: {
                        type: 'post',
                        href: `/api/actions/coin_flip/bet?choice=${choice}`
                    }
                },
            }
        });

        return Response.json(payload, {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error occurred', error);
        return Response.json({ error: 'Error occurred' }, { status: 500 });
    }
};