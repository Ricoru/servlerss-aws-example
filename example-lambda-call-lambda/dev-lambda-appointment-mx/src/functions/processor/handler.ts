const processorHandler = async (event: any = {}): Promise<any> => {
  return {
    statusCode: 200,
    body: { status: "Message received", body: event},
  };
};

export { processorHandler };