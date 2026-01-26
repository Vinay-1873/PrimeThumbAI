import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { colorSchemes, dummyThumbnails } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatio from "../components/AspectRatio";
import StyleSelector from "../components/StyleSelector";
import ColorSelector from "../components/ColorSelector";
import PreviewPanel from "../components/previewPanel";

export default function Generate() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [loading, setLoading] = useState(false);

    const [aspectRatio,setAspectRatio] = useState('16:9')
    const [colorSchemeId,setColorSchemeId] = useState(colorSchemes[0]?.id || '')
    const [style,setStyle] = useState('Bold & Graphic')

    const [styleDropdownOpen, setStyleDropdownOpen] =useState(false)
    const handleGenerate =async () =>{
         
    }

    const fetchThumbnail = async () =>{
        if(id){
            const thumbnail=dummyThumbnails.find((thumbnail)=>thumbnail._id === id);
            setThumbnail(thumbnail)
            setAdditionalDetails(thumbnail.user_prompt)
            setTitle(thumbnail.title)
            setColorSchemeId(thumbnail.color_scheme)
            setAspectRatio(thumbnail.aspect_ratio)
            setStyle(thumbnail.style)
            setLoading(false)
        }
    }

    useEffect(()=>{
        if(!id) return;
        setLoading(true);
        fetchThumbnail();
    },[id])
    
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
                       {/* details */}
                       <div className="space-y-2">
                        <label className="block text-sm font-medium">
                          Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                        </label>
                        <textarea value={additionalDetails} onChange={(e)=>setAdditionalDetails(e.target.value)}
                            rows={3} placeholder="Add any specific elements,mood, or style preferences..." className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"/>
                       </div>
                    {/* buttom */}
                    {!id &&(
                        <button onClick={handleGenerate} className="w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-600 disabled:cursor-not-allowed transition-colors item-center">
                        {loading ? 'Generating...':'Generate Thumbnail'}
                        </button>
                    )}
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
