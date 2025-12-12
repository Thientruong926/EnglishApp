// User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, default: "user" },
}, { timestamps: true });
const User = mongoose.model("User", UserSchema);
export default User;