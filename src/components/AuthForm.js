import React, {useState} from 'react';
import {authService} from 'fbase';

const AuthForm = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [newAccount, setNewAccount] = useState(true);

    const onChange = (event) => {
        const {target: { name, value }} = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
      };
    const onSubmit = async(event) =>{
        event.preventDefault();
        try {
            let data;
            if(newAccount){
                //create Account
                data = await authService.createUserWithEmailAndPassword(email, password);
            }else{
                //login
                data = await authService.signInWithEmailAndPassword(email, password);
            }
        } catch(error){
            setError(error.message);
            console.error(error.message)
        }
    }
    const toggleAccount = () => setNewAccount((prev) => !prev);
    return(
        <>
            <form onSubmit={onSubmit} className="container">
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={onChange} 
                    required 
                    className="authInput"
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={onChange} 
                    required 
                    className="authInput"
                />
                <input
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "Create Account" : "Sign In"}
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Login" : "Create Account"}
            </span>
        </>
    )
}
export default AuthForm;