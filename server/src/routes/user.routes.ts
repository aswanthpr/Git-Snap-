import { Router } from "express";
import {
  getAllUsers,
  getMutualFriends,
  getUser,
  searchUsers,
  softDeleteUser,
  updateUserProfile,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute.post("/user", getUser);
userRoute.delete("/user", softDeleteUser);
userRoute.get("/user", searchUsers);
userRoute.patch("/user", updateUserProfile);
userRoute.post("/user/mutual", getMutualFriends);
userRoute.get("/users", getAllUsers);
export default userRoute;
