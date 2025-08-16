import { GoogleLogin as GoogleLoginComponent } from "@react-oauth/google";

const server = import.meta.env.VITE_SERVER_URL;
export const GoogleLoginButton = () => {
  const handleLogin = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
    const res = await fetch(`${server}/api/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
