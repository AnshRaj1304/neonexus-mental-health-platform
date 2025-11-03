import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Globe, AlertCircle, Heart, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import { Navigation, Card, Button, ToastContainer } from '../components/ui';
import { ChatMessage, User as UserType, Language } from '../types';
import { useToast } from '../hooks/useToast';

interface ChatBotProps {
  user?: UserType;
  onLogout?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({
  user,
  onLogout,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.profile?.fullName?.split(' ')[0] || 'there'}! I'm here to provide you with mental health support and guidance. How are you feeling today?`,
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ur' as Language, name: 'اردو', flag: '🇵🇰' },
    { code: 'ks' as Language, name: 'कॉशुर', flag: '🏔️' },
    { code: 'doi' as Language, name: 'डोगरी', flag: '🏔️' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle scroll to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isNearBottom && messages.length > 1);
    }
  };

  // Only auto-scroll when new messages are added, not on initial load
  useEffect(() => {
    // Skip auto-scroll for the initial welcome message
    if (messages.length > 1) {
      // Only auto-scroll if user is already near bottom
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (isNearBottom) {
          setTimeout(scrollToBottom, 100);
        }
      }
    }
  }, [messages]);

  const mockResponses = {
    en: {
      stress: "I understand you're feeling stressed. Here are some techniques that might help: Take deep breaths for 5 minutes, try progressive muscle relaxation, or listen to calming music. Would you like me to guide you through a breathing exercise?",
      anxiety: "Anxiety is a common experience, especially for students. Let's try some grounding techniques: Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
      sad: "I can sense you're feeling sad. Remember, it's okay to feel this way. Your emotions are valid. Would you like to talk about what's making you feel this way, or would you prefer some uplifting activities?",
      help: "I'm here to help you. You can book an appointment with our counselors, explore our resource library, connect with peer support, or continue chatting with me about whatever is on your mind.",
      crisis: "I'm very concerned about you. Please reach out to someone immediately. You're not alone in this.",
      default: "I hear you. Can you tell me more about how you're feeling? I'm here to listen and support you."
    },
    hi: {
      stress: "मैं समझ सकता हूँ कि आप तनाव महसूस कर रहे हैं। कुछ तकनीकें जो मदद कर सकती हैं: 5 मिनट तक गहरी सांस लें, प्रगतिशील मांसपेशी विश्राम करें, या शांत संगीत सुनें।",
      anxiety: "चिंता एक सामान्य अनुभव है। आइए कुछ शांत करने वाली तकनीकों को आज़माएं: 5 चीजें देखें, 4 चीजें छूएं, 3 आवाजें सुनें।",
      sad: "मुझे पता है कि आप उदास महसूस कर रहे हैं। याद रखें, ऐसा महसूस करना ठीक है। क्या आप इसके बारे में बात करना चाहेंगे?",
      help: "मैं यहाँ आपकी मदद के लिए हूँ। आप हमारे काउंसलर से अपॉइंटमेंट बुक कर सकते हैं या हमारे संसाधनों को देख सकते हैं।",
      crisis: "मैं आपके बारे में बहुत चिंतित हूँ। कृपया तुरंत किसी से संपर्क करें। आप अकेले नहीं हैं।",
      default: "मैं आपकी बात सुन रहा हूँ। आप और बताएं कि आप कैसा महसूस कर रहे हैं?"
    },
    ur: {
      stress: "میں سمجھ سکتا ہوں کہ آپ دباؤ میں ہیں۔ کچھ تکنیکیں جو مدد کر سکتی ہیں: 5 منٹ گہری سانس لیں، پٹھوں کو آرام دیں۔",
      anxiety: "پریشانی ایک عام تجربہ ہے۔ آئیے کچھ سکون بخش تکنیکیں آزمائیں۔",
      sad: "میں جانتا ہوں کہ آپ اداس محسوس کر رہے ہیں۔ یاد رکھیں، ایسا محسوس کرنا ٹھیک ہے۔",
      help: "میں یہاں آپ کی مدد کے لیے ہوں۔ آپ ہمارے کونسلر سے ملاقات بک کر سکتے ہیں۔",
      crisis: "میں آپ کے بارے میں بہت فکر مند ہوں۔ برائے کرم فوری طور پر کسی سے رابطہ کریں۔",
      default: "میں آپ کی بات سن رہا ہوں۔ آپ اور بتائیں کہ آپ کیسا محسوس کر رہے ہیں؟"
    },
    ks: {
      stress: "بہ سمجھان چھُس کہ توہہ تناؤ محسوس کران چھیو۔ یمہ کانہہ تکنیک چھیہ یوس مدد کرہ سکان: 5 منٹہ گہری سانس نیو، یا پھر آرام والی موسیقی بونو۔",
      anxiety: "پریشانی چھیہ آم تجربہ، خاص کر طالب علمو کہ۔ یہ کانہہ ذہن آرام کرنہ والی تکنیکہ آزماؤ: 5 چیزہ وچھو، 4 چیزہ چھُو، 3 چیزہ بونو۔",
      sad: "بہ سمجھان چھُس کہ توہہ اداس محسوس کران چھیو۔ یاد تھاوو، یہ محسوس کرن چھُ ٹھیک۔ کیا توہہ اتھ کینہہ وننا چھو یا پھر کانہہ خوشی والی سرگرمی کرنا چھو؟",
      help: "بہ یتھ چھُس تہندی مدد کرنہ خاطرہ۔ توہہ اسان کاؤنسلرو سان وقت مقرر کرہ ہیکو، یا پھر اسان وسائل ویچھہ ہیکو۔",
      crisis: "بہ تہندے بارے میں واریاہ فکر چھُس۔ مہربانی کرتھ فوری طور پر کنہہ نہ کنہہ سان رابطہ کرو۔ توہہ اکیلہ نہ چھیو۔",
      default: "بہ تہندی گل بوزان چھُس۔ توہہ مہربانی کرتھ دسو کہ توہہ کیتھ محسوس کران چھیو؟"
    },
    doi: {
      stress: "मैं समझ सकदा ہیں की تुसीं تनاव महसूस کरدے ओ۔ کئی تکنیک ہن جیहडی مدد کرن: 5 मिनٹ گھیری सانس لینے کیں, हीکہ کरکے اپنیاں ماسپیشیاں نوں آرام دینے۔",
      anxiety: "گھبراہट زروری گل ہے، خاس کرکے نوجواناں کہتے یا طالب علماں کہتے۔ کئی من نوں شانزیں تکنیکاں کریک: 5 چیزاں دیکھیک, 4 چیزاں چھوہیک, 3 آوازاں بونیک۔",
      sad: "मैं جاندा ہیں की تुسीن اداسی محسوس کردے ओ۔ یاد راکھیک, اسہ محسوس کرن بریک گل نیں ہے۔ تمہ اپنے اہساس اسہ بارے گل کرنا چاہوں دے یا پھر کئی خوشی والی گتیودھی کرنا چاہوں دے؟",
      help: "मैं تہاڈی مدد لئی اوتھے ہیں۔ تسیں ساڈے کاؤنسلر کول ملاقات کر سکدے ओ, ساڈہ وسائل لائبریری دیکھ سکدے ओ۔",
      crisis: "मیں تہاڈے بارے بڑی گبھراہ؟ اور خاطر چنتا ہیں۔ کرپا کرکے فوری عقلے کسے نہ کسے کول رابطہ کریک۔ تسیں اِکے نیں ओ۔",
      default: "मیں تہاڈی گل بات بوندا ہیں۔ براہ کرم چھر دسیک کہ تسیں کتھے محسوس کردے ओ؟"
    }
  };

  const detectCrisis = (message: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'no point living', 'want to die',
      'आत्महत्या', 'मरना चाहता हूं', 'जीने का मन नहीं',
      'خودکشی', 'مرنا چاہتا ہوں',
      // Kashmiri keywords
      'ختم کرُن', 'مرنہ ہیکیں', 'جیندچی خاطر کینہ مطلب',
      // Dogri keywords
      'मरना चहुंदा', 'जीनدی खتم کرन', 'आत्महत्या'
    ];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    const responses = mockResponses[selectedLanguage];

    if (detectCrisis(userMessage)) {
      setShowCrisisModal(true);
      toast.warning(
        'Crisis Detected',
        'We\'re here to help. Please consider reaching out to a professional immediately.'
      );
      return responses.crisis;
    }

    if (message.includes('stress') || message.includes('तनाव') || message.includes('دباؤ') || 
        message.includes('تناو') || message.includes('तनाव')) {
      return responses.stress;
    }
    if (message.includes('anxiety') || message.includes('चिंता') || message.includes('پریشانی') ||
        message.includes('پریشانی') || message.includes('گھبراہट')) {
      return responses.anxiety;
    }
    if (message.includes('sad') || message.includes('उदास') || message.includes('اداس') ||
        message.includes('اداس') || message.includes('उदास')) {
      return responses.sad;
    }
    if (message.includes('help') || message.includes('मदد') || message.includes('مدد') ||
        message.includes('مددہ') || message.includes('मدد')) {
      return responses.help;
    }

    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(inputMessage),
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickReplies = {
    en: [
      "I'm feeling stressed about exams",
      "I need help with anxiety",
      "I'm feeling lonely",
      "Can you help me sleep better?",
    ],
    hi: [
      "मैं परीक्षा को लेकर तनाव में हूं",
      "मुझे चिंता से मदद चाहिए",
      "मैं अकेलापन महसूस कर रहा हूं",
      "क्या आप बेहतर नींद में मदद कर सकते हैं?",
    ],
    ur: [
      "امتحان کے لیے پریشان ہوں",
      "پریشانی میں مدد چاہیے",
      "تنہائی محسوس کر رہا ہوں",
      "بہتر نیند کے لیے مدد چاہیے",
    ],
    ks: [
      "بہ امتحانو کہ بارے میں تناؤ محسوس کران چھُس",
      "بہ پریشانی کہ بارے میں مدد لوٹان",
      "بہ اکیلہ محسوس کران چھُس",
      "کیا تو بہتر نیند لینہ میں مدد کرہ ہیکہ۔",
    ],
    doi: [
      "मیں امتحاناں دی وجہ کن تناع मحسوس کردا ओ",
      "मیں گھبراہट لئی مدد لوڑدا ہیں",
      "मیں اکیلپن محسوس کردا ओ",
      "کی توں بہتر نیند لئی مدد کر ساکدا ہیں؟",
    ]
  };

  const CrisisModal = (): React.JSX.Element | null => {
    if (!showCrisisModal) {
      return null;
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card padding="lg" className="max-w-md w-full bg-red-50 border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-4">
              We're Here for You
            </h3>
            <p className="text-red-700 mb-6">
              It sounds like you're going through a really difficult time. Please reach out for immediate support.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Emergency Helpline</span>
                </div>
                <span className="font-semibold text-red-600">102</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="font-medium">Mental Health Helpline</span>
                </div>
                <span className="font-semibold text-red-600">1800-233-3330</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/appointments')}
              >
                Talk to Counselor Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCrisisModal(false)}
              >
                Continue Chat
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        userRole="student"
        userName={user?.profile?.fullName || 'Student'}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-neon-lavender-500 to-neon-blue-500 rounded-xl p-6 text-white mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-pulse">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Chat Support</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-blue-100">Online - Ready to help you</p>
                </div>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    selectedLanguage === lang.code 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'bg-white bg-opacity-10 text-blue-100 hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card padding="sm" className="h-[calc(100vh-300px)] min-h-[500px] flex flex-col transform transition-all duration-300">
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth relative"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-neon-blue-500 text-white' 
                            : 'bg-neon-lavender-500 text-white'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-neon-blue-500 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-neon-lavender-500 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-lg rounded-bl-none">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Scroll to bottom button */}
                {showScrollButton && (
                  <div className="sticky bottom-4 right-4 flex justify-end">
                    <button
                      onClick={scrollToBottom}
                      className="bg-neon-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-neon-blue-600 transition-all duration-200 animate-bounce"
                      title="Scroll to bottom"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message here..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-lavender-200 focus:border-neon-lavender-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Replies */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Replies</h3>
              <div className="space-y-2">
                {quickReplies[selectedLanguage].map((reply: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(reply)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </Card>

            {/* Help Options */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 mb-4">Need More Help?</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/appointments')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Book Counselor Session
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/resources')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Browse Resources
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/forum')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </Card>

            {/* Safety Notice */}
            <Card padding="md" className="bg-blue-50 border-blue-200">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-800 mb-2">Remember</h4>
                <p className="text-sm text-blue-700">
                  This AI is here to provide support, but in case of emergency, please contact professional help immediately.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <CrisisModal />
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
};

export default ChatBot;