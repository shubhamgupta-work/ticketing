import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";
import { response } from "express";

it("returns a 404 if Id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "afdfad", price: 20 })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).send({ title: "afdfad", price: 20 }).expect(401);
});

it("returns a 401 if user does not own the ticket", async () => {
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Ljlk", price: 20 });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "kljlk", price: 50 })
    .expect(401);
});

it("return 400 if user provides invalid title or price", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Ljlk", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 25 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "dfsd", price: -10 })
    .expect(400);
});

it("updated the ticket provided valid outputs", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Ljlk", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 10 })
    .expect(200);

  const newTicket = await request(app).get(`/api/tickets/${ticket.body.id}`).send();

  expect(newTicket.body.title).toEqual("new title");
  expect(newTicket.body.price).toEqual(10);
});

it("publishes and event", async () => {
  const cookie = global.signin();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Ljlk", price: 20 })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 10 })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket if reserved", async () => {
  const cookie = global.signin();
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Ljlk", price: 20 })
    .expect(201);

  const createdTicket = await Ticket.findById(ticket.body.id);
  createdTicket?.set({ orderId });
  await createdTicket?.save();

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title", price: 10 })
    .expect(400);
});
