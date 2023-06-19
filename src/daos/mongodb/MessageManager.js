import mongoose from "mongoose";
import { messagesModel } from "./models/messages.model.js"


export default class MessageManager {
  connection = mongoose.connect("mongodb+srv://admin:admin123@cluster0.wnbmalb.mongodb.net/ecommerce?retryWrites=true&w=majority");

  async addMessage(messageData) {
    if (!messageData.user || !messageData.message) {
      throw new Error("invalid message")
    }
    const result = await messagesModel.create({
      user: messageData.user,
      message: messageData.message
      });
      return result
  }

  async getMessages() {
    let result = await messagesModel.find().lean();
    return result
  }
}