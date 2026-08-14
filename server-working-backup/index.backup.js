const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');
const { searchIntentSchema } = require('./intent');
const { products } = require('./products');
const { findMatchingProducts } = require('./matcher');

const app = express();
const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 120000,
  },
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'SmartCart AI server is running',
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

// Temporary network test
app.get('/search-test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Search route network connection works',
  });
});

app.post('/test-ai', async (req, res) => {
  try {
    const userQuery = req.body.query;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({
        error: 'Please provide a query.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Analyze this shopping request and extract the user's shopping intent.

User request:
"${userQuery}"

Return only the structured information requested by the response schema.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: searchIntentSchema,
      },
    });

    const intent = JSON.parse(response.text);

    res.json({
      success: true,
      intent,
    });
  } catch (error) {
    console.error('Gemini error:', error);

    res.status(500).json({
      success: false,
      error: 'Gemini request failed.',
    });
  }
});

app.post('/search', async (req, res) => {
  try {
    const userQuery = req.body.query;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a query.',
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Analyze this shopping request and extract the user's shopping intent.

User request:
"${userQuery}"

Return only the structured information requested by the response schema.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: searchIntentSchema,
      },
    });

    const intent = JSON.parse(response.text);

    const results = findMatchingProducts(products, intent);

    res.json({
      success: true,
      query: userQuery,
      intent,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);

    res.status(500).json({
      success: false,
      error: 'Search failed.',
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `SmartCart AI server running on http://localhost:${PORT}`
  );
});