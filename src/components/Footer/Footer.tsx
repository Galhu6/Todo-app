import { useState, useEffect } from "react";

import { LogoGrid } from "../LogoGrid/LogoGrid";
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
        <>
            <div className={`footer ${isScrollOverLimit ? 'visible' : 'hidden'}`}>
                <div>
                    <ul className="space-y-2">
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="#Mycontact">Get In Touch with me! (the programmer)</a></li>
                        <li><a href="git-link">GitRepo</a></li>
                    </ul>
                </div>
                <div className="center space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">Lorem, ipsum dolor.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, similique aut? Voluptate magnam obcaecati inventore.</p>
                    </div>
                    <div>
                        <LogoGrid />
                    </div>
                    <div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, suscipit?</p>
                    </div>
                </div>
                <div className="center">
                    <h3 className="mb-2">To see more projects <br /> go to my portofolio!</h3>
                    <a href="linktoportofolio"><img src="??" alt="a logo or avatar" /></a>
                </div>
            </div>
        </>
    )
}

