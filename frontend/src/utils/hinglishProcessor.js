/**
 * Hinglish & Bilingual Speech Processor
 * Handles mixed Hindi (Devanagari) + English (Latin) live transcription.
 * 
 * Accurately transforms browser phonetic transcripts into clean mixed script:
 * e.g. "हेलो क्या मेरी आवाज आ रही है आर यू एबल टू लिसन मी" -> "हेलो क्या मेरी आवाज आ रही है are you able to listen me"
 */

// 1. Common English Multi-Word Phrases transcribed phonetically in Devanagari or mixed script
const PHRASE_MAPPINGS = [
  // Flexible patterns matching Devanagari, English, and hybrid outputs
  { dev: /आर\s+(?:यू|यु|you)\s+(?:एबल|able)\s+(?:टू|टु|to)\s+(?:लिसन|listen)\s+(?:मी|में|me)/gi, eng: 'are you able to listen me' },
  { dev: /आर\s+(?:यू|यु|you)\s+(?:एबल|able)\s+(?:टू|टु|to)\s+(?:हियर|hear)\s+(?:मी|में|me)/gi, eng: 'are you able to hear me' },
  { dev: /आर\s+(?:यू|यु|you)\s+(?:एबल|able)\s+(?:टू|टु|to)\s+(?:लिसन|listen)/gi, eng: 'are you able to listen' },
  { dev: /आर\s+(?:यू|यु|you)\s+(?:एबल|able)\s+(?:टू|टु|to)\s+(?:हियर|hear)/gi, eng: 'are you able to hear' },
  { dev: /आर\s+(?:यू|यु|you)\s+(?:एबल|able)\s+(?:टू|टु|to)/gi, eng: 'are you able to' },
  { dev: /कैन\s+(?:यू|यु|you)\s+(?:कन्फर्म|कंफर्म|confirm)\s*(?:मी|में|me)?/gi, eng: 'can you confirm' },
  { dev: /कैन\s+(?:यू|यु|you)\s+(?:हियर|hear)\s*(?:मी|में|me)?/gi, eng: 'can you hear me' },
  { dev: /कैन\s+(?:यू|यु|you)\s+(?:लिसन|listen)\s*(?:मी|में|me)?/gi, eng: 'can you listen' },
  { dev: /कैन\s+(?:यू|यु|you)\s+(?:सी|see)\s*(?:मी|में|me)?/gi, eng: 'can you see me' },
  { dev: /एम\s+(?:आई|आय|i)\s+(?:ऑडिबल|audible)/gi, eng: 'am I audible' },
  { dev: /एम\s+(?:आई|आय|i)\s+(?:विजिबल|visible)/gi, eng: 'am I visible' },
  { dev: /आर\s+(?:यू|यु|you)\s+(?:देयर|there)/gi, eng: 'are you there' },
  { dev: /व्हाट\s+(?:इज|इस|is)\s+(?:योर|your)\s+(?:नेम|name)/gi, eng: 'what is your name' },
  { dev: /हाउ\s+आर\s+(?:यू|यु|you)/gi, eng: 'how are you' },
  { dev: /नाइस\s+(?:टू|टु|to)\s+(?:मीट|meet)\s+(?:यू|यु|you)/gi, eng: 'nice to meet you' },
  { dev: /गुड\s+(?:मॉर्निंग|morning)/gi, eng: 'good morning' },
  { dev: /गुड\s+(?:इवनिंग|evening)/gi, eng: 'good evening' },
  { dev: /गुड\s+(?:आफ्टरनून|afternoon)/gi, eng: 'good afternoon' },
  { dev: /गुड\s+(?:नाइट|night)/gi, eng: 'good night' },
  { dev: /थैंक\s+(?:यू|यु|you)\s+(?:सो|so)\s+(?:मच|much)/gi, eng: 'thank you so much' },
  { dev: /थैंक\s+(?:यू|यु|you)\s+(?:वेरी|very)\s+(?:मच|much)/gi, eng: 'thank you very much' },
  { dev: /थैंक\s+(?:यू|यु|you)/gi, eng: 'thank you' },
  { dev: /थैंक्स\s+अ\s+लॉट/gi, eng: 'thanks a lot' },
  { dev: /यू\s+आर\s+वेलकम/gi, eng: 'you are welcome' },
  { dev: /गिव\s+मी\s+वन\s+मिनट/gi, eng: 'give me one minute' },
  { dev: /गिव\s+मी\s+अ\s+मिनट/gi, eng: 'give me a minute' },
  { dev: /वेट\s+अ\s+मिनट/gi, eng: 'wait a minute' },
  { dev: /वेट\s+अ\s+सेकंड/gi, eng: 'wait a second' },
  { dev: /लेट\s+मी\s+चेक/gi, eng: 'let me check' },
  { dev: /लेट\s+मी\s+नो/gi, eng: 'let me know' },
  { dev: /आई\s+एम\s+फाइन/gi, eng: 'I am fine' },
  { dev: /आई\s+एम\s+रेडी/gi, eng: 'I am ready' },
  { dev: /आई\s+एम\s+कमिंग/gi, eng: 'I am coming' },
  { dev: /आई\s+एम\s+नॉट\s+एबल\s+टू/gi, eng: 'I am not able to' },
  { dev: /शेयर\s+योर\s+स्क्रीन/gi, eng: 'share your screen' },
  { dev: /स्क्रीन\s+शेयर/gi, eng: 'screen share' },
  { dev: /शेयर\s+स्क्रीन/gi, eng: 'share screen' },
  { dev: /ज्वाइन\s+द\s+मीटिंग/gi, eng: 'join the meeting' },
  { dev: /ज्वाइन\s+द\s+कॉल/gi, eng: 'join the call' },
  { dev: /कॉल\s+यू\s+बैक/gi, eng: 'call you back' },
  { dev: /टर्न\s+ऑन\s+योर\s+माइक/gi, eng: 'turn on your mic' },
  { dev: /टर्न\s+ऑफ\s+योर\s+माइक/gi, eng: 'turn off your mic' },
  { dev: /म्यूट\s+योर\s+माइक/gi, eng: 'mute your mic' },
  { dev: /अनम्यूट\s+योर\s+माइक/gi, eng: 'unmute your mic' },
  { dev: /अनम्यूट\s+योरसेल्फ/gi, eng: 'unmute yourself' },
  { dev: /सेंड\s+मी\s+द\s+लिंक/gi, eng: 'send me the link' },
  { dev: /ड्रॉप\s+अ\s+मैसेज/gi, eng: 'drop a message' },
  { dev: /बाय\s+द\s+वे/gi, eng: 'by the way' },
  { dev: /नो\s+प्रॉब्लम/gi, eng: 'no problem' },
  { dev: /नो\s+इशू/gi, eng: 'no issue' },
  { dev: /ऑफ\s+कोर्स/gi, eng: 'of course' },
  { dev: /एज\s+सून\s+एज\s+पॉसिबल/gi, eng: 'as soon as possible' },
  { dev: /टेक\s+योर\s+टाइम/gi, eng: 'take your time' },
  { dev: /सी\s+यू\s+सून/gi, eng: 'see you soon' },
  { dev: /हैव\s+अ\s+नाइस\s+डे/gi, eng: 'have a nice day' },
  { dev: /ऑल\s+द\s+बेस्ट/gi, eng: 'all the best' },
];

// 2. English Words commonly spoken in Hindi conversations and transcribed into Devanagari
const ENGLISH_WORD_MAPPINGS = {
  'एबल': 'able',
  'लिसन': 'listen',
  'हियर': 'hear',
  'ऑडिबल': 'audible',
  'विजिबल': 'visible',
  'स्पीक': 'speak',
  'टॉक': 'talk',
  'प्लीज': 'please',
  'सॉरी': 'sorry',
  'थैंक्स': 'thanks',
  'थैंक': 'thank',
  'वेलकम': 'welcome',
  'ओके': 'ok',
  'ओकेय': 'ok',
  'यस': 'yes',
  'नो': 'no',
  'श्योर': 'sure',
  'फाइन': 'fine',
  'राइट': 'right',
  'रॉन्ग': 'wrong',
  'कंफर्म': 'confirm',
  'कन्फर्म': 'confirm',
  'कंफर्मेशन': 'confirmation',
  'कन्फर्मेशन': 'confirmation',
  'मीटिंग': 'meeting',
  'स्क्रीन': 'screen',
  'शेयर': 'share',
  'कॉल': 'call',
  'मैसेज': 'message',
  'चैट': 'chat',
  'लिंक': 'link',
  'ईमेल': 'email',
  'मेल': 'mail',
  'प्रोजेक्ट': 'project',
  'कोड': 'code',
  'फाइल': 'file',
  'डेटा': 'data',
  'सिस्टम': 'system',
  'सॉफ्टवेयर': 'software',
  'हार्डवेयर': 'hardware',
  'लैपटॉप': 'laptop',
  'मोबाइल': 'mobile',
  'फोन': 'phone',
  'कंप्यूटर': 'computer',
  'इंटरनेट': 'internet',
  'वाईफाई': 'wifi',
  'नेटवर्क': 'network',
  'वीडियो': 'video',
  'ऑडियो': 'audio',
  'माइक': 'mic',
  'कैमरा': 'camera',
  'रिकॉर्डिंग': 'recording',
  'टेस्ट': 'test',
  'बग': 'bug',
  'एरर': 'error',
  'इशू': 'issue',
  'प्रॉब्लम': 'problem',
  'अपडेट': 'update',
  'वर्जन': 'version',
  'डॉक्यूमेंट': 'document',
  'प्रेजेंटेशन': 'presentation',
  'स्लाइड': 'slide',
  'टीम': 'team',
  'मैनेजर': 'manager',
  'क्लाइंट': 'client',
  'यूजर': 'user',
  'पासवर्ड': 'password',
  'लॉगिन': 'login',
  'लॉगआउट': 'logout',
  'साइनइन': 'sign in',
  'साइनअप': 'sign up',
  'डाउनलोड': 'download',
  'अपलोड': 'upload',
  'ऑनलाइन': 'online',
  'ऑफलाइन': 'offline',
  'कनेक्ट': 'connect',
  'डिस्कनेक्ट': 'disconnect',
  'सबमिट': 'submit',
  'कैंसिल': 'cancel',
  'कॉपी': 'copy',
  'पेस्ट': 'paste',
  'सर्च': 'search',
  'रिफ्रेश': 'refresh',
  'स्टार्ट': 'start',
  'स्टॉप': 'stop',
  'ओपन': 'open',
  'क्लोज': 'close',
  'क्लिक': 'click',
  'सेव': 'save',
  'डिलीट': 'delete',
  'एडिट': 'edit',
  'क्रिएट': 'create',
  'व्यू': 'view',
  'सेंड': 'send',
  'रिसीव': 'receive',
  'फॉलो': 'follow',
  'कंटिन्यू': 'continue',
  'पॉज': 'pause',
  'रिज्यूम': 'resume',
  'फर्स्ट': 'first',
  'सेकंड': 'second',
  'थर्ड': 'third',
  'लास्ट': 'last',
  'नेक्स्ट': 'next',
  'टुडे': 'today',
  'टुमारो': 'tomorrow',
  'यस्टरडे': 'yesterday',
  'मॉर्निंग': 'morning',
  'इवनिंग': 'evening',
  'नाइट': 'night',
  'टाइम': 'time',
  'मिनट': 'minute',
  'सेकंड्स': 'seconds',
  'आवर्स': 'hours',
  'ऑफिस': 'office',
  'होम': 'home',
  'वर्क': 'work',
  'टास्क': 'task',
  'स्टेटस': 'status',
  'रेडी': 'ready',
  'वेट': 'wait',
  'चेक': 'check',
  'हैलो': 'hello',
};

// Pure Hindi stopwords / common native Hindi words that must NEVER be converted to English
const NATIVE_HINDI_PROTECTED = new Set([
  'क्या', 'मेरी', 'आवाज', 'आ', 'रही', 'है', 'हैं', 'हो', 'हूँ',
  'नमस्ते', 'कैसे', 'कैसा', 'कैसी', 'कहाँ', 'कब', 'क्यों', 'कौन',
  'हम', 'आप', 'मैं', 'तुम', 'यह', 'वह', 'ये', 'वे',
  'का', 'की', 'के', 'में', 'से', 'पर', 'को', 'तक', 'ने', 'और', 'या', 'भी', 'तो',
  'खाना', 'पानी', 'घर', 'काम', 'बात', 'सुन', 'सुना', 'रहा', 'रहे',
  'था', 'थी', 'थे', 'नहीं', 'मत', 'बहुत', 'अच्छा', 'अच्छी', 'अच्छे', 'ठीक',
  'दो', 'देना', 'लेना', 'किया', 'करते', 'करेंगे', 'करना', 'जाना', 'आना',
  'लोग', 'दिन', 'साल', 'महीना', 'बातें', 'बताओ', 'बोलो', 'सुनो', 'देखो', 'रखो',
  'मुझे', 'सकते', 'सकता', 'सकती',
]);

/**
 * Format mixed Hindi + English speech in real-time.
 * - Detects English phrases phonetically written in Devanagari and replaces them with English Latin text.
 * - Preserves authentic Hindi Devanagari words untouched.
 * - Nicely formats punctuation and spacing between scripts.
 */
export function formatMixedHindiEnglish(text) {
  if (!text || typeof text !== 'string') return '';

  let formatted = text;

  // Step 1: Replace known multi-word phrases first
  for (const phrase of PHRASE_MAPPINGS) {
    formatted = formatted.replace(phrase.dev, phrase.eng);
  }

  // Step 2: Tokenize and handle isolated English words
  const tokens = formatted.split(/(\s+)/);
  const processedTokens = tokens.map((token) => {
    // Preserve whitespace
    if (/^\s+$/.test(token)) return token;

    // Extract core word and punctuation
    const match = token.match(/^([^\w\u0900-\u097F]*)([\w\u0900-\u097F]+)([^\w\u0900-\u097F]*)$/);
    if (!match) return token;

    const [, leadingPunct, coreWord, trailingPunct] = match;

    // If word is protected Hindi word, keep as is
    if (NATIVE_HINDI_PROTECTED.has(coreWord)) {
      return token;
    }

    // Check if word is in English loanwords dictionary
    if (ENGLISH_WORD_MAPPINGS[coreWord]) {
      return leadingPunct + ENGLISH_WORD_MAPPINGS[coreWord] + trailingPunct;
    }

    return token;
  });

  formatted = processedTokens.join('');

  // Step 3: Clean up spacing between Devanagari and English words
  formatted = formatted
    .replace(/([\u0900-\u097F])([A-Za-z])/g, '$1 $2')
    .replace(/([A-Za-z])([\u0900-\u097F])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return formatted;
}
