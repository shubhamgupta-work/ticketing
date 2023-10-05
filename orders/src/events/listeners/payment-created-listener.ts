import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@sgpkgs/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, orderid, stripeId } = data;
    const order = await Order.findById(orderid);
    if (!order) {
      throw new Error("Order Not Found");
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
