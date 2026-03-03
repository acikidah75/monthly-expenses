export default function Dashboard({ stats }) {
    return (
        <div className="dashboard-view fade-in">
            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon income">↑</div>
                    <div className="stat-info">
                        <span className="stat-label">Monthly Income</span>
                        <h2 className="stat-value">RM {stats.totalIncome.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon expense">↓</div>
                    <div className="stat-info">
                        <span className="stat-label">Monthly Expenses</span>
                        <h2 className="stat-value">RM {stats.totalExpense.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon balance">⚖️</div>
                    <div className="stat-info">
                        <span className="stat-label">Net Balance</span>
                        <h2 className={`stat-value ${stats.balance < 0 ? 'text-danger' : 'text-success'}`}>
                            RM {stats.balance.toFixed(2)}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="glass-card mt-2">
                <h3>Quick Tips</h3>
                <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
                    {stats.balance < 0
                        ? "⚠️ Your expenses are higher than your income this month. Consider reviewing your 'Lifestyle' categories."
                        : "✅ You're doing great! Your balance is positive. Keep it up!"}
                </p>
            </div>

            <style jsx>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .stat-icon.income { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .stat-icon.expense { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
        .stat-icon.balance { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        
        .stat-label { font-size: 0.875rem; color: var(--text-muted); }
        .stat-value { font-size: 1.75rem; margin-top: 0.25rem; }
        .text-danger { color: var(--danger) !important; }
        .text-success { color: var(--success) !important; }
        .mt-2 { margin-top: 1.5rem; }
      `}</style>
        </div>
    )
}
