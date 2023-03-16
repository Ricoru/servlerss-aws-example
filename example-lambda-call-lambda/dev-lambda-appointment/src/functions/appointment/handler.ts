import * as AWS from 'aws-sdk';
import { ISO_COUNTRY, Message } from './schema';

const lambda = new AWS.Lambda();

const senMessage = async (information: Message): Promise<any> =>  {
  const isoCountry = information.isoCountry;
  let lambdaFunctionNameDestination = "";
  switch (isoCountry) {
    case ISO_COUNTRY.COLOMBIA:
      lambdaFunctionNameDestination = "dev-appointment-co-dev-processor";
      break;
    case ISO_COUNTRY.MEXICO:
      lambdaFunctionNameDestination = "dev-appointment-mx-dev-processor";
      break;
    case ISO_COUNTRY.PERU:
      lambdaFunctionNameDestination = "dev-appointment-pe-dev-processor";
      break;
  }

  return await lambda
  .invoke({
    FunctionName: lambdaFunctionNameDestination,
    InvocationType: "RequestResponse",
    Payload: JSON.stringify(information)
  })
  .promise();
}


const appointmentHandler = async (event: any = {}): Promise<any> => {
  const { body } = event;
  
  const information: Message = JSON.parse(body);
  const result = await senMessage(information);
  
  return {
    statusCode: 200,
    body: result.Payload,
  };
  
};

export { appointmentHandler };

