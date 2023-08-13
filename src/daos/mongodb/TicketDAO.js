import { ticketModel } from "./models/ticket.model.js";

export default class TicketDAO {
    async create(ticket) {
        const result = await ticketModel.create(ticket)
        return result
    }
}