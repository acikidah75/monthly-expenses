import { useState } from 'react'

export default function Login({ onLogin, isFirstTime }) {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!code) return

        const success = onLogin(code)
        if (!success) {
            setError('Invalid Passcode. Please try again.')
            setCode('')
        }
    }

    return (
        <div className="login-screen">
            <div className="glass-card login-card fade-in">
                <div className="login-header">
                    <div className="icon-badge">🔒</div>
                    <h2 className="text-gradient">{isFirstTime ? 'Set Your Passcode' : 'Private Access'}</h2>
                    <p className="text-muted">
                        {isFirstTime
                            ? 'Create a secure passcode to protect your finance data.'
                            : 'Please enter your security passcode to continue.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form mt-2">
                    <div className="input-group">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter Passcode..."
                            className={error ? 'input-error' : ''}
                            autoFocus
                            required
                        />
                        {error && <span className="error-text">{error}</span>}
                    </div>

                    <button type="submit" className="btn-primary w-100 mt-2">
                        {isFirstTime ? 'Set & Enter Dashboard' : 'Unlock Dashboard'}
                    </button>
                </form>

                <p className="footer-note mt-2">Personal Expense Tracker v2.0</p>
            </div>

            <style jsx>{`
        .login-screen {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a; /* Deep dark background */
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          padding: 3rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .icon-badge {
          font-size: 3rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 0 10px var(--primary));
        }

        .login-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .login-form input {
          width: 100%;
          padding: 1rem;
          font-size: 1.25rem;
          text-align: center;
          letter-spacing: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1.5px solid var(--glass-border);
          color: white;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .login-form input:focus {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .input-error {
          border-color: var(--danger) !important;
        }

        .error-text {
          display: block;
          color: var(--danger);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .w-100 { width: 100%; }
        .mt-2 { margin-top: 2rem; }
        
        .footer-note {
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0.5;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>
        </div>
    )
}
