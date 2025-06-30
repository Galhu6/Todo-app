import { AuthLogin } from "../../components/Auth/AuthLogin/AuthLogin.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Navbar } from "../../components/Navbar/Navbar.js";

export const AuthScreen = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-gray-950 p-4">
                <AuthLogin />
            </div>
            <Footer />
        </div>
    );
};
