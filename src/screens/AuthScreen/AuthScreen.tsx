import { AuthLogin } from "../../components/Auth/AuthLogin/AuthLogin.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Navbar } from "../../components/Navbar/Navbar.js";

export const AuthScreen = () => {
    return (
        <>
            <Navbar />
            <div className="flex min-h-screen items-center justify-center bg-gray-950 p-4">
                <AuthLogin />
            </div>
            <Footer />
        </>
    );
};
