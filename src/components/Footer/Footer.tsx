import { useState, useEffect } from "react";
import "./Footer.css"
import { LogoGrid } from "../LogoGrid/LogoGrid";
export const Footer = () => {
    const [isScrollOverLimit, setIScrollOverLimit] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 800) {
                setIScrollOverLimit(true);
            } else {
                setIScrollOverLimit(false)
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <div className={`footer ${isScrollOverLimit ? "visible" : "hidden"}`}>
                <div className="footer-left">
                    <ul>
                        <li> <a href="/faq">FAQ</a></li>
                        <li><a href="#Mycontact">Get In Touch with me! (the programmer)</a></li>
                        <li><a href="git-link">GitRepo</a></li>
                    </ul>
                </div>
                <div className="footer-center">
                    <div className="footer-center-upperText">
                        <h2>Lorem, ipsum dolor.</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Error, similique aut? Voluptate magnam obcaecati inventore.</p>
                    </div>
                    <div className="footer-center-logoGrid">
                        <LogoGrid />
                    </div>
                    <div className="footer-center-bottomText">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, suscipit?</p>
                    </div>
                </div>
                <div className="footer-right">
                    <h3>To see more projects <br /> go to my portofolio!</h3>
                    <a href="linktoportofolio"><img src="??" alt="a logo or avatar" /></a>
                </div>
            </div>
        </>
    )
}
