import { AuthLogin } from "../../components/Auth/AuthLogin/AuthLogin";

export const AuthScreen = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
            <AuthLogin />
        </div>
    );
};
