import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Header() {
  const { user,logoutUser } = useAuth();
  return (
      <div className=" flex items-center justify-between text-center pb-10 pt-8 px-4">
        <Link to='/'>
        <strong className="text-4xl text-white">@</strong>
        </Link>
        {user ? (
          <div className="flex flex-col">
            <div >
              <Link to={`/profile/${user.profile.username}`} className="inline">
                <img
                  className="mr-2 h-6 w-6 object-cover rounded-full inline"
                  src={user.profile.profile_pic}
                />
              </Link>
              <p className="inline">Hello {user.name}!</p>
            </div>
            <button onClick={logoutUser} className="self-end mt-2 bg-white text-black py-1 px-2 border text-xs border-black rounded cursor-pointer">
              Logout
            </button>
          </div>
        ) : (
          <button className="bg-white text-black py-1 px-2 border text-xs border-black rounded cursor-pointer">
            <Link to="./login">Login</Link>
          </button>
        )}
      </div>
  );
}

export default Header;
