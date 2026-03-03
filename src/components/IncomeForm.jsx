import { useState } from 'react'

const INCOME_SOURCES = ['Gaji', 'Rumah Sewa', 'Other']

export default function IncomeForm({ addTransaction }) {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        source: INCOME_SOURCES[0],
        otherSource: '',
        description: '',
        amount: '',
        notes: ''
    })
    const [file, setFile] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()

        addTransaction({
            ...formData,
            type: 'income',
            source: formData.source === 'Other' ? formData.otherSource : formData.source,
            attachment: file ? file.name : null
        })

        alert('Income recorded successfully!')

        // Reset form
        setFormData({
            date: new Date().toISOString().split('T')[0],
            source: INCOME_SOURCES[0],
            otherSource: '',
            description: '',
            amount: '',
            notes: ''
        })
        setFile(null)
    }

    return (
        <div className="income-form glass-card fade-in">
            <h3>Record Income</h3>
            <form onSubmit={handleSubmit} className="mt-1">
                <div className="grid-2">
                    <div className="input-group">
                        <label>Date *</label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="input-group">
                        <label>Income Source *</label>
                        <select
                            required
                            value={formData.source}
                            onChange={e => setFormData({ ...formData, source: e.target.value })}
                        >
                            {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                {formData.source === 'Other' && (
                    <div className="input-group fade-in">
                        <label>Specify Other Source *</label>
                        <input
                            type="text"
                            required
                            value={formData.otherSource}
                            onChange={e => setFormData({ ...formData, otherSource: e.target.value })}
                            placeholder="Enter income source"
                        />
                    </div>
                )}

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
                    <label>Description</label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief description"
                    />
                </div>

                <div className="input-group">
                    <label>Attachment (Supporting Document)</label>
                    <div className="file-input-wrapper">
                        <input
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            id="income-file"
                        />
                        <label htmlFor="income-file" className="file-label">
                            {file ? `📄 ${file.name}` : '📁 Choose file or drag & drop'}
                        </label>
                    </div>
                </div>

                <div className="input-group">
                    <label>Notes</label>
                    <textarea
                        rows="3"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes..."
                    ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full">Record Income</button>
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
