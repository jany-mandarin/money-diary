import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useTransactions } from './hooks/useTransactions'
import { useCategories } from './hooks/useCategories'
import { useAccounts } from './hooks/useAccounts'
import { useExchangeRates } from './hooks/useExchangeRates'
import Login from './components/Login'
import Layout, { type Tab } from './components/Layout'
import MonthNav from './components/MonthNav'
import TransactionList from './components/TransactionList'
import MonthSummary from './components/MonthSummary'
import InstallmentsPage from './components/InstallmentsPage'
import SettingsPage from './components/SettingsPage'
import AddTransactionSheet from './components/AddTransactionSheet'
import AssetsPage from './components/AssetsPage'
import AddAccountSheet from './components/AddAccountSheet'
import { currentMonthKey, monthKeyOf, shiftMonth } from './utils/date'
import type { Account, Transaction } from './types'

export default function App() {
  const { uid, isCloud, needsLogin, authLoading } = useAuth()
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions(uid, isCloud)
  const { categories, updateCategories } = useCategories(uid, isCloud)
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts(uid, isCloud)
  const ratesInfo = useExchangeRates(uid, isCloud)

  const [tab, setTab] = useState<Tab>('home')
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [accountSheetOpen, setAccountSheetOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <div className="text-6xl animate-bounce">🍮</div>
      </div>
    )
  }

  if (needsLogin) {
    return <Login />
  }

  const monthTx = transactions.filter((t) => monthKeyOf(t.date) === monthKey)

  function openAdd() {
    setEditingTx(null)
    setSheetOpen(true)
  }

  function openEdit(tx: Transaction) {
    setEditingTx(tx)
    setSheetOpen(true)
  }

  function closeSheet() {
    setSheetOpen(false)
    setEditingTx(null)
  }

  function openAddAccount() {
    setEditingAccount(null)
    setAccountSheetOpen(true)
  }

  function openEditAccount(acc: Account) {
    setEditingAccount(acc)
    setAccountSheetOpen(true)
  }

  function closeAccountSheet() {
    setAccountSheetOpen(false)
    setEditingAccount(null)
  }

  return (
    <Layout active={tab} onChange={setTab} onAdd={openAdd}>
      {tab === 'home' && (
        <div className="space-y-4">
          <MonthNav
            monthKey={monthKey}
            onPrev={() => setMonthKey((m) => shiftMonth(m, -1))}
            onNext={() => setMonthKey((m) => shiftMonth(m, 1))}
          />
          <TransactionList transactions={monthTx} categories={categories} onSelect={openEdit} />
        </div>
      )}

      {tab === 'summary' && (
        <MonthSummary
          monthKey={monthKey}
          transactions={monthTx}
          categories={categories}
          onPrevMonth={() => setMonthKey((m) => shiftMonth(m, -1))}
          onNextMonth={() => setMonthKey((m) => shiftMonth(m, 1))}
        />
      )}

      {tab === 'assets' && (
        <AssetsPage accounts={accounts} ratesInfo={ratesInfo} onAdd={openAddAccount} onSelect={openEditAccount} />
      )}

      {tab === 'installments' && <InstallmentsPage transactions={transactions} />}

      {tab === 'settings' && <SettingsPage categories={categories} onUpdateCategories={updateCategories} />}

      {sheetOpen && (
        <AddTransactionSheet
          categories={categories}
          initial={editingTx ?? undefined}
          onSave={(tx) => {
            if (editingTx) updateTransaction(editingTx.id, tx)
            else addTransaction(tx)
            closeSheet()
          }}
          onClose={closeSheet}
          onDelete={
            editingTx
              ? () => {
                  deleteTransaction(editingTx.id)
                  closeSheet()
                }
              : undefined
          }
        />
      )}

      {accountSheetOpen && (
        <AddAccountSheet
          initial={editingAccount ?? undefined}
          onSave={(acc) => {
            if (editingAccount) updateAccount(editingAccount.id, acc)
            else addAccount(acc)
            closeAccountSheet()
          }}
          onClose={closeAccountSheet}
          onDelete={
            editingAccount
              ? () => {
                  deleteAccount(editingAccount.id)
                  closeAccountSheet()
                }
              : undefined
          }
        />
      )}
    </Layout>
  )
}
