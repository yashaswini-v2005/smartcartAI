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


// ============================================================
// BASIC ROUTES
// ============================================================

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


// ============================================================
// LOCAL INTENT DETECTION
// ============================================================

function getLocalIntent(query) {
  const text = query.toLowerCase();

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


  // ----------------------------------------------------------
  // PRODUCT / CATEGORY
  // ----------------------------------------------------------

  if (
    text.includes('running shoe') ||
    text.includes('running shoes') ||
    text.includes('jogging shoe') ||
    text.includes('jogging shoes') ||
    text.includes('footwear') ||
    text.includes('sneaker') ||
    text.includes('sneakers')
  ) {
    intent.product = 'running shoes';
    intent.category = 'running shoes';
  }


  // ----------------------------------------------------------
  // AUDIENCE
  // ----------------------------------------------------------

  if (
    text.includes('beginner') ||
    text.includes('new runner') ||
    text.includes('first time runner')
  ) {
    intent.audience = 'beginner';
  } else if (text.includes('intermediate')) {
    intent.audience = 'intermediate';
  } else if (
    text.includes('runner') ||
    text.includes('running')
  ) {
    intent.audience = 'runner';
  }


  // ----------------------------------------------------------
  // PURPOSE
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // PREFERENCES
  // ----------------------------------------------------------

  const possiblePreferences = [
    'comfortable',
    'lightweight',
    'cushioned',
    'supportive',
    'breathable',
    'soft',
    'durable',
    'flexible',
    'shock absorption',
    'shock absorbing',
    'impact protection',
    'impact reduction',
    'reduces impact',
    'reduce impact',
  ];

  for (const preference of possiblePreferences) {
    if (text.includes(preference)) {
      intent.preferences.push(preference);
    }
  }


  // ----------------------------------------------------------
  // BRANDS
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // PRICE: UNDER / BELOW / LESS THAN / WITHIN
  // ----------------------------------------------------------

  const underPriceMatch = text.match(
    /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
  );

  if (underPriceMatch) {
    intent.maxPrice = Number(
      underPriceMatch[1].replace(/,/g, '')
    );

    intent.constraints.push(
      `under ${intent.maxPrice}`
    );
  }


  // ----------------------------------------------------------
  // PRICE: OVER / ABOVE / MORE THAN
  // ----------------------------------------------------------

  const overPriceMatch = text.match(
    /(?:over|above|more than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
  );

  if (overPriceMatch) {
    intent.minPrice = Number(
      overPriceMatch[1].replace(/,/g, '')
    );

    intent.constraints.push(
      `over ${intent.minPrice}`
    );
  }


  // ----------------------------------------------------------
  // CHECK WHETHER LOCAL DETECTION FOUND SOMETHING
  // ----------------------------------------------------------

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


// ============================================================
// GEMINI INTENT DETECTION
// ============================================================

async function getGeminiIntent(userQuery) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',

    contents: `Analyze this shopping request and extract the user's shopping intent.

User request:
"${userQuery}"

Important:
- If the user mentions footwear, shoes, sneakers, running, jogging, a 5K, or similar activity, identify the product as running shoes when appropriate.
- Identify the purpose as running when the request is about running or a 5K.
- Put requirements such as comfortable, lightweight, cushioned, shock absorbing, or impact reduction into preferences.
- Put price limits such as under ₹3000 into constraints.

Return only the structured information requested by the response schema.`,

    config: {
      responseMimeType: 'application/json',
      responseSchema: searchIntentSchema,
    },
  });

  return JSON.parse(response.text);
}


// ============================================================
// TEST GEMINI
// ============================================================

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


// ============================================================
// SEARCH
// ============================================================

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


    // --------------------------------------------------------
    // FIRST: TRY LOCAL INTENT DETECTION
    // --------------------------------------------------------

    let intent = getLocalIntent(userQuery);

    let source = 'local';


    // --------------------------------------------------------
    // FALLBACK TO GEMINI
    // --------------------------------------------------------

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


    // --------------------------------------------------------
    // FIND PRODUCTS
    // --------------------------------------------------------

    const results = findMatchingProducts(
      products,
      intent
    );


    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    const elapsed = Date.now() - startTime;

    console.log(
      `Search completed in ${elapsed}ms`
    );

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


// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
  console.log(
    `SmartCart AI server running on http://localhost:${PORT}`
  );
});