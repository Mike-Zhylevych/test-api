import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";

async function random(event, context) {
  try {
    const { locale, name, method } = event.pathParameters;
    return {
      statusCode: 200,
      body: JSON.stringify({ locale, name, method }),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
}

export const handler = commonMiddleware(random);
