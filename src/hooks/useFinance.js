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

    const fetchFromCloud = useCallback(async () => {
        if (!cloudUrl) return
        setIsSyncing(true)
        try {
            const resp = await fetch(cloudUrl)
            const data = await resp.json()

            // Map cloud data (which has keys from headers) back to application format
            const formattedData = data.map(item => ({
                date: item['Date'],
                type: item['Type'],
                category: item['Type'] === 'expense' ? item['Source/Category'] : undefined,
                source: item['Type'] === 'income' ? item['Source/Category'] : undefined,
                amount: item['Amount'],
                description: item['Details'],
                id: item['ID'],
                attachment: item['Attachment URL']
            }))

            // Merge with local data, avoiding duplicates based on ID
            setTransactions(prev => {
                const localIds = new Set(prev.map(t => t.id))
                const newRecords = formattedData.filter(t => !localIds.has(t.id))
                return [...newRecords, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date))
            })

            alert('Successfully synced with cloud!')
        } catch (error) {
            console.error('Cloud Fetch Error:', error)
            alert('Cloud Sync Failed: Check your Web App URL and Sheet headers.')
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

    return {
        transactions,
        categories,
        stats,
        cloudUrl,
        setCloudUrl,
        isSyncing,
        addTransaction,
        deleteTransaction,
        addCategory,
        deleteCategory,
        fetchFromCloud
    }
}
