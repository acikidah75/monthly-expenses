export default function CloudSync({ cloudUrl, setCloudUrl, isSyncing, fetchFromCloud }) {
    return (
        <div className="cloud-sync glass-card fade-in">
            <h3>Cloud Storage Settings</h3>
            <p className="text-muted mt-1">
                Connect your app to Google Sheets to access your data from anywhere.
                Follow the <a href="#" style={{ color: 'var(--primary)' }}>Setup Guide</a> to get your Web App URL.
            </p>

            <div className="input-group mt-2">
                <label>Google Apps Script Web App URL</label>
                <input
                    type="text"
                    value={cloudUrl}
                    onChange={(e) => setCloudUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                />
            </div>

            <div className="flex-gap mt-1">
                <button
                    className="btn-primary"
                    onClick={fetchFromCloud}
                    disabled={!cloudUrl || isSyncing}
                >
                    {isSyncing ? '⌛ Syncing...' : '🔄 Sync Now'}
                </button>
                {cloudUrl && (
                    <span className="sync-status">
                        {isSyncing ? 'Synchronizing with cloud...' : '✅ Cloud storage connected'}
                    </span>
                )}
            </div>

            <div className="info-box mt-2">
                <h4>Why connect to Cloud?</h4>
                <ul className="mt-1">
                    <li>Access your expenses from your phone or tablet.</li>
                    <li>Your data is safely stored in your own Google Drive.</li>
                    <li>Easily export and analyze your data in Excel.</li>
                </ul>
            </div>

            <style jsx>{`
        .mt-1 { margin-top: 1rem; }
        .mt-2 { margin-top: 2rem; }
        .text-muted { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }
        .flex-gap { display: flex; align-items: center; gap: 1rem; }
        .sync-status { font-size: 0.8rem; color: var(--success); }
        .info-box {
          background: rgba(99, 102, 241, 0.05);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        .info-box h4 { color: var(--primary); }
        .info-box ul { list-style-position: inside; color: var(--text-muted); font-size: 0.9rem; }
        .info-box li { margin-bottom: 0.5rem; }
      `}</style>
        </div>
    )
}
