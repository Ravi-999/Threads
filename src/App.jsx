// import React from 'react'
import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
// import Feed from "./pages/feed";
// import Login from "./pages/Login";
import AuthContextProvider from "./context/AuthContext";
// import ThreadPage from "./pages/ThreadPage";
// import Profile from "./pages/Profile";
// import MainLayout from "./components/MainLayout";
// import Register from "./pages/Register";
const Feed = lazy(() => import("./pages/feed"));
const ThreadPage = lazy(() => import("./pages/ThreadPage"));
const Profile = lazy(() => import("./pages/Profile"));
const MainLayout = lazy(() => import("./components/MainLayout"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));

const routeDefinitons = createRoutesFromElements(
  <Route
    path="/"
    element={
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    }
  >
    <Route
      index
      element={
        <Suspense fallback={<p>Loading .... </p>}>
          <Feed />
        </Suspense>
      }
    />
    {/* {<Route path='/' element={<Feed/>} />} */}
    <Route
      path="/login"
      element={
        <Suspense>
          <Login />
        </Suspense>
      }
    />
    <Route
      path="/register"
      element={
        <Suspense fallback={<p>Loading .... </p>}>
          <Register />
        </Suspense>
      }
    />
    <Route
      path="/profile/:username"
      element={
        <Suspense fallback={<p>Loading .... </p>}>
          <Profile />
        </Suspense>
      }
    />
    <Route
      path="/thread/:id"
      element={
        <Suspense fallback={<p>Loading .... </p>}>
          <ThreadPage />
        </Suspense>
      }
    />
  </Route>
);
const routers = createBrowserRouter(routeDefinitons);

function App() {
  return (
    <div>
      <RouterProvider router={routers} />
    </div>
  );
}

export default App;
