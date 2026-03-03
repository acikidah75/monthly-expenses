import { useState } from 'react'

export default function Dashboard({ transactions }) {
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })

    // Calculate stats for selected month
    const stats = transactions
        .filter(t => {
            const transactionMonth = t.date.substring(0, 7) // YYYY-MM format
            return transactionMonth === selectedMonth
        })
        .reduce((acc, t) => {
            const amt = parseFloat(t.amount || 0)
            if (t.type === 'income') acc.totalIncome += amt
            else acc.totalExpense += amt
            acc.balance = acc.totalIncome - acc.totalExpense
            return acc
        }, { totalIncome: 0, totalExpense: 0, balance: 0 })

    return (
        <div className="dashboard-view fade-in">
            {/* Month Selection */}
            <div className="glass-card mb-2">
                <div className="flex-between">
                    <h3>Monthly Listing</h3>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="month-picker"
                    />
                </div>
            </div>

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
        .mb-2 { margin-bottom: 2rem; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        
        .month-picker { 
          background: rgba(255, 255, 255, 0.05); 
          border: 1px solid var(--glass-border); 
          color: white; 
          padding: 0.5rem 1rem; 
          border-radius: 8px; 
        }

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

