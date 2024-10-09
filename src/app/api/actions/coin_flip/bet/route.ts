import {
    ActionError,
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  LinkedAction
} from "@solana/actions";

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

        const choice = url.searchParams.get('choice');
        if (!choice) {
            return Response.json({ error: 'Choice parameter is required' }, { status: 400 });
        }

        // Generate response for user to select a betting amount
        const actions: LinkedAction[] = [
            {
                href: `/api/actions/coin_flip/bet/final?choice=${choice}&amount=0.1`,
                type: 'post',
                label: '0.1 SOL'
            },
            {
                href: `/api/actions/coin_flip/bet/final?choice=${choice}&amount=0.25`,
                type: 'post',
                label: '0.25 SOL'
            }, {
                href: `/api/actions/coin_flip/bet/final?choice=${choice}&amount=0.5`,
                type: 'post',
                label: '0.5 SOL'
            }
        ];
        
        const payload: ActionGetResponse = {
            title: "Coin Flip",
            icon: 'https://avatars.dzeninfra.ru/get-zen_doc/4387099/pub_6414b8e4731cd5494e985337_6414b912dac81b380e5d2a4f/scale_1200',
            description: 'Choose the bet Amount',
            label: 'Choose',
            links: {
                actions
            }
        };

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS
        });

    } catch (error) {
        console.error('Error occurred', error);
        return Response.json({ error: 'Error occurred' }, { status: 500 });
    }
};

