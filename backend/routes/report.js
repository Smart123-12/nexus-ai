const router = require('express').Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { type = 'Executive Summary', businessName = 'Demo Company', industry = 'SaaS', data } = req.body;
    const key = process.env.GEMINI_API_KEY;

    const prompt = `Generate a professional ${type} business report for ${businessName} in the ${industry} industry.
Business Data: ${JSON.stringify(data || { revenue: 105000, customers: 4289, conversion: '6.8%', churn: '2.1%' })}

Format the report with clear sections:
- Executive Summary
- Key Metrics Analysis
- Strengths & Opportunities
- Risks & Challenges
- Strategic Recommendations
- Action Items (with timeline)

Make it professional, data-driven, and actionable. Use INR for currency.`;

    let content;
    if (!key || key === 'your_gemini_api_key_here') {
      content = getDemoReport(type, businessName);
    } else {
      const { data: gData } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );
      content = gData.candidates[0].content.parts[0].text;
    }

    res.json({ success: true, report: { type, businessName, industry, content, generatedAt: new Date().toISOString() } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getDemoReport(type, biz) {
  return `# ${type} — ${biz}
Generated: ${new Date().toLocaleDateString()} | Powered by Nexus AI

## Executive Summary
${biz} demonstrated strong performance in Q4 2025 with ₹1,05,000 total revenue, representing 18.4% QoQ growth.

## Key Metrics
- Revenue: ₹1,05,000 (+18.4%)
- Customers: 4,289 (+12.1%)
- Conversion Rate: 6.8% (2x industry avg)
- Churn Rate: 2.1% (below industry avg of 5%)

## Strengths
- Enterprise segment growing at 41%
- Strong ad performance (Google ROAS 6.8x)
- Industry-leading conversion rate

## Recommendations
1. Launch Enterprise premium tier (₹7,999/month)
2. Re-engage Starter plan churners
3. Reallocate ₹4,000 from Bing to Instagram Ads
4. Test annual billing with 2-month discount

## Next Steps
- Week 1: Launch Starter retention email sequence
- Week 2: A/B test premium pricing page
- Month 1: CSM program for Enterprise clients`;
}

module.exports = router;
