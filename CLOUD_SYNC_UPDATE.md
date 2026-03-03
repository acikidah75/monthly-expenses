# Cloud Sync Update - Settings Support

## What's New

The "Push All Data to Cloud" feature now includes **Settings** data along with Transactions, Categories, and Commitments.

## What Gets Synced

### 1. Transactions Sheet
- All income and expense records
- Date, Type, Category, Amount, Details, Attachments, ID

### 2. Categories Sheet  
- Custom expense categories
- Code, Description, LHDN Segment, ID

### 3. Commitments Sheet
- Monthly commitment definitions
- Name, Estimated Amount, Category, ID

### 4. Settings Sheet (NEW)
- App configuration data
- Cloud URL, Last Sync timestamp, App Version
- **Note:** Passcode is NOT synced for security reasons

## Backend Changes

Updated `google-apps-script.js` to handle the new Settings sheet:
- Added `SHEET_NAME_SETTINGS` constant
- Updated `doGet()` to return settings data
- Updated `doPost()` to handle settings in batch operations
- Added individual settings sync support

## Frontend Changes

Updated `useFinance.js`:
- Modified `pushAllToCloud()` to include settings data
- Updated `fetchFromCloud()` to handle settings (read-only for security)
- Enhanced success message to mention all 4 data types

Updated `CloudSync.jsx`:
- Added detailed "What gets synced?" section
- Updated button text and descriptions
- Clarified that Settings are included in sync

## Security Notes

- **Passcode is never synced** to the cloud for security
- Settings sync is primarily for app configuration and timestamps
- Cloud URL is synced to help with multi-device setup

## Usage

1. Click "🚀 Push All Data to Cloud" 
2. All 4 data types (Transactions, Categories, Commitments, Settings) will be synced
3. Google Sheets will have 4 separate sheets with organized data
4. Success message confirms all data types were pushed

## Google Sheets Structure

Your Google Sheet will now have these sheets:
- **Transactions** - Financial records
- **Categories** - Expense categories  
- **Commitments** - Monthly commitments
- **Settings** - App configuration (NEW)