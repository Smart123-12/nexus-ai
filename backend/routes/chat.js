const router = require('express').Router();
const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const businessContext = `You are an AI business assistant for Nexus AI platform.
You have access to this demo business data:
- Total Revenue: ₹1,05,000 (Q4 2025), +18.4% growth
- Customers: 4,289 active users, +12.1% growth
- Conversion Rate: 6.8% (industry avg 3.2%)
- Churn Rate: 2.1%
- Top Product: Enterprise Plan (+41% growth)
- Ad Campaigns: Google (ROAS 6.8x), Instagram (CPC ₹0.65), Facebook (ROAS 4.9x)
- Monthly Revenue trend: Jan:42K, Feb:51K, Mar:47K, Apr:63K, May:58K, Jun:72K, Jul:68K, Aug:81K, Sep:75K, Oct:92K, Nov:88K, Dec:105K

Answer business questions concisely and actionably. Use INR for currency. Focus on practical recommendations.`;

    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      return res.json({ reply: getDemoReply(message) });
    }

    const contents = [
      { role: 'user', parts: [{ text: businessContext }] },
      { role: 'model', parts: [{ text: 'Understood. I am your AI business assistant with access to your business data. How can I help you?' }] },
      ...history.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const { data } = await axios.post(`${GEMINI_URL}?key=${key}`, { contents });
    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message, reply: getDemoReply(req.body.message) });
  }
});

function getDemoReply(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('revenue')) return '📈 Your Q4 revenue reached ₹1,05,000 — an 18.4% increase. Enterprise plan is your top growth driver at +41%. Recommend launching a premium ₹7,999/month tier.';
  if (m.includes('risk') || m.includes('problem')) return '⚠️ Key risks: (1) Starter plan churn up 0.4% — launch re-engagement campaign; (2) 43% budget on Google Ads — diversify; (3) Enterprise only 14 clients — revenue concentration risk.';
  if (m.includes('marketing') || m.includes('ads')) return '📣 Best ROAS: Google Ads at 6.8x. Instagram has lowest CPC at ₹0.65. Recommend: pause Bing Ads, reallocate ₹4,000 to Instagram. Test video format on Facebook.';
  if (m.includes('grow') || m.includes('opportunit')) return '🌟 Top opportunities: (1) Instagram budget reallocation (+ROI), (2) Annual billing launch (+18% ARR), (3) Enterprise CSM program (+25% retention), (4) Tier-2 city expansion (untapped market).';
  return '🤖 Based on your business data showing ₹1.05M quarterly revenue and 6.8% conversion rate, I recommend focusing on Enterprise segment expansion and optimizing your ad budget allocation. Would you like a detailed analysis of any specific area?';
}

module.exports = router;
