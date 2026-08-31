import { useState, useCallback } from "react";
import Header from "./components/header";
import CraneScene from "./components/CraneScene";
import Footer from "./components/footer";
import Loader from "./components/Loader";

export default function Home() {
    const [progress, setProgress] = useState(15);
    const [loaded, setLoaded] = useState(false);

    const handleProgress = useCallback((p: number) => {
        setProgress((prev) => Math.max(prev, p));
    }, []);

    const handleLoaded = useCallback(() => {
        setProgress(100);
        setLoaded(true);
    }, []);

    return (
        <div className="min-h-dvh flex flex-col justify-between overflow-hidden relative">
            <Loader progress={progress} loaded={loaded} />
            <Header />
            <CraneScene onProgress={handleProgress} onLoaded={handleLoaded} />
            <Footer />
        </div>
    );
}