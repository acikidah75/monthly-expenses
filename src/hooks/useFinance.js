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

    const syncToCloud = useCallback(async (data) => {
        if (!cloudUrl) return
        setIsSyncing(true)
        try {
            await fetch(cloudUrl, {
                method: 'POST',
                mode: 'no-cors', // Apps Script requires no-cors for simple POSTs
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.error('Cloud Sync Error:', error)
        } finally {
            setIsSyncing(false)
        }
    }, [cloudUrl])

    const pushAllToCloud = useCallback(async () => {
        if (!cloudUrl || transactions.length === 0) return
        setIsSyncing(true)
        try {
            // Push each transaction one by one (simplest for the current Apps Script setup)
            for (const tx of transactions) {
                await fetch(cloudUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(tx)
                })
            }
            alert('All local data has been pushed to the cloud!')
        } catch (error) {
            console.error('Push All Error:', error)
            alert('Failed to push all data. Check connection.')
        } finally {
            setIsSyncing(false)
        }
    }, [cloudUrl, transactions])

    const fetchFromCloud = useCallback(async () => {
        if (!cloudUrl) {
            alert('Please enter your Web App URL first.')
            return
        }
        setIsSyncing(true)
        try {
            const resp = await fetch(cloudUrl)
            if (!resp.ok) throw new Error('Network response was not ok')

            const data = await resp.json()
            if (!Array.isArray(data)) throw new Error('Data is not an array')

            // Map cloud data (which has keys from headers) back to application format
            const formattedData = data.map(item => ({
                date: item['Date'] || new Date().toISOString().split('T')[0],
                type: item['Type'] || 'expense',
                category: item['Source/Category'] || 'Other',
                source: item['Source/Category'] || 'Other',
                amount: parseFloat(item['Amount'] || 0),
                description: item['Details'] || '',
                id: item['ID'] || Date.now() + Math.random(),
                attachment: item['Attachment URL'] || ''
            }))

            // Merge with local data, avoiding duplicates based on ID
            setTransactions(prev => {
                const localIds = new Set(prev.map(t => t.id.toString()))
                const newRecords = formattedData.filter(t => t.id && !localIds.has(t.id.toString()))
                const combined = [...newRecords, ...prev]
                // Deduplicate in case of duplicate IDs in the mesh
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
                return unique.sort((a, b) => new Date(b.date) - new Date(a.date))
            })

            alert('Successfully synced with cloud!')
        } catch (error) {
            console.error('Cloud Fetch Error:', error)
            alert('Cloud Sync Failed: \n1. Ensure your Tab is named "Transactions"\n2. Ensure your headers match exactly\n3. Ensure your Web App is deployed as "Anyone"')
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

    const addCommitment = (data) => {
        setCommitments(prev => [...prev, { ...data, id: Date.now() }])
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
        pushAllToCloud
    }
}
