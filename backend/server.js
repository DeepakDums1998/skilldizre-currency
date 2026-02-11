const express = require('express');
// Axios is a library to make HTTP requests (to fetch data from other APIs)
const axios = require('axios');

// Create an Express application
const app = express();

// Set the port number (where our server will run)
const PORT = 3000;

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our frontend (running on a different port) to talk to our backend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

// Define a route for the root path
app.get('/convert', async (req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const amount = parseFloat(req.query.amount);
    console.log(from, to, amount);
    try {
        // Check if the required parameters are present
        // If not, return a 400 status code and an error message
        // also show which parameters are missing

        if (!from || !to || !amount) {
            return res.status(400).json({ error: 'Missing required parameters: from, to, amount' });
        }
        // Check if the amount is a number
        if (isNaN(amount)) {
            return res.status(400).json({ error: 'Amount must be a number' });
        }
        // Check if the from and to are valid currencies
            // Fetch live exchange rates from the external API
        // This API returns rates based on USD (US Dollar)
        const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
        
        console.log('Fetching exchange rates from:', apiUrl);
        const response = await axios.get(apiUrl);
        console.log(response.data);
        
        // Extract the rates object from the API response
        // rates contains exchange rates for all currencies relative to USD
        const rates = response.data.rates;

        // Check if the currencies exist in the rates
        if (!rates[from] || !rates[to]) {
        return res.status(400).json({
            error: 'Invalid currency code. Please use valid 3-letter currency codes (e.g., USD, EUR, GBP)'
        });
        }
        const fromRate = rates[from];  // Exchange rate for source currency
        const toRate = rates[to];      // Exchange rate for target currency
        const convertedAmount = (toRate / fromRate) * amount;
    
        // Round the result to 2 decimal places for readability
        const roundedResult = Math.round(convertedAmount * 100) / 100;

        res.json({
            success: true,
            amount: amount,
            from: from,
            to: to,
            rate: toRate / fromRate,  // The conversion rate between the two currencies
            result: roundedResult
          });
      
    } catch (error) {
        res.status(500).json({ error: 'Failed to convert currency' });
    }

  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 