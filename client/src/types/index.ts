export interface IRepo {
  id: number;
  repoId: number;
  name: string;
  description?: string;
  htmlUrl: string;
  language?: string;
  stargazers: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id: number;
  githubId: number;
  username: string;
  avatarUrl?: string;
  location?: string;
  blog?: string;
  bio?: string;
  publicRepos: number;
  publicGists: number;
  followers: number;
  following: number;
  createdAt: Date;
  deletedAt?: Date;
}
export interface IFriends {
  id: number;
  userId: number;
  friendId: number;
  username: string;
  githUrl?: string;
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AppState {
  users: Record<string, IUser>;
  repos: Record<string, IRepo[]>;
  followers: Record<string, IFriends[]>;
  selectedUser: string | null;
  selectedRepo: string | null;
  currentView: "home" | "repo-details" | "followers";
  loading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: { username: string; user: IUser } }
  | { type: "SET_REPOS"; payload: { username: string; repos: IRepo[] } }
  | {
      type: "SET_FOLLOWERS";
      payload: { username: string; followers: IFriends[] };
    }
  | { type: "SELECT_USER"; payload: string }
  | { type: "SELECT_REPO"; payload: string }
  | { type: "SET_VIEW"; payload: "home" | "repo-details" | "followers" };
export interface IfetchMutualResponse {
  success: boolean;
  message: string;
  mutual: IFriends[];
}

export interface IfetchUserResponse {
  user: IUser;
  repo: IRepo[];
  message:string;
  success:boolean
}
