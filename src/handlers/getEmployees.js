import createError from "http-errors";
import AWS from "aws-sdk";

import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getEmployees = async () => {
  try {
    const result = await dynamodb
      .scan({ TableName: process.env.EMPLOYEES_TABLE_NAME })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(getEmployees);
