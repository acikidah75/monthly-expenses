import { useState, useEffect } from 'react'

export default function ExpenseForm({ categories, addTransaction }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        item: '',
        amount: '',
        category: '',
        remarks: ''
    })
    const [file, setFile] = useState(null)

    useEffect(() => {
        if (categories.length > 0 && !formData.category) {
            setFormData(prev => ({ ...prev, category: categories[0].code }))
        }
    }, [categories])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.category) {
            alert('Please set up categories in the Category Master first!')
            return
        }

        addTransaction({
            ...formData,
            type: 'expense',
            receipt: file ? file.name : null
        })

        alert('Expense recorded successfully!')

        setFormData({
            date: new Date().toISOString().split('T')[0],
            item: '',
            amount: '',
            category: categories[0]?.code || '',
            remarks: ''
        })
        setFile(null)
    }

    return (
        <div className="expense-form glass-card fade-in">
            <h3>Record Expense</h3>
            <form onSubmit={handleSubmit} className="mt-1">
                <div className="grid-2">
                    <div className="input-group">
                        <label>Purchase Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Category *</label>
                        <select
                            required
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.length === 0 && <option value="">No categories set</option>}
                            {categories.map(c => <option key={c.id} value={c.code}>{c.code} - {c.description}</option>)}
                        </select>
                    </div>
                </div>

                <div className="input-group">
                    <label>Item *</label>
                    <input
                        type="text"
                        required
                        value={formData.item}
                        onChange={e => setFormData({ ...formData, item: e.target.value })}
                        placeholder="What did you buy?"
                    />
                </div>

                <div className="input-group">
                    <label>Amount *</label>
                    <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                    />
                </div>

                <div className="input-group">
                    <label>Receipt (Attachment)</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            id="expense-file"
                        />
                        <label htmlFor="expense-file" className="file-label">
                            {file ? `📄 ${file.name}` : '📁 Upload receipt'}
                        </label>
                    </div>
                </div>

                <div className="input-group">
                    <label>Remarks</label>
                    <textarea
                        rows="3"
                        value={formData.remarks}
                        onChange={e => setFormData({ ...formData, remarks: e.target.value })}
                        placeholder="Optional remarks..."
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">Record Expense</button>
            </form>

            <style jsx>{`
        .mt-1 { margin-top: 1rem; }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .w-full { width: 100%; justify-content: center; }
        .file-input-wrapper {
          position: relative;
        }
        .file-input-wrapper input {
          position: absolute;
          width: 0.1px;
          height: 0.1px;
          opacity: 0;
        }
        .file-label {
          display: block;
          padding: 1.5rem;
          border: 2px dashed var(--glass-border);
          border-radius: var(--radius-md);
          text-align: center;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.02);
          transition: var(--transition);
        }
        .file-label:hover {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.05);
        }
        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}
