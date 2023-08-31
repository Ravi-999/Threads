/* eslint-disable react/prop-types */
import {Heart,MessageCircle,Repeat,Send,Trash2} from 'react-feather';
import { useEffect, useState } from 'react';
import { COLLECTION_ID_COMMENTS, COLLECTION_ID_PROFILES, DB_ID, database, functions } from '../appWriteConfig';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
// import TimeAgo from 'javascript-time-ago';
// import en from 'javascript-time-ago/locale/en.json';
// TimeAgo.addDefaultLocale(en);
import ReactTimeAgo from 'react-time-ago'

import { useAuth } from '../context/AuthContext';

function Comment({comment,setComments}) {

   const [owner,setOwner] = useState(null);
   const [loading,setLoading] = useState(true);
   const [commentInstance,setCommentInstance] = useState(comment);
   const [numReplies,setNumReplies] = useState(0);

   const {user} = useAuth();


   useEffect(()=>{
    getUserInfo();
    // console.log(thread);
   },[])

   const getComments = async ()=>{
    const response = await database.listDocuments(DB_ID,COLLECTION_ID_COMMENTS,[
        Query.equal('parent_id',comment.$id),
        Query.orderDesc('$createdAt'),
    ]);
    setNumReplies(response.total);
    setLoading(false);
}
   const getUserInfo = async ()=>{
      const payload = {"owner_id":comment.owner_id};
      const response = await functions.createExecution('64bf9cb98df18589e479',JSON.stringify(payload));

      const profile = await database.getDocument(DB_ID,COLLECTION_ID_PROFILES,comment.owner_id);
      const userData = JSON.parse(response.response);

      userData['profile_pic'] = profile.profile_pic;
      userData['username'] = profile.username; 
      // console.log(userData);
      setOwner(userData);
      getComments();
   }

   const handleDelete = async ()=>{
    database.deleteDocument(DB_ID,COLLECTION_ID_COMMENTS,comment.$id);
    setComments((prevState) => prevState.filter(curthread => curthread.$id !== comment.$id));
   }

   const toggleLikeHandler = async ()=>{
    
    const users_who_liked = comment.users_who_liked;
  
    if(users_who_liked.includes(user.$id)) 
    {
      const index = users_who_liked.indexOf(user.$id);
      users_who_liked.splice(index,1);
    }
    else{
      users_who_liked.push(user.$id);
    } 
    const payload = {
          'users_who_liked':users_who_liked,
          "likes":users_who_liked.length
    }
    const response = await database.updateDocument(DB_ID,COLLECTION_ID_COMMENTS,comment.$id,JSON.stringify(payload));
    setCommentInstance(response);
    
   }

   if(loading) return;


  return (
    <div className="flex p-4">
    <Link to={`/profile/${owner.username}`}>
    <img className="w-12 h-12 rounded-full object-cover"
         src={owner.profile_pic}/>
    </Link>

    <div className="w-full px-2 pb-3 border-b border-[rgba(97,97,97,1)]">
        {/* Thread Header */}
      <div className="flex justify-between">
      <Link to={`/profile/${owner.username}`}>
      <strong className='text-white'>{owner.name}</strong>
    </Link>
       

         <div className="flex gap-2 items-cente cursor-pointer">
          <p className='text-[rgba(97,97,97,1)]'> <ReactTimeAgo date={new Date(comment.$createdAt).getTime()} locale="en-US"/></p>
          <Trash2 onClick={handleDelete} size={20}/>
        </div>
      </div>

     {/* Thread Body */}
     <Link to={`/thread/${comment.$id}?isthread=false`}>
      <div className='pb-5 text-white' style={{whiteSpace:"prev-wrap"}}>
        {comment.body}
        {comment.image && <img className='border border-[rgba(49,49,50,1)] rounded-md mt-2' src={comment.image} />}
      </div>
     </Link>

     <div className='flex space-x-4 py-3'>
        <Heart onClick={toggleLikeHandler} size={22} className='cursor-pointer' color={commentInstance.users_who_liked.includes(user.$id) ? '#ff0000': '#fff'}/>
        <Link to={`/thread/${comment.$id}?isthread=false`}><MessageCircle size={22} color={"#fff"}/></Link>
        <Repeat size={22}/>
        <Send size={22}/>
     </div>

     <div className="flex gap-2">
      <p className='text-[rgba(97,97,97,1)]'>{numReplies} Replies</p>
      <p> . </p>
      <p className='text-[rgba(97,97,97,1)]'>{commentInstance.likes} Likes</p>
     </div>
     
    </div>
  </div>
  )
}

export default Comment;
