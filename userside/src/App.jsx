import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Footer from "./components/footer";
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import Login from "./components/Login";

export default function App() {
    return (
        <>
        <LenisScroll/>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/generate/:id" element={<Generate />} />
            <Route path="/my-generation" element={<MyGeneration />} />
            <Route path="/preview" element={<YtPreview/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
        <Footer/>
        </>
    );
}