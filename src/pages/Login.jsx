import { useEffect, useRef} from 'react'
import { Form, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {

  // console.log('login page is called');
    const loginForm = useRef(null);
    const ctx = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        if(ctx.user){
            navigate('/');
        }
    },[ctx.user,navigate])

    const handleSubmit = (e)=>{
        e.preventDefault();
        const email = loginForm.current.email.value;
        const password = loginForm.current.password.value;
        try{
          ctx.loginUser({email,password});
          navigate('/');
        }catch(err)
        {
          alert('Login failed');
        }
    }

  return (
    <div className='container mx-auto border border-[rgba(49,49,50,1)] max-w-[400px] rounded-sm p-4'>
      <Form onSubmit={handleSubmit} ref={loginForm}>

        <div className='p-2'>
            <label>Email:</label>
            <input type="email" name="email" required className='w-full p-2 rounded-sm'/>
        </div>

        <div className='p-2'>
            <label>Password:</label>
            <input type="password" name="password" required className='w-full p-2 rounded-sm'/>
        </div>

        <div className='p-2'>
            <input type="submit" name="Login" required className='bg-white text-black py-2 px-4 border text-sm border-black rounded cursor-pointer'/>
        </div>
       
       <p>Don't have an account? <Link to='/register'>Register</Link></p>
      </Form>
    </div>
  )
}


export default Login
