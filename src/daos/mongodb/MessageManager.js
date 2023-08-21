import { messagesModel } from "./models/messages.model.js"

export default class MessageManager {
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