import { GoogleLogin as GoogleLoginComponent } from "@react-oauth/google"
import dotenv from "dotenv";
dotenv.config();

const server = process.env.SERVER_URL
export const GoogleLoginButton = () => {
    const handleLogin = async (credentialResponse: any) => {
        const token = credentialResponse.credential;
        const res = await fetch(`${server}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();
        console.log("User logged in:", data);

    };

    return (
        <div>
            <h2>Login with Google</h2>
            <GoogleLoginComponent
                onSuccess={handleLogin}
                onError={() => console.log("Login failed")}
            />
        </div>
    );
};