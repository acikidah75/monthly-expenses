import { useState } from 'react'

const LHDN_SEGMENTS = [
    '02 - PELEPASAN DIRI KELUARGA',
    '03 - PELEPASAN GAYA HIDUP',
    '04 - ANAK',
    '05 - DERMA / ZAKAT',
    '06 - LAIN-LAIN'
]

export default function CategoryMaster({ categories, addCategory, updateCategory, deleteCategory }) {
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        lhdn: LHDN_SEGMENTS[0]
    })

    const [editingId, setEditingId] = useState(null)
    const [editFormData, setEditFormData] = useState({ description: '', lhdn: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!formData.code || !formData.description) return

        // Check for duplicate code
        if (categories.some(c => c.code.toUpperCase() === formData.code.toUpperCase())) {
            alert('Category Code already exists!')
            return
        }

        addCategory({ ...formData, code: formData.code.toUpperCase() })
        setFormData({ code: '', description: '', lhdn: LHDN_SEGMENTS[0] })
    }

    const startEditing = (cat) => {
        setEditingId(cat.id)
        setEditFormData({ description: cat.description, lhdn: cat.lhdn })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditFormData({ description: '', lhdn: '' })
    }

    const saveEdit = (id) => {
        updateCategory(id, editFormData)
        setEditingId(null)
    }

    return (
        <div className="category-master fade-in">
            <div className="glass-card mb-2">
                <h3>Add New Category</h3>
                <form onSubmit={handleSubmit} className="mt-1">
                    <div className="grid-2">
                        <div className="input-group">
                            <label>Category Code * (Cannot be changed later)</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                placeholder="e.g. FOOD"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Category Description *</label>
                            <input
                                type="text"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="e.g. Daily Meals & Drinks"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>LHDN Segment (Tax Relief)</label>
                        <select
                            value={formData.lhdn}
                            onChange={e => setFormData({ ...formData, lhdn: e.target.value })}
                        >
                            {LHDN_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="btn-primary">Add Category</button>
                </form>
            </div>

            <div className="glass-card">
                <h3>Shared Categories</h3>
                <div className="table-container mt-1">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Description</th>
                                <th>LHDN Segment</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(cat => (
                                <tr key={cat.id}>
                                    <td><span className="badge">{cat.code}</span></td>
                                    <td>
                                        {editingId === cat.id ? (
                                            <input
                                                className="edit-input"
                                                value={editFormData.description}
                                                onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                                autoFocus
                                            />
                                        ) : cat.description}
                                    </td>
                                    <td>
                                        {editingId === cat.id ? (
                                            <select
                                                className="edit-select"
                                                value={editFormData.lhdn}
                                                onChange={e => setEditFormData({ ...editFormData, lhdn: e.target.value })}
                                            >
                                                {LHDN_SEGMENTS.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        ) : cat.lhdn}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        {editingId === cat.id ? (
                                            <div className="flex-right">
                                                <button onClick={() => saveEdit(cat.id)} className="btn-icon btn-success">💾</button>
                                                <button onClick={cancelEditing} className="btn-icon btn-muted">✖️</button>
                                            </div>
                                        ) : (
                                            <div className="flex-right">
                                                <button onClick={() => startEditing(cat)} className="btn-icon btn-primary-alt">✏️</button>
                                                <button onClick={() => deleteCategory(cat.id)} className="btn-icon btn-danger">🗑️</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No categories added yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
        .mb-2 { margin-bottom: 2rem; }
        .mt-1 { margin-top: 1rem; }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .table-container {
          overflow-x: auto;
        }
        .custom-table {
          width: 100%;
          border-collapse: collapse;
          color: var(--text-main);
        }
        .custom-table th, .custom-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--glass-border);
        }
        .badge {
          background: var(--primary);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .btn-icon {
          padding: 0.5rem;
          background: transparent;
        }
        .btn-danger:hover {
          background: var(--danger);
          color: white;
        }
        .btn-success:hover { background: var(--success); color: white; }
        .btn-muted:hover { background: var(--text-muted); color: white; }
        .btn-primary-alt:hover { background: var(--primary); color: white; }
        
        .flex-right { display: flex; justify-content: flex-end; gap: 0.5rem; }
        
        .edit-input, .edit-select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid var(--primary);
          color: white;
          padding: 0.4rem;
          border-radius: 4px;
          width: 100%;
        }

        @media (max-width: 600px) {
          .grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}
