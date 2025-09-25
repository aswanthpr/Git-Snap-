import axios, { AxiosInstance, AxiosResponse } from "axios";
import { createHttpError } from "../utils";
import { HttpResponse } from "../constants";
import { GitHubRepository, GitHubUser } from "../types/types";

const { GITHUB_FETCH_URL,GITHUB_TOKEN } = process.env;

const api: AxiosInstance = axios.create({
  baseURL: GITHUB_FETCH_URL,
  headers:{
    Authorization:`Bearer ${GITHUB_TOKEN}`,
    Accept:"application/vnd.github.v3+json",
    'X-GitHub-Api-Version': '2022-11-28'
  },
  timeout: 5000,
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
): Promise<GitHubRepository[] | []> => {
  try {
    const res = await api.get(`/${userName}/repos?per_page=100`);
    return res.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.message);
    } else {
      throw createHttpError(err.response?.status || 500, err.message || HttpResponse.SERVER_ERROR);
    }
    return [];
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
    return [];
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
    return [];
  }
};
