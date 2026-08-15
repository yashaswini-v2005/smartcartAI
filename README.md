# SmartCart AI 🛒🤖

SmartCart AI is a React Native mobile eCommerce application that provides **conversational product search** using natural-language queries.

Instead of requiring users to select multiple filters, they can simply describe what they are looking for, for example:

> "Show me running shoes under ₹5,000 suitable for beginners."

The application uses AI to understand the user's intent, matches that intent against a sample product dataset, and explains why each recommended product matches the request.

---

## Features

* 🔎 Natural-language product search
* 🤖 AI-powered intent understanding
* 🛍️ Product recommendations from a sample dataset
* 🎯 Match scoring for recommended products
* 💡 Explanations showing why a product matches
* 💰 Price constraint handling
* 👟 Product images and product information
* 📱 React Native mobile interface
* ☁️ Deployed backend API
* ✨ Clean and intuitive user interface

---

## Example Query

```text
Show me running shoes under ₹5,000 suitable for beginners.
```

SmartCart AI interprets the request and identifies information such as:

* Product category: running shoes
* Audience: beginner
* Purpose: running
* Price constraint: under ₹5,000

The application then ranks suitable products and displays the reasons for each recommendation.

---

## How It Works

The application follows a simple conversational search pipeline:

```text
User enters a natural-language query
            ↓
      Mobile React Native App
            ↓
        Backend API
            ↓
       AI Intent Analysis
            ↓
     Structured Search Intent
            ↓
       Product Matcher
            ↓
   Match Score + Match Reasons
            ↓
      Recommended Products
```

### 1. User Query

The user enters a natural-language request in the mobile application.

Example:

```text
comfortable running shoes for beginner
```

### 2. Intent Understanding

The backend processes the query and extracts structured information such as:

* Product
* Audience
* Purpose
* Preferences
* Constraints

### 3. Product Matching

The structured intent is compared against the available products.

The matcher considers:

* Product category
* Intended audience
* Product purpose
* Brand
* Product features
* Price constraints

### 4. Match Scoring

Products receive a match score based on how many requested characteristics they satisfy.

### 5. Explanation

The application displays matching reasons so that users can understand why a product was recommended.

For example:

```text
✓ Suitable for beginner
✓ Good for running
✓ Has comfortable feature
✓ Has lightweight feature
✓ Within ₹5,000
```

---

## Project Structure

```text
SmartCartAI/
│
├── app/
│   ├── (tabs)/
│   │   └── index.tsx
│   └── product.tsx
│
├── assets/
│   └── products/
│
├── components/
│
├── constants/
│
├── data/
│
├── hooks/
│
├── server/
│   ├── index.js
│   ├── intent.js
│   ├── matcher.js
│   └── products.js
│
├── types/
│
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## Technologies Used

### Mobile Application

* React Native
* Expo
* Expo Router
* TypeScript

### Backend

* Node.js
* Express.js

### AI

* Google Gemini API for natural-language intent understanding

### Deployment

* Render for backend deployment
* Expo Application Services (EAS) for Android builds

---

## Sample Product Dataset

The current application uses a sample dataset of running shoes.

Example products include:

* Skechers Go Run
* Adidas Runfalcon
* Nike Revolution
* Puma Softride

Each product contains information such as:

```text
Product name
Brand
Category
Audience
Purpose
Features
Price
Currency
```

This dataset allows the conversational search system to demonstrate product discovery and recommendation without requiring a production database.

---

## Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Expo CLI / Expo tooling
* Android device or Android emulator

### Install the mobile application dependencies

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project:

```bash
cd SmartCartAI
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

The application can then be opened using an Android device, emulator, or supported Expo development environment.

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install backend dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Add the required Gemini API key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Do not commit the `.env` file or API keys to GitHub.

Start the backend server using the project's configured server command.

---

## API

The mobile application communicates with the backend through the search endpoint:

```text
POST /search
```

Example request:

```json
{
  "query": "Show me running shoes under ₹5,000 suitable for beginners."
}
```

The backend processes the request and returns the recommended products together with their match information.

---

## Environment Variables

The backend requires:

```text
GEMINI_API_KEY
```

API keys and other secrets should be stored in environment variables and should **never be committed to the repository**.

---

## Third-Party Services and Libraries

This project uses the following third-party technologies:

* **React Native** — mobile application framework
* **Expo** — React Native development and build platform
* **Expo Router** — file-based navigation
* **Node.js** — backend runtime
* **Express.js** — backend API framework
* **Google Gemini API** — natural-language intent understanding
* **Render** — backend hosting
* **Expo Application Services (EAS)** — Android application builds

---

## Backend Deployment

The backend is deployed using Render.

The mobile application communicates with the deployed backend rather than relying on a local development IP address.

---

## Android Build

The Android application can be built using Expo Application Services:

```bash
eas build --platform android --profile preview
```

The generated Android application can then be installed on a compatible Android device.

---

## Assessment Requirements

This project was developed for the **Conversational Search for an eCommerce Application** technical assessment.

The implementation addresses the requested requirements:

| Requirement              | Implementation                                            |
| ------------------------ | --------------------------------------------------------- |
| React Native             | Expo + React Native                                       |
| Natural-language search  | Conversational search input                               |
| AI intent understanding  | Gemini-powered intent extraction                          |
| Sample products          | Local product dataset                                     |
| Relevant recommendations | Intent-based product matching                             |
| Explain recommendations  | Match reasons displayed for products                      |
| Clean user experience    | Custom mobile UI                                          |
| Scalable architecture    | Separate mobile, backend, intent, matcher and data layers |
| README                   | Project setup and implementation documentation            |
| Third-party services     | Documented above                                          |

---

## Future Improvements

Possible future improvements include:

* Connecting to a larger product database
* Adding category and brand filters
* Supporting product availability and stock
* Adding shopping cart functionality
* Adding user accounts and saved searches
* Personalizing recommendations based on previous searches
* Adding more product categories
* Improving ranking with additional recommendation signals

---

## Author

**Yashaswini **

SmartCart AI — Conversational Product Search Application
