import express from 'express';

const router = express.Router();

// Get all resources
router.get('/', (req, res) => {
  const { category, language } = req.query;
  
  res.json({
    success: true,
    resources: [
      {
        id: 1,
        title: 'Managing Exam Stress',
        titleHindi: 'परीक्षा तनाव प्रबंधन',
        type: 'video',
        category: 'Stress Relief',
        duration: '15 min',
        language: 'English',
        description: 'Learn effective techniques to manage exam-related stress and anxiety.',
        url: '/resources/videos/exam-stress.mp4',
        thumbnail: '/resources/thumbnails/exam-stress.jpg',
        views: 1250,
        rating: 4.7
      },
      {
        id: 2,
        title: 'Sleep Hygiene for Students',
        titleHindi: 'छात्रों के लिए नींद की स्वच्छता',
        type: 'audio',
        category: 'Sleep',
        duration: '12 min',
        language: 'Hindi',
        description: 'गुणवत्तापूर्ण नींद के लिए आवश्यक तकनीकें और सुझाव।',
        url: '/resources/audio/sleep-hygiene-hindi.mp3',
        thumbnail: '/resources/thumbnails/sleep.jpg',
        views: 890,
        rating: 4.5
      },
      {
        id: 3,
        title: 'Academic Pressure Coping Strategies',
        type: 'pdf',
        category: 'Academic Pressure', 
        language: 'English',
        description: 'Comprehensive guide to managing academic pressure and expectations.',
        url: '/resources/pdfs/academic-pressure-guide.pdf',
        thumbnail: '/resources/thumbnails/academic.jpg',
        pages: 24,
        downloads: 2100,
        rating: 4.8
      }
    ],
    categories: ['Stress Relief', 'Sleep', 'Academic Pressure', 'Anxiety', 'Depression', 'Self-Care'],
    languages: ['English', 'Hindi', 'Urdu']
  });
});

// Get resource by ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    resource: {
      id: parseInt(req.params.id),
      title: 'Managing Exam Stress',
      type: 'video',
      category: 'Stress Relief',
      duration: '15 min',
      language: 'English',
      description: 'Learn effective techniques to manage exam-related stress and anxiety.',
      url: '/resources/videos/exam-stress.mp4',
      transcript: 'Full transcript would be available here...',
      relatedResources: [2, 3]
    }
  });
});

export default router;