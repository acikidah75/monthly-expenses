export default function Analytics({ transactions, categories }) {
    // Aggregate expenses by LHDN Segment
    const segmentData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const cat = categories.find(c => c.code === t.category)
            const segment = cat?.lhdn || 'Uncategorized'
            acc[segment] = (acc[segment] || 0) + parseFloat(t.amount || 0)
            return acc
        }, {})

    const totalExpense = Object.values(segmentData).reduce((a, b) => a + b, 0)

    return (
        <div className="analytics-view fade-in">
            <div className="glass-card mb-2">
                <h3>LHDN Segment Breakdown (Tax Relief)</h3>
                <div className="chart-container mt-1">
                    {Object.entries(segmentData).map(([segment, amount]) => {
                        const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                        return (
                            <div key={segment} className="bar-group">
                                <div className="bar-labels">
                                    <span>{segment}</span>
                                    <span>RM {amount.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                                </div>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        )
                    })}
                    {Object.keys(segmentData).length === 0 && (
                        <p className="text-muted">No expense data available for breakdown.</p>
                    )}
                </div>
            </div>

            <style jsx>{`
        .mb-2 { margin-bottom: 2rem; }
        .mt-1 { margin-top: 1rem; }
        .chart-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .bar-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .bar-labels { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--text-muted); }
        .bar-track { height: 8px; background: rgba(255, 255, 255, 0.05); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.8s ease-out; }
        .text-muted { color: var(--text-muted); text-align: center; padding: 2rem; }
      `}</style>
        </div>
    )
}
