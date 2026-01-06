import { ArrowRight, CheckIcon, Video } from "lucide-react";
import { motion } from "framer-motion";
import TiltedImage from "../components/tilt-image";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate()
        const specialFeatures = [
            "No design skills needed",
            "Fast generation",
            "High CTR templates",
        ];
    return (
        <section className="flex flex-col items-center -mt-18">
            <motion.svg className="absolute -z-10 w-full -mt-40 md:mt-0" width="1440" height="676" viewBox="0 0 1440 676" fill="none" xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5}}
            >
                <rect x="-92" y="-948" width="1624" height="1624" rx="812" fill="url(#a)" />
                <defs>
                    <radialGradient id="a" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="rotate(90 428 292)scale(812)">
                        <stop offset=".63" stopColor="#372AAC" stopOpacity="0" />
                        <stop offset="1" stopColor="#372AAC" />
                    </radialGradient>
                </defs>
            </motion.svg>
            <motion.a className="flex items-center mt-48 gap-2 border border-slate-600 text-gray-50 rounded-full px-4 py-2"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <div className="size-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span>Generate Your First Thumbnail Now</span>
            </motion.a>
            <motion.h1 className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-4xl"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 2 }}
            >
                AI Thumbnail
                <span className="block">Generator for Your video</span>
            </motion.h1>
            <motion.p className="text-center text-base max-w-lg mt-2"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                Create eye-catching thumbnails in seconds — AI-powered designs, customizable templates,one-click export.
            </motion.p>
            <motion.div className="flex items-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
             >
                <button onClick={()=>navigate('/generate')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white active:scale-95 rounded-lg px-7 h-11">
                    generate Now
                    <ArrowRight className="size-5" />
                </button>
                <button className="flex items-center gap-2 border border-slate-400 active:scale-95 hover:bg-white/10 transition rounded-lg px-4 py-2 h-11">
                    <Video className="w-5 h-5" />
                    <span>See how it works</span>
                </button>
            </motion.div>
            <div className="flex flex-wrap items-center gap-6 mt-8">
                    {specialFeatures.map((feature, index) =>(
                    <motion.p className="flex items-center gap-2" key={index}
                    initial={{y:30, opacity:0}}
                    whileInView={{y:0, opacity:1}}
                    viewport={{once:true}}
                    transition={{delay:index*0.2, duration:0.3}}
                    >
                    <CheckIcon className="w-5 h-5 text-green-400"/>
                    <span className="text-slate-400">{feature}</span>
                    </motion.p>
                ))}
            </div>
            <TiltedImage />
        </section>
    );
}