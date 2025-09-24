
import { useUserContext } from './context/UserContext';
import FollowersPage from './page/FollowersPage';
import HomePage from './page/HomePage';
import RepoDetailsPage from './page/RepoDetailsPage';
import './index.css';

function App() {
  const { state } = useUserContext();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'repo-details':
        return <RepoDetailsPage />;
      case 'followers':
        return <FollowersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">GitHub User Explorer</h1>
        <h5 className='app-subtitle'>Search for a GitHub user to view profile, repositories, and followers.</h5>
      </header>
      
      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;