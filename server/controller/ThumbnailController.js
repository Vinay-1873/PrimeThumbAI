import path from 'path';
import Thumbnail from '../models/Thumbnail.js';
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
        return res.status(503).json({message: 'Thumbnail generation via this endpoint is not configured. Please use /api/lora endpoint instead.'})
    } catch (error) {
        console.error(error);
        
        if (thumbnailId) {
            await Thumbnail.findByIdAndDelete(thumbnailId);
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
