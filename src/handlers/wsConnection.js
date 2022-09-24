import AWS from "aws-sdk";
import createError from "http-errors";

import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const addConnection = async (connectionId, userId) => {
    const params = {
        TableName: process.env.WS_CONNECTIONS_TABLE_NAME,
        Item: {
            connectionId,
            userId
        },
    };
    return dynamodb.put(params).promise();
};

const deleteConnection = async connectionId => {
    const params = {
        TableName: process.env.WS_CONNECTIONS_TABLE_NAME,
        Key: {
            connectionId
        },
    };
    return dynamodb.delete(params).promise();
};

const wsConnection = async (event) => {
    const successfulResponse = {
        statusCode: 200,
        body: "everything is alright"
    }
    if(event.requestContext.eventType === 'CONNECT') {
        const { userId } = event.queryStringParameters;
        const { connectionId } = event.requestContext;
        try {
            await addConnection(connectionId, userId);
            return successfulResponse;
        } catch(e) {
            console.log(e);
            throw new createError.InternalServerError(e);
        }
    }
    if(event.requestContext.eventType === 'DISCONNECT') {
        try {
            console.log('event', event);
            const { connectionId } = event.requestContext;
            await deleteConnection(connectionId);
            return successfulResponse;
        } catch(e) {
            console.log(e);
            throw new createError.InternalServerError(e);
        }
    }
};

export const handler = commonMiddleware(wsConnection);
