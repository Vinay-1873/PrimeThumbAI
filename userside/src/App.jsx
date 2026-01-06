import GetInTouch from "./sections/get-in-touch";
import OurTestimonials from "./sections/our-testimonials";
import Pricing from "./sections/pricing";
import CTASection from "./sections/CTASection";
import Footer from "./components/footer";
import LenisScroll from "./components/lenis-scroll";
import Navbar from "./components/navbar";
import AboutOurApps from "./sections/about-our-apps";
import HeroSection from "./sections/hero-section";
import OurLatestCreation from "./sections/our-latest-creation";

export default function Page() {
    return (
        <>
            <LenisScroll />
            <Navbar />
            <main className="px-6 md:px-16 lg:px-24 xl:px-32">
                <HeroSection />
                <OurLatestCreation />
                <AboutOurApps />
                <OurTestimonials />
                <Pricing />
                <GetInTouch />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}