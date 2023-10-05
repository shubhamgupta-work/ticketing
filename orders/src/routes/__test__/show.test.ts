import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("fetches the order", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const user = global.signin();

  const {
    body: { id },
  } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const {
    body: { id: fetchedId },
  } = await request(app).get(`/api/orders/${id}`).set("Cookie", user).send().expect(200);

  expect(fetchedId).toEqual(id);
});

it("returns an error if one user tries to fetch another user's order", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const {
    body: { id },
  } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app).get(`/api/orders/${id}`).set("Cookie", global.signin()).send().expect(401);
});
