const router = require('express').Router();

// GET /api/dashboard — returns all dashboard KPI data
router.get('/', (req, res) => {
  res.json({
    kpis: {
      revenue: { value: 105000, change: 18.4, up: true, label: 'Total Revenue' },
      customers: { value: 4289, change: 12.1, up: true, label: 'Customers' },
      conversion: { value: 6.8, change: 0.9, up: true, label: 'Conversion Rate' },
      churn: { value: 2.1, change: -0.4, up: false, label: 'Churn Rate' }
    },
    revenueChart: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      revenue: [42000,51000,47000,63000,58000,72000,68000,81000,75000,92000,88000,105000],
      expenses: [28000,31000,27000,38000,34000,41000,39000,44000,40000,49000,47000,55000]
    },
    products: [
      { name: 'Pro Plan', revenue: 42000, units: 210, growth: 22 },
      { name: 'Starter Plan', revenue: 18000, units: 720, growth: 8 },
      { name: 'Enterprise', revenue: 35000, units: 14, growth: 41 },
      { name: 'Add-ons', revenue: 8500, units: 380, growth: 5 }
    ],
    campaigns: [
      { name: 'Google Ads', spend: 28000, clicks: 14200, ctr: 4.2, cpc: 1.97, conversions: 482, roas: 6.8 },
      { name: 'Facebook Ads', spend: 19000, clicks: 22100, ctr: 2.8, cpc: 0.86, conversions: 311, roas: 4.9 },
      { name: 'Instagram Ads', spend: 12000, clicks: 18400, ctr: 3.5, cpc: 0.65, conversions: 224, roas: 5.3 },
      { name: 'Bing Ads', spend: 6500, clicks: 5900, ctr: 3.1, cpc: 1.10, conversions: 98, roas: 3.2 }
    ],
    aiInsights: [
      { icon: '📈', title: 'Revenue Surge', desc: 'Q4 revenue up 18.4% — Enterprise upsells accelerating.', type: 'success' },
      { icon: '⚠️', title: 'Churn Risk', desc: 'Starter plan churn up. Launch re-engagement sequence.', type: 'warning' },
      { icon: '💡', title: 'Ad Opportunity', desc: 'Instagram CPC lowest (₹0.65). Reallocate 30% budget.', type: 'info' }
    ]
  });
});

module.exports = router;
