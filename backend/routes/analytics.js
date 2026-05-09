const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    marketing: {
      totalSpend: 65500,
      totalClicks: 60600,
      totalConversions: 1115,
      avgRoas: 5.1,
      platforms: [
        { name: 'Google Ads', spend: 28000, clicks: 14200, ctr: 4.2, cpc: 1.97, conversions: 482, roas: 6.8, status: 'Active' },
        { name: 'Facebook Ads', spend: 19000, clicks: 22100, ctr: 2.8, cpc: 0.86, conversions: 311, roas: 4.9, status: 'Active' },
        { name: 'Instagram Ads', spend: 12000, clicks: 18400, ctr: 3.5, cpc: 0.65, conversions: 224, roas: 5.3, status: 'Active' },
        { name: 'Bing Ads', spend: 6500, clicks: 5900, ctr: 3.1, cpc: 1.10, conversions: 98, roas: 3.2, status: 'Paused' }
      ]
    },
    funnel: [
      { stage: 'Website Visitors', count: 48200, pct: 100 },
      { stage: 'Landing Page Views', count: 32100, pct: 67 },
      { stage: 'Sign Up Started', count: 12400, pct: 26 },
      { stage: 'Trial Activated', count: 5800, pct: 12 },
      { stage: 'Paid Conversion', count: 3270, pct: 6.8 }
    ],
    abTests: [
      { name: 'Landing CTA', varA: 'Sign Up Free', varB: 'Start AI Analysis', winner: 'B', lift: '+34% conv' },
      { name: 'Pricing Display', varA: 'Monthly', varB: 'Annual with discount', winner: 'B', lift: '+18% ARR' },
      { name: 'Email Subject', varA: 'Check your report', varB: 'AI insights ready', winner: 'B', lift: '+42% open' }
    ],
    forecast: {
      labels: ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'],
      actual: [92000, 88000, 105000, null, null, null, null, null, null],
      predicted: [null, null, 105000, 112000, 118000, 126000, 133000, 141000, 150000]
    }
  });
});

module.exports = router;
