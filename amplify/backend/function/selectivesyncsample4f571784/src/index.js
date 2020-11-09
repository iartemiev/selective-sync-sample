const { API, graphqlOperation } = require('aws-amplify');
const mutations = require('./graphql/mutations');

exports.handler = async (event) => {
  mutations.createUser();

  // TODO implement
  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*"
    //  },
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
