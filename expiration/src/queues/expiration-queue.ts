import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  //order:expiration is the bucket of redis where our jobs will sit
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("Publishing expiration:complete event for orderId", job.data.orderId);
  //Actually publishing the event expiration:complete
  new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expirationQueue };
