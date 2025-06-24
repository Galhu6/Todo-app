import { useState } from "react";
import { AuthLoginForm } from "../AuthLoginForm/AuthLoginForm";
import { GoogleLoginButton } from "../GoogleLogin/GoogleLogin";
import { AuthSignup } from "../AuthSignup/AuthSignup";



export const AuthLogin = () => {
    const [toggleSignUp, setToggleSignUp] = useState(false);

    const handleToggle = () => {
        setToggleSignUp(true)
    };


    return (
        <>
            {toggleSignUp ? (
                <AuthSignup />
            ) : (
                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <AuthLoginForm />
                    <div className="flex flex-col items-center gap-2 text-sm">
                        <hr className="w-full border-t border-indigo-600" />
                        <p>
                            Don't have an account?{' '}
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleToggle();
                                }}
                                className="cursor-pointer text-indigo-400 hover:underline"
                            >
                                Sign up!
                            </a>
                        </p>
                    </div>
                </div>
            )}
            <hr className="my-4" />

            <div className="text-center">
                <GoogleLoginButton />
            </div>
        </>


    );
};