import createError from "http-errors";
import { faker } from "@faker-js/faker";
import commonMiddleware from "../../lib/commonMiddleware";

const ignoredObjects = [
  "mersenne",
  "definitions",
  "locales",
  "datatype",
  "helpers",
  "localization",
  "time",
];

const getMethods = (obj) =>
  Object.keys(obj).reduce((acc, methodName) => {
    if (typeof obj[methodName] === "function") {
      acc[methodName] = obj[methodName]();
    }
    return acc;
  }, {});

const random = async (event) => {
  try {
    const { name, method } = event.pathParameters;
    if (!name) {
      const obj = Object.keys(faker)
        .filter((item) => !ignoredObjects.includes(item))
        .reduce((acc, item) => {
          if (typeof faker[item] === "object") {
            acc[item] = getMethods(faker[item]);
          }
          return acc;
        }, {});
      return {
        statusCode: 200,
        body: JSON.stringify(obj),
      };
    }
    if (!method) {
      const avaliableMethods = getMethods(faker[name]);
      return {
        statusCode: 200,
        body: JSON.stringify(avaliableMethods),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ [method]: faker[name][method]() }),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(random);
