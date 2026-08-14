const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');
const { searchIntentSchema } = require('./intent');
const { products } = require('./products');
const { findMatchingProducts } = require('./matcher');

const app = express();
const PORT = 3000;

// --------------------------------------------------
// GEMINI
// --------------------------------------------------

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    timeout: 120000,
  },
});

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// BASIC ROUTES
// --------------------------------------------------

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

app.get('/search-test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Search route network connection works',
  });
});

// --------------------------------------------------
// LOCAL INTENT DETECTION
// --------------------------------------------------
//
// Simple/common shopping queries are handled locally.
// This makes searches extremely fast and avoids the
// 3-10 second Gemini delay.
//
// Gemini is used only when local detection cannot
// understand the query.
// --------------------------------------------------

function getLocalIntent(query) {
  const text = String(query || '').toLowerCase();

  const intent = {
    product: '',
    category: '',
    audience: '',
    purpose: '',
    preferences: [],
    constraints: [],
    brand: '',
    maxPrice: null,
    minPrice: null,
  };

  // ------------------------------------------------
  // PRODUCT / CATEGORY
  // ------------------------------------------------

  if (
    text.includes('running shoe') ||
    text.includes('running shoes') ||
    text.includes('jogging shoe') ||
    text.includes('jogging shoes')
  ) {
    intent.product = 'running shoes';
    intent.category = 'running shoes';
  }

  if (
    text.includes('shoe') ||
    text.includes('shoes') ||
    text.includes('footwear')
  ) {
    if (!intent.product) {
      intent.product = 'running shoes';
    }

    if (!intent.category) {
      intent.category = 'running shoes';
    }
  }

  // ------------------------------------------------
  // AUDIENCE
  // ------------------------------------------------

  if (
    text.includes('beginner') ||
    text.includes('new runner') ||
    text.includes('new to running')
  ) {
    intent.audience = 'beginner';
  } else if (
    text.includes('intermediate') ||
    text.includes('regular runner')
  ) {
    intent.audience = 'intermediate';
  } else if (
    text.includes('advanced runner') ||
    text.includes('experienced runner')
  ) {
    intent.audience = 'advanced';
  }

  // ------------------------------------------------
  // PURPOSE
  // ------------------------------------------------

  if (
    text.includes('running') ||
    text.includes('jogging') ||
    text.includes('run') ||
    text.includes('5k') ||
    text.includes('5 k')
  ) {
    intent.purpose = 'running';
  } else if (
    text.includes('walking') ||
    text.includes('walk')
  ) {
    intent.purpose = 'walking';
  } else if (
    text.includes('training') ||
    text.includes('workout')
  ) {
    intent.purpose = 'training';
  }

  // ------------------------------------------------
  // FEATURES / PREFERENCES
  // ------------------------------------------------

  const possibleFeatures = [
    'comfortable',
    'comfort',
    'lightweight',
    'cushioned',
    'cushion',
    'supportive',
    'support',
    'breathable',
    'breathability',
    'soft',
    'durable',
    'flexible',
  ];

  for (const feature of possibleFeatures) {
    if (text.includes(feature)) {
      let normalizedFeature = feature;

      if (feature === 'comfort') {
        normalizedFeature = 'comfortable';
      }

      if (feature === 'cushion') {
        normalizedFeature = 'cushioned';
      }

      if (feature === 'support') {
        normalizedFeature = 'supportive';
      }

      if (feature === 'breathability') {
        normalizedFeature = 'breathable';
      }

      if (!intent.preferences.includes(normalizedFeature)) {
        intent.preferences.push(normalizedFeature);
      }
    }
  }

  // ------------------------------------------------
  // IMPACT / SHOCK ABSORPTION
  // ------------------------------------------------

  if (
    text.includes('reduces impact') ||
    text.includes('reduce impact') ||
    text.includes('impact protection') ||
    text.includes('shock absorption') ||
    text.includes('shock absorbing') ||
    text.includes('shock absorb')
  ) {
    if (!intent.preferences.includes('cushioned')) {
      intent.preferences.push('cushioned');
    }
  }

  // ------------------------------------------------
  // BRANDS
  // ------------------------------------------------

  const brands = [
    'nike',
    'adidas',
    'puma',
    'skechers',
  ];

  for (const brand of brands) {
    if (text.includes(brand)) {
      intent.brand = brand;
      break;
    }
  }

  // ------------------------------------------------
  // PRICE: UNDER / BELOW / LESS THAN / WITHIN
  // ------------------------------------------------
  //
  // Important:
  // We intentionally allow any non-digit character
  // between "under" and the number.
  //
  // This handles:
  // ₹3000
  // Rs 3000
  // INR 3000
  // ?3000
  // etc.
  //
  // This also avoids the Windows PowerShell ₹ encoding
  // problem you encountered.
  // ------------------------------------------------

  const underPriceMatch = text.match(
    /(?:under|below|less than|within)\s*[^\d\s]*\s*([\d,]+)\s*(?:rupees|rs|inr)?/i
  );

  if (underPriceMatch) {
    intent.maxPrice = Number(
      underPriceMatch[1].replace(/,/g, '')
    );

    intent.constraints.push(
      `under ${intent.maxPrice}`
    );
  }

  // ------------------------------------------------
  // PRICE: OVER / ABOVE / MORE THAN
  // ------------------------------------------------

  const overPriceMatch = text.match(
    /(?:over|above|more than)\s*[^\d\s]*\s*([\d,]+)\s*(?:rupees|rs|inr)?/i
  );

  if (overPriceMatch) {
    intent.minPrice = Number(
      overPriceMatch[1].replace(/,/g, '')
    );

    intent.constraints.push(
      `over ${intent.minPrice}`
    );
  }

  // ------------------------------------------------
  // PRICE: BETWEEN
  // ------------------------------------------------

  const betweenPriceMatch = text.match(
    /between\s*[^\d\s]*\s*([\d,]+)\s*(?:and|to|-)\s*[^\d\s]*\s*([\d,]+)/i
  );

  if (betweenPriceMatch) {
    const firstPrice = Number(
      betweenPriceMatch[1].replace(/,/g, '')
    );

    const secondPrice = Number(
      betweenPriceMatch[2].replace(/,/g, '')
    );

    intent.minPrice = Math.min(firstPrice, secondPrice);
    intent.maxPrice = Math.max(firstPrice, secondPrice);

    intent.constraints.push(
      `between ${intent.minPrice} and ${intent.maxPrice}`
    );
  }

  // ------------------------------------------------
  // CHECK WHETHER LOCAL DETECTION FOUND SOMETHING
  // ------------------------------------------------

  const hasUsefulIntent =
    intent.product ||
    intent.category ||
    intent.audience ||
    intent.purpose ||
    intent.preferences.length > 0 ||
    intent.constraints.length > 0 ||
    intent.brand ||
    intent.maxPrice !== null ||
    intent.minPrice !== null;

  return hasUsefulIntent ? intent : null;
}

