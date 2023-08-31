import {useState,useEffect,useRef} from 'react'
import { COLLECTION_ID_THREADS, DB_ID, database, storage, BUCKET_ID_IMAGES, COLLECTION_ID_COMMENTS } from '../appWriteConfig'
import { useParams,useSearchParams} from 'react-router-dom';
import { Image } from 'react-feather';
import Thread from "../components/Thread";
import Comments from '../components/Comment';
import { Query, ID } from 'appwrite';
import { useAuth } from '../context/AuthContext';

function ThreadPage() {

    const {id} = useParams();
    const fileRef = useRef();
    const [thread,setThread] = useState(null);
    const [comments,setComments] = useState([]);
    // const [threads,setThreads] = useState([]);
    const [commentBody,setCommentBody] = useState('');
    const [commentImg,setCommentImg] = useState(null);
    const [searchParams,setSearchParams] = useSearchParams();
    
    const isThread = searchParams.get('isthread');

    const {user} = useAuth();

    useEffect(()=>{
        if(isThread === 'true')  getThread(COLLECTION_ID_THREADS);
        else getThread(COLLECTION_ID_COMMENTS);
    },[id])

    const getComments = async ()=>{
        const response = await database.listDocuments(DB_ID,COLLECTION_ID_COMMENTS,[
            Query.equal('parent_id',id),
            Query.orderDesc('$createdAt'),
        ]);
        setComments(response.documents);
    }

    const getThread = async (COLLECTION_ID)=>{
        const response = await database.getDocument(DB_ID,COLLECTION_ID,id);
        getComments();
        console.log('captured thread:- ', response);
        setThread(response);
    }
    if(!thread) return;

    const handleCommentSubmit = async (e)=>{
        e.preventDefault();
        const payload = {
          "parent_id":id, 
          "owner_id":user.$id,
          "body":commentBody,
          "image":commentImg,
        }
        // console.log(payload);
        const response = await database.createDocument(
          DB_ID,
          COLLECTION_ID_COMMENTS,
          ID.unique(),
          payload
        )
        setComments((prevState)=> [response,...prevState])
        setCommentBody('');
        setCommentImg(null);  
      }

      const onClickImageHanlder = ()=>{
        fileRef.current.click();
      }
      const handleFileChange = async (e)=>{
        const fileObj = e.target.files && e.target.files[0];
        const response = await storage.createFile(BUCKET_ID_IMAGES, ID.unique(), fileObj);
        const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES,response.$id);
        setCommentImg(imagePreview.href);
      }


  return (
    <>
     <Thread thread={thread}/>
     <form onSubmit={handleCommentSubmit}>
          <textarea 
          className='rounded-lg p-4 w-full bg-[rgba(29,29,29,1)]'
          required
          name="body" 
          placeholder='yo edhoti matladu..'
          value={commentBody}
          onChange={(e)=>setCommentBody(e.target.value)}
          ></textarea>
         
          <img src={commentImg}/>

          <input type="file" style={{display:'none'}} ref={fileRef} onChange={handleFileChange}/>

          <div className='flex justify-between items-center border-y border-[rgba(49,49,50,1)]'>
          <Image onClick={onClickImageHanlder} className='cursor-pointer' size={24}/>
          <input className='bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer'  type='submit' value='POST' />
        </div>
    </form>

     {comments.map(comment => <Comments setComments={setComments} key={comment.$id} comment={comment}/>)}
    </>
  )
}

export default ThreadPage
