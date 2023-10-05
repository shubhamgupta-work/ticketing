import { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";
import { NotFoundError } from "@sgpkgs/common";
const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await Ticket.findById(id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
