import { useState, useEffect } from "react";
import SectionTitle from "../components/section-title";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../configs/api";
import { X, MessageSquareQuote, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function OurTestimonials() {
    const { isLoggedIn, user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ quote: "", role: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Default testimonials
    const defaultTestimonials = [
        { quote: "Generated a thumbnail in seconds — my video CTR jumped noticeably!", name: "Oliver Reed", role: "YouTuber", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200", },
        { quote: "Templates are perfectly tuned for high CTR. No design skills needed.", name: "Liam Johnson", role: "Creator", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", },
        { quote: "One-click export to YouTube saved me so much time — professional results every time.", name: "Ethan Roberts", role: "Channel Owner", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60", },
        { quote: "Eye-catching designs that boosted impressions and engagement on my channel.", name: "Isabella Kim", role: "Content Strategist", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60", },
        { quote: "Fast iterations and editable templates — perfect for testing what converts.", name: "Sophia Martinez", role: "Video Marketer", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop", },
        { quote: "Consistently high-quality thumbnails that look custom-made for my content.", name: "Ava Patel", role: "Creator & Editor", image: "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/userImage/userImage1.png", },
    ];

    const [testimonials, setTestimonials] = useState(defaultTestimonials);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get('/api/testimonials/all');
                if (data.success && data.testimonials.length > 0) {
                    // Combine fetched testimonials with defaults, or just use fetched if enough exist
                    // For now, let's prepend fetched ones to defaults so user sees their own updates
                    const formattedFetched = data.testimonials.map(t => ({
                        ...t,
                        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`
                    }));
                    setTestimonials([...formattedFetched, ...defaultTestimonials]);
                }
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.quote.trim()) return;

        setIsSubmitting(true);
        try {
            const { data } = await api.post('/api/testimonials/add', formData);
            if (data.success) {
                toast.success("Thanks for your review!");
                const newTestimonial = {
                    ...data.testimonial,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.testimonial.name)}&background=random`
                };
                setTestimonials([newTestimonial, ...testimonials]);
                setIsModalOpen(false);
                setFormData({ quote: "", role: "" });
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex flex-col items-center relative" id="testimonials">
            <SectionTitle title="Our testimonials" description="What creators say about our AI thumbnail generator — faster production, higher CTR, and one-click YouTube export." />
            
            {isLoggedIn && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 mb-4"
                >
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 rounded-full transition-all hover:scale-105 active:scale-95"
                    >
                        <MessageSquareQuote className="size-5" />
                        <span>Write a Review</span>
                    </button>
                </motion.div>
            )}

            <div className="w-full overflow-hidden mt-10 max-w-5xl mx-auto relative px-4 mask-linear">
                {/* Two marquee rows: one left-to-right, one right-to-left to create round-robin effect */}
                <div className="flex flex-col gap-6">
                    <motion.div className="flex gap-6"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    >
                        {[...testimonials, ...testimonials].map((testimonial, i) => (
                            <div key={`t1-${i}`} className="group bg-slate-900/40 border border-slate-800 p-6 rounded-xl w-[300px] sm:w-[350px] flex-shrink-0 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 cursor-default">
                                <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3 mt-6 border-t border-slate-800 pt-4">
                                    <img className="size-10 rounded-full object-cover ring-2 ring-indigo-900/50" src={testimonial.image} alt={testimonial.name} />
                                    <div>
                                        <h2 className="text-gray-200 font-medium text-sm">{testimonial.name}</h2>
                                        <p className="text-indigo-400 text-xs">{testimonial.role || 'Creator'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div className="flex gap-6"
                        animate={{ x: ['-50%', '0%'] }}
                        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    >
                        {[...testimonials, ...testimonials].map((testimonial, i) => (
                            <div key={`t2-${i}`} className="group bg-slate-900/40 border border-slate-800 p-6 rounded-xl w-[300px] sm:w-[350px] flex-shrink-0 hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300 cursor-default">
                                <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3 mt-6 border-t border-slate-800 pt-4">
                                    <img className="size-10 rounded-full object-cover ring-2 ring-indigo-900/50" src={testimonial.image} alt={testimonial.name} />
                                    <div>
                                        <h2 className="text-gray-200 font-medium text-sm">{testimonial.name}</h2>
                                        <p className="text-indigo-400 text-xs">{testimonial.role || 'Creator'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Modal for adding testimonial */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                            >
                                <X className="size-5" />
                            </button>

                            <h3 className="text-xl font-semibold text-white mb-1">Share Your Experience</h3>
                            <p className="text-slate-400 text-sm mb-6">How has PrimeThumbAI helped your channel?</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Your Role</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. YouTuber, Streamer, Editor" 
                                        value={formData.role} 
                                        onChange={e => setFormData({...formData, role: e.target.value})}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition placeholder:text-slate-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Your Review</label>
                                    <textarea 
                                        required
                                        rows={4}
                                        placeholder="Tell us what you think..." 
                                        value={formData.quote} 
                                        onChange={e => setFormData({...formData, quote: e.target.value})}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition resize-none placeholder:text-slate-600"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Post Review</span>
                                            <Send className="size-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}