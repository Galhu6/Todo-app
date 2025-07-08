import { LogoGrid } from "../LogoGrid/LogoGrid.js";

export const Footer = () => {
    return (
        <footer className="bg-gray-900/80 backdrop-blur-lg text-gray-300 mt-auto w-full">
            <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
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
                <div className="flex flex-col items-center text-center gap-4 md:flex-1">
                    <div>
                        <h2 className="text-xl font-semibold"> Lorem ipsum dolor sit.</h2>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            voluptatum quos provident.
                        </p>
                    </div>
                    <LogoGrid />
                    <div>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, suscipit?</p>
                    </div>
                </div>
                <div className="text-center md:text-right space-y-2">
                    <h3 >
                        To see more projects <br /> go to my portofolio!
                    </h3>
                    <a href="linktoportofolio">
                        <img src="??" alt="a logo or avatar" className="mx-auto md:ml-auto" />
                    </a>
                </div>
            </div>
        </footer>
    )
}

