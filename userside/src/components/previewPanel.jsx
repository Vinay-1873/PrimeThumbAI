import { Loader2Icon } from "lucide-react";


const previewPanel = (thumbnail, isLoading, aspectRatio ) => {
       
        
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
               <h1>hello</h1>
            )}
        </div>
    </div>
  )
}

export default previewPanel