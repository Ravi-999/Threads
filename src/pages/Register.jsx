import { useEffect, useRef } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { storage, BUCKET_ID_IMAGES } from "../appWriteConfig";
import { ID } from "appwrite";
import EditProfileModal from "../components/editProfileModal";

function Register() {
  const registerForm = useRef();
  const ctx = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.user) {
      navigate("/");
    }
  }, [ctx.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = registerForm.current.name.value;
    const email = registerForm.current.email.value;
    const password = registerForm.current.password.value;
    const username = registerForm.current.username.value;
    const bio = registerForm.current.bio.value;
    const link = registerForm.current.link.value;
    const fileObj =
      registerForm.current["profile_pic"].files &&
      registerForm.current["profile_pic"].files[0];
    const response = await storage.createFile(
      BUCKET_ID_IMAGES,
      ID.unique(),
      fileObj
    );
    const imagePreview = storage.getFilePreview(BUCKET_ID_IMAGES, response.$id);

    try {
      ctx.registerUser({
        name,
        email,
        password,
        username,
        bio,
        link,
        profile_pic: imagePreview.href,
      });
      // navigate('/');
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container mx-auto border border-[rgba(49,49,50,1)] max-w-[400px] rounded-sm p-4 ">
      <strong className="text-2xl text-white p-2 mb-4">Register on @</strong>
      <Form onSubmit={handleSubmit} ref={registerForm}>
        <div className="p-2">
          <label>Name:</label>
          <input
            type="name"
            name="name"
            required
            className="w-full p-2 rounded-sm"
          />
        </div>

        <div className="p-2">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 rounded-sm"
          />
        </div>

        <div className="p-2">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-2 rounded-sm"
          />
        </div>

        <div className="p-2">
          <label>username:</label>
          <input
            type="username"
            name="username"
            required
            className="w-full p-2 rounded-sm"
          />
        </div>

        <div className="p-2">
          <label>Bio:</label>
          <textarea
            className="rounded-lg h-24 p-1 w-full"
            name="bio"
            placeholder="enter your bio"
          ></textarea>
        </div>

        <div className="p-2">
          <label>link:</label>
          <input type="link" name="link" className="w-full p-2 rounded-sm" />
        </div>

        <div className="p-2 mb-2">
          <label>Profile Picture:</label>
          <input
            type="file"
            name="profile_pic"
            className="
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
          />
        </div>

        <div className="p-2">
          <input
            type="submit"
            name="Register"
            required
            className="bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer"
          />
        </div>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Form>
   
    </div>
      
  );
}

export default Register;
