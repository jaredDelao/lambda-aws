'use strict';

module.exports.handlerGet = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'API REST GET',
        input: event,
      },
      null,
      2
    ),
  };

};
