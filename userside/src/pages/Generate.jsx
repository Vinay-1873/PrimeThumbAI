import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { aspectRatios, colorSchemes, dummyThumbnails } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatio from "../components/AspectRatio";
import StyleSelector from "../components/StyleSelector";
import ColorSelector from "../components/ColorSelector";
import PreviewPanel from "../components/previewPanel";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../configs/api";

export default function Generate() {
    const { id } = useParams();
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const {isLoggedIn, user} = useAuth()
    const [title, setTitle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);

    const [aspectRatio,setAspectRatio] = useState('16:9')
    const [colorSchemeId,setColorSchemeId] = useState(colorSchemes[0]?.id || '')
    const [style,setStyle] = useState('Bold & Graphic')
    const [referenceImage, setReferenceImage] = useState(null);
    const [referencePreview, setReferencePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [styleDropdownOpen, setStyleDropdownOpen] = useState(false)

    const handleReferenceImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setReferenceImage(file);
        setReferencePreview(URL.createObjectURL(file));
    };

    const removeReferenceImage = () => {
        setReferenceImage(null);
        if (referencePreview) URL.revokeObjectURL(referencePreview);
        setReferencePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const forceScrollToTop = () => {
        // Lenis can override smooth window scrolling, so force native scroll position.
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    };

    const handleGenerate = async () => {
        if(!isLoggedIn) return toast.error('please login to generate thumbnails')
        if(!title.trim()) return toast.error('Title is required')

        forceScrollToTop();

        setLoading(true)
        setThumbnail(null)

        try {
            const { data } = await api.post('/api/lora/generate', {
                userId: user?._id,
                title,
                prompt: additionalDetails,
                style,
                aspect_ratio: aspectRatio,
                color_scheme: colorSchemeId,
            });

            if(data.thumbnailUrl) {
                setThumbnail({ image_url: data.thumbnailUrl, title });
                toast.success('Thumbnail generated!')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }


    const fetchThumbnail = async () => {
        try {
            const { data } = await api.get(`/api/user/thumbnail/${id}`);
            setThumbnail(data?.thumbnail);
            setLoading(!data?.thumbnail?.image_url);
            setAdditionalDetails(data?.thumbnail?.user_prompt);
            setTitle(data?.thumbnail?.title);
            setColorSchemeId(data?.thumbnail?.color_scheme);
            setAspectRatio(data?.thumbnail?.aspect_ratio);
            setStyle(data?.thumbnail?.style);
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error.message);
        }
    }

    useEffect(()=>{
        if(isLoggedIn && id){
            fetchThumbnail()
        }
        if(id && loading && isLoggedIn){
            const interval = setInterval(()=>{
                fetchThumbnail()
            },5000)
            return ()=> clearInterval(interval)
        }
    },[id ,loading, isLoggedIn])

    useEffect(()=>{
        if(!id && thumbnail){
            setThumbnail(null)
        }
    },[pathname])
    
    return (
        <div className="pt-1 min-h-screen">
            <SoftBackdrop />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
                <div className="grid lg:grid-cols-[400px_1fr] gap-8">
                    {/*left panel */}
                    <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
                        <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life</p>
                    </div>
                    <div className="space-y-5">
                       {/* title input */}
                       <div className="space-y-2">
                        <label className="block text-sm font-medium">Title or Topic</label>
                        <input type="text"  value={title} onChange={(e)=>setTitle(e.target.value)} maxLength={100} placeholder="e.g., 10 Tips for better sleep" className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400
                          focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                          <div className="flex justify-end">
                              <span className="text-xs text-zinc-400">{title.length}/100</span>
                          </div>
                       </div>
                       {/* AspectRatioselector */}
                       <AspectRatio value={aspectRatio} onChange={setAspectRatio} />
                       {/* StyleSelector */}
                       <StyleSelector value={style} onChange={setStyle} isOpen={styleDropdownOpen} setIsOpen={setStyleDropdownOpen}/>
                       {/* ColorSelector */}
                       <ColorSelector value={colorSchemeId} onChange={setColorSchemeId}/>
                       {/* Reference Image Upload */}
                       <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Reference Image <span className="text-zinc-400 text-xs">(optional — your face, subject, or style)</span>
                        </label>
                        {referencePreview ? (
                            <div className="relative w-full rounded-lg overflow-hidden border border-white/12">
                                <img src={referencePreview} alt="Reference" className="w-full h-32 object-cover" />
                                <button
                                    type="button"
                                    onClick={removeReferenceImage}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                                >✕</button>
                                <p className="px-3 py-1.5 text-xs text-zinc-400 bg-black/40 truncate">{referenceImage?.name}</p>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-24 rounded-lg border border-dashed border-white/20 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-zinc-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-zinc-400 text-sm">Click to upload image</span>
                                <span className="text-zinc-500 text-xs mt-0.5">PNG, JPG, WEBP — max 5MB</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleReferenceImageChange}
                                />
                            </label>
                        )}
                       </div>
                       {/* details */}
                       <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                        </label>
                        <textarea value={additionalDetails} onChange={(e)=>setAdditionalDetails(e.target.value)}
                            rows={3} placeholder="Add any specific elements,mood, or style preferences..." className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"/>
                       </div>
                    {/* button */}
                    <button onClick={handleGenerate} disabled={loading} className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 disabled:cursor-not-allowed transition-colors item-center">
                    {loading ? 'Generating...':'Generate Thumbnail'}
                    </button>
                    </div>
                    </div>
                    {/* Right Panel */}
                    <div>
                        <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                            <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
                            <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
