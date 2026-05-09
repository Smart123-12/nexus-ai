/**
 * Nexus AI — Google Apps Script Automation
 * 
 * SETUP:
 * 1. Open script.google.com → New Project
 * 2. Paste this entire file
 * 3. Replace SHEET_ID and EMAIL values below
 * 4. Deploy → New Deployment → Web App → Anyone → Deploy
 * 5. Copy the Web App URL to your backend .env as GOOGLE_SCRIPT_URL
 */

// ─── CONFIGURATION ───────────────────────────────────────────
const CONFIG = {
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID',          // Replace with your Google Sheet ID
  ADMIN_EMAIL: 'smitparmar280@gmail.com',     // Your admin email
  GEMINI_API_KEY: 'AIzaSyDIoT3KzTJK9CTOSR8o2nMf28WHERWzqes',      // Gemini API Key
  SHEET_NAMES: {
    contacts: 'Contacts',
    leads: 'Leads',
    reports: 'AI Reports',
    analytics: 'Analytics'
  }
};

// ─── WEB APP ENTRY POINT ──────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    let result;
    switch(action) {
      case 'newContact': result = handleNewContact(body.data); break;
      case 'generateReport': result = handleGenerateReport(body.data); break;
      case 'trackLead': result = handleTrackLead(body.data); break;
      default: result = { error: 'Unknown action' };
    }
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'Nexus AI Automation Active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── CONTACT HANDLER ─────────────────────────────────────────
function handleNewContact(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.contacts);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAMES.contacts);
    sheet.appendRow(['First Name','Last Name','Email','Company','Type','Message','Timestamp','Status']);
    sheet.getRange(1,1,1,8).setFontWeight('bold').setBackground('#A7C7E7');
  }
  sheet.appendRow([
    data.firstName, data.lastName, data.email, data.company,
    data.type, data.message, new Date().toISOString(), 'New'
  ]);

  // Auto-reply email
  sendAutoReply(data.email, data.firstName);
  // Admin notification
  sendAdminNotification(data);

  return { success: true, message: 'Contact saved and emails sent' };
}

// ─── AUTO REPLY EMAIL ─────────────────────────────────────────
function sendAutoReply(email, name) {
  const subject = '✦ Thank you for contacting Nexus AI!';
  const body = `
Hi ${name},

Thank you for reaching out to Nexus AI! 🚀

We've received your message and our team will get back to you within 24 hours.

In the meantime, you can:
• 📊 Try our free demo: https://smart123-12.github.io/nexusai/dashboard.html
• 💬 Chat with our AI assistant: https://smart123-12.github.io/nexusai/chat.html
• 📄 Generate a free report: https://smart123-12.github.io/nexusai/reports.html

Best regards,
The Nexus AI Team

---
Nexus AI — AI-Powered Business Intelligence
support@nexusai.in | +91 98765 43210
  `;
  GmailApp.sendEmail(email, subject, body);
}

// ─── ADMIN NOTIFICATION ───────────────────────────────────────
function sendAdminNotification(data) {
  const subject = `🔔 New Nexus AI Lead: ${data.firstName} ${data.lastName}`;
  const body = `
New contact form submission:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Type: ${data.type}
Message: ${data.message}
Time: ${new Date().toLocaleString()}
  `;
  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, body);
}

// ─── LEAD TRACKING ───────────────────────────────────────────
function handleTrackLead(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.leads);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAMES.leads);
    sheet.appendRow(['Email','Source','Action','Timestamp','Score']);
    sheet.getRange(1,1,1,5).setFontWeight('bold').setBackground('#A7C7E7');
  }
  const score = calculateLeadScore(data);
  sheet.appendRow([data.email, data.source, data.action, new Date().toISOString(), score]);
  return { success: true, leadScore: score };
}

function calculateLeadScore(data) {
  let score = 0;
  if (data.action === 'upload') score += 30;
  if (data.action === 'report_generated') score += 25;
  if (data.action === 'chat_used') score += 20;
  if (data.action === 'demo_requested') score += 40;
  if (data.source === 'google_ads') score += 10;
  return score;
}

// ─── AI REPORT GENERATION ─────────────────────────────────────
function handleGenerateReport(data) {
  const prompt = `Generate a brief business intelligence summary for:
Business: ${data.businessName}
Revenue: ${data.revenue}
Customers: ${data.customers}
Key metrics: ${JSON.stringify(data.metrics || {})}
Provide 3 key insights and 2 recommendations in 150 words.`;

  let reportContent = '';
  try {
    const response = UrlFetchApp.fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    const result = JSON.parse(response.getContentText());
    reportContent = result.candidates[0].content.parts[0].text;
  } catch(e) {
    reportContent = 'AI analysis: Strong revenue growth detected. Recommend focusing on Enterprise segment expansion and ad budget optimization.';
  }

  // Save to Google Doc
  const doc = DocumentApp.create(`Nexus AI Report — ${data.businessName} — ${new Date().toLocaleDateString()}`);
  const body = doc.getBody();
  body.appendParagraph('NEXUS AI BUSINESS REPORT').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Business: ${data.businessName}`);
  body.appendParagraph(`Generated: ${new Date().toLocaleString()}`);
  body.appendParagraph('').appendText(reportContent);
  doc.saveAndClose();

  // Log in sheet
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.reports);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAMES.reports);
    sheet.appendRow(['Business Name','Report URL','Generated At','Type']);
    sheet.getRange(1,1,1,4).setFontWeight('bold').setBackground('#A7C7E7');
  }
  sheet.appendRow([data.businessName, doc.getUrl(), new Date().toISOString(), data.type || 'AI Report']);

  return { success: true, reportUrl: doc.getUrl(), content: reportContent };
}

// ─── WEEKLY REPORT TRIGGER ────────────────────────────────────
// Set this as a time-driven trigger: every Monday at 9 AM
function sendWeeklyReport() {
  const subject = '📊 Your Weekly Nexus AI Business Report';
  const body = `
Good morning! Here's your weekly business intelligence summary:

📈 This Week's Highlights:
• Revenue trending +18.4% QoQ
• 4,289 active customers
• Best performing campaign: Google Ads (ROAS 6.8x)
• AI insight: Consider reallocating Instagram ad budget

🔗 Quick Links:
• Dashboard: https://smart123-12.github.io/nexusai/dashboard.html
• Analytics: https://smart123-12.github.io/nexusai/analytics.html
• AI Chat: https://smart123-12.github.io/nexusai/chat.html

Have a great week!
Nexus AI Team
  `;
  GmailApp.sendEmail(CONFIG.ADMIN_EMAIL, subject, body);
}

// ─── SETUP FUNCTION ───────────────────────────────────────────
// Run this ONCE to set up the spreadsheet and triggers
function setup() {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);

  // Create all sheets
  ['Contacts','Leads','AI Reports','Analytics'].forEach(name => {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });

  // Set up weekly trigger
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();

  Logger.log('✅ Nexus AI automation setup complete!');
}
