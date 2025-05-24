import { Schema, model, models, Document } from "mongoose";

interface Chat {
  role: string;
  content: string;
}

interface MessageInterface extends Document {
  portfolioid: string;
  message: Chat[];
  email: string;
}

const chatSchema = new Schema<Chat>(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const messageSchema = new Schema<MessageInterface>(
  {
    portfolioid: { type: String, required: true },
    message: { type: [chatSchema], required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const messageModel =
  models.Messages || model<MessageInterface>("Messages", messageSchema);
