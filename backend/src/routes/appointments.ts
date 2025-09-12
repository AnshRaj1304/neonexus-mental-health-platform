import express from 'express';

const router = express.Router();

// Get available counselors
router.get('/counselors', (req, res) => {
  res.json({
    success: true,
    counselors: [
      {
        id: 1,
        name: 'Dr. Priya Sharma',
        specialization: 'Anxiety & Stress Management',
        experience: 8,
        languages: ['English', 'Hindi'],
        rating: 4.8,
        available: true,
        nextSlot: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: 2, 
        name: 'Dr. Rajesh Kumar',
        specialization: 'Depression & Mood Disorders',
        experience: 12,
        languages: ['English', 'Hindi', 'Urdu'],
        rating: 4.9,
        available: true,
        nextSlot: new Date(Date.now() + 172800000).toISOString()
      }
    ]
  });
});

// Get available time slots
router.get('/slots/:counselorId', (req, res) => {
  res.json({
    success: true,
    slots: [
      { time: '09:00', available: true, date: new Date().toDateString() },
      { time: '10:30', available: false, date: new Date().toDateString() },
      { time: '14:00', available: true, date: new Date().toDateString() },
      { time: '15:30', available: true, date: new Date().toDateString() }
    ]
  });
});

// Book appointment
router.post('/book', (req, res) => {
  res.json({
    success: true,
    message: 'Appointment booked successfully',
    appointment: {
      id: 'apt_' + Date.now(),
      counselorId: req.body.counselorId,
      date: req.body.date,
      time: req.body.time,
      isAnonymous: req.body.isAnonymous || false,
      status: 'confirmed',
      meetingType: req.body.meetingType || 'video'
    }
  });
});

export default router;