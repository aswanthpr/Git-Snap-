
import { ExternalLink } from 'lucide-react';
import { useUserContext } from '../context/UserContext';
import { memo } from 'react';
import { fetchGithubUser } from '../services/apis';

 const FollowersList =memo(()=> {

  const { state, dispatch } = useUserContext();
  const { selectedUser, followers } = state;

  if (!selectedUser) {
    return null;
  }

  const userFollowers = followers[selectedUser];

  if (!userFollowers) {
    return (
      <div className="followers-list">
        <h3 className="section-title">Followers</h3>
        <div className="loading-state">Loading followers...</div>
      </div>
    );
  }

  const handleFollowerClick = async(followerUsername: string) => {
    try {
            const result = await fetchGithubUser(followerUsername);
            if(result) {
    
              const {repo,user} = result;
               
                // Fetch user data
             
                dispatch({ type: 'SET_USER', payload: { username:followerUsername, user } });
          
                // Fetch repositories
                
                dispatch({ type: 'SET_REPOS', payload: { username:followerUsername, repos:repo } });
                 dispatch({ type: 'SELECT_USER', payload: followerUsername });
            }
          
        } catch (error) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: error instanceof Error ? error.message : 'An error occurred' 
          });
        }
   
  };

  if (userFollowers.length === 0) {
    return (
      <div className="followers-list">
        <h3 className="section-title">Followers</h3>
        <div className="empty-state">
          <p>No followers found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="followers-list">
      <h3 className="section-title">Followers ({userFollowers.length})</h3>
      <div className="followers-grid">
        {userFollowers.map((follower) => (
          <div key={follower.id} className="follower-card">
            <img
              src={follower.avatarUrl}
              alt={`${follower?.username}'s avatar`}
              className="follower-avatar"
            />
            
            <div className="follower-info">
              <h4 className="follower-username">{follower?.username}</h4>
              <div className="follower-actions">
                <button
                  onClick={() => handleFollowerClick(follower?.username)}
                  className="follower-button primary"
                >
                  View Profile
                </button>
                
                <a
                  href={follower?.githUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="follower-button secondary"
                >
                  <ExternalLink size={14} />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
})
export default FollowersList