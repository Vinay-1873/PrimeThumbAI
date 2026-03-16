import express from 'express';
import { generateWithFlux, getStatus } from '../controller/LoraController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const LoraRouter = express.Router();

// POST /api/lora/generate  — generate thumbnail via FLUX.1-schnell (with optional reference image)
LoraRouter.post('/generate', protect, upload.single('referenceImage'), generateWithFlux);

// GET  /api/lora/status/:jobId  — get job result
LoraRouter.get('/status/:jobId', protect, getStatus);

export default LoraRouter;
