import  { memo } from 'react';
import { BackButton } from '../components/BackButton';
import FollowersList from "../components/FollowersList"

 const FollowersPage = memo(()=> {
  return (
    <div className="followers-page">
      <BackButton />
      <FollowersList />
    </div>
  );
})
export default FollowersPage