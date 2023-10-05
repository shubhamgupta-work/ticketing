import { OrderCreatedEvent, Publisher, Subjects } from "@sgpkgs/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
