import { Schema, model, models, Document } from "mongoose";

interface PortfolioInterface extends Document {
  title: string;
  email: string;
  description: string;
  data: string;
  score: number;
}

const portfolioSchema = new Schema<PortfolioInterface>(
  {
    title: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    data: { type: String },
    score: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const portfolioModel =
  models.Portfolio || model<PortfolioInterface>("Portfolio", portfolioSchema);
