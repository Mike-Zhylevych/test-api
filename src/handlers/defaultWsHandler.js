import commonMiddleware from "../../lib/commonMiddleware";

const defaultWsHandler = async (event) => {
    console.log('Could not find handler', event);
    return {
        statusCode: 200,
        body: 'ok'
    }
};

export const handler = commonMiddleware(defaultWsHandler);
