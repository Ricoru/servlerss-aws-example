import { handlerPath } from '@libs/handler-resolver';
// subscribe to SNS topic
export default {
  handler: `${handlerPath(__dirname)}/handler.receive`,
  events: [
    {
      sns: { 
        arn: "${cf:origin04-dev.SNSTopicArn}",
        topicName: "SNSTop01"
      },
    },
  ],
};
