import {useEffect,useState,useRef} from 'react'
import Thread from '../components/Thread';
import {Image} from 'react-feather'
import { database,storage,DB_ID,COLLECTION_ID_THREADS,BUCKET_ID_IMAGES} from '../appWriteConfig';
import {Query,ID} from 'appwrite'
import {useAuth} from '../context/AuthContext'

function Feed() {

  const [threads,setThreads] = useState([]);
  const [threadBody,setThreadBody] = useState('');
  const [threadImg,setThreadImg] = useState(null);

  const {user} = useAuth();


  const fileRef = useRef();



  useEffect(()=>{

     getThreads();
  },[user])

  const getThreads = async ()=>{

    let feedPosts = [];

    let following = [... user.profile.following];
    following.push(user.$id);
    // console.log('following list:-', following);
    for(let i=0;i<following.length;i++)
    {
      const response = await database.listDocuments(
        DB_ID,
        COLLECTION_ID_THREADS,

        [
          Query.orderDesc('$createdAt'),
          Query.equal('owner_id',following[i]),
          Query.limit(1)
        ]);

        feedPosts = [...feedPosts,...response.documents];
    }
    setThreads(feedPosts);

  }
  const handleThreadSubmit = async (e)=>{
    e.preventDefault();
    const payload = {
      "owner_id":user.$id,
      "body":threadBody,
      "image":threadImg,
    }
    // console.log(payload);
    const response = await database.createDocument(
      DB_ID,
      COLLECTION_ID_THREADS,
      ID.unique(),
      payload
    )
    // console.log(response);
    setThreads((prevState)=> [response,...prevState])
    setThreadBody('');
    setThreadImg(null);
    
  }

  const onClickImageHanlder = ()=>{
    fileRef.current.click();
  }
  const handleFileChange = async (e)=>{
    const fileObj = e.target.files && e.target.files[0];
    const response = await storage.createFile(BUCKET_ID_IMAGES, ID.unique(), fileObj);
    const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES,response.$id);
    setThreadImg(imagePreview.href);
  }

  return (
    <>
      <div className='p-4'>
        <form onSubmit={handleThreadSubmit}>
          <textarea 
          className='rounded-lg p-4 w-full bg-[rgba(29,29,29,1)]'
          required
          name="body" 
          placeholder='yo edhoti matladu..'
          value={threadBody}
          onChange={(e)=>setThreadBody(e.target.value)}
          ></textarea>
         
          <img src={threadImg}/>

          <input type="file" style={{display:'none'}} ref={fileRef} onChange={handleFileChange}/>

          <div className='flex justify-between items-center border-y border-[rgba(49,49,50,1)]'>
          <Image onClick={onClickImageHanlder} className='cursor-pointer' size={24}/>
          <input className='bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer'  type='submit' value='POST' />
        </div>
        </form>


      </div>
      {threads.map(thread => {
        // console.log(thread);
        return  <Thread key={thread.$id} thread={thread} setThreads={setThreads}/>
      } )}
    </>
  )
}

export default Feed;
