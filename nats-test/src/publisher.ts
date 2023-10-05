import nats from "node-nats-streaming";
import { TickerCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", { url: "http://localhost:4222" });

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  // const data = JSON.stringify({
  //   id: "45678",
  //   title: "some title",
  //   price: 10,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event Published");
  // });
  // //first argument in publish function is channel name, then data we want to send
  // //and third is the optional call back function

  const publisher = new TickerCreatedPublisher(stan);
  try {
    await publisher.publish({ id: "123", title: "concer", price: 20 });
  } catch (err) {
    console.log(err);
  }
});
