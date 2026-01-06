import SectionTitle from "../components/section-title";
import { motion } from "framer-motion";

export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            price: "$9",
            period: "/month",
            features: ["10 thumbnails / month", "Basic templates", "Standard export quality"],
            popular: false,
        },
        {
            name: "Pro",
            price: "$29",
            period: "/month",
            features: ["Unlimited thumbnails", "High-CTR templates", "One-click YouTube export"],
            popular: true,
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "/month",
            features: ["Team seats & collaboration", "Priority support", "Custom templates"],
            popular: false,
        },
    ];

    return (
        <section className="flex flex-col items-center" id="pricing">
            <SectionTitle title="Our Pricing Plans" description="Flexible pricing options designed to meet your needs — whether you're just getting started or scaling up." />

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-6 md:px-0">
                {plans.map((plan, i) => (
                    <motion.div key={plan.name} className={`group rounded-xl p-6 border transform transition-all duration-300 ${plan.popular ? "bg-indigo-700 text-white border-indigo-700 shadow-2xl hover:scale-105" : "bg-transparent border-slate-800 text-slate-200 hover:scale-105 hover:shadow-xl"}`}
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.12, type: "spring", stiffness: 320, damping: 70 }}
                    >
                        {plan.popular && <div className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full mb-4">Most Popular</div>}
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-sm text-slate-400">{plan.period}</span>
                        </div>
                        <ul className="mt-6 space-y-2 text-sm text-slate-300">
                            {plan.features.map((f, idx) => (
                                <li key={idx} className="flex items-start gap-2"> 
                                    <span className="text-green-400">✓</span>
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <button className={`${plan.popular ? "bg-white text-indigo-700 hover:opacity-95" : "bg-indigo-800 text-white hover:brightness-95"} w-full rounded-lg px-4 py-3 transition`}>{plan.popular ? "Get Started" : "Get Started"}</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
