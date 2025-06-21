import { useState, useEffect } from "react";

// import image arr

export const ImageCarousell = () => {
    const [counter, setCounter] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 7500);
        return () => clearInterval(interval);



    }, [])

    const imgArr: string[] = []//imported imgs urls 
    const visibleImgIndex = imgArr.length > 0 ? counter % imgArr.length : 0;

    return (
        <div className="carousel" id="Image-carousell">
            {imgArr.length > 0 && (
                <img
                    src={imgArr[visibleImgIndex]}
                    alt={`Image ${visibleImgIndex + 1}`}
                    className="carousel-img" />
            )}

        </div>)
}

