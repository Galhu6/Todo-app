import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordValidation } from "./PasswordValidation.js";
import { useAppContext } from "../../../context/AppContext.js";

const server = import.meta.env.VITE_SERVER_URL
export const AuthSignup = () => {

    const navigate = useNavigate();
    const { setUser, refreshLists } = useAppContext();

    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [emailCheckLoading, setEmailCheckLoading] = useState(false);
    const [signupPassword, setSignupPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);


    useEffect(() => {
        if (!handleEmail()) {
            setIsEmailAvailable(true);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                setEmailCheckLoading(true);
                const res = await fetch(`${server}/api/auth/check-email?email=${signupEmail}`);
                const data = await res.json();
                setIsEmailAvailable(!data.exists);
            } catch (err) {
                console.error("Email check failed", err);
                setIsEmailAvailable(true);
            } finally {
                setEmailCheckLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [signupEmail]);

    const handleName = (): boolean =>
        signupName.trim().length >= 2;


    const handleEmail = (): boolean =>
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(signupEmail);



    const handleSubmit = async () => {
        if (!handleEmail() || !handleName() || !isPasswordValid || !doPasswordsMatch) {
            console.warn("Form is invalid");
            return;
        }

        try {
            const response = await fetch(`${server}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: signupName,
                    email: signupEmail,
                    password: signupPassword
                })
            });

            if (!response.ok) {
                console.log("Failed to signup", await response.text());

            } else {
                const data = await response.json();
                localStorage.setItem("token", data.token)
                localStorage.setItem("refreshToken", data.refreshToken);
                console.log("Signup success:", data);
                console.log("navigating to dashboard");
                if (data.user?.id) {
                    localStorage.setItem("userId", String(data.user.id))
                }
                if (data.user?.id && data.user?.name) {
                    setUser({ id: data.user.id, name: data.user.name });
                }
                navigate('/dashboard')

            }
        } catch (err) {
            console.error("network Error", err);

        }

    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-3">
                <input
                    type="text"
                    placeholder="name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <p className="text-sm" style={{ color: handleName() ? 'green' : 'red' }}>
                    Name must be more than 2 letters
                </p>

                <input
                    type="email"
                    placeholder="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
                />
                <p className="text-sm" style={{ color: handleEmail() ? 'green' : 'red' }}>
                    Email must be in right format
                </p>
                <p className="text-sm" style={{ color: isEmailAvailable ? 'green' : 'red' }}>
                    {emailCheckLoading
                        ? 'Checking email...'
                        : isEmailAvailable
                            ? 'Email is available'
                            : 'Email already in use'}
                </p>

                <PasswordValidation
                    onChange={(password, _confirm, isValid, match) => {
                        setSignupPassword(password);
                        setIsPasswordValid(isValid);
                        setDoPasswordsMatch(match);
                    }}
                />
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isPasswordValid || !handleName() || !handleEmail() || !doPasswordsMatch || !isEmailAvailable}
                    className="w-full rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 disabled:opacity-50 focus:outline-none focus:ring focus:ring-indigo-500"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
