import ThumbnailGeneration from '../models/ThumbnailGeneration.js';
import Thumbnail from '../models/Thumbnail.js';
import cloudinary from '../configs/cloudinary.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

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
        const referenceFile = req.file || null; // Optional reference image

        if (!userId || !title) {
            return res.status(400).json({ message: 'userId and title are required.' });
        }

        // Build a rich prompt from style + color + user details
        let fullPrompt = `High-quality photorealistic image. `;
        if (style && stylePrompts[style]) fullPrompt += stylePrompts[style] + '. ';
        if (color_scheme && colorSchemeDescriptions[color_scheme]) fullPrompt += colorSchemeDescriptions[color_scheme] + '. ';
        if (user_prompt) fullPrompt += user_prompt + '. ';
        
        // Add reference image context if provided
        if (referenceFile) {
            fullPrompt += `Reference style: Match the subject, person, face, and aesthetic from the reference image. Incorporate similar styling and composition. `;
        }
        
        fullPrompt += 'IMPORTANT: No text labels, no words, no typography, no watermarks, no captions on the image. Clean image only with no text overlay. Full bleed, ultra high quality.';

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
        let imageBuffer = Buffer.from(await hfResponse.arrayBuffer());

        // Generate description from title and user prompt
        const description = `${title}${user_prompt ? ': ' + user_prompt : ''}`;

        // If reference image was uploaded, upload it to Cloudinary first
        let referenceImageUrl = null;
        if (referenceFile) {
            const referenceUploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'primethumb/references' },
                    (error, result) => (error ? reject(error) : resolve(result))
                ).end(referenceFile.buffer);
            });
            referenceImageUrl = referenceUploadResult.secure_url;
        }

        // Large bold YouTube thumbnail style text
        const baseFontSize = Math.floor(dimensions.width / 8); // Large font for impact
        const displayTitle = String(title).substring(0, 100);
        
        // Split title into words and create color array for variety
        const words = displayTitle.split(' ');
        const colors = ['#FF1493', '#FFFF00', '#00FF00', '#FF00FF', '#FF6B35'];
        
        // Escape special characters
        const escapeXml = (str) => str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        // Create SVG with large overlaid text (YouTube thumbnail style)
        let textSvg = `<svg width="${dimensions.width}" height="${dimensions.height}" xmlns="http://www.w3.org/2000/svg">`;
        
        let yPosition = Math.floor(dimensions.height * 0.15); // Start near top
        let lineHeight = Math.floor(baseFontSize * 1.2);
        let lineCount = 0;
        const maxWordsPerLine = Math.max(1, Math.floor(4 * dimensions.width / 1344)); // Responsive to aspect ratio
        let currentLineWords = [];
        
        // Build text lines
        for (let i = 0; i < words.length; i++) {
            currentLineWords.push({ word: words[i], color: colors[i % colors.length] });
            
            if (currentLineWords.length >= maxWordsPerLine || i === words.length - 1) {
                // Draw this line
                let xPosition = Math.floor(dimensions.width * 0.05); // Left margin
                
                for (const wordObj of currentLineWords) {
                    const escapedWord = escapeXml(wordObj.word);
                    textSvg += `
                    <text x="${xPosition}" y="${yPosition}" 
                          font-family="Impact, Arial Black, sans-serif" 
                          font-size="${baseFontSize}" 
                          font-weight="900"
                          fill="${wordObj.color}" 
                          stroke="#FFFFFF" 
                          stroke-width="${Math.floor(baseFontSize * 0.08)}"
                          text-anchor="start">${escapedWord}</text>`;
                    xPosition += Math.floor(escapedWord.length * baseFontSize * 0.55) + Math.floor(baseFontSize * 0.1);
                }
                
                yPosition += lineHeight;
                currentLineWords = [];
                lineCount++;
            }
        }
        
        textSvg += `</svg>`;
        
        imageBuffer = await sharp(imageBuffer)
            .composite([
                {
                    input: Buffer.from(textSvg),
                    top: 0,
                    left: 0,
                }
            ])
            .png()
            .toBuffer();

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
            description,
            prompt_used: fullPrompt,
            user_prompt: user_prompt || '',
            style: style || 'Bold & Graphic',
            aspect_ratio: aspect_ratio || '16:9',
            color_scheme: color_scheme || 'vibrant',
            image_url: uploadResult.secure_url,
            referenceImageUrl: referenceImageUrl || null,
            text_overlay: true,
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
        console.error('[generateWithFlux] Full Error:', error);
        return res.status(500).json({ message: 'Failed to generate thumbnail.', error: error.message });
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
