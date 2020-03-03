'use strict';
const {PubSub} = require('@google-cloud/pubsub');

exports.getScreenShot = (pubSubEvent, context) => {
  // const name = pubSubEvent.data;
    // const theContext = context;
  const newDataNoString =  Buffer.from(pubSubEvent.data, 'base64');
  console.log(` newDataNoString: ${newDataNoString}`);

};