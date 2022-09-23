import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

const mono = async (event) => {
  try {
    if(event.httpMethod === 'GET') {
        console.log('GET');
    }
    if(event.httpMethod === 'POST') {
        console.log('POST');
        console.log(event.body);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ 'result': 'OK' }),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(mono);
