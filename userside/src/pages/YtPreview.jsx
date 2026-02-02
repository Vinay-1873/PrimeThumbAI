import React, { useMemo, useState, useEffect } from 'react'
import { Menu, Search, Mic, PlusCircle, Bell, Play, X } from 'lucide-react'
import { dummyThumbnails } from '../assets/assets'

const Chips = ({ items, onSelect, selected }) => (
  <div className="flex gap-3 overflow-x-auto pb-2">
    {items.map((c, i) => (
      <button
        key={i}
        onClick={() => onSelect(c)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm ${selected === c ? 'bg-white/10' : 'bg-white/6'}`}
      >
        {c}
      </button>
    ))}
  </div>
)

const YtPreview = () => {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selected, setSelected] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [playItem, setPlayItem] = useState(null)
  const [minimized, setMinimized] = useState(false)
  const categories = useMemo(() => ['All', 'Music', 'Mixes', 'Gaming', 'Shorts', 'Playlists', 'Technology'], [])

  const data = (dummyThumbnails && dummyThumbnails.length) ? dummyThumbnails : []

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase()
    return data.filter(d => {
      if (selectedCategory !== 'All') {
        // naive category filter: check title or style
        if (!((d.title || '').toLowerCase().includes(selectedCategory.toLowerCase()) || (d.style || '').toLowerCase().includes(selectedCategory.toLowerCase()))) return false
      }
      if (!q) return true
      return (d.title || '').toLowerCase().includes(q) || (d.prompt_used || '').toLowerCase().includes(q)
    })
  }, [data, query, selectedCategory])

  const featured = filtered.slice(0, 3)
  const shorts = filtered.slice(3, 9)
  const grid = filtered.slice(9)

  React.useEffect(() => {
    if (!selected && featured.length) setSelected(featured[0])
  }, [featured, selected])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        // Escape closes everything
        setPlaying(false)
        setPlayItem(null)
        setMinimized(false)
      }
    }
    if (playing) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing])

  const openPlayer = (item) => {
    setPlayItem(item)
    setSelected(item)
    setPlaying(true)
    setMinimized(false)
  }

  return (
    <div className="min-h-screen bg-yt text-white">
      <div className="flex">
        <aside className="w-20 md:w-64 bg-neutral-900 min-h-screen p-4 border-r border-white/6">
          <div className="mb-6 flex items-center gap-2">
            <div className="w-8 h-6 bg-red-600 rounded-sm flex items-center justify-center font-semibold">You</div>
            <div className="hidden md:block font-bold">YouTube</div>
          </div>
          <nav className="space-y-5 text-sm opacity-90">
            <div className="flex items-center gap-3"><Menu size={18} /> <span className="hidden md:inline">Home</span></div>
            <div className="flex items-center gap-3"><PlusCircle size={18} /> <span className="hidden md:inline">Shorts</span></div>
            <div className="flex items-center gap-3"><Bell size={18} /> <span className="hidden md:inline">Subscriptions</span></div>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between px-6 py-3 border-b border-white/6">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-md hover:bg-white/6"><Menu /></button>
              <div className="hidden sm:flex items-center gap-2 font-semibold">
                <div className="w-8 h-6 bg-red-600 rounded-sm" />
                <div className="hidden md:block">YouTube</div>
              </div>
            </div>

            <div className="flex-1 max-w-3xl mx-4 flex items-center gap-2">
              <div className="flex items-center flex-1 bg-neutral-800 rounded-full px-3 py-2">
                <Search className="text-zinc-300" />
                <input className="flex-1 bg-transparent outline-none px-3 text-sm" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search" />
                <button className="px-3 py-1 rounded bg-white/6 hidden sm:inline">Search</button>
              </div>
              <button className="ml-2 p-2 rounded-full bg-white/6"><Mic /></button>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-3 py-1 rounded bg-white/6 hidden sm:inline">Create</button>
              <Bell />
              <div className="w-8 h-8 bg-neutral-700 rounded-full" />
            </div>
          </header>

          <div className="p-6">
            <Chips items={categories} selected={selectedCategory} onSelect={c => setSelectedCategory(c)} />

            <section className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((f, i) => (
                  <div key={i} onClick={() => openPlayer(f)} className="rounded-lg overflow-hidden bg-neutral-800 cursor-pointer hover:shadow-lg">
                    <div className="relative">
                      <img src={f.image_url} alt={f.title} className="w-full h-52 object-cover rounded-md" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                          <Play />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="font-semibold">{f.title}</div>
                      <div className="text-xs text-zinc-400">Neo TV Channel • 1.2M views • 2 days ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Shorts</h3>
                <div className="text-sm text-zinc-400">More</div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {shorts.map((s, i) => (
                  <div key={i} onClick={() => openPlayer(s)} className="w-40 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800 cursor-pointer">
                    <div className="relative">
                      <img src={s.image_url} alt={s.title} className="w-full h-72 object-cover rounded-md" />
                      <div className="absolute bottom-2 left-2 bg-black/50 text-xs px-2 py-1 rounded">Shorts</div>
                    </div>
                    <div className="p-2 text-sm line-clamp-2">{s.title}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h3 className="text-lg font-semibold mb-4">Recommended</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {grid.length ? grid.map((g, i) => (
                  <div key={i} onClick={() => openPlayer(g)} className="cursor-pointer rounded overflow-hidden bg-neutral-800 hover:shadow-lg">
                    <img src={g.image_url} alt={g.title} className="w-full h-40 object-cover" />
                    <div className="p-3">
                      <div className="text-sm font-semibold line-clamp-2">{g.title}</div>
                      <div className="text-xs text-zinc-400 mt-2">Neo TV Channel • 654K views • 20 days ago</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-zinc-400">No more items</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      {playing && playItem && (
        <div onClick={() => { setPlaying(false); setPlayItem(null) }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-4xl mx-4 bg-neutral-900 rounded">
            <div className="relative">
              <img src={playItem.image_url} alt={playItem.title} className="w-full h-96 object-cover rounded-t" />
              <button
                type="button"
                onClick={() => {
                  // minimize instead of fully closing
                  setPlaying(false)
                  setMinimized(true)
                }}
                aria-label="Minimize"
                className="absolute top-3 left-3 p-2 bg-black/60 rounded-full backdrop-blur-sm hover:bg-black/70"
              >
                <X className="text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center text-2xl">
                  <Play />
                </div>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{playItem.title}</h2>
              <div className="text-sm text-zinc-400 mt-2">Neo TV Channel • 1.2M views • 3 days ago</div>
              <p className="mt-3 text-sm text-zinc-300">{playItem.prompt_used || 'No description available.'}</p>
            </div>
          </div>
        </div>
      )}

      {minimized && playItem && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-neutral-900 rounded shadow-lg overflow-hidden">
          <img onClick={() => { setPlaying(true); setMinimized(false) }} src={playItem.image_url} alt={playItem.title} className="w-44 h-24 object-cover cursor-pointer" />
          <div className="px-3 py-2">
            <div className="font-semibold text-sm line-clamp-1">{playItem.title}</div>
            <div className="text-xs text-zinc-400">Neo TV Channel</div>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <button onClick={() => { setPlaying(true); setMinimized(false) }} className="p-2 bg-white/6 rounded"> <Play size={16} /> </button>
            <button onClick={() => { setMinimized(false); setPlayItem(null); setPlaying(false) }} className="p-2 bg-white/6 rounded"> <X size={16} /> </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default YtPreview
