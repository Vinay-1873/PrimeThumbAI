export const aspectRatios = ["16:9", "1:1", "9:16"];

export const thumbnailStyles = ["Bold & Graphic", "Minimalist", "Photorealistic", "Illustrated", "Tech/Futuristic"];

export const colorSchemes = [
    { id: "vibrant", name: "Vibrant", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"] },
    { id: "sunset", name: "Sunset", colors: ["#FF8C42", "#FF3C38", "#A23B72"] },
    { id: "ocean", name: "Ocean", colors: ["#0077B6", "#00B4D8", "#90E0EF"] },
    { id: "forest", name: "Forest", colors: ["#2D6A4F", "#40916C", "#95D5B2"] },
    { id: "purple", name: "Purple Dream", colors: ["#7B2CBF", "#9D4EDD", "#C77DFF"] },
    { id: "monochrome", name: "Monochrome", colors: ["#212529", "#495057", "#ADB5BD"] },
    { id: "neon", name: "Neon", colors: ["#FF00FF", "#00FFFF", "#FFFF00"] },
    { id: "pastel", name: "Pastel", colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB"] },
];

export const dummyThumbnails = [
    {
        _id: "69451ff3c9ea67e4c930f6a6",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Top smartwatch under 1499",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_1.jpg",
        prompt_used: "add multiple smartwatches ",
        user_prompt: "add multiple smartwatches ",
        isGenerating: false,
        createdAt: "2025-12-19T09:50:43.727Z",
        updatedAt: "2025-12-19T09:51:07.874Z",
    },
    {
        _id: "69451d5bc9ea67e4c930f698",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Learn How to make 100k in 10 days",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_2.jpg",
        prompt_used: "add cash images graph and etc",
        user_prompt: "add cash images graph and etc",
        isGenerating: false,
        createdAt: "2025-12-19T09:39:39.971Z",
        updatedAt: "2025-12-19T09:40:05.084Z",
    },
    {
        _id: "6943fb409fa048268a04f105",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Learn NextJS 16 with a Project",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_3.jpg",
        prompt_used: "add human with laptop",
        user_prompt: "add human with laptop",
        isGenerating: false,
        createdAt: "2025-12-18T13:01:52.205Z",
        updatedAt: "2025-12-18T13:02:13.766Z",
    },
    {
        _id: "6943e8c763d3d5ec3e4f5c8c",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Learn how to use Photoshop",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_4.jpg",
        prompt_used: "",
        user_prompt: "",
        isGenerating: false,
        createdAt: "2025-12-18T11:43:03.281Z",
        updatedAt: "2025-12-18T11:43:24.982Z",
    },
    {
        _id: "6943e2220611d25b40e529b3",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Make Burger in 30 min",
        style: "Photorealistic",
        aspect_ratio: "1:1",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_5.jpg",
        isGenerating: false,
        createdAt: "2025-12-18T11:14:42.466Z",
        updatedAt: "2025-12-18T11:15:04.260Z",
    },
    {
        _id: "6943e04c0611d25b40e529ac",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Learn Full Stack Development",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "vibrant",
        text_overlay: true,
        image_url: "/assets/thumb_6.jpg",
        isGenerating: false,
        createdAt: "2025-12-18T11:06:52.555Z",
        updatedAt: "2025-12-18T11:07:18.715Z",
    },
    {
        _id: "6943d68d5b9fed7040154a0f",
        userId: "6942b3bd2a93a220baa331b3",
        title: "Learn ReactJS in 2 hours",
        style: "Bold & Graphic",
        aspect_ratio: "16:9",
        color_scheme: "ocean",
        text_overlay: true,
        image_url: "/assets/thumb_7.jpg",
        isGenerating: false,
        createdAt: "2025-12-18T10:25:17.135Z",
        updatedAt: "2025-12-18T10:25:41.648Z",
    },
];

export const yt_html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Preview - %%TITLE%%</title>
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
            tailwind.config = { darkMode: 'class', theme: { extend: { colors: { yt: '#0f0f0f', yt2: '#181818', ytBorder: '#303030' } } } };
        </script>
    </head>
    <body class="dark bg-yt text-white font-sans">
        <div class="min-h-screen">
            <header class="flex items-center justify-between px-6 py-3 border-b border-white/6">
                <div class="flex items-center gap-4">
                    <button class="p-2 rounded-md hover:bg-white/6">☰</button>
                    <div class="text-lg font-semibold">Thumblify</div>
                </div>
                <div class="flex-1 max-w-2xl mx-4">
                    <input class="w-full rounded-full px-4 py-2 bg-white/6 placeholder:text-zinc-300" placeholder="Search" />
                </div>
                <div class="flex items-center gap-3">
                    <button class="px-3 py-1 rounded bg-white/6">Create</button>
                </div>
            </header>

            <main class="p-6">
                <div class="max-w-5xl mx-auto">
                    <div class="rounded-lg overflow-hidden bg-neutral-900">
                        <img src="%%THUMBNAIL_URL%%" alt="%%TITLE%%" class="w-full h-72 object-cover" />
                        <div class="p-4">
                            <h1 class="text-2xl font-bold">%%TITLE%%</h1>
                            <p class="text-sm text-zinc-400 mt-2">Preview generated thumbnail</p>
                        </div>
                    </div>

                    <section class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- example related cards -->
                        <div class="rounded overflow-hidden bg-neutral-800">
                            <img src="%%THUMBNAIL_URL%%" class="w-full h-40 object-cover" alt="related" />
                            <div class="p-3">
                                <div class="text-sm font-semibold line-clamp-2">%%TITLE%%</div>
                                <div class="text-xs text-zinc-400 mt-2">Neo TV Channel • 2.3M views • 12 days ago</div>
                            </div>
                        </div>
                        <div class="rounded overflow-hidden bg-neutral-800">
                            <img src="%%THUMBNAIL_URL%%" class="w-full h-40 object-cover" alt="related" />
                            <div class="p-3">
                                <div class="text-sm font-semibold line-clamp-2">More like this</div>
                                <div class="text-xs text-zinc-400 mt-2">Neo TV Channel • 1.1M views • 3 days ago</div>
                            </div>
                        </div>
                        <div class="rounded overflow-hidden bg-neutral-800">
                            <img src="%%THUMBNAIL_URL%%" class="w-full h-40 object-cover" alt="related" />
                            <div class="p-3">
                                <div class="text-sm font-semibold line-clamp-2">Suggested video</div>
                                <div class="text-xs text-zinc-400 mt-2">Neo TV Channel • 654K views • 20 days ago</div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    </body>
</html>
`;
