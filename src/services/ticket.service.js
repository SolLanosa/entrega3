import TicketDAO from "../daos/mongodb/TicketDAO.js"
import {randomBytes} from 'crypto'

export default class TicketService {
    constructor() {
        this.ticketDAO = new TicketDAO()
    }

    async createTicket(products, email) {
        const purchasePrice = products.reduce((acc, product) => {
            return acc + product.quantity * product.product.price
        }, 0)
        const ticket = {
           code: randomBytes(20).toString('hex'),
           amount: purchasePrice,
           purchaser: email
        }
        this.ticketDAO.create(ticket)
    } 
}