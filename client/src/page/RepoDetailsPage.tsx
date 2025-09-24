import { memo } from 'react';
import RepoDetails from '../components/RepoDetails';
import { BackButton } from '../components/BackButton';
import { useUserContext } from '../context/UserContext';
import UserInfo from '../components/UserInfo';
import type { IUser } from '../types';


const RepoDetailsPage = memo(()=> {
  const { state } = useUserContext();
  const { selectedUser, users } = state;

  const currentUser = selectedUser ? users[selectedUser] : null;

  return (
    <div className="repo-details-page">
      <BackButton />
      <UserInfo user={currentUser as IUser}/>
      <RepoDetails />
    </div>
  );
})
export default RepoDetailsPage