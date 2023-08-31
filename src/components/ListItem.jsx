import React from 'react'
import { Link } from 'react-router-dom';

function ListItem(props) {
    const {username, profilePic, name} = props;
    console.log(name)
  return (
    <Link to={`profile/${username}`}>
        <div className='py-2 cursor-pointer flex hover:bg-[#282828] rounded-md'>
            <img className="w-12 h-12 border rounded-full inline mr-2" src={profilePic}/>
            <div className='flex flex-col'>
                <span className="font-bold text-lg text-white ml-2">{username}</span>
                <span className="text-sm ml-2 text-gray-600">{name}</span>
            </div>
        </div>
    </Link>
  )
}

export default ListItem
