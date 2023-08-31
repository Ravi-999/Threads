/* eslint-disable react/prop-types */
import { Heart, MessageCircle, Repeat, Send, Trash2 } from "react-feather";
import { useEffect, useState } from "react";
import {
  COLLECTION_ID_PROFILES,
  COLLECTION_ID_COMMENTS,
  COLLECTION_ID_THREADS,
  DB_ID,
  database,
  functions,
} from "../appWriteConfig";
import { Link } from "react-router-dom";
import { Query } from "appwrite";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from "react-time-ago";

import { useAuth } from "../context/AuthContext";

function Thread({ thread, setThreads }) {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threadInstanse, setThreadInstance] = useState(thread);
  const [numReplies, setNumReplies] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    getUserInfo();
    // console.log(thread);
  }, [thread]);

  const getComments = async () => {
    const response = await database.listDocuments(
      DB_ID,
      COLLECTION_ID_COMMENTS,
      [Query.equal("parent_id", thread.$id), Query.orderDesc("$createdAt")]
    );
    setNumReplies(response.total);
    setLoading(false);
  };
  const getUserInfo = async () => {
    const payload = { owner_id: thread.owner_id };
    const response = await functions.createExecution(
      "64bf9cb98df18589e479",
      JSON.stringify(payload)
    );

    const profile = await database.getDocument(
      DB_ID,
      COLLECTION_ID_PROFILES,
      thread.owner_id
    );
    const userData = JSON.parse(response.response);

    userData["profile_pic"] = profile.profile_pic;
    userData["username"] = profile.username;
    // console.log(userData);
    setOwner(userData);
    getComments();
  };

  const handleDelete = async () => {
    if (owner.$id !== user.$id) return;
    database.deleteDocument(DB_ID, COLLECTION_ID_THREADS, thread.$id);
    setThreads((prevState) =>
      prevState.filter((curthread) => curthread.$id !== thread.$id)
    );
  };

  const toggleLikeHandler = async () => {
    const users_who_liked = thread.users_who_liked;

    if (users_who_liked.includes(user.$id)) {
      const index = users_who_liked.indexOf(user.$id);
      users_who_liked.splice(index, 1);
    } else {
      users_who_liked.push(user.$id);
    }
    const payload = {
      users_who_liked: users_who_liked,
      likes: users_who_liked.length,
    };
    const response = await database.updateDocument(
      DB_ID,
      COLLECTION_ID_THREADS,
      thread.$id,
      JSON.stringify(payload)
    );
    setThreadInstance(response);
  };

  if (loading) return;

  return (
    <div className="flex p-4">
      <Link to={`/profile/${owner.username}`}>
        <img
          className="relative z-20 w-12 h-12 rounded-full object-cover"
          src={owner.profile_pic}
        />
      </Link>

      <div className="relative z-10 w-0.5 bg-[rgba(97,97,97,1)] right-6 mb-1"></div>
      <div className="w-full px-2 pb-3 border-b border-[rgba(97,97,97,1)]">
        {/* Thread Header */}
        <div className="flex justify-between">
          <Link to={`/profile/${owner.username}`}>
            <strong className="text-white">{owner.name}</strong>
          </Link>

          <div className="flex gap-2 items-cente cursor-pointer">
            <p className="text-[rgba(97,97,97,1)]">
              {" "}
              <ReactTimeAgo
                date={new Date(thread.$createdAt).getTime()}
                locale="en-US"
              />
            </p>
            <Trash2 onClick={handleDelete} size={20} />
          </div>
        </div>

        {/* Thread Body */}
        <Link to={`/thread/${thread.$id}?isthread=true`}>
          <div className="pb-5 text-white" style={{ whiteSpace: "prev-wrap" }}>
            {thread.body}
            {thread.image && (
              <img
                className="border border-[rgba(49,49,50,1)] rounded-md mt-2"
                src={thread.image}
              />
            )}
          </div>
        </Link>

        <div className="flex space-x-4 py-3">
          <Heart
            onClick={toggleLikeHandler}
            size={22}
            className="cursor-pointer"
            color={
              threadInstanse.users_who_liked.includes(user.$id)
                ? "#ff0000"
                : "#fff"
            }
          />
          <Link to={`/thread/${thread.$id}?isthread=true`}>
            <MessageCircle size={22} color={"#fff"} />
          </Link>
          <Repeat size={22} />
          <Send size={22} />
        </div>

        <div className="flex gap-2">
          <p className="text-[rgba(97,97,97,1)]">{numReplies} Replies</p>
          <p> . </p>
          <p className="text-[rgba(97,97,97,1)]">
            {threadInstanse.likes} Likes
          </p>
        </div>
      </div>
    </div>
  );
}

export default Thread;
