import { model, Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required to create account"],
    unique: [true, "Account with this username already exists"],
  },
  email: {
    type: String,
    required: [true, "Email is required to create account"],
    unique: [true, "Account with this email already exists"],
  },
  password: {
    type: String,
    required: [true, "Password is required to create account"],
    minLength: 6,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: "videos",
    },
  ],
  // People that subscribes/sunscribed to user's channel
  subscribers: {
    type: Array,
    default: [],
  },
  // These are the channels that the document user is subscribed to
  userSubscribedChannels: {
    type: Array,
    default: [],
  },
});

export const userModel = model("user", userSchema);