// --------------------------------------------------
// GEMINI INTENT DETECTION
// --------------------------------------------------

async function getGeminiIntent(userQuery) {
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

  return JSON.parse(response.text);
}

// --------------------------------------------------
// TEST GEMINI
// --------------------------------------------------

app.post('/test-ai', async (req, res) => {
  try {
    const userQuery = req.body.query;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a query.',
      });
    }

    const intent = await getGeminiIntent(userQuery);

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

// --------------------------------------------------
// SEARCH
// --------------------------------------------------

app.post('/search', async (req, res) => {
  const startTime = Date.now();

  try {
    const userQuery = req.body.query;

    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Please provide a query.',
      });
    }

    // ----------------------------------------------
    // FIRST: LOCAL INTENT DETECTION
    // ----------------------------------------------

    let intent = getLocalIntent(userQuery);
    let source = 'local';

    // ----------------------------------------------
    // FALLBACK: GEMINI
    // ----------------------------------------------

    if (!intent) {
      console.log(
        'Using Gemini for query:',
        userQuery
      );

      intent = await getGeminiIntent(userQuery);

      source = 'gemini';
    } else {
      console.log(
        'Using local search for query:',
        userQuery
      );
    }

    // ----------------------------------------------
    // PRODUCT MATCHING
    // ----------------------------------------------

    const results = findMatchingProducts(
      products,
      intent
    );

    const elapsed = Date.now() - startTime;

    console.log(
      `Search completed in ${elapsed}ms`
    );

    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    res.json({
      success: true,
      query: userQuery,
      intent,
      source,
      results,
      searchTimeMs: elapsed,
    });
  } catch (error) {
    console.error('Search error:', error);

    res.status(500).json({
      success: false,
      error: 'Search failed.',
    });
  }
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `SmartCart AI server running on http://localhost:${PORT}`
  );
});