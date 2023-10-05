import { OrderCancelledEvent, Publisher, Subjects } from "@sgpkgs/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
