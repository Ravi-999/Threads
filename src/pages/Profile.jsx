import { useEffect, useState } from "react";
import {
  database,
  DB_ID,
  COLLECTION_ID_THREADS,
  COLLECTION_ID_PROFILES,
} from "../appWriteConfig";
import { useParams } from "react-router-dom";
import { Query } from "appwrite";
import Thread from "../components/Thread";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "../components/editProfileModal";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState([]);
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [showModal,setShowModal] = useState(false);

  console.log('profile called');
  const { user } = useAuth();
 
  useEffect(() => {
    getProfile();
    // setting setLoading(false) here is a bad idea because getThreads() and getProfile() are async functions so they will be pushed to queue untill they return some result meanwhile setLoading(false) gets executed and that makes way to evaluse JSX code below in return ,which results in error as userProfile,threads are not stored yet
  }, [showModal,username]);

  const getProfile = async () => {
    let profile = await database.listDocuments(DB_ID, COLLECTION_ID_PROFILES, [
      Query.equal("username", username),
      Query.limit(1),
    ]);

    getThreads(profile.documents[0].$id);
    setUserProfile(profile.documents[0]);
    setLoading(false);
  };

  const getThreads = async (owner_id) => {
    const response = await database.listDocuments(
      DB_ID,
      COLLECTION_ID_THREADS,
      [Query.equal("owner_id", owner_id), Query.orderDesc("$createdAt")]
    );
    setThreads(response.documents);
  };

  const toggleFollow = async () => {
    const following = user.profile.following;
    if (following.includes(userProfile.$id)) {
      const index = following.indexOf(userProfile.$id);
      following.splice(index, 1);
    } else following.push(userProfile.$id);

    const followers = userProfile.followers;
    if (followers.includes(user.$id)) {
      const index = followers.indexOf(user.$id);
      followers.splice(index, 1);
    } else followers.push(user.$id);

    const payload1 = {
      following,
      following_count: following.length,
    };
    const payload2 = {
      followers,
      follower_count: followers.length,
    };

    const response1 = await database.updateDocument(
      DB_ID,
      COLLECTION_ID_PROFILES,
      user.$id,
      payload1
    );
    const response2 = await database.updateDocument(
      DB_ID,
      COLLECTION_ID_PROFILES,
      userProfile.$id,
      payload2
    );
    setUserProfile(response2);
  };


  if (loading) return;



 

  return (
    <>

      <div className="flex ml-10 justify-between my-10">
        <div className="py-4">
          <h3 className="text-3xl font-bold">{userProfile.username}</h3>
          <p>{userProfile.name}</p>

          <div className="py-6">{userProfile.bio}</div>

          <div className="flex self-start gap-2">
            <p className="text-[rgba(97,97,97,1)]">
              <span className="inline-block w-2 mr-1">
                {userProfile.follower_count}{" "}
              </span>
              followers
            </p>
            {userProfile.link && (
              <>
                <p>.</p>
                <a
                  href={userProfile.link}
                  className="w-maxcontent text-[rgba(97,97,97,1)]"
                >
                  some Link to move
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between pb-2 w-1/3" >
          <img
            className="h-20 w-20 rounded-full object-cover"
            src={userProfile.profile_pic}
          />

          <div className="w-22">
            {user.$id === userProfile.$id ? (
              <button
                onClick={()=>setShowModal((prevState)=> !prevState)}
                className="text-white py-2 px-2 border text-sm border-[#fff] rounded-full cursor-pointer"
              >
                edit Profile
              </button>
            ) : (
              <>
                {user.profile.following.includes(userProfile.$id) ? (
                  <button
                    onClick={toggleFollow}
                    className="text-white py-2 px-4 border text-sm border-[#fff] rounded-full cursor-pointer"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={toggleFollow}
                    className="bg-white text-black py-2 px-7 border text-sm border-black rounded-full cursor-pointer"
                  >
                    Follow
                  </button>
                )}
              </>
            )}
            
          </div>
        </div>
      </div>
      {showModal && <EditProfileModal setShowModal={setShowModal}/>}
      {threads.map((thread) => (
        <Thread key={thread.$id} thread={thread} setThreads={setThreads} />
      ))}
    </>
  );
};

export default Profile;
