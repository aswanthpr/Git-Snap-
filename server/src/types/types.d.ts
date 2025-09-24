
export interface GitHubUser {
  id: number;                 
  login: string;              
  avatar_url?: string;         
  location?: string;           
  blog?: string;               
  bio?: string;               
  public_repos: number;        
  public_gists: number;        
  followers: number;           
  following: number;           
  created_at: string;          
  [key: string]: any;         
}
export interface GitHubRepository {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;

  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
    site_admin: boolean;
  };

  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;

  created_at: string;   
  updated_at: string;   
  pushed_at: string;    

  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;

  topics?: string[];
  visibility?: "public" | "private" | "internal";
  archived?: boolean;
  disabled?: boolean;
}
