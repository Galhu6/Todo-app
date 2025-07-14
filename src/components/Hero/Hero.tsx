import { Link } from "react-router-dom";
import { ImageCarousell } from "../ImageCarousell/ImageCarousell.js";

export const Hero = () => {
    return (
        <section className="w-full max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8 py-12 animate-fade-in" id="hero">
            <div className="flex-1 text-center md:text-left space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold">Take control of your tasks</h1>
                <p className="text-lg text-gray-700 dark:text-gray-300">Organize, collaborate and let our AI assist you in getting things done.</p>
                <Link to="/auth" className="inline-block px-6 py-3 bg-brand-500 text-white rounded shadow hover:bg-brand-400 transition-colors">
                    Get Started
                </Link>
                <ul className="mt-6 grid gap-2 text-left text-sm">
                    <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Task organization</li>
                    <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z" /><path fillRule="evenodd" d="M4 12a4 4 0 018 0v1h1a4 4 0 110 8H3a3 3 0 01-3-3v-1a4 4 0 014-4h1v-1z" clipRule="evenodd" /></svg>Collaboration</li>
                    <li className="flex items-start gap-2"><svg className="w-5 h-5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.366-.446.92-.699 1.493-.7h.002c.573.001 1.127.254 1.493.7l.957 1.165 1.436-.39a1.75 1.75 0 011.972 2.415l-.54 1.205.957 1.165a1.75 1.75 0 01-1.287 2.845h-1.204l-.389 1.436a1.75 1.75 0 01-2.415 1.972l-1.205-.54-1.165.957a1.75 1.75 0 01-2.845-1.287v-1.204l-1.436-.389a1.75 1.75 0 01-1.972-2.415l.54-1.205L2.1 8.257A1.75 1.75 0 013.387 5.412l1.205-.54-.39-1.436A1.75 1.75 0 016.615 2.91l1.205.54.437-.35z" clipRule="evenodd" /></svg>AI suggestions</li>
                </ul>
            </div>
            <div className="flex-1 w-full"><ImageCarousell /></div>
        </section>
    );
};