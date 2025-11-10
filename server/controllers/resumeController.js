import Resume from '../models/resumeModel.js';

export async function getUserResumes(req, res) {
  try {
    const { userId } = req.params;
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resumes' });
  }
}

export async function getResumeById(req, res) {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resume'
      });
    }

    res.json({ success: true, resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resume' });
  }
}

export async function createResume(req, res) {
  try {
    const { userId, userEmail, title, resumeData, templateType } = req.body;

    // Verify the userId in body matches authenticated user
    if (userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'Cannot create resume for another user',
      });
    }

    if (!userId || !userEmail || !resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, userEmail, resumeData',
      });
    }

    const resume = new Resume({
      userId,
      userEmail,
      title: title || 'Untitled Resume',
      resumeData,
      templateType: templateType || 'modern',
    });

    await resume.save();
    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ success: false, message: 'Failed to create resume' });
  }
}

export async function updateResume(req, res) {
  try {
    const { id } = req.params;
    const { title, resumeData, templateType } = req.body;

    // First, find the resume to check ownership
    const existingResume = await Resume.findById(id);

    if (!existingResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (existingResume.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this resume'
      });
    }

    const updateData = {
      updatedAt: Date.now(),
    };

    if (title !== undefined) updateData.title = title;
    if (resumeData !== undefined) updateData.resumeData = resumeData;
    if (templateType !== undefined) updateData.templateType = templateType;

    const resume = await Resume.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume' });
  }
}

export async function deleteResume(req, res) {
  try {
    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this resume'
      });
    }

    await Resume.findByIdAndDelete(id);

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume' });
  }
}

