import { useEffect, useState } from "react";
import { AuthLoginForm } from "../AuthLoginForm/AuthLoginForm";
import { GoogleLoginButton } from "../GoogleLogin/GoogleLogin";



export const AuthLogin = () => {
    const [toggleSignUp, setToggleSignUp] = useState(false);


    useEffect(() => {


    }, [toggleSignUp]);

    const handleToggle = () => {
        setToggleSignUp(true)
    };


    return (
        <>
            <AuthLoginForm />
            <div className="Auth">
                {!toggleSignUp && <>
                    <AuthLogin />
                    <div className="break-and-to-sign">
                        <hr />
                        <p>Don't have an account? <a ref={handleToggle}>sign up!</a></p>

                    </div></>}

                {toggleSignUp && <>
                    <div className="regular-sign-up">

                    </div>
                    <div className="break-and-to-signup">

                    </div></>}

                <div className="google-sign-in">
                    <GoogleLoginButton />

                </div>
            </div>

        </>
    )
}
