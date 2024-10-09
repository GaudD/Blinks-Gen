import { ACTIONS_CORS_HEADERS, ActionsJson } from "@solana/actions"

export const GET = () => {
    const payload: ActionsJson = {
        rules: [
            {
                apiPath: "/api/actions/donate",
                pathPattern: "/donate"
            },
            {
                apiPath: "/api/actions/coin_flip",
                pathPattern:"/coin_flip"
            }
        ]
    }

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    })
}


export const OPTIONS = GET 
