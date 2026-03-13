import mongoose from 'mongoose';

const ThumbnailGenerationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        prompt: {
            type: String,
            required: true,
            trim: true,
        },
        loraModelId: {
            type: String,
            required: true,
        },
        jobId: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        thumbnailUrl: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

const ThumbnailGeneration =
    mongoose.models.ThumbnailGeneration ||
    mongoose.model('ThumbnailGeneration', ThumbnailGenerationSchema);

export default ThumbnailGeneration;
