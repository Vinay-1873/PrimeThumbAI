import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Pricing() {
    const { isLoggedIn } = useAuth();
    
    const handleSubscription = async (planName) => {
        if (!isLoggedIn) {
            toast.error("Please login to subscribe");
            return;
        }
        if (planName === "Free Forever" || planName === "Enterprise") {
            toast('This plan is not available for online purchase yet', { icon: 'ℹ️' });
            return; 
        }

        try {
            const { data } = await api.post('/api/payment/create-checkout-session', { plan: planName });
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to initiate checkout");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };
    
    const plans = [
        {
            name: "Free Forever",
            price: "$0",
            period: "/month",
            features: ["5 thumbnails / month", "Standard templates", "720p export quality"],
            popular: false,
            buttonText: "Current Plan"
        },
        {
            name: "Basic",
            price: "$9",
            period: "/month",
            features: ["50 thumbnails / month", "Pro templates", "1080p export quality"],
            popular: false,
            buttonText: "Get Started"
        },
        {
            name: "Pro",
            price: "$29",
            period: "/month",
            features: ["Unlimited thumbnails", "High-CTR templates", "4K export quality", "Priority support"],
            popular: true,
            buttonText: "Upgrade to Pro"
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "/month",
            features: ["Team seats & collaboration", "Dedicated account manager", "Custom branding"],
            popular: false,
            buttonText: "Contact Sales"
        },
    ];

    return (
        <section className="flex flex-col items-center" id="pricing">
            <SectionTitle title="Our Pricing Plans" description="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up." />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 px-6">
                {plans.map((plan, i) => (
                    <motion.div key={plan.name} className={`relative flex flex-col group rounded-2xl p-6 border transform transition-all duration-300 ${plan.popular ? "bg-indigo-900/40 border-indigo-500 shadow-2xl scale-105 z-10" : "bg-slate-900/20 border-slate-800 text-slate-200 hover:border-slate-600"}`}
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 320, damping: 70 }}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                        )}
                        <h3 className={`text-xl font-semibold ${plan.popular ? "text-indigo-400" : "text-white"}`}>{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-white">{plan.price}</span>
                            <span className="text-sm text-slate-400">{plan.period}</span>
                        </div>
                        <ul className="mt-8 space-y-4 text-sm text-slate-300 flex-1">
                            {plan.features.map((f, idx) => (
                                <li key={idx} className="flex items-start gap-3"> 
                                    <div className={`mt-0.5 rounded-full p-0.5 ${plan.popular ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-800 text-slate-400"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8">
                            <button onClick={() => handleSubscription(plan.name)} className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30" : "bg-slate-800 hover:bg-slate-700 text-white"}`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
