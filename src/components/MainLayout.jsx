import { Outlet } from "react-router-dom";
import Header from "./Header";
import SearchUser from "./SearchUser";
import { useAuth } from "../context/AuthContext";

function MainLayout() {

  return (
    <>
      <Header />
        {useAuth().user && <SearchUser />}
        <div className="container mx-auto max-w-[700px]">
          <Outlet />
        </div>
    </>
  );
}

export default MainLayout;
