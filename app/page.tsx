import Footer from "./components/Footer/Footer";

export default function Home() {
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex flex-col justify-center items-center flex-1 min-h-36">
                <h1 className="text-5xl font-bold">Chatnado</h1>
                <p className="text-xl">Intern Projects for Knowz</p>
            </div>
            <Footer />
        </div>
    );
}
