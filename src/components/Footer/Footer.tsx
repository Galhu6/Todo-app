import { useState, useEffect } from "react";

import { LogoGrid } from "../LogoGrid/LogoGrid.js";

export const Footer = () => {
    const [isScrollOverLimit, setIScrollOverLimit] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;
            setIScrollOverLimit(nearBottom);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 w-full flex flex-col justify-between gap-8 p-8 backdrop-blur-lg bg-gray-900/80 text-gray-300 transition-all duration-700 md:flex-row ${isScrollOverLimit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
            <div>
                <ul className="space-y-2 text-sm">
                    <li>
                        <a href="/faq" className="hover:text-indigo-400">
                            FAQ
                        </a>
                    </li>
                    <li>
                        <a href="#Mycontact" className="hover:text-indigo-400">
                            Get In Touch with me! (the programmer)
                        </a>
                    </li>
                    <li>
                        <a href="git-link" className="hover:text-indigo-400">
                            GitRepo
                        </a>
                    </li>
                </ul>
            </div>
            <div className="text-center space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Lorem, ipsum dolor.</h2>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Error,
                        similique aut? Voluptate magnam obcaecati inventore.
                    </p>
                </div>
                <LogoGrid />
                <div>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, suscipit?</p>
                </div>
            </div>
            <div className="text-center">
                <h3 className="mb-2">
                    To see more projects <br /> go to my portofolio!
                </h3>
                <a href="linktoportofolio">
                    <img src="??" alt="a logo or avatar" />
                </a>
            </div>
        </div>
    );
}

