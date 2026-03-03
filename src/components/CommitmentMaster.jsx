import { useState } from 'react'

export default function CommitmentMaster({ commitments, categories, addCommitment, deleteCommitment }) {
    const [formData, setFormData] = useState({
        name: '',
        estimatedAmount: '',
        category: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.name || !formData.estimatedAmount || !formData.category) return

        addCommitment({
            ...formData,
            estimatedAmount: parseFloat(formData.estimatedAmount)
        })
        setFormData({ name: '', estimatedAmount: '', category: '' })
    }

    return (
        <div className="commitment-master fade-in">
            <div className="glass-card mb-2">
                <h3>Define Monthly Commitment</h3>
                <form onSubmit={handleSubmit} className="mt-1">
                    <div className="grid-3">
                        <div className="input-group">
                            <label>Commitment Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. House Loan, Netflix"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Estimated Amount *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.estimatedAmount}
                                onChange={e => setFormData({ ...formData, estimatedAmount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Category *</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.code}>{cat.description}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn-primary mt-1">Register Commitment</button>
                </form>
            </div>

            <div className="glass-card">
                <h3>Commitment List</h3>
                <div className="table-container mt-1">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Estimated Amount</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commitments.map(item => (
                                <tr key={item.id}>
                                    <td><strong>{item.name}</strong></td>
                                    <td><span className="badge">{item.category}</span></td>
                                    <td>RM {item.estimatedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button onClick={() => deleteCommitment(item.id)} className="btn-icon btn-danger">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            {commitments.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No commitments defined yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .mb-2 { margin-bottom: 2rem; }
        .mt-1 { margin-top: 1rem; }
        .mt-2 { margin-top: 2rem; }
        .grid-3 {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1rem;
        }
        .table-container { overflow-x: auto; }
        .custom-table { width: 100%; border-collapse: collapse; color: var(--text-main); }
        .custom-table th, .custom-table td { padding: 1rem; text-align: left; border-bottom: 1px solid var(--glass-border); }
        .badge { background: var(--primary); padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
        .btn-icon { padding: 0.5rem; background: transparent; }
        .btn-danger:hover { background: var(--danger); color: white; }
        @media (max-width: 768px) { .grid-3 { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    )
}
