import { useEffect, useState, useRef } from "react";
import { COLLECTION_ID_PROFILES, DB_ID, database } from "../appWriteConfig";

import ListItem from "./ListItem";

function SearchUser() {
  let usernames = useRef([]);
  const [usersList, setUsersList] = useState([]);
  useEffect(() => {
    getUsersList();
  }, []);
  const getUsersList = async (name) => {
    const response = await database.listDocuments(
      DB_ID,
      COLLECTION_ID_PROFILES
    );
    usernames.current = response.documents;
  };

  const findUserStartsWIth = (value) => {
    if (value.length === 0) {
      setUsersList([]);
      return;
    }
    let result = [];
    for (let user of usernames.current) {
      if (user.username.startsWith(value))
        result.push({
          id: user.$id,
          name: user.name,
          username: user.username,
          profilePic: user.profile_pic,
        });
    }
    setUsersList(result);
  };

  let previousCall = useRef(null);
  let timeInterval = 1000;
  let previousTimeOut = useRef(null);
  const debounceInputChange = (e) => {
    if (previousCall && Date.now() - previousCall.current <= timeInterval) {
      console.log(previousTimeOut.current);
      clearTimeout(previousTimeOut.current);
    }
    previousCall.current = Date.now();
    previousTimeOut.current = setTimeout(() => {
      findUserStartsWIth(e.target.value);
    }, timeInterval);
  };

  return (
    <div className="fixed left-4">
      <input
        onChange={debounceInputChange}
        className="group/search outline-none p-2 border-2 border-zinc-800 rounded-md w-80"
        type="search"
        placeholder="Search"
      ></input>

      {/* <button className='bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer ml-1'>Search</button> */}
      <div>
        {usersList.map((item) => (
          <ListItem
            key={item.id}
            username={item.username}
            profilePic={item.profilePic}
            name={item.name}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchUser;

// function debouce(){
//   return function
// }
