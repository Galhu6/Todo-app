import { useEffect, useState } from "react";
import { AuthLoginForm } from "../AuthLoginForm/AuthLoginForm";
import { GoogleLoginButton } from "../GoogleLogin/GoogleLogin";
import { AuthSignup } from "../AuthSignup/AuthSignup";



export const AuthLogin = () => {
    const [toggleSignUp, setToggleSignUp] = useState(false);


    useEffect(() => {


    }, [toggleSignUp]);

    const handleToggle = () => {
        setToggleSignUp(true)
    };


    return (
        <>
            {toggleSignUp ? (<AuthSignup />

            ) : (
                <div className="Auth">
                    <AuthLoginForm />

                    <div className="break-and-to-sign">
                        <hr />
                        <p>Don't have an account? <a onClick={(e) => { e.preventDefault(); handleToggle(); }} style={{ cursor: "pointer" }}>Sign up!</a></p>

                    </div>
                </div>
            )}
            <hr />

            <div className="google-sign-in">
                <GoogleLoginButton />

            </div>

        </>


    );
};