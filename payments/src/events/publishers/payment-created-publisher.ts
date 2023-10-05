import { PaymentCreatedEvent, Publisher, Subjects } from "@sgpkgs/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
