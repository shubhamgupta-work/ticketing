import { Publisher } from "./base-publisher";
import { Subjects } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
