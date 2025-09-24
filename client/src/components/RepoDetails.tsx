import { Calendar, Code, ExternalLink, Star } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import { memo } from "react";


const  RepoDetails= memo(()=> {
  const { state } = useUserContext();
  const { selectedUser, selectedRepo, repos } = state;

  if (!selectedUser || !selectedRepo) {
    return null;
  }

  const userRepos = repos[selectedUser];
  const repo = userRepos?.find(r => r.name === selectedRepo);

  if (!repo) {
    return (
      <div className="repo-details">
        <div className="error-state">Repository not found</div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="repo-details">
      <div className="repo-details-header">
        <div className="repo-title-section">
          <h2 className="repo-title">{repo.name}</h2>
          <div className="repo-links">
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-link"
            >
              <ExternalLink size={16} />
              View on GitHub
            </a>
          </div>
        </div>
        
        {repo.language && (
          <div className="repo-language-badge">
            <Code size={16} />
            {repo.language}
          </div>
        )}
      </div>

      {repo.description && (
        <div className="repo-description-section">
          <p className="repo-description-full">{repo.description}</p>
        </div>
      )}

      <div className="repo-stats-detailed">
        <div className="stat-card">
          <Star size={20} />
          <div className="stat-info">
            <span className="stat-number">{repo.stargazers}</span>
            <span className="stat-label">Stars</span>
          </div>
        </div>
      </div>

      <div className="repo-metadata">
        <div className="metadata-item">
          <Calendar size={16} />
          <div className="metadata-info">
            <span className="metadata-label">Created</span>
            <span className="metadata-value">{formatDate(repo?.createdAt)}</span>
          </div>
        </div>

        <div className="metadata-item">
          <Calendar size={16} />
          <div className="metadata-info">
            <span className="metadata-label">Last Updated</span>
            <span className="metadata-value">{formatDate(repo.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
})
export default RepoDetails