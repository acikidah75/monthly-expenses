import { useState, useEffect, useCallback } from 'react'

export function useFinance() {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('monthly_exp_transactions')
        return saved ? JSON.parse(saved) : []
    })

    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('monthly_exp_categories')
        return saved ? JSON.parse(saved) : []
    })

    const [commitments, setCommitments] = useState(() => {
        const saved = localStorage.getItem('monthly_exp_commitments')
        return saved ? JSON.parse(saved) : []
    })

    const [cloudUrl, setCloudUrl] = useState(() => {
        return localStorage.getItem('monthly_exp_cloud_url') || ''
    })

    const [passcode, setPasscode] = useState(() => {
        return localStorage.getItem('monthly_exp_passcode') || ''
    })

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    useEffect(() => {
        localStorage.setItem('monthly_exp_transactions', JSON.stringify(transactions))
    }, [transactions])

    useEffect(() => {
        localStorage.setItem('monthly_exp_categories', JSON.stringify(categories))
    }, [categories])

    useEffect(() => {
        localStorage.setItem('monthly_exp_commitments', JSON.stringify(commitments))
    }, [commitments])

    useEffect(() => {
        localStorage.setItem('monthly_exp_cloud_url', cloudUrl)
    }, [cloudUrl])

    useEffect(() => {
        localStorage.setItem('monthly_exp_passcode', passcode)
    }, [passcode])

    const login = (code) => {
        if (!passcode) {
            // First time setup
            setPasscode(code)
            setIsLoggedIn(true)
            return true
        }
        if (code === passcode) {
            setIsLoggedIn(true)
            return true
        }
        return false
    }

    const logout = () => {
        setIsLoggedIn(false)
    }

    const updatePasscode = (newCode) => {
        setPasscode(newCode)
    }

    const syncToCloud = useCallback(async (data, tab = 'Transactions') => {
        if (!cloudUrl) return
        setIsSyncing(true)
        try {
            await fetch(cloudUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, tab })
            })
        } catch (error) {
            console.error('Cloud Sync Error:', error)
        } finally {
            setIsSyncing(false)
        }
    }, [cloudUrl])

    const pushAllToCloud = useCallback(async () => {
        if (!cloudUrl) {
            alert('Cloud URL is missing!')
            return
        }
        setIsSyncing(true)
        try {
            // Push Transactions
            for (const tx of transactions) {
                await fetch(cloudUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...tx, tab: 'Transactions' })
                })
            }
            // Push Commitments
            for (const cm of commitments) {
                await fetch(cloudUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...cm, tab: 'Commitments' })
                })
            }
            alert(`Success! Data pushed to Google Sheets.`)
        } catch (error) {
            console.error('Push All Error:', error)
            alert('Failed to push data: ' + error.message)
        } finally {
            setIsSyncing(false)
        }
    }, [cloudUrl, transactions, commitments])

    const fetchFromCloud = useCallback(async () => {
        if (!cloudUrl) {
            alert('Please enter your Web App URL first.')
            return
        }
        setIsSyncing(true)
        try {
            const resp = await fetch(cloudUrl)
            if (!resp.ok) throw new Error('Network response was not ok')

            const result = await resp.json()

            // 1. Process Transactions
            if (result.transactions && Array.isArray(result.transactions)) {
                const formattedTx = result.transactions.map(item => ({
                    date: item['Date'] || new Date().toISOString().split('T')[0],
                    type: item['Type'] || 'expense',
                    category: item['Source/Category'] || 'Other',
                    source: item['Source/Category'] || 'Other',
                    amount: parseFloat(item['Amount'] || 0),
                    description: item['Details'] || '',
                    id: item['ID'] || Date.now() + Math.random(),
                    attachment: item['Attachment URL'] || ''
                }))

                setTransactions(prev => {
                    const localIds = new Set(prev.map(t => t.id.toString()))
                    const newRecords = formattedTx.filter(t => t.id && !localIds.has(t.id.toString()))
                    const combined = [...newRecords, ...prev]
                    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
                    return unique.sort((a, b) => new Date(b.date) - new Date(a.date))
                })
            }

            // 2. Process Commitments
            if (result.commitments && Array.isArray(result.commitments)) {
                const formattedCm = result.commitments.map(item => ({
                    name: item['Name'],
                    estimatedAmount: parseFloat(item['Estimated Amount'] || 0),
                    category: item['Category'],
                    id: item['ID']
                }))

                setCommitments(prev => {
                    const localIds = new Set(prev.map(c => c.id.toString()))
                    const newRecords = formattedCm.filter(c => c.id && !localIds.has(c.id.toString()))
                    const combined = [...newRecords, ...prev]
                    return Array.from(new Map(combined.map(item => [item.id, item])).values())
                })
            }

            alert('Successfully synced everything from cloud!')
        } catch (error) {
            console.error('Cloud Fetch Error:', error)
            alert('Cloud Sync Failed. Please update your Apps Script and check your headers.')
        } finally {
            setIsSyncing(false)
        }
    }, [cloudUrl])

    const stats = transactions.reduce((acc, t) => {
        const amt = parseFloat(t.amount || 0)
        if (t.type === 'income') acc.totalIncome += amt
        else acc.totalExpense += amt
        acc.balance = acc.totalIncome - acc.totalExpense
        return acc
    }, { totalIncome: 0, totalExpense: 0, balance: 0 })

    const addTransaction = async (data) => {
        const newTx = { ...data, id: Date.now() }
        setTransactions(prev => [newTx, ...prev])
        if (cloudUrl) await syncToCloud(newTx)
    }

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id))
    }

    const addCategory = (data) => {
        setCategories(prev => [...prev, { ...data, id: Date.now() }])
    }

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(c => c.id !== id))
    }

    const addCommitment = async (data) => {
        const newCm = { ...data, id: Date.now() }
        setCommitments(prev => [...prev, newCm])
        if (cloudUrl) await syncToCloud(newCm, 'Commitments')
    }

    const deleteCommitment = (id) => {
        setCommitments(prev => prev.filter(c => c.id !== id))
    }

    return {
        transactions,
        categories,
        commitments,
        stats,
        cloudUrl,
        setCloudUrl,
        isSyncing,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        addCommitment,
        deleteCommitment,
        fetchFromCloud,
        pushAllToCloud,
        login,
        logout,
        updatePasscode,
        isLoggedIn,
        hasPasscode: !!passcode
    }
}
