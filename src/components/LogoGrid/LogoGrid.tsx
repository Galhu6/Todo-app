import { useState, useEffect } from "react";


export const LogoGrid = () => {
    const [counter, setCounter] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 10000);
        return () => clearInterval(interval);
    }, [])

    const logoArr: string[] = [] //import later from a different file
    const visibleLogoIndex = counter % logoArr.length;
    return (

        <div className="logo-grid" id="logoGrid">
            {logoArr.length > 0 && (
                <img src={
                    logoArr[visibleLogoIndex]}
                    alt={`Logo ${visibleLogoIndex + 1}`}
                    className="logo-img" />
            )}

        </div>
    )
}

