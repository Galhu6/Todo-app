import { useState, useEffect } from "react";

const images = [
    "https://images.pexels.com/photos/2034373/pexels-photo-2034373.jpeg",
    "https://images.pexels.com/photos/68562/pexels-photo-68562.jpeg",
    "https://images.pexels.com/photos/606539/pexels-photo-606539.jpeg"



]

export const ImageCarousell = () => {
    const [counter, setCounter] = useState(0);


    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 7500);
        return () => clearInterval(interval);



    }, [])

    const imgArr: string[] = images//imported imgs urls 
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

