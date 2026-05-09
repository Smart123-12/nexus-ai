const router = require('express').Router();
const axios = require('axios');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    return getDemoInsights(); // fallback demo data
  }
  const { data } = await axios.post(`${GEMINI_URL}?key=${key}`, {
    contents: [{ parts: [{ text: prompt }] }]
  });
  return data.candidates[0].content.parts[0].text;
}

function getDemoInsights() {
  return `📊 **AI Business Analysis**

**Revenue Insights:**
- Revenue is trending upward with 18.4% quarterly growth
- Enterprise segment shows strongest momentum at +41%
- Recommended: Launch premium tier at ₹7,999/month

**Risk Alerts:**
- Starter plan churn increased 0.4% — launch re-engagement campaign
- Bing Ads underperforming (ROAS 3.2x) — consider pausing

**Opportunities:**
- Instagram Ads: Lowest CPC at ₹0.65 — reallocate 30% budget
- Annual billing upsell: Expected +18% ARR improvement
- Enterprise CSM program: Estimated +25% Enterprise retention

**Action Priority:**
1. Increase Google Ads budget (+20%)
2. Launch Starter retention campaign
3. Test Enterprise premium tier`;
}

router.post('/', async (req, res) => {
  try {
    const { uploadId, businessData, type = 'general' } = req.body;
    const prompt = `You are a business intelligence AI analyst. Analyze this business data and provide:
1. Key insights and trends
2. Risk factors
3. Growth opportunities  
4. Specific actionable recommendations

Business Data: ${JSON.stringify(businessData || 'Demo business dataset with ₹1.05M revenue, 4289 customers, 6.8% conversion rate')}
Analysis Type: ${type}

Provide structured, actionable insights in a business report format.`;

    const analysis = await callGemini(prompt);
    res.json({ success: true, analysis, uploadId });
  } catch (err) {
    res.status(500).json({ error: err.message, analysis: getDemoInsights() });
  }
});

module.exports = router;
