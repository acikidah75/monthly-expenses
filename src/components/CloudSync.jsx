export default function CloudSync({ cloudUrl, onUrlChange, isSyncing, onSync, onPush }) {
    return (
        <div className="cloud-sync fade-in">
            <div className="glass-card">
                <h3>Cloud Storage Settings</h3>
                <p className="text-muted mt-1">Connect your app to Google Sheets to access your data from anywhere. This will sync Transactions, Categories, Commitments, and Settings. Follow the <a href="#" onClick={(e) => { e.preventDefault(); alert('Please refer to the cloud_setup.md file in your project.') }} className="link">Setup Guide</a> to get your Web App URL.</p>

                <div className="input-group mt-2">
                    <label>Google Apps Script Web App URL</label>
                    <input
                        type="text"
                        value={cloudUrl}
                        onChange={(e) => onUrlChange(e.target.value)}
                        placeholder="https://script.google.com/macros/s/.../exec"
                    />
                </div>

                <div className="flex-gap mt-2">
                    <button
                        onClick={onSync}
                        disabled={isSyncing || !cloudUrl}
                        className="btn-primary"
                    >
                        {isSyncing ? '⌛ Syncing...' : '🔄 Pull from Cloud'}
                    </button>

                    <button
                        onClick={onPush}
                        disabled={isSyncing || !cloudUrl}
                        className="btn-secondary"
                    >
                        🚀 Push All Data to Cloud
                    </button>
                </div>

                {isSyncing && <p className="sync-status mt-1">Synchronizing with cloud...</p>}
            </div>

            <div className="glass-card mt-2">
                <h3>What gets synced?</h3>
                <ul className="mt-1 feature-list">
                    <li><strong>Transactions:</strong> All your income and expense records</li>
                    <li><strong>Categories:</strong> Your custom expense categories and LHDN segments</li>
                    <li><strong>Commitments:</strong> Your monthly commitment definitions</li>
                    <li><strong>Settings:</strong> App configuration and sync timestamps</li>
                </ul>
            </div>

            <div className="glass-card mt-2">
                <h3>Why connect to Cloud?</h3>
                <ul className="mt-1 feature-list">
                    <li>Access your expenses from your phone or tablet.</li>
                    <li>Your data is safely stored in your own Google Drive.</li>
                    <li>Easily export and analyze your data in Excel.</li>
                </ul>
            </div>

            <style jsx>{`
        .mt-1 { margin-top: 1rem; }
        .mt-2 { margin-top: 2rem; }
        .link { color: var(--primary); text-decoration: underline; }
        .flex-gap { display: flex; gap: 1rem; flex-wrap: wrap; }
        .sync-status { color: var(--primary); font-size: 0.9rem; animation: pulse 2s infinite; }
        .feature-list { list-style: disc; padding-left: 1.5rem; color: var(--text-muted); }
        .feature-list li { margin-bottom: 0.5rem; }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    )
}
