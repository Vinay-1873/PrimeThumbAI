import React, { useState, useEffect } from 'react'
import SoftBackdrop from '../components/SoftBackdrop'
import { useNavigate } from 'react-router-dom'
import { DownloadIcon, Trash2Icon, ArrowUpRightIcon } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const MyGeneration = () => {
  const navigate = useNavigate()
  const aspectRatioClassMap = {
    '16:9': 'aspect-video',
    '1:1': 'aspect-square',
    '9:16': 'aspect-[9/16]',
  }

  const [thumbnails, setThumbnails] = useState([])
  const [loading, setLoading] = useState(true)

  // Verify payment if coming back from Stripe
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');

    if (sessionId) {
        const verifyPayment = async () => {
            try {
                const { data } = await api.post('/api/payment/verify-session', { sessionId });
                if (data.success) {
                    toast.success('Payment successful! Plan upgraded.');
                    // Remove session_id from URL to prevent re-verification on reload
                    navigate('/my-generation', { replace: true });
                }
            } catch (error) {
                console.error(error);
                // toast.error('Payment verification failed or already processed'); 
                // Silently fail if already processed ideally, or show specific msg
            }
        };
        verifyPayment();
    }
  }, []);

  const fetchthumbnails = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/api/user/thumbnails')
      setThumbnails(data.thumbnail)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load thumbnails')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchthumbnails()
  }, [])

  const handleDownload = (image_url) => {
    if (!image_url) return
    window.open(image_url, '_blank')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/thumbnail/delete/${id}`)
      setThumbnails((prev) => prev.filter((t) => t._id !== id))
      toast.success('Thumbnail deleted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete thumbnail')
    }
  }

  const handleOpen = (id) => {
    if (!id) return
    const url = `${window.location.origin}/yt-preview/${id}`
    window.open(url, '_blank')
  }

  return (
    <>
      <SoftBackdrop />
      <div className='mt-3 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
        {/* header */}
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-zinc-200'>My Generations</h1>
          <p className='text-sm text-zinc-400 mt-1'>View and manage all your AI-generated thumbnails</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='rounded-2xl bg-white/6 border border-white/10 animate-pulse h-[260px]' />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && thumbnails.length === 0 && (
          <div className='text-center py-24'>
            <h3 className='text-lg font-semibold text-zinc-200'>No thumbnails yet</h3>
            <p className='text-sm text-zinc-400 mt-2'>Generate your first thumbnail to see it here</p>
          </div>
        )}

        {/* Grid */}
        {!loading && thumbnails.length > 0 && (
          <div className='columns-1 sm:columns-3 2xl:columns-4 gap-8'>
            {thumbnails.map((thumb) => {
              const aspectClass = aspectRatioClassMap[thumb.aspect_ratio || '16:9']

              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className='mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid'
                >
                  {/* image */}
                  <div className={`relative overflow-hidden rounded-t-2xl ${aspectClass} bg-black`}>
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                    ) : (
                      <div>{thumb.isGenerating ? 'Generating....' : 'NO image'}</div>
                    )}

                    {thumb.isGenerating && <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white'> Generating....</div>}
                    {/* action buttons */}
                    <div onClick={(e) => e.stopPropagation()} className="absolute bottom-2 right-2 max-sm:flex sm:hidden group-hover:flex gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpen(thumb._id)
                        }}
                        title="YT Preview"
                        type="button"
                      >
                        <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(thumb.image_url)
                        }}
                        title="Download"
                        type="button"
                      >
                        <DownloadIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(thumb._id)
                        }}
                        title="Delete"
                        type="button"
                      >
                        <Trash2Icon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all text-white" />
                      </button>
                    </div>
                  </div>
                  {/* CONTENT */}
                  <div className='p-4 space-y-2'>
                    <h3 className='text-sm font-semibold text-zinc-100 line-clamp-2'>{thumb.title}</h3>
                    <div className='flex flex-wrap gap-2 text-xs text-zinc-400'>
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.style}</span>
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.color_scheme}</span>
                      <span className='px-2 py-0.5 rounded bg-white/8'>{thumb.aspect_ratio}</span>
                    </div>
                    <p className='text-xs text-zinc-500'>{thumb.createdAt ? new Date(thumb.createdAt).toDateString() : ''}</p>
                  </div>
                  {/* buttons */}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default MyGeneration