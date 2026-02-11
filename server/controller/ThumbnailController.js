import path from 'path';
import ai from '../configs/ai.js';
import Thumbnail from '../models/Thumbnail.js';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import fs from 'fs';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style'
};

const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic'
};

export const generateThumbnail = async (req, res) => {
    let thumbnailId;
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme, text_overlay } = req.body;

        const thumbnail = await Thumbnail.create({
            userId,
            title,
            prompt_used: user_prompt,
            user_prompt,
            style,
            aspect_ratio,
            color_scheme,
            text_overlay,
            isGenerating: true 
        });
        thumbnailId = thumbnail._id;
        
        const model = 'gemini-3-pro-image-preview';
        const generationConfig = {
            maxOutputTokens: 32768,
            temperature: 1,
            topP: 0.95,
            responseModalities: ['IMAGE'],
            imageConfig: {
                aspectRatio: aspect_ratio || '16:9',
                imageSize: '1K'
            },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.OFF },
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.OFF }
            ]
        };

        let prompt = `Create a ${stylePrompts[style]} for: "${title}".`;

        if(color_scheme) {
            prompt += `Use a ${colorSchemeDescriptions[color_scheme]} color scheme.`;
        }

        if(user_prompt) {
            prompt += `Additional details: ${user_prompt}.`;
        }

        prompt += `The thumbnail should be ${aspect_ratio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;

        // Generate the image using the ai model
        const response = await ai.models.generateContent({
            model,
            contents: [prompt],
            config: generationConfig
        });

        // check if the response is valid
        const candidates = response.candidates || response.candidate;

        if(!candidates?.[0]?.content?.parts){
            throw new Error('Unexpected response')
        }

        const parts = candidates[0].content.parts;
        let finalBuffer = null;

        for(const part of parts){
            if(part.inlineData){
                finalBuffer = Buffer.from(part.inlineData.data, 'base64');
            }
        }

        if(!finalBuffer) {
            throw new Error('Failed to generate image buffer');
        }

        const filename = `final-output-${Date.now()}.png`;
        const filepath = path.join('images', filename);

        // Create the image directory if it does't exist
        fs.mkdirSync('images',{recursive:true})

        // Write the final image to the file
        fs.writeFileSync(filepath,finalBuffer);
        
        const uploadResult = await cloudinary.uploader.upload
        (filepath, {resource_type: 'image'})
         
        thumbnail.image_url = uploadResult.url;
        thumbnail.isGenerating = false;
        await thumbnail.save()

        res.json({message: 'Thumbnail Generated', thumbnail})
        // remove image file from disk
        fs.unlinkSync(filepath)

    } catch (error) {
        console.error(error);
        
        // Delete the incomplete thumbnail entry if it exists
        if (thumbnailId) {
            await Thumbnail.findByIdAndDelete(thumbnailId);
        }

        if (error.status === 429 || error.status === 503) {
            return res.status(429).json({ message: "Service is busy or quota exceeded. Please try again in 30-60 seconds." });
        }

        res.status(500).json({ message:'Failed to generate thumbnail' });
    }
};

export const deleteThumbnail =async(req,res)=>{
    try {
        const {id}= req.params;
        const {userId} = req.session;

        await Thumbnail.findByIdAndDelete({_id: id,userId})
        res.json({message: 'Thumbnail deleted successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}
