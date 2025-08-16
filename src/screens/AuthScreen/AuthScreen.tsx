import { useNavigate } from "react-router-dom";
import { AuthLogin } from "../../components/Auth/AuthLogin/AuthLogin";
import { Footer } from "../../components/Footer/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import { useAppContext } from "../../context/AppContext";

export const AuthScreen = () => {
  const navigate = useNavigate();

  const { user } = useAppContext();
  return (
    <>
      {!user ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
            <AuthLogin />
          </div>
          <Footer />
        </div>
      ) : (
        navigate("/dashboard")
      )}
    </>
  );
};
