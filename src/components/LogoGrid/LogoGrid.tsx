const logos = [
    "https://user-images.githubusercontent.com/12243763/33518868-6e2595c4-d76a-11e7-8260-31b4e8110c93.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGmKtrnxElpqw3AExKXPWWBulcwjlvDJa1Q&s",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Vitejs-logo.svg/1039px-Vitejs-logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png",
    "https://www.postgresql.org/media/img/about/press/elephant.png",
    "https://www.figma.com/community/resource/9043ad92-248b-4d9c-8fb9-22d27a474316/thumbnail",


]

export const LogoGrid = () => {

    const logoArr: string[] = logos //import later from a different file
    const movingLogos = [...logoArr, ...logoArr, ...logoArr]
    return (
        <div className="logo-grid overflow-hidden py-4">
            <div className="logo-track flex mx-6 w-max animate-logo-scroll">
                {movingLogos.map((src, idx) => (
                    <img key={idx} src={src} alt={`logo ${idx + 1}`} className="logo-item h-16 object-contain" />
                ))}

            </div>

        </div>
    )
}

