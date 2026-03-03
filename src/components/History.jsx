import { useState } from 'react'

export default function History({ transactions, deleteTransaction }) {
    const [filter, setFilter] = useState('all')

    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))

    const filteredTransactions = sortedTransactions.filter(t => {
        if (filter === 'all') return true
        return t.type === filter
    })

    return (
        <div className="history-view glass-card fade-in">
            <div className="flex-between mb-1">
                <h3>Transaction History</h3>
                <div className="filter-group">
                    <button
                        className={`btn-filter ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >All</button>
                    <button
                        className={`btn-filter ${filter === 'income' ? 'active' : ''}`}
                        onClick={() => setFilter('income')}
                    >Income</button>
                    <button
                        className={`btn-filter ${filter === 'expense' ? 'active' : ''}`}
                        onClick={() => setFilter('expense')}
                    >Expenses</button>
                </div>
            </div>

            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Category/Source</th>
                            <th>Amount</th>
                            <th>Details</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t.id}>
                                <td>{t.date}</td>
                                <td>
                                    <span className={`badge ${t.type}`}>
                                        {t.type === 'income' ? 'Income' : 'Expense'}
                                    </span>
                                </td>
                                <td>{t.source || t.category || t.item}</td>
                                <td className={t.type === 'income' ? 'text-success' : 'text-danger'}>
                                    RM {parseFloat(t.amount).toFixed(2)}
                                </td>
                                <td>
                                    <small>{t.description || t.remarks || t.item || '-'}</small>
                                    {(t.attachment || t.receipt) && <span title="Has Attachment" style={{ marginLeft: '8px' }}>📎</span>}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => deleteTransaction(t.id)} className="btn-icon btn-danger">🗑️</button>
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .mb-1 { margin-bottom: 1rem; }
        .filter-group { display: flex; gap: 0.5rem; background: rgba(255, 255, 255, 0.05); padding: 0.25rem; border-radius: var(--radius-md); }
        .btn-filter { padding: 0.4rem 1rem; font-size: 0.8rem; background: transparent; color: var(--text-muted); }
        .btn-filter.active { background: var(--primary); color: white; }
        
        .table-container { overflow-x: auto; }
        .custom-table { width: 100%; border-collapse: collapse; }
        .custom-table th, .custom-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--glass-border); }
        
        .badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; text-transform: uppercase; }
        .badge.income { background: rgba(16, 185, 129, 0.2); color: var(--success); }
        .badge.expense { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
        
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
        .btn-icon { background: transparent; padding: 0.5rem; }
        .btn-danger:hover { background: var(--danger); color: white; }
      `}</style>
        </div>
    )
}
