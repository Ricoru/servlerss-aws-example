import * as AWS from 'aws-sdk';

interface PublishMessageSNS {
  Message: string;
  TopicArn: string;
}

const sns = new AWS.SNS();

const send = async (event) => {
  const topicARN = process.env.SNS_TOPIC_ARN;
  const message = {
    user: "ricoru21",
    status: "active",
    date: new Date(),
    message: "test envio"
  };

  const params: PublishMessageSNS = {
    Message: JSON.stringify(message),
    TopicArn: topicARN,
  };
  
  const result = await sns.publish(params).promise();
  console.log("result", result);

  return {
    statusCode: 200,
    body: "Message send",
  };
};

export { send };