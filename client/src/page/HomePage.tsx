import { memo } from 'react';
import UserInput from '../components/UserInput';
import UserInfo from '../components/UserInfo';
import RepoList from '../components/RepoList';
import { useUserContext } from '../context/UserContext';

 const HomePage = memo(()=> {
  const { state } = useUserContext();
  const { selectedUser, users, repos, loading, error } = state;

  const currentUser = selectedUser ? users[selectedUser] : null;
  const currentRepos = selectedUser ? repos[selectedUser] || [] : [];

  return (
    <div className="home-page">
      <UserInput />
      
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>
      )}
      
      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}
      
      {currentUser && !loading && (
        <>
          <UserInfo user={currentUser} />
          <RepoList repos={currentRepos} />
        </>
      )}
    </div>
  );
})
export default HomePage