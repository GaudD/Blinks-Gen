import { PrismaClient } from "@prisma/client";
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, LinkedAction } from "@solana/actions"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

const prisma = new PrismaClient();

export const GET = async (req: Request) => {
    const url = new URL(req.url);
    const params = url.searchParams;

    // Retrieve the ID from the URL
    const id = params.get("id");

    if (!id) {
        return Response.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    try {
        // Fetch the donation entry from the database using the ID
        const Entry = await prisma.donationEntry.findUnique({
            where: { id: parseInt(id) }, // Assuming id is an integer
        });

        if (!Entry) {
            return Response.json({ error: 'Donation entry not found' }, { status: 404 });
        }

        // Use the data from the fetched entry
        const label = Entry.label
        const heading = Entry.title
        const img = Entry.imgUrl
        const description = Entry.description;

        const amount1 = Entry.amount1?.toString()// Default amount if not provided
        const amount2 = Entry.amount2?.toString()
        const amount3 = Entry.amount3?.toString()

        const actions: LinkedAction[] = [
            {
                href: `/api/actions/donate?id=${id}&amount=${amount1}`,
                label: `${amount1} SOL`,
                type: "transaction",
            },
            {
                href: `/api/actions/donate?id=${id}&amount=${amount2}`,
                label: `${amount2} SOL`,
                type: "transaction",
            },
            {
                href: `/api/actions/donate?id=${id}&amount=${amount3}`,
                label: `${amount3} SOL`,
                type: "transaction",
            },
        ];

        const payload: ActionGetResponse = {
            icon: img,
            label,
            description,
            title: heading,
            links:{actions}
        };

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS,
        });
    } catch (error) {
        console.error('Error fetching donation entry:', error);
        return Response.json({ error: 'Failed to fetch donation entry' }, { status: 500 });
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const body: ActionPostRequest = await req.json();
        
        // Retrieve the ID from the URL
        const id = url.searchParams.get("id");
        if (!id) {
            return Response.json({ error: 'ID parameter is required' }, { status: 400 });
        }

        // Fetch the donation entry from the database using the ID
        const donationEntry = await prisma.donationEntry.findUnique({
            where: { id: parseInt(id) }, // Assuming id is an integer
        });

        if (!donationEntry) {
            return Response.json({ error: 'Donation entry not found' }, { status: 404 });
        }

        let account: PublicKey;
        try {
            account = new PublicKey(body.account);
        } catch {
            throw "Invalid account provided, not a real Public Key";
        }

        let amount: number = 0.05;
        if (url.searchParams.has("amount")) {
            try {
                amount = parseFloat(url.searchParams.get("amount") || "0.05");
            } catch {
                throw "Invalid Amount";
            }
        }

        const connection = new Connection(clusterApiUrl("devnet"));
        
        // Fetch toPubKey from the donationEntry
        const TO_PUBKEY = new PublicKey(donationEntry.addy); // Use the fetched toPubKey

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account,
                lamports: amount * LAMPORTS_PER_SOL,
                toPubkey: TO_PUBKEY,
            })
        );
        transaction.feePayer = account;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type: "transaction",
                transaction,
                message: "Thanks you :)"
            }
        });

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS,
        });

        } catch (error) {
        let message = "Unknown error occurred";
        if (typeof error == "string") {
            message = error;
        }

        return Response.json({
            message: message,
        }, {
            headers: ACTIONS_CORS_HEADERS,
        });
    }
}