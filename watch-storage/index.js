'use strict';
const {PubSub} = require('@google-cloud/pubsub');

const publishMessage = async (dataToSend) =>  {
  const topicName = 'screenshot-created';
  const data = JSON.stringify(dataToSend);
  const pubSubClient = new PubSub();
  const dataBuffer = Buffer.from(data);
  const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
}

exports.watchCloudStorage = async (data, context) => {
  const file = data;
  console.log(`  Event ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);
  console.log(`  SelfLink: ${file.selfLink}`);
  console.log(`  MediaLink: ${file.mediaLink}`);

  const objToSend = {
    Event: context.eventId,
    EventType: context.eventType,
    Bucket: file.bucket,
    File: file.name,
    Metageneration: file.metageneration,
    Created: file.timeCreated,
    Updated: file.updated,
    SelfLink: file.selfLink,
    MediaLink: file.mediaLink,
  }
  await publishMessage(objToSend).catch(console.error);
};