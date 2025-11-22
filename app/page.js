'use client';

import { useState, useEffect } from 'react';

export default function ExpensesDashboard() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    const stored = localStorage.getItem('expenses');
    if (stored) {
      setExpenses(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalToday = expenses
    .filter(exp => exp.date === new Date().toISOString().split('T')[0])
    .reduce((sum, exp) => sum + exp.amount, 0);

  const totalAll = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Daily Expenses</h1>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Today</div>
            <div style={styles.statValue}>${totalToday.toFixed(2)}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total</div>
            <div style={styles.statValue}>${totalAll.toFixed(2)}</div>
          </div>
        </div>

        <form onSubmit={addExpense} style={styles.form}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.input}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            style={styles.input}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" style={styles.button}>Add Expense</button>
        </form>

        {Object.keys(categoryTotals).length > 0 && (
          <div style={styles.categories}>
            <h3 style={styles.categoryTitle}>By Category</h3>
            <div style={styles.categoryGrid}>
              {Object.entries(categoryTotals).map(([cat, total]) => (
                <div key={cat} style={styles.categoryItem}>
                  <span style={styles.categoryName}>{cat}</span>
                  <span style={styles.categoryAmount}>${total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.expensesList}>
          <h3 style={styles.expensesTitle}>Recent Expenses</h3>
          {expenses.length === 0 ? (
            <p style={styles.emptyState}>No expenses yet. Add your first expense above.</p>
          ) : (
            expenses.map(exp => (
              <div key={exp.id} style={styles.expenseItem}>
                <div style={styles.expenseInfo}>
                  <div style={styles.expenseDesc}>{exp.description}</div>
                  <div style={styles.expenseMeta}>
                    <span style={styles.expenseCategory}>{exp.category}</span>
                    <span style={styles.expenseDate}>{exp.date}</span>
                  </div>
                </div>
                <div style={styles.expenseRight}>
                  <div style={styles.expenseAmount}>${exp.amount.toFixed(2)}</div>
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    style={styles.deleteButton}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 24px 0',
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none'
  },
  select: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#1a1a1a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  categories: {
    marginBottom: '32px'
  },
  categoryTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a'
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '12px'
  },
  categoryItem: {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  categoryName: {
    fontSize: '14px',
    color: '#666'
  },
  categoryAmount: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  expensesList: {
    marginTop: '32px'
  },
  expensesTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#1a1a1a'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px'
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #eee'
  },
  expenseInfo: {
    flex: 1
  },
  expenseDesc: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '6px'
  },
  expenseMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
    color: '#666'
  },
  expenseCategory: {
    backgroundColor: '#f0f0f0',
    padding: '2px 8px',
    borderRadius: '4px'
  },
  expenseDate: {},
  expenseRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  expenseAmount: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '28px',
    color: '#999',
    cursor: 'pointer',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
