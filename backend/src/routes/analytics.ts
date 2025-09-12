import express from 'express';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    analytics: {
      overview: {
        totalUsers: 2847,
        activeUsers: 1642,
        totalSessions: 8945,
        averageSessionTime: '24 minutes'
      },
      mentalHealthTrends: {
        currentWeek: {
          moodCheckIns: 1250,
          screeningCompleted: 340,
          counselorSessions: 89,
          crisisInterventions: 5
        },
        moodDistribution: {
          excellent: 12,
          good: 35,
          okay: 28,
          struggling: 18,
          crisis: 7
        }
      },
      resourceUsage: {
        mostViewedCategory: 'Stress Relief',
        totalResourceViews: 5670,
        averageRating: 4.6,
        topResources: [
          { title: 'Managing Exam Stress', views: 1250 },
          { title: 'Sleep Hygiene', views: 890 },
          { title: 'Breathing Exercises', views: 760 }
        ]
      },
      appointments: {
        totalBooked: 234,
        completed: 189,
        canceled: 12,
        noShow: 8,
        averageRating: 4.7
      },
      forumActivity: {
        totalPosts: 456,
        totalReplies: 1234,
        activeDiscussions: 89,
        peerVolunteers: 23
      }
    }
  });
});

// Get user well-being trends
router.get('/wellbeing-trends', (req, res) => {
  const { timeRange = 'week' } = req.query;
  
  res.json({
    success: true,
    trends: {
      timeRange: timeRange,
      data: [
        { date: '2025-09-01', moodAverage: 3.2, screeningScores: 8.5, engagementRate: 0.75 },
        { date: '2025-09-02', moodAverage: 3.4, screeningScores: 7.8, engagementRate: 0.82 },
        { date: '2025-01-03', moodAverage: 3.1, screeningScores: 9.1, engagementRate: 0.68 },
        { date: '2025-09-04', moodAverage: 3.6, screeningScores: 6.9, engagementRate: 0.89 },
        { date: '2025-09-05', moodAverage: 3.3, screeningScores: 8.2, engagementRate: 0.77 }
      ],
      insights: [
        'Mood scores have improved by 8% this week',
        'Crisis interventions decreased by 20%',
        'Resource engagement is highest on Tuesdays and Thursdays'
      ]
    }
  });
});

// Get counselor performance metrics
router.get('/counselors', (req, res) => {
  res.json({
    success: true,
    counselorMetrics: [
      {
        id: 1,
        name: 'Dr. Priya Sharma',
        totalSessions: 45,
        averageRating: 4.8,
        completionRate: 0.96,
        studentSatisfaction: 4.7,
        specialization: 'Anxiety & Stress'
      },
      {
        id: 2,
        name: 'Dr. Rajesh Kumar', 
        totalSessions: 38,
        averageRating: 4.9,
        completionRate: 0.94,
        studentSatisfaction: 4.8,
        specialization: 'Depression & Mood'
      }
    ]
  });
});

// Export reports
router.get('/export/:reportType', (req, res) => {
  const { reportType } = req.params;
  
  res.json({
    success: true,
    message: `${reportType} report generated successfully`,
    downloadUrl: `/api/reports/${reportType}-${Date.now()}.pdf`,
    generatedAt: new Date().toISOString()
  });
});

export default router;