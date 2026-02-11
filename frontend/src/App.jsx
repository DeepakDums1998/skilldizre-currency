import { useState } from 'react'
import './App.css'

function App() {
  // State variables
  // Amount is the amount of money to convert
  const [amount, setAmount] = useState('1');
  // From is the currency to convert from
  const [from, setFrom] = useState('USD');
  // To is the currency to convert to
  const [to, setTo] = useState('INR');
  // Result is the result of the conversion
  const [result, setResult] = useState(null);
  // State for loading state
  const [loading, setLoading] = useState(false);
  // State for error message
  const [error, setError] = useState(null);

//Backend API URL
const API_URL = 'http://localhost:3000/convert';

const convertCurrency = async () => {
  const amountNum = parseFloat(amount);
  if (isNaN(amountNum)) {
    setError('Please enter a valid amount');
    return;
  }

  setError(null);
  setLoading(true);
  setResult(null);

  try {
    const url = `${API_URL}?from=${from}&to=${to}&amount=${amountNum}`;
    console.log('Fetching conversion from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Conversion result:', data);
    setResult(data);
  } catch (error) {
    setError('Failed to convert currency');
    console.error('Error converting currency:', error);
  } finally {
    setLoading(false);
  }
  
}

const currencies = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'NZD', name: 'New Zealand Dollar' }
];
  return (
    <div className="container">
      <h1>Currency Converter</h1>
      <p className="subtitle">Convert your currency to get the best exchange rate</p>
        <div className="converter-box">
          <div className="input-group">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={amount} 
              placeholder="Enter amount"
              onChange={(e) => setAmount(e.target.value)} 
            />
          </div>
          <div className="currency-row">
            <label htmlFor="fromCurrency">From</label>
            <select 
              id="fromCurrency"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="currency-select"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>{currency.name}</option>
              ))}
            </select>
             {/* Swap button */}
            <button 
              className="swap-btn" 
              title="Swap currencies"
            
            >
            ⇄
          </button>
          <div className="input-group">
            <label htmlFor="toCurrency">To</label>
            <select 
              id="toCurrency"
              value={to}
              // onChange updates the toCurrency state when user selects

            >
              {/* Map through currencies array to create options */}
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          </div>
                  {/* Convert button */}
        <button 
          className="convert-btn"
          disabled={loading}
          onClick={convertCurrency}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
         {/* Result display area */}
        {/* Conditional rendering: only show if result exists */}
        {result && (
          <div className="result-box">
            <div className="result-amount">
              {parseFloat(result.result).toFixed(2)} {result.to}
            </div>
            <div className="result-details">
              {parseFloat(result.amount).toFixed(2)} {result.from} = {parseFloat(result.result).toFixed(2)} {result.to}
            </div>
            <div className="result-rate">
              Exchange Rate: 1 {result.from} = {parseFloat(result.rate).toFixed(4)} {result.to}
            </div>
          </div>
        )}
         {/* Error message area */}
        {/* Conditional rendering: only show if error exists */}
        {error && (
          <div className="error-box">
            {error}
          </div>
        )}
        </div>
    </div>
  )
}

export default App
