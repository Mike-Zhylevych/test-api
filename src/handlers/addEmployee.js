import createError from "http-errors";
import { faker } from "@faker-js/faker";
import AWS from "aws-sdk";

import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const addEmployee = async (event) => {
  try {
    const { name, salary, position } = event.body;
    const now = new Date();
    const employee = {
      id: faker.random.uuid(),
      name,
      salary,
      position,
      createdAt: now.toISOString(),
    };
    await dynamodb
      .put({ TableName: process.env.EMPLOYEES_TABLE_NAME, Item: employee })
      .promise();
    return {
      statusCode: 201,
      body: JSON.stringify(employee),
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(addEmployee);
