/**
 * RailQuick — Google Apps Script Web App
 * Deploy this as a Web App (Execute as: Me, Access: Anyone)
 * Then copy the deployment URL and paste into App.jsx SHEET_URL constant.
 *
 * Setup steps:
 * 1. Open your Google Sheet
 * 2. Extensions > Apps Script
 * 3. Delete all existing code and paste this entire file
 * 4. Click "Deploy" > "New deployment"
 * 5. Type: Web App
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Click Deploy, authorise, copy the URL
 * 9. Paste the URL into App.jsx where it says YOUR_APPS_SCRIPT_URL
 */

const SPREADSHEET_ID = '1Q_H4oaL5NHXXm_FTMCcm6II1y0yCk1is-Ux6LxmE8HY';

function doPost(e) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getActiveSheet();

        // Write headers if first row is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Timestamp', 'https://sheetdb.io/api/v1/6z3vh2kf9d5g5', 'Customer Name', 'Seat / Berth',
                'Mobile', 'Items Ordered', 'Total (₹)', 'Train No.'
            ]);
            sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#0C831F').setFontColor('#ffffff');
        }

        const data = JSON.parse(e.postData.contents);
        const items = data.items.map(i => `${i.name} x${i.qty}`).join(' | ');

        sheet.appendRow([
            new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            data.orderId || '',
            data.name || '',
            data.seat || '',
            data.contact || '',
            items || '',
            data.grand || 0,
            data.trainNo || ''
        ]);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet() {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', message: 'RailQuick API is running' }))
        .setMimeType(ContentService.MimeType.JSON);
}
