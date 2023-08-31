import { useEffect, useRef } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { storage, BUCKET_ID_IMAGES, database, DB_ID, COLLECTION_ID_PROFILES } from "../appWriteConfig";
import { ID } from "appwrite";
import {User} from 'react-feather'

function EditProfileModal(props) {
  const {setShowModal} = props;
  const editProfileForm = useRef();
 const {user} = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    const name = editProfileForm.current.name.value;
    const bio = editProfileForm.current.bio.value;
    const link = editProfileForm.current.link.value;

    const payload = {
      name,
      bio,
      link
    }
    const response = await database.updateDocument(DB_ID,COLLECTION_ID_PROFILES,user.$id,JSON.stringify(payload));
    console.log(response);
    setShowModal(false);
  };
  return (
    <>
    <div className="fixed z-40 bg-[rgba(0,0,0,0.7)] inset-0 overflow-hidden"></div>
    <div className="border border-[rgba(255,255,255,0.25)] rounded-md" style={{padding:'1rem', position:'fixed',zIndex:'40',backgroundColor:'black',top:'50%',left:'50%',transform:'translateX(-50%) translateY(-50%)',width:'30rem'}}>
      <strong className="text-2xl text-white p-2 mb-4">Edit Profile</strong>
      <Form onSubmit={submitHandler} ref={editProfileForm}>

        <div className="relative my-3">
          <input type="text" id="name" name="name" placeholder="Name" className="w-full focus:outline-none bg-black peer/name border border-[rgba(255,255,255,0.25)] h-14 pl-2 placeholder-transparent rounded-md"/>
          <label htmlFor="name" className="absolute z-20 top-0 left-2 text-xs text-[#646cff] 
          peer-placeholder-shown/name:text-[rgba(255,255,255,0.25)]
          peer-placeholder-shown/name:text-lg 
          peer-placeholder-shown/name:top-3 

          peer-focus/name:text-[#646cff]
          peer-focus/name:text-xs
          peer-focus/name:top-0 
          transition-all ease-in-out duration-500 ">Name</label>
        </div>

        <div className="relative my-3">
          <textarea type="text" id="bio" name="bio" placeholder="Bio" style={{height:'100px',paddingTop:'20px'}} className="w-full focus:outline-none bg-black peer/bio border border-[rgba(255,255,255,0.25)]  pl-2 placeholder-transparent rounded-md"/>
          <label htmlFor="bio" className="absolute z-20 top-1 left-2 text-xs text-[#646cff] bg-black w-[98%]
          peer-placeholder-shown/bio:text-[rgba(255,255,255,0.25)]
          peer-placeholder-shown/bio:text-lg 
          peer-placeholder-shown/bio:top-3 

          peer-focus/bio:text-[#646cff]
          peer-focus/bio:text-xs
          peer-focus/bio:top-1 
          transition-all ease-in-out duration-500 ">Bio</label>
        </div>

        <div className="relative my-3">
          <input type="text" id="link" name="link" placeholder="Link" className="w-full focus:outline-none bg-black peer/link border border-[rgba(255,255,255,0.25)] h-14 pl-2 placeholder-transparent rounded-md"/>
          <label htmlFor="link" className="absolute z-20 top-0 left-2 text-xs text-[#646cff] 
          peer-placeholder-shown/link:text-[rgba(255,255,255,0.25)]
          peer-placeholder-shown/link:text-lg
          peer-placeholder-shown/link:top-3 

          peer-focus/link:text-[#646cff]
          peer-focus/link:text-xs
          peer-focus/link:top-0 
          transition-all ease-in-out duration-500 ">Website</label>
        </div>


        {/* <div className="p-2 mb-2 flex justify-around items-center">
          <User className="mr-1"/>
          <p className="text-white-600 whitespace-nowrap mr-2 self-end">Profile Picture:</p>
          <input
            type="file"
            name="profile_pic"
            className="
                    self-end
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
          />
        </div> */}

        <div className="p-2 flex justify-between mt-5">
          <input
            type="button"
            name="cancel"
            value="Cancel"
            onClick={()=>setShowModal(false)}
            className="hover:bg-violet-300 hover:text-white  bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer"
          />

          <input
            type="submit"
            name="submit"
            className="hover:bg-violet-300 hover:text-white bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer"
          />
        </div>

      </Form>
    </div>
    </>
  );
}

export default EditProfileModal;
