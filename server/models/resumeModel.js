import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        userEmail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: 'Untitled Resume',
        },
        resumeData: {
            type: Object,
            required: true,
        },
        templateType: {
            type: String,
            default: 'modern',
        },
    },
    {
        timestamps: true,
    }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;

