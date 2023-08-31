import {useState,useEffect,createContext,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { account, database,COLLECTION_ID_PROFILES, DB_ID } from '../appWriteConfig';
import { ID } from 'appwrite';

const AuthContext = createContext();

const AuthContextProvider = ({children})=>{

    const [isLoading,setLoading] = useState(true);
    const [user,setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
         getUserOnLoad();
    },[])

    // console.log(user);

    const getUserOnLoad = async ()=>{
        try{
            const accountDetails = await account.get();
            // console.log(accountDetails);
            let profile = await database.getDocument(DB_ID,COLLECTION_ID_PROFILES,accountDetails.$id);
            accountDetails['profile'] = profile;
            setUser(accountDetails);
            setLoading(false);
        }catch(error){
            setLoading(false);
            navigate('/login');
            console.log(error);
            throw error;
        }
    }

    const loginUser = async (userInfo)=>{
        try{
            await account.createEmailSession(userInfo.email,userInfo.password);
            const accountDetails = await account.get();
            console.log(accountDetails);
            let profile = await database.getDocument(DB_ID,COLLECTION_ID_PROFILES,accountDetails.$id);
            accountDetails['profile'] = profile;
            setUser(accountDetails);
        }catch(error){
            console.log(error);
        }
    }

    const registerUser = async (userInfo)=>{
        try{
            console.log(userInfo);
            const response = await account.create(ID.unique(), userInfo.email, userInfo.password,userInfo.name);
            const payload = {
                username:userInfo.username,
                bio:userInfo.bio?userInfo.bio:null,
                link:userInfo.link?userInfo.link:null,
                profile_pic:userInfo.profile_pic?userInfo.profile_pic:null,
                user_id:response.$id
            }
            await database.createDocument(DB_ID,COLLECTION_ID_PROFILES,response.$id,payload)
            navigate('/login');
        }catch(error)
        {
            console.log(error);
        }
    }

    const logoutUser = async ()=>{
        try{
            account.deleteSession('current');
            setUser(null);
            navigate('/login');
        }catch(error)
        {
            console.log(error);
        }
    }

    const contextData = {
        loginUser,
        logoutUser,
        registerUser,
        user
    }

    return(
        <AuthContext.Provider value={contextData}>
            {isLoading ? <p>Loading ...</p> : children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
export default AuthContextProvider;