export default function CTASection() {
    return (
        <section className="w-full flex justify-center mt-26">
            <div className="max-w-4xl w-full px-6 sm:px-10">
                <div className="w-full bg-gradient-to-r from-blue-900 via-indigo-700 to-blue-700 rounded-2xl px-6 sm:px-10 h-40 sm:h-44 flex items-center shadow-xl">
                    <div className="flex-1">
                        <h2 className="text-2xl sm:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300">Ready to go viral?</h2>
                        <p className="mt-1 text-sm bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-blue-200">Join thousands of creators using AI to boost their CTR.</p>
                    </div>

                    <div>
                        <button className="inline-flex items-center gap-3 bg-white text-blue-800 px-5 sm:px-6 py-2.5 rounded-full font-medium shadow-md hover:brightness-95 transition">
                            Generate Free Thumbnail
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
