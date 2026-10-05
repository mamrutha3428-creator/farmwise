import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIChatAssistant: React.FC = () => {
  const { farmerProfile } = useAuth();
  const { language, currentLangConfig, t } = useI18n();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        language === 'te'
          ? `నమస్కారం! నేను ఫార్మ్‌వైజ్ AI సహాయకుడిని. మీ నేల, వాతావరణం, పంటల సాగు మరియు చీడపీడల నివారణ గురించి ఏదైనా అడగండి. మీరు టైప్ చేయవచ్చు లేదా మైక్రోఫోన్ ద్వారా మాట్లాడవచ్చు!`
          : language === 'hi'
          ? `नमस्ते! मैं फार्मवाइज AI सहायक हूँ। अपने खेत की मिट्टी, मौसम, फसलों और कीट नियंत्रण के बारे में कोई भी प्रश्न पूछें। आप लिखकर या बोलकर सवाल पूछ सकते हैं!`
          : `Hello! I am your FarmWise AI Assistant. Ask me any question about your soil, crops, pest remedies, organic manures, or harvest planning. You can type or ask by voice!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Set up Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLangConfig.voiceCode || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied.');
        } else {
          setVoiceError('Could not capture audio. Please try typing.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      recognitionRef.current = null;
    }
  }, [currentLangConfig]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      setVoiceError(t('assistantVoiceUnsupported'));
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVoiceError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleSend = async (messageText = inputMessage) => {
    const trimmed = messageText.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/farming-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          language,
          farmerContext: {
            location: farmerProfile?.locationName,
            farmSize: `${farmerProfile?.farmSizeAcres || 2} acres`,
            soilType: farmerProfile?.soilType,
            waterSource: farmerProfile?.waterSource,
            currentCrops: farmerProfile?.currentCrops,
          },
          history: messages.slice(-4),
        }),
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      const aiMsg: Message = {
        id: 'reply-' + Date.now(),
        sender: 'assistant',
        text: data.reply || t('errorGeneric'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: t('errorGeneric'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Preset quick questions based on language
  const quickPrompts =
    language === 'te'
      ? [
          'ఈ సీజన్లో ఏ పంట వేయడం మంచిది?',
          'ఆకులు పసుపు రంగులోకి మారడానికి కారణం ఏమిటి?',
          'సేంద్రియ వేప కషాయం ఎలా తయారు చేయాలి?',
          'రేపు వర్షం పడితే ఎరువులు వేయవచ్చా?',
        ]
      : language === 'hi'
      ? [
          'इस मौसम में कौन सी फसल सबसे लाभदायक रहेगी?',
          'पत्तियां पीली पड़ने का क्या कारण और उपचार है?',
          'नीम का जैविक कीटनाशक घोल कैसे बनाएं?',
          'कल बारिश की संभावना में छिड़काव करना चाहिए?',
        ]
      : [
          'Which crop is best suited for red loamy soil this season?',
          'Why are my lower crop leaves turning yellow?',
          'How do I prepare a 5% Neem seed kernel extract (NSKE)?',
          'Is it safe to spray foliar nutrients before tomorrow’s rain?',
        ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[700px] max-h-[85vh]">
      {/* Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-green-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Bot className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-serif leading-tight">
                {t('assistantTitle')}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-tight">
              {currentLangConfig.nativeName} ({currentLangConfig.name}) • Context-Aware
            </p>
          </div>
        </div>

        {farmerProfile && (
          <div className="hidden md:flex flex-col text-right text-[11px] text-emerald-200/80">
            <span>Soil: {farmerProfile.soilType.split(' ')[0]}</span>
            <span>Land: {farmerProfile.farmSizeAcres} Acres</span>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isUser ? 'ml-auto rtl:ml-0 rtl:mr-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs sm:text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                    : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none'
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-1.5 ${
                    isUser ? 'text-emerald-200 text-right' : 'text-stone-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs italic bg-white p-3 rounded-2xl w-fit border border-stone-200 shadow-sm animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>{t('actionAnalyzing')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-stone-100/60 border-t border-stone-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-bold text-stone-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          Quick:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-2.5 py-1 text-xs bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Voice error notice */}
      {voiceError && (
        <div className="px-4 py-1.5 bg-amber-50 border-t border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <span>{voiceError}</span>
          <button onClick={() => setVoiceError(null)} className="font-bold text-stone-500">
            ×
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Stop listening' : t('actionAskVoice')}
          className={`p-3 rounded-2xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
              : 'bg-stone-100 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 border border-stone-200'
          }`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={isListening ? t('actionListening') : t('assistantPlaceholder')}
          className="flex-1 px-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="p-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
