import { useState, useMemo } from 'react'

export default function CommitmentTracker({ commitments, transactions, addTransaction }) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)) // YYYY-MM
    const [activeLoggingId, setActiveLoggingId] = useState(null)
    const [logData, setLogData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: ''
    })

    // Determine payment status for the selected month
    const commitmentStatus = useMemo(() => {
        return commitments.map(c => {
            const payment = transactions.find(t =>
                t.type === 'expense' &&
                t.details?.includes(`[COMMITMENT: ${c.name}]`) &&
                t.date.startsWith(selectedMonth)
            )
            return {
                ...c,
                isPaid: !!payment,
                actualAmount: payment?.amount,
                paymentDate: payment?.date
            }
        })
    }, [commitments, transactions, selectedMonth])

    const startLogging = (item) => {
        setActiveLoggingId(item.id)
        setLogData({
            date: new Date().toISOString().split('T')[0],
            amount: item.estimatedAmount.toString()
        })
    }

    const handleLogSubmit = (e, item) => {
        e.preventDefault()
        if (!logData.date || !logData.amount) return

        addTransaction({
            date: logData.date,
            type: 'expense',
            category: item.category,
            amount: parseFloat(logData.amount),
            details: `[COMMITMENT: ${item.name}] Payment for ${selectedMonth}`,
            remarks: `Paid RM ${logData.amount} on ${logData.date}`
        })

        setActiveLoggingId(null)
    }

    return (
        <div className="commitment-tracker fade-in">
            <div className="glass-card mb-2">
                <div className="flex-between">
                    <h3>Monthly Listing</h3>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                        className="month-picker"
                    />
                </div>

                <div className="table-container mt-2">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Commitment</th>
                                <th>Category</th>
                                <th>Est. Amount</th>
                                <th>Action / Payment Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commitmentStatus.map(item => (
                                <tr key={item.id} className={item.isPaid ? 'row-paid' : 'row-pending'}>
                                    <td className="status-cell">
                                        <span className={`status-pill ${item.isPaid ? 'paid' : 'pending'}`}>
                                            {item.isPaid ? 'PAID' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td><strong>{item.name}</strong></td>
                                    <td><span className="category-tag">{item.category}</span></td>
                                    <td className="amount-cell">RM {item.estimatedAmount.toFixed(2)}</td>
                                    <td className="action-cell">
                                        {item.isPaid ? (
                                            <div className="paid-info">
                                                <span className="actual-amt">RM {parseFloat(item.actualAmount).toFixed(2)}</span>
                                                <span className="pay-date text-muted">{item.paymentDate}</span>
                                            </div>
                                        ) : (
                                            activeLoggingId === item.id ? (
                                                <form onSubmit={(e) => handleLogSubmit(e, item)} className="log-row-form">
                                                    <input
                                                        type="date"
                                                        value={logData.date}
                                                        onChange={e => setLogData({ ...logData, date: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={logData.amount}
                                                        onChange={e => setLogData({ ...logData, amount: e.target.value })}
                                                        placeholder="Amt"
                                                        className="amt-input"
                                                        required
                                                    />
                                                    <button type="submit" className="btn-success btn-xs">Pay</button>
                                                    <button type="button" onClick={() => setActiveLoggingId(null)} className="btn-muted btn-xs">Cancel</button>
                                                </form>
                                            ) : (
                                                <button onClick={() => startLogging(item)} className="btn-outline-small">Log Payment</button>
                                            )
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {commitments.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="no-data">No commitments defined.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .mb-2 { margin-bottom: 2rem; }
        .mt-2 { margin-top: 2rem; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        
        .month-picker { background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); color: white; padding: 0.5rem 1rem; border-radius: 8px; }
        
        .table-container { overflow-x: auto; }
        .custom-table { width: 100%; border-collapse: collapse; color: var(--text-main); }
        .custom-table th { text-align: left; padding: 1rem; color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid var(--glass-border); }
        .custom-table td { padding: 1.25rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: bold; }
        .status-pill.pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-pill.paid { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

        .category-tag { font-size: 0.7rem; padding: 2px 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; border: 1px solid var(--glass-border); color: var(--text-muted); }
        
        .amount-cell { font-family: 'Inter', monospace; font-weight: 600; }
        
        .row-paid { background: rgba(16, 185, 129, 0.02); }
        .row-paid Strong { color: var(--text-muted); text-decoration: line-through; }
        
        .paid-info { display: flex; flex-direction: column; gap: 2px; }
        .actual-amt { font-weight: bold; color: #34d399; }
        .pay-date { font-size: 0.8rem; }

        .log-row-form { display: flex; gap: 0.5rem; align-items: center; }
        .log-row-form input { background: rgba(255, 255, 255, 0.1); border: 1px solid var(--glass-border); color: white; padding: 0.4rem; border-radius: 4px; font-size: 0.85rem; }
        .amt-input { width: 80px; }
        .btn-xs { padding: 4px 12px; font-size: 0.75rem; border-radius: 4px; }

        .btn-outline-small {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .btn-outline-small:hover { background: var(--primary); color: white; }

        .no-data { text-align: center; padding: 3rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .log-row-form { flex-direction: column; align-items: stretch; }
          .amt-input { width: 100%; }
        }
      `}</style>
        </div>
    )
}
