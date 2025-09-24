import axios from "axios";
import type { IFriends, IRepo, IUser } from "../types";

export const fetchGithubUser = async (
  username: string
):Promise<{user:IUser,repo:IRepo[]}|null> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user`, { username });
  
    return response?.data
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "An error occurred");
    return null;
  }
};

export const  fetchFollowers = async(userId: IUser["id"]):Promise<{friends:IFriends[]}|[]>=> {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/mutual`, { userId });
   
    return response?.data?.mutual
  } catch (error: unknown) {
    console.log(error instanceof Error ? error.message : "An error occurred");
    return [];
  }
}