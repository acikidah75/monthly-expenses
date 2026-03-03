import { useState } from 'react'
import './index.css'
import { useFinance } from './hooks/useFinance'
import Dashboard from './components/Dashboard'
import IncomeForm from './components/IncomeForm'
import ExpenseForm from './components/ExpenseForm'
import CategoryMaster from './components/CategoryMaster'
import History from './components/History'
import Analytics from './components/Analytics'
import CloudSync from './components/CloudSync'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const finance = useFinance()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'income', label: 'Income', icon: '💰' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'category-master', label: 'Categories', icon: '⚙️' },
    { id: 'cloud-sync', label: 'Cloud Sync', icon: '☁️' },
  ]

  return (
    <div className="layout">
      {/* Sidebar Navigation */}
      <nav className="sidebar glass-card">
        <div className="logo">
          <h2 className="text-gradient">FinanceHub</h2>
        </div>
        <ul className="nav-list">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        <header className="content-header fade-in">
          <h1>{navItems.find(i => i.id === activeTab)?.label}</h1>
          <div className="user-profile">
            <span className="avatar">👤</span>
            <span className="username">My Account</span>
          </div>
        </header>

        <section className="view-container fade-in">
          {activeTab === 'dashboard' && <Dashboard stats={finance.stats} />}
          {activeTab === 'income' && <IncomeForm addTransaction={finance.addTransaction} />}
          {activeTab === 'expenses' && <ExpenseForm categories={finance.categories} addTransaction={finance.addTransaction} />}
          {activeTab === 'analytics' && <Analytics transactions={finance.transactions} categories={finance.categories} />}
          {activeTab === 'history' && <History transactions={finance.transactions} deleteTransaction={finance.deleteTransaction} />}
          {activeTab === 'category-master' && <CategoryMaster categories={finance.categories} addCategory={finance.addCategory} updateCategory={finance.updateCategory} deleteCategory={finance.deleteCategory} />}
          {activeTab === 'cloud-sync' && (
            <CloudSync
              cloudUrl={finance.cloudUrl}
              setCloudUrl={finance.setCloudUrl}
              isSyncing={finance.isSyncing}
              fetchFromCloud={finance.fetchFromCloud}
            />
          )}
        </section>
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          padding: 1.5rem;
          gap: 1.5rem;
        }

        .sidebar {
          width: 280px;
          height: calc(100vh - 3rem);
          display: flex;
          flex-direction: column;
          padding: 2rem 1rem;
          position: sticky;
          top: 1.5rem;
        }

        .logo {
          margin-bottom: 3rem;
          text-align: center;
        }

        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          width: 100%;
          padding: 1rem;
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-muted);
          justify-content: flex-start;
          transition: var(--transition);
        }

        .nav-item.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .nav-item:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main);
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--glass-bg);
          padding: 0.5rem 1.25rem;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
        }

        .view-container {
          flex: 1;
        }

        @media (max-width: 1024px) {
          .layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
            top: 0;
          }
          .nav-list {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .nav-item {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  )
}

export default App
