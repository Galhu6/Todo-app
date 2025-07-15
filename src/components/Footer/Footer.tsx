import { Link } from "react-router-dom";
import { LogoGrid } from "../LogoGrid/LogoGrid.js";

export const Footer = () => {
    return (
        <footer className="bg-gray-900/80 backdrop-blur-lg text-gray-300 mt-auto w-full">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-start">
                <div>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="/faq" className="hover:text-indigo-400">FAQ</a>
                        </li>
                        <li>
                            <a href="#Mycontat" className="hover:text-indigo-400">Get In Touch with me! (theDeveloper)</a>
                        </li>
                        <li>
                            <a href="https://github.com/Galhu6/Todo-app"

                                className="hover:text-indigo-400"
                            >
                                GitRepo
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="order-2 sm:order-none flex flex-col items-center text-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold"> Lorem ipsum dolor sit.</h2>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            voluptatum quos provident.
                        </p>
                    </div>
                    <div className="hidden sm:hidden md:block w-full">
                        <LogoGrid />
                    </div>
                    <div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, suscipit?</p>
                    </div>
                </div>
                <div className="order-last sm:order-none text-right sm:text-center md:text-center space-y-2 justify-self-end">
                    <h3 >
                        To see more projects <br /> go to my resume!
                    </h3>
                    <Link to="linktoportoresumePDF">
                        <img src="../../../public/avatarfooter.png" alt="a logo or avatar" className="mx-auto md:ml-auto w-16 h-16" />
                    </Link>
                </div>
                <div className="md:hidden order-last sm:block col-span-full">
                    <LogoGrid />
                </div>
            </div>
        </footer>
    )
}

