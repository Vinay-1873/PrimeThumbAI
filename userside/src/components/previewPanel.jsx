import { DownloadIcon, ImageIcon, Loader2Icon, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";


const PreviewPanel = ({ thumbnail, isLoading, aspectRatio }) => {
       const navigate = useNavigate();
       const aspectClasses={
        '16:9':'aspect-video',
        '1:1':'aspect-square',
        '9:16':'aspect-[9/16]',
       } 

       const onDownload =()=>{
        if(!thumbnail?.image_url)return;
        const link = document.createElement('a');
        link.href = thumbnail?.image_url.replace('/upload', '/upload/fl_attachment')
        document.body.appendChild(link);
        link.click()
        link.remove()
       }
       
       const onPreview = () => {
           if (thumbnail?._id) {
               navigate(`/yt-preview/${thumbnail._id}`);
           } else {
               navigate('/preview');
           }
       }
        
  return (
    <div className="relative mx-auto w-full max-w-2xl">
        <div className={`relative overflow-hidden ${aspectClasses [aspectRatio]}`}>
            {/* Loading state */}
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/25">
                    <Loader2Icon className="size-8 animate-spin text-zinc-400"/>
                    <div className="text-center">
                        <p className="text-sm font-medium text-zinc-200">AI is creating your Thumbnail</p>
                        <p className="mt-1 text-xs text-zinc-400">This may take few seconds</p>
                    </div>
                </div>
            )}
             
            {/* Image Preview */}
            {!isLoading && thumbnail?.image_url &&( 
               <div className="group relative h-full w-full">
                <img src={thumbnail?.image_url} alt={thumbnail.title} className="h-full w-full object-cover"/>
                <div className="absolute inset-0 flex items-end justify-center gap-3 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={onDownload} type="button" className="mb-6 flex items-center gap-2 rounded-md px-5 py-2 text-xs font-medium transition bg-white/30 ring-2 ring-white/40 backdrop-blur hover:scale-105 active:scale-95 ">
                       <DownloadIcon className="size-4"/>
                       Download
                    </button>
                    <button onClick={onPreview} type="button" className="mb-6 flex items-center gap-2 rounded-md px-5 py-2 text-xs font-medium transition bg-indigo-500/30 ring-2 ring-indigo-400/40 backdrop-blur hover:scale-105 active:scale-95 ">
                       <Eye className="size-4"/>
                       YouTube Preview
                    </button>
                </div>
               </div>
            )}

            {/* empty state */}
            {!isLoading && !thumbnail?.image_url &&(
                <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
                    <div className="max-sm:hidden flex size-20 items-center justify-center rounded-full bg-white/10">
                       <ImageIcon className="size-20 text-white opacity-50"/>
                    </div>
                    <div className="px-4 text-center">
                        <p className="font text-zinc-200">Generate your first thumbnail</p>
                        <p className="mt-1 text-xs text-zinc-400">Fill out the form and click Generate</p>
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}

export default PreviewPanel