import { ExpirationCompleteEvent, Publisher, Subjects } from "@sgpkgs/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
