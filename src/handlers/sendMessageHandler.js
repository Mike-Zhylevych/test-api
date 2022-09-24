import createError from "http-errors";
import AWS from "aws-sdk";

import commonMiddleware from "../../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const send = async (event, connectionId) => {
    console.log('send');
    const body = JSON.parse(event.body);
    const postData = body.data;
    const {domainName, stage} =  event.requestContext
    const endpoint = `${domainName}/${stage}`;
    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint
    });

    const params = {
        ConnectionId: connectionId,
        Data: postData
    };
    try {
        console.log('apigwManagementApi');
        const result = await apigwManagementApi.postToConnection(params).promise();
        console.log('result', result);
        return result;
    } catch (e) {
        console.log('error', e);
    }
};


const sendMessage = async(event) => {
    try {
        const { userId } = JSON.parse(event.body);
        const params = {
            TableName: process.env.WS_CONNECTIONS_TABLE_NAME,
            FilterExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId',
            },
            ExpressionAttributeValues: {
                ':userId': userId,
            },
          }; 
        const result = await dynamodb
          .scan(params)
          .promise();

        if (!result.Items.length) {
          throw new createError.NotFound(`There is no record with ID ${userId}`);
        }
        const re = await result.Items.map(item => send(event, item.connectionId));
        console.log('re', re);
        return re;
    
      } catch (e) {
        console.error(e);
        throw new createError.InternalServerError(e);
      }
};

const sendMessageHandler = async (event) => {
  try {
    const { userId } = JSON.parse(event.body);
    const params = {
            TableName: process.env.WS_CONNECTIONS_TABLE_NAME,
            FilterExpression: '#userId = :userId',
            ExpressionAttributeNames: {
                '#userId': 'userId',
            },
            ExpressionAttributeValues: {
                ':userId': userId,
            },
    }; 
    const result = await dynamodb
          .scan(params)
          .promise();

    if (!result.Items.length) {
          throw new createError.NotFound(`There is no record with ID ${userId}`);
    }
    await Promise.all(result.Items.map(async (item) => send(event, item.connectionId)));
    return {
        statusCode: 200,
        body: "everything is alright"
    };
  } catch (e) {
    console.error(e);
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(sendMessageHandler);
