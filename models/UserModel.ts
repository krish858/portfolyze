import { Schema, model, models, Document } from "mongoose";

export enum Tier {
  FREE = "free",
  PAID = "paid",
}

interface UserInterface extends Document {
  name: string;
  email: string;
  PortfolioId: string[];
  tier: Tier;
}

const userSchema = new Schema<UserInterface>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  PortfolioId: [{ type: Schema.Types.ObjectId, ref: "Portfolio" }],
  tier: {
    type: String,
    enum: Object.values(Tier),
    default: Tier.FREE,
  },
});

export const userModel =
  models.Users || model<UserInterface>("Users", userSchema);
