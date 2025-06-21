import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ImageCarousell } from "../../components/ImageCarousell/ImageCarousell";
import "./HomePage.css";

export const HomePage = () => {

    return (
        <>
            <Navbar />
            <main className="homeContent">
                <section className="imgCarousell">
                    <ImageCarousell />
                </section>

                <section className="about" id="about">
                    <h2>About Us</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nulla ex enim quo numquam officiis incidunt! Excepturi neque quia a alias dolor id eaque facilis beatae at modi, reprehenderit placeat.</p>
                </section>
                <section className="programming" id="programming">
                    <h2>The back and front scenes:</h2>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum expedita blanditiis modi nemo asperiores rem, sapiente perferendis id, distinctio fugiat neque, minima amet veritatis nesciunt perspiciatis quidem reiciendis explicabo similique?</p>
                </section>
                <section className="contact" id="contact">
                    <h2>Contact Us</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis error perferendis nisi? Nesciunt ut recusandae doloribus praesentium debitis iste neque maxime ratione, voluptates officia voluptas nobis autem, sit, id temporibus!</p>
                </section>

            </main>
            <Footer />

        </>
    )
}
