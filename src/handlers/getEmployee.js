import createError from "http-errors";
import AWS from "aws-sdk";

import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getEmployees = async (event) => {
  try {
    const { id } = event.pathParameters;
    const result = await dynamodb
      .get({ TableName: process.env.EMPLOYEES_TABLE_NAME, Key: { id } })
      .promise();

    if (!result.Item) {
      throw new createError.NotFound(`Employee with ID ${id} not found`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(getEmployees);
