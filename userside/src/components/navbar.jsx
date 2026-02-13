import { useState, useRef } from "react";
import { MenuIcon, XIcon, User, LogOut, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../configs/api";
import toast from "react-hot-toast";

export default function Navbar() {
    const {isLoggedIn, user, logout, setUser} = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        setIsUploading(true);
        try {
            // Assume api is imported from ../configs/api or similar (it's used in AuthContext)
            // But we can't easily import it here if it's not exported or if we need interceptors.
            // Let's use the one from context if available? No, context exposes user/funcs.
            // We should import api directly. 
            // Wait, I need to check imports in navbar.jsx.
            const { data } = await api.post("/api/user/update-profile-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                setUser(data.user);
                toast.success("Profile updated");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSectionClick = (e, sectionId) => {
        e.preventDefault();
        if (location.pathname !== "/") {
            navigate("/");
            setTimeout(() => {
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
    };

    const navlinks = [
        {
            href: "/",
            text: "Home",
        },
        {
            href: "/generate",
            text: "Generate",
        },
        ...(isLoggedIn ? [{
            href: "/my-generation",
            text: "My Generation",
        }] : []),
        {
            href: "#about",
            text: "About",
            isSection: true,
        },
        {
            href: "#contact",
            text: "Contact Us",
            isSection: true,
        },
    ];
    return (
        <>
            <motion.nav className="sticky top-0 z-50 flex items-center justify-between w-full h-18 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <a href="/">
                    <img className="h-9 w-auto" src="/assets/logo.png" width={138} height={36} alt="logo" />
                </a>

                <div className="hidden lg:flex items-center gap-8 transition duration-500">
                    {navlinks.map((link) => (
                        link.isSection ? (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => handleSectionClick(e, link.href.slice(1))}
                                className="hover:text-slate-300 transition cursor-pointer"
                            >
                                {link.text}
                            </a>
                        ) : (
                            <Link key={link.href} to={link.href} className="hover:text-slate-300 transition">
                                {link.text}
                            </Link>
                        )
                    ))}
                </div>

                <div className="hidden lg:block space-x-3">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">Hi, {user?.name}</span>
                            <div className="relative group">
                                <div className="w-9 h-9 flex items-center justify-center bg-slate-800 rounded-full text-white cursor-pointer hover:bg-slate-700 transition overflow-hidden border border-transparent group-hover:border-indigo-500/50">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt="profile" className="w-full h-full object-cover" />
                                    ) : user?.name ? (
                                        <span className="font-medium text-lg">{user.name[0].toUpperCase()}</span>
                                    ) : (
                                        <User className="size-5" />
                                    )}
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                                    <div className="p-2 border-b border-slate-800/50">
                                        <p className="text-xs text-slate-500 px-2 pb-1">Manage Account</p>
                                        <button 
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
                                        >
                                            {isUploading ? (
                                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Camera className="size-4 text-indigo-400" />
                                            )}
                                            <span>{isUploading ? "Uploading..." : "Change Avatar"}</span>
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            accept="image/*" 
                                            className="hidden" 
                                        />
                                    </div>
                                    <button 
                                        onClick={logout} 
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-800/80 hover:text-red-300 transition"
                                    >
                                        <LogOut className="size-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-full active:scale-95 inline-flex items-center">
                            Get started
                        </Link>
                    )}
                </div>
                <button onClick={() => setIsMenuOpen(true)} className="lg:hidden active:scale-90 transition">
                    <MenuIcon className="size-6.5" />
                </button>
            </motion.nav>
            <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 lg:hidden transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {navlinks.map((link) => (
                    link.isSection ? (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleSectionClick(e, link.href.slice(1))}
                            className="cursor-pointer"
                        >
                            {link.text}
                        </a>
                    ) : (
                        <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                            {link.text}
                        </Link>
                    )
                ))}
                {isLoggedIn ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-white">Hi, {user?.name}</span>
                            <User className="size-5" />
                        </div>
                        <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-sm text-slate-300 hover:text-white transition">
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md inline-flex items-center">
                        Get started
                    </Link>
                )}
                <button onClick={() => setIsMenuOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}