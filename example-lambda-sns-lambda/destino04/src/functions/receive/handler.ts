const receive = async (event) => {
  //console.log(JSON.stringify(event, null, "\t"));
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export { receive };