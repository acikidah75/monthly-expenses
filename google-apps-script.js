// ============================================================
// Monthly Expenses Tracker — Google Apps Script Backend
// ============================================================
// HOW TO DEPLOY:
// 1. Open your Google Sheet → Extensions → Apps Script
// 2. Replace ALL existing code with this file's contents
// 3. Click Deploy → Manage Deployments → New Deployment
//    (or update existing deployment)
// 4. Set "Execute as: Me" and "Who has access: Anyone"
// 5. Copy the Web App URL and paste it into the app's Cloud Sync settings
// ============================================================

const SHEET_NAME_TX = 'Transactions'
const SHEET_NAME_CM = 'Commitments'
const SHEET_NAME_CAT = 'Categories'
const SHEET_NAME_SETTINGS = 'Settings'

// ── GET: return all data to the frontend ──────────────────────
function doGet(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet()

    const result = {
        transactions: readSheet(ss, SHEET_NAME_TX),
        commitments: readSheet(ss, SHEET_NAME_CM),
        categories: readSheet(ss, SHEET_NAME_CAT),
        settings: readSheet(ss, SHEET_NAME_SETTINGS)
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
}

// ── POST: receive data from the frontend ─────────────────────
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents)
        const ss = SpreadsheetApp.getActiveSpreadsheet()

        if (data.tab === 'ALL') {
            // ── Batch replace: clear all sheets and rewrite ──────────
            if (data.transactions && Array.isArray(data.transactions)) {
                replaceSheet(ss, SHEET_NAME_TX,
                    ['Date', 'Type', 'Source/Category', 'Amount', 'Details', 'Attachment URL', 'ID'],
                    data.transactions.map(tx => [
                        tx.date || '',
                        tx.type || '',
                        tx.category || tx.source || '',
                        tx.amount || 0,
                        tx.description || '',
                        tx.attachment || '',
                        tx.id || ''
                    ])
                )
            }

            if (data.commitments && Array.isArray(data.commitments)) {
                replaceSheet(ss, SHEET_NAME_CM,
                    ['Name', 'Estimated Amount', 'Category', 'ID'],
                    data.commitments.map(cm => [
                        cm.name || '',
                        cm.estimatedAmount || 0,
                        cm.category || '',
                        cm.id || ''
                    ])
                )
            }

            if (data.categories && Array.isArray(data.categories)) {
                replaceSheet(ss, SHEET_NAME_CAT,
                    ['Code', 'Description', 'LHDN Segment', 'ID'],
                    data.categories.map(cat => [
                        cat.code || '',
                        cat.description || '',
                        cat.lhdn || '',
                        cat.id || ''
                    ])
                )
            }

            if (data.settings) {
                replaceSheet(ss, SHEET_NAME_SETTINGS,
                    ['Setting Type', 'Cloud URL', 'Last Sync', 'App Version', 'Timestamp'],
                    [[
                        'app_config',
                        data.settings.cloudUrl || '',
                        data.settings.lastSync || '',
                        data.settings.appVersion || '',
                        new Date().toISOString()
                    ]]
                )
            }

        } else if (data.tab === 'Transactions') {
            // ── Single transaction upsert ────────────────────────────
            upsertRow(ss, SHEET_NAME_TX,
                ['Date', 'Type', 'Source/Category', 'Amount', 'Details', 'Attachment URL', 'ID'],
                [data.date || '', data.type || '', data.category || data.source || '',
                data.amount || 0, data.description || '', data.attachment || '', data.id || ''],
                'ID', data.id
            )

        } else if (data.tab === 'Commitments') {
            upsertRow(ss, SHEET_NAME_CM,
                ['Name', 'Estimated Amount', 'Category', 'ID'],
                [data.name || '', data.estimatedAmount || 0, data.category || '', data.id || ''],
                'ID', data.id
            )

        } else if (data.tab === 'Categories') {
            upsertRow(ss, SHEET_NAME_CAT,
                ['Code', 'Description', 'LHDN Segment', 'ID'],
                [data.code || '', data.description || '', data.lhdn || '', data.id || ''],
                'ID', data.id
            )

        } else if (data.tab === 'Settings') {
            upsertRow(ss, SHEET_NAME_SETTINGS,
                ['Setting Type', 'Cloud URL', 'Last Sync', 'App Version', 'Timestamp'],
                ['app_config', data.cloudUrl || '', data.lastSync || '', data.appVersion || '', new Date().toISOString()],
                'Setting Type', 'app_config'
            )
        }

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'ok' }))
            .setMimeType(ContentService.MimeType.JSON)

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
            .setMimeType(ContentService.MimeType.JSON)
    }
}

// ── Helper: read a sheet into array of objects ───────────────
function readSheet(ss, sheetName) {
    const sheet = ss.getSheetByName(sheetName)
    if (!sheet) return []

    const data = sheet.getDataRange().getValues()
    if (data.length < 2) return []

    const headers = data[0]
    return data.slice(1).map(row => {
        const obj = {}
        headers.forEach((h, i) => { obj[h] = row[i] })
        return obj
    })
}

// ── Helper: clear sheet and rewrite with fresh data ──────────
function replaceSheet(ss, sheetName, headers, rows) {
    let sheet = ss.getSheetByName(sheetName)
    if (!sheet) {
        sheet = ss.insertSheet(sheetName)
    } else {
        sheet.clearContents()
    }

    sheet.appendRow(headers)
    rows.forEach(row => sheet.appendRow(row))
}

// ── Helper: upsert a single row by key column ────────────────
function upsertRow(ss, sheetName, headers, rowData, keyCol, keyVal) {
    let sheet = ss.getSheetByName(sheetName)
    if (!sheet) {
        sheet = ss.insertSheet(sheetName)
        sheet.appendRow(headers)
    }

    const data = sheet.getDataRange().getValues()
    const colData = data[0]
    const keyIdx = colData.indexOf(keyCol)

    if (keyIdx === -1) {
        // Sheet exists but missing header — rewrite headers first
        sheet.clearContents()
        sheet.appendRow(headers)
        sheet.appendRow(rowData)
        return
    }

    // Check if row with same key already exists
    for (let i = 1; i < data.length; i++) {
        if (data[i][keyIdx] && data[i][keyIdx].toString() === keyVal.toString()) {
            // Update existing row in place
            const range = sheet.getRange(i + 1, 1, 1, rowData.length)
            range.setValues([rowData])
            return
        }
    }

    // Not found — append new row
    sheet.appendRow(rowData)
}
