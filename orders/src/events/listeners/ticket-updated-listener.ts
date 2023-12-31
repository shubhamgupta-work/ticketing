import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@sgpkgs/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket Not Found");
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save(); //version will be updated automatically

    msg.ack();
  }
}
