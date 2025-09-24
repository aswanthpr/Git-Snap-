import axios, { AxiosInstance, AxiosResponse } from "axios";
import { createHttpError } from "../utils";
import { HttpResponse } from "../constants";
import { GitHubRepository, GitHubUser } from "../types/types";

const { GITHUB_FETCH_URL } = process.env;

const api: AxiosInstance = axios.create({
  baseURL: GITHUB_FETCH_URL,
  timeout: 10000,
});

export const fetchGitHubUser = async (
  userName: string
): Promise<GitHubUser>  => {
  try {
    const res = await api.get(`/${userName}`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.message);
    } else {
      throw createHttpError(err.response?.status || 500, err.message || HttpResponse.SERVER_ERROR);
    }
  }
};

export const fetchGitHubRepos = async (
  userName: string
): Promise<GitHubRepository[] | [null]> => {
  try {
    const res = await api.get(`/${userName}/repos?per_page=100`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.message);
    } else {
      throw createHttpError(err.response?.status || 500, err.message || HttpResponse.SERVER_ERROR);
    }
    return null;
  }
};
export const fetchGitHubFollowers = async (
  userName: string
) => {
  try {
    const res = await api.get(`/${userName}/followers?per_page=100`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.message);
    } else {
       throw createHttpError(err.response?.status || 500, err.message || HttpResponse.SERVER_ERROR);
    }
    return null;
  }
};
export const fetchGitHubFollowing = async (
  userName: string
) => {
  try {
    const res = await api.get(`/${userName}/following?per_page=100`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.message);
    } else {
       throw createHttpError(err.response?.status || 500, err.message || HttpResponse.SERVER_ERROR);
    }
    return null;
  }
};
