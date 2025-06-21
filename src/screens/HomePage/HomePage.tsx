import { Navbar } from "../../components/Navbar/Navbar";
import { Footer } from "../../components/Footer/Footer";
import { ImageCarousell } from "../../components/ImageCarousell/ImageCarousell";


export const HomePage = () => {

    return (
        <>
            <Navbar />
            <main className="flex flex-col items-center gap-16 p-8 bg-gray-950 min-h-screen">
                <section className="w-full max-w-3xl">
                    <ImageCarousell />
                </section>

                <section className="w-full max-w-3xl p-6 rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-md" id="about">
                    <h2 className="text-2xl mb-4 font-semibold">About Us</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nulla ex enim quo numquam officiis incidunt! Excepturi neque quia a alias dolor id eaque facilis beatae at modi, reprehenderit placeat.</p>
                </section>
                <section className="w-full max-w-3xl p-6 rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-md" id="programming">
                    <h2 className="text-2xl mb-4 font-semibold">The back and front scenes:</h2>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum expedita blanditiis modi nemo asperiores rem, sapiente perferendis id, distinctio fugiat neque, minima amet veritatis nesciunt perspiciatis quidem reiciendis explicabo similique?</p>
                </section>
                <section className="w-full max-w-3xl p-6 rounded-lg bg-gray-800/50 shadow-lg backdrop-blur-md" id="contact">
                    <h2 className="text-2xl mb-4 font-semibold">Contact Us</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Omnis error perferendis nisi? Nesciunt ut recusandae doloribus praesentium debitis iste neque maxime ratione, voluptates officia voluptas nobis autem, sit, id temporibus!</p>
                </section>

            </main>
            <Footer />

        </>
    )
}
