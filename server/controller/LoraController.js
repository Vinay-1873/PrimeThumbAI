import ThumbnailGeneration from '../models/ThumbnailGeneration.js';
import Thumbnail from '../models/Thumbnail.js';
import cloudinary from '../configs/cloudinary.js';

const stylePrompts = {
    'Bold & Graphic': 'high-impact YouTube thumbnail, bold oversized typography, exaggerated facial expression, ultra-vibrant colors, dramatic lighting, high contrast, maximum visual punch',
    'Tech/Futuristic': 'futuristic YouTube thumbnail, sleek dark background, glowing neon circuit patterns, holographic UI overlays, cyber-tech aesthetic, sci-fi atmosphere',
    'Minimalist': 'clean minimalist YouTube thumbnail, generous negative space, simple 2-3 color palette, elegant sans-serif typography, modern editorial layout',
    'Photorealistic': 'photorealistic YouTube thumbnail, studio-quality lighting, DSLR-style photography, shallow depth of field, cinematic color grading',
    'Illustrated': 'illustrated YouTube thumbnail, custom digital illustration, bold outlines, vibrant saturated colors, cartoon or vector art style'
};

const colorSchemeDescriptions = {
    vibrant: 'ultra-vibrant energetic colors, maximum saturation, bold high-contrast palette',
    sunset: 'warm golden-hour sunset tones, rich orange and coral-pink and deep purple hues',
    forest: 'natural deep green and earthy brown tones, organic calm palette',
    neon: 'intense neon glow, electric cyan and hot pink, dark cyberpunk background',
    purple: 'rich purple-dominant palette, deep violet and magenta tones, luxurious mood',
    monochrome: 'striking black and white, high-contrast dramatic lighting, timeless aesthetic',
    ocean: 'cool deep blue and teal tones, aquatic palette, fresh clean atmosphere',
    pastel: 'soft dreamy pastel colors, low-saturation gentle tones, light airy mood'
};

// POST /api/lora/generate
export const generateWithFlux = async (req, res) => {
    try {
        const { userId, title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;

        if (!userId || !title) {
            return res.status(400).json({ message: 'userId and title are required.' });
        }

        // Build a rich prompt from style + color + user details
        let fullPrompt = `YouTube thumbnail image. Topic: "${title}". `;
        if (style && stylePrompts[style]) fullPrompt += stylePrompts[style] + '. ';
        if (color_scheme && colorSchemeDescriptions[color_scheme]) fullPrompt += colorSchemeDescriptions[color_scheme] + '. ';
        if (user_prompt) fullPrompt += user_prompt + '. ';
        fullPrompt += 'No watermarks, no borders, full bleed image, ultra high quality, click-worthy composition.';

        // Map aspect ratio string to pixel dimensions
        const dimensionMap = {
            '16:9': { width: 1344, height: 768 },
            '1:1':  { width: 1024, height: 1024 },
            '9:16': { width: 768,  height: 1344 },
        };
        const dimensions = dimensionMap[aspect_ratio] || dimensionMap['16:9'];

        // Call HuggingFace FLUX.1-schnell (synchronous — returns image bytes directly)
        const hfResponse = await fetch(
            'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: fullPrompt,
                    parameters: {
                        width: dimensions.width,
                        height: dimensions.height,
                        num_inference_steps: 4,
                    }
                }),
            }
        );

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error('[HuggingFace error]', errorText);
            return res.status(502).json({ message: 'Image generation failed.', detail: errorText });
        }

        // Convert response to buffer
        const imageBuffer = Buffer.from(await hfResponse.arrayBuffer());

        // Upload buffer directly to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'primethumb' },
                (error, result) => (error ? reject(error) : resolve(result))
            ).end(imageBuffer);
        });

        // Save to Thumbnail model (same as Gemini flow) so it appears in My Generation page
        const savedThumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: fullPrompt,
            user_prompt: user_prompt || '',
            style: style || 'Bold & Graphic',
            aspect_ratio: aspect_ratio || '16:9',
            color_scheme: color_scheme || 'vibrant',
            image_url: uploadResult.secure_url,
            isGenerating: false,
        });

        // Also log to ThumbnailGeneration for job tracking
        const jobId = `flux_${Date.now()}`;
        await ThumbnailGeneration.create({
            userId,
            prompt: fullPrompt,
            loraModelId: 'FLUX.1-schnell',
            jobId,
            status: 'completed',
            thumbnailUrl: uploadResult.secure_url,
        });

        return res.status(201).json({
            message: 'Thumbnail generated successfully.',
            thumbnailUrl: uploadResult.secure_url,
            thumbnail: savedThumbnail,
        });
    } catch (error) {
        console.error('[generateWithFlux]', error.message);
        return res.status(500).json({ message: 'Failed to generate thumbnail.' });
    }
};

// GET /api/lora/status/:jobId
export const getStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await ThumbnailGeneration.findOne({ jobId });
        if (!job) return res.status(404).json({ message: 'Job not found.' });
        return res.json({ jobId: job.jobId, status: job.status, thumbnailUrl: job.thumbnailUrl || null });
    } catch (error) {
        console.error('[getStatus]', error.message);
        return res.status(500).json({ message: 'Failed to fetch job status.' });
    }
};
