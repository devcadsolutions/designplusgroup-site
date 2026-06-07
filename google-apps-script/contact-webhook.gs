const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Inquiries';
const NOTIFICATION_EMAILS = [
  'devcadsolutions@gmail.com',
  'dp.projectadmin@designplusgroup.com',
  'info@designplusgroup.com'
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheet = getSheet_();

    const submittedAt = new Date();
    const isoTimestamp = submittedAt.toISOString();

    sheet.appendRow([
      isoTimestamp,
      payload.name || '',
      payload.email || '',
      payload.phone || '',
      payload.subject || '',
      payload.message || '',
      payload.page_url || '',
      payload.user_agent || ''
    ]);

    MailApp.sendEmail({
      to: NOTIFICATION_EMAILS.join(','),
      subject: `New website inquiry: ${payload.subject || payload.name || 'Design Plus Group'}`,
      htmlBody: buildEmailHtml_(payload, isoTimestamp)
    });

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: error && error.message ? error.message : String(error)
    });
  }
}

function parsePayload_(e) {
  const params = (e && e.parameter) || {};
  return {
    name: params.name || '',
    email: params.email || '',
    phone: params.phone || '',
    subject: params.subject || '',
    message: params.message || '',
    page_url: params.page_url || '',
    user_agent: params.user_agent || ''
  };
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Submitted At',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Page URL',
      'User Agent'
    ]);
  }

  return sheet;
}

function buildEmailHtml_(payload, isoTimestamp) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;">
      <h2 style="margin:0 0 16px;">New Design Plus Group Inquiry</h2>
      <p><strong>Submitted:</strong> ${escapeHtml_(isoTimestamp)}</p>
      <p><strong>Name:</strong> ${escapeHtml_(payload.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml_(payload.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml_(payload.phone)}</p>
      <p><strong>Subject:</strong> ${escapeHtml_(payload.subject)}</p>
      <p><strong>Message:</strong><br>${escapeHtml_(payload.message).replace(/\n/g, '<br>')}</p>
      <p><strong>Page URL:</strong> ${escapeHtml_(payload.page_url)}</p>
      <p><strong>User Agent:</strong> ${escapeHtml_(payload.user_agent)}</p>
    </div>
  `;
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
