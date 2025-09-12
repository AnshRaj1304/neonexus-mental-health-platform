import express from 'express';

const router = express.Router();

// Mock chatbot conversation
router.post('/chat', (req, res) => {
  const { message, language = 'English' } = req.body;
  
  // Simple mock responses based on keywords
  let response = "I understand you're reaching out. Can you tell me more about how you're feeling?";
  
  if (message.toLowerCase().includes('stress') || message.toLowerCase().includes('तनाव')) {
    response = language === 'Hindi' ? 
      "मैं समझ सकता हूँ कि आप तनाव महसूस कर रहे हैं। क्या आप मुझे बता सकते हैं कि यह तनाव किस वजह से है?" :
      "I understand you're feeling stressed. Here are some quick techniques that might help: Take deep breaths for 5 minutes, try progressive muscle relaxation, or listen to calming music.";
  } else if (message.toLowerCase().includes('anxiety') || message.toLowerCase().includes('चिंता')) {
    response = language === 'Hindi' ?
      "चिंता एक सामान्य अनुभव है। आइए कुछ शांत करने वाली तकनीकों को आज़माएं।" :
      "Anxiety is a common experience. Let's try some grounding techniques: Name 5 things you can see, 4 things you can touch, 3 things you can hear.";
  } else if (message.toLowerCase().includes('sad') || message.toLowerCase().includes('उदास')) {
    response = language === 'Hindi' ?
      "मुझे पता है कि अभी आप उदास महसूस कर रहे हैं। क्या आप किसी मित्र या परिवार से बात करना चाहेंगे?" :
      "I can sense you're feeling sad. Remember, it's okay to feel this way. Would you like me to connect you with a counselor or suggest some mood-lifting activities?";
  } else if (message.toLowerCase().includes('help') || message.toLowerCase().includes('मदद')) {
    response = language === 'Hindi' ?
      "मैं यहाँ आपकी मदद के लिए हूँ। आप चाहें तो हमारे काउंसलर से अपॉइंटमेंट बुक कर सकते हैं या हमारे रिसोर्स सेक्शन को देख सकते हैं।" :
      "I'm here to help you. You can book an appointment with our counselors, explore our resource library, or continue chatting with me.";
  }

  res.json({
    success: true,
    response: response,
    language: language,
    timestamp: new Date().toISOString(),
    conversationId: 'conv_' + Date.now(),
    suggestions: [
      "Tell me more about this",
      "Book a counselor appointment",
      "Show me resources",
      "How do I cope with stress?"
    ]
  });
});

// Get conversation history
router.get('/history/:userId', (req, res) => {
  res.json({
    success: true,
    conversations: [
      {
        id: 'conv_123',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        messages: [
          { role: 'user', content: 'I feel stressed about exams', timestamp: new Date().toISOString() },
          { role: 'bot', content: 'I understand exam stress can be overwhelming. Let me help you with some strategies.', timestamp: new Date().toISOString() }
        ]
      }
    ]
  });
});

// Crisis detection and intervention
router.post('/crisis-check', (req, res) => {
  const { message } = req.body;
  
  // Simple keyword-based crisis detection (replace with ML model)
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'no point living'];
  const isCrisis = crisisKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );

  if (isCrisis) {
    res.json({
      success: true,
      crisis: true,
      message: "I'm concerned about you. Please reach out to someone immediately.",
      resources: {
        emergency: {
          number: "102", // India emergency number
          text: "Emergency Helpline"
        },
        mentalHealth: {
          number: "1800-233-3330",
          text: "Mental Health Helpline"
        },
        counselor: {
          available: true,
          message: "Connect with an on-call counselor now"
        }
      }
    });
  } else {
    res.json({
      success: true,
      crisis: false,
      message: "Continue conversation normally"
    });
  }
});

export default router;