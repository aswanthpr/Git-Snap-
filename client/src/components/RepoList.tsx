import { Star } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import type { IRepo } from "../types";

interface RepoListProps {
  repos: IRepo[];
}

export default function RepoList({ repos }: RepoListProps) {
  const { dispatch } = useUserContext();

  const handleRepoClick = (repoName: string) => {
    dispatch({ type: 'SELECT_REPO', payload: repoName });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (repos.length === 0) {
    return (
      <div className="repo-list">
        <h3 className="section-title">Repositories</h3>
        <div className="empty-state">
          <p>No public repositories found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="repo-list">
      <h3 className="section-title">Repositories ({repos.length})</h3>
      <div className="repos-grid">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="repo-card"
            onClick={() => handleRepoClick(repo.name)}
          >
            <div className="repo-header">
              <h4 className="repo-name">{repo.name}</h4>
              {repo.language && (
                <span className="repo-language">{repo.language}</span>
              )}
            </div>
            
            {repo.description && (
              <p className="repo-description">{repo.description.length>80?repo.description.slice(0,80)+"...":repo.description}</p>
            )}
            
            <div className="repo-stats">
              <div className="repo-stat">
                <Star size={14} />
                <span>{repo?.stargazers}</span>
              </div>


            </div>
            
            <div className="repo-footer">
              <span className="repo-updated">
                Updated {formatDate(repo?.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}