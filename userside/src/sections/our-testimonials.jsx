import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function OurTestimonials() {
    const testimonials = [
        { quote: "Generated a thumbnail in seconds — my video CTR jumped noticeably!", name: "Oliver Reed", role: "YouTuber", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", },
        { quote: "Templates are perfectly tuned for high CTR. No design skills needed.", name: "Liam Johnson", role: "Creator", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", },
        { quote: "One-click export to YouTube saved me so much time — professional results every time.", name: "Ethan Roberts", role: "Channel Owner", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60", },
        { quote: "Eye-catching designs that boosted impressions and engagement on my channel.", name: "Isabella Kim", role: "Content Strategist", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60", },
        { quote: "Fast iterations and editable templates — perfect for testing what converts.", name: "Sophia Martinez", role: "Video Marketer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop", },
        { quote: "Consistently high-quality thumbnails that look custom-made for my content.", name: "Ava Patel", role: "Creator & Editor", image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png", },
    ];

    return (
        <section className="flex flex-col items-center" id="testimonials">
            <SectionTitle title="Our testimonials" description="What creators say about our AI thumbnail generator — faster production, higher CTR, and one-click YouTube export." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-18 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <motion.div key={testimonial.name} className="group border border-slate-800 p-6 rounded-xl"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: `${index * 0.15}`, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="text-slate-100 text-base">{testimonial.quote}</p>
                        <div className="flex items-center gap-3 mt-8 group-hover:-translate-y-1 duration-300">
                            <img className="size-10 rounded-full" src={testimonial.image} alt="user image" />
                            <div>
                                <h2 className="text-gray-200 font-medium">
                                    {testimonial.name}
                                </h2>
                                <p className="text-indigo-500">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}