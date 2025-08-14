import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const server = import.meta.env.VITE_SERVER_URL;
export const AuthLoginForm = () => {
  const navigate = useNavigate();
  const { setUser, refreshLists } = useAppContext();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${server}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        console.log("Failed to login", await response.text());
      } else {
        const data = await response.json();
        console.log("Login success:", data);
        if (data.user?.id) {
          localStorage.setItem("userId", String(data.user.id));
        }
        if (data.user?.id && data.user?.name) {
          setUser({ id: data.user.id, name: data.user.name });
        }
        await refreshLists();
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("network Error", err);
    }
  };
  return (
    <form onSubmit={(e) => handleLogin(e)} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value.toLowerCase())}
        className="rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
      />
      <input
        type="password"
        placeholder="password"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        className="rounded bg-gray-200 dark:bg-gray-700 p-2 dark:text-white focus:outline-none focus:ring focus:ring-indigo-500"
      />
      <button
        type="submit"
        className="rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500"
      >
        Sign In
      </button>
    </form>
  );
};
