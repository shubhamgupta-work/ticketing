import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: any;
process.env.STRIPE_KEY =
  "sk_test_51NxCh5HfGltDt4f8x7UlSMG9Wd2Gqp3Uf29Gn4NVhGr7ZKQx9YgVN2S9ZeOKtglniqCyOyg5DqPV3iNtRRpKpTCn00RnRSCKjT";

beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  //Build a JWT Paylod {id, email}
  const payload = { id: id || new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  //Turn that session object into json
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return the string that cookie with encoded data
  return [`session=${base64}`];
};
