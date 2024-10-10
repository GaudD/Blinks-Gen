import {
    ActionError,
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
} from "@solana/actions";

const headers = {
    'Access-Control-Allow-Origin': 'https://dial.to',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...ACTIONS_CORS_HEADERS
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

        const result = url.searchParams.get('result');
        if (!result) {
            return Response.json({ error: 'Result parameter is required' }, { status: 400 });
        }

        // Generate response for user to select a betting amount
        
        // In the existing payload for win/loss messages
        let payload: ActionGetResponse;
        if (result === `You won!`) {
            payload = {
                title: "Coin Flip - You Won!",
                icon: 'https://avatars.dzeninfra.ru/get-zen_doc/4387099/pub_6414b8e4731cd5494e985337_6414b912dac81b380e5d2a4f/scale_1200', // Link to a win icon
                description: 'Congratulations! You won the coin flip. Choose your bet amount for the next round.',
                label: 'Choose',
                links: {
                    actions: [
                        {
                            href: `/api/actions/coin_flip/bet/result/won?result=${result}&amount=${0.1}`,
                            type: 'transaction',
                            label: 'Claim'
                        }
                    ]
                }
            };
        } else {
            payload = {
                title: "Coin Flip - You Lost!",
                icon: 'https://avatars.dzeninfra.ru/get-zen_doc/4387099/pub_6414b8e4731cd5494e985337_6414b912dac81b380e5d2a4f/scale_1200', // Link to a loss icon
                description: 'Better luck next time! You lost the coin flip. Choose your bet amount for a new chance.',
                label: 'Choose',
                links: {
                    actions: [
                        {
                            href: '',
                            type: 'message',
                            label: 'Rugged, Refresh to retry'
                        }
                    ]
                }
            };
        }


        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS
        });

    } catch (error) {
        console.error('Error occurred', error);
        return Response.json({ error: 'Error occurred' }, { status: 500 });
    }
};

