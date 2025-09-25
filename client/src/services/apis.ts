import axios, { AxiosError } from "axios";
import type { IfetchMutualResponse, IfetchUserResponse, IUser } from "../types";
import toast from "react-hot-toast";

export const fetchGithubUser = async (
  username: string
):Promise<IfetchUserResponse|null> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user`, { username });
  
    return response?.data
  } catch (error: unknown) {
     if(error instanceof AxiosError) {
      toast.error(error.response?.data.message)
    }
    console.log(error instanceof Error ? error.message : "An error occurred");
    return null;
  }
};

export const  fetchFollowers = async(userId: IUser["id"]):Promise<IfetchMutualResponse|[]>=> {
  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/mutual`, { userId });
   
    return response?.data
  } catch (error: unknown) {
    if(error instanceof AxiosError) {
      toast.error(error.response?.data.message)
    }
    console.log(error instanceof Error ? error.message : "An error occurred");
    return [];
  }
}