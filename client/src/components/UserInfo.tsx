import { Calendar, LinkIcon, MapPin } from "lucide-react";
import { useUserContext } from "../context/UserContext";
import type { IfetchMutualResponse, IFriends, IUser } from "../types";
import { fetchFollowers } from "../services/apis";
import toast from "react-hot-toast";
// import toast from "react-hot-toast";

interface UserInfoProps {
  user: IUser;
}

export default function UserInfo({ user }: UserInfoProps) {
  const { dispatch } = useUserContext();
  //fetch user data
  const handleFollowersClick = async () => {
    try {
      const result = (await fetchFollowers(user?.id)) as IfetchMutualResponse;

      if (result) {
        if (!result?.mutual?.length) {
          toast.error(result?.message || "No mutual followers found");
          return;
        }

        const username = user?.username;

        dispatch({
          type: "SET_FOLLOWERS",
          payload: { username, followers: result?.mutual as IFriends[] },
        });
        
        dispatch({ type: "SET_VIEW", payload: "followers" });
      }
    } catch (error: unknown) {
      console.log(error instanceof Error ? error : String(error));
      toast.error("Something went wrong while fetching followers");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="user-info">
      <div className="user-header">
        <img
          src={user?.avatarUrl}
          alt={`${user?.username}'s avatar`}
          className="user-avatar"
        />
        <div className="user-details">
          <div className="user-name-section">
            <h2 className="user-name">{user.username || user.username}</h2>
            <p className="user-username">@{user.username}</p>
          </div>

          {user.bio && <p className="user-bio">{user.bio}</p>}

          <div className="user-meta">
            {user.location && (
              <div className="meta-item">
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}

            {user.blog && (
              <div className="meta-item">
                <LinkIcon size={16} />
                <a
                  href={
                    user.blog.startsWith("http")
                      ? user.blog
                      : `https://${user.blog}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="user-link"
                >
                  {user.blog}
                </a>
              </div>
            )}

            <div className="meta-item">
              <Calendar size={16} />
              <span>Joined {formatDate(String(user?.createdAt))}</span>
            </div>
          </div>

          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-number">{user?.publicRepos}</span>
              <span className="stat-label">Repositories</span>
            </div>

            <div className="stat-item ">
              <span className="stat-number">{user.followers}</span>
              <span className="stat-label">Followers</span>
            </div>

            <div className="stat-item">
              <span className="stat-number">{user.following}</span>
              <span className="stat-label">Following</span>
            </div>

            <button
              onClick={handleFollowersClick}
              className="stat-item stat-button"
            >
              {/* <span className="stat-number">{user.followers}</span> */}
              <span className="stat-label">Mutual</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
