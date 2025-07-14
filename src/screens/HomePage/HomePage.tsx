import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "../../components/Navbar/Navbar.js";
import { Footer } from "../../components/Footer/Footer.js";
import { Hero } from "../../components/Hero/Hero.js";

export const HomePage = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            element?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow flex flex-col items-center gap-20 p-8 bg-gray-100 dark:bg-gray-950">
                <Hero />
                <section className="w-full max-3xl bg-gray-800/50 rounded shadow-lg p-6 space-y-4 animate-fade-in id=about">

                    {/* <section className="w-full max-w-3xl">
                    <ImageCarousell />
                </section> */}

                    {/* <section className="w-full max-w-3xl bg-gray-800/50 rounded shadow-lg p-6" id="about"> */}
                    <h2 className="mb-2 text-xl font-semibold">About Us</h2>
                    <p>Our mission is to help you stay organized and productive. Todo.io was built to make task management simple while offering powerful features when you need them.</p>
                    <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" alt="Team" className="rounded" />
                </section>
                <section className="w-full max-w-3xl bg-gray-800/50 rounded shadow-lg p-6 space-y-2 animate-fade-in" id="programming">
                    <h2 className="mb-2 text-xl font-semibold">The back and front scenes:</h2>
                    <p>React and Tailwind power the interface while an Express API with PostgreSQL stores your data securely</p>
                </section>
                <section className="w-full max-w-3xl bg-gray-800/50 rounded shadow-lg p-6 space-y-2 animate-fade-in" id="Updates">
                    <h2 className="mb-2 text-xl font-semibold">What's New</h2>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                        <li>Ai - powered suggestions now available</li>
                        <li>Tip: press "D" anytime to toggle dark mode</li>

                    </ul>
                </section>
                <section className="w-full max-w-3xl bg-gray-800/50 rounded shadow-lg p-6 space-y-2 animate-fade-in" id="contact">
                    <h2 className="mb-2 text-xl font-semibold">Contact Us</h2>
                    <p>Have questions or feedback? Reach out via <a href="mailto:support@todo.io">support@todo.io</a></p>
                </section>

            </main>
            <Footer />

        </div>
    )
}
