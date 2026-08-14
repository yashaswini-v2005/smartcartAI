function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function matchesText(productValues, requestedValue) {
  const requested = normalizeText(requestedValue);

  if (!requested) {
    return false;
  }

  return productValues.some((item) => {
    const productValue = normalizeText(item);

    return (
      productValue === requested ||
      productValue.includes(requested) ||
      requested.includes(productValue)
    );
  });
}

// ------------------------------------
// HARD PRICE CONSTRAINT CHECK
// ------------------------------------

function violatesPriceConstraint(product, intent) {
  const constraints = Array.isArray(intent.constraints)
    ? intent.constraints
    : [];

  for (const constraint of constraints) {
    const constraintText = normalizeText(constraint);

    // Under / below / less than / within
    const underMatch = constraintText.match(
      /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (underMatch) {
      const maxPrice = Number(
        underMatch[1].replace(/,/g, '')
      );

      if (product.price > maxPrice) {
        return true;
      }
    }

    // Over / above / more than
    const overMatch = constraintText.match(
      /(?:over|above|more than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (overMatch) {
      const minPrice = Number(
        overMatch[1].replace(/,/g, '')
      );

      if (product.price < minPrice) {
        return true;
      }
    }
  }

  return false;
}

// ------------------------------------
// MATCH SCORE
// ------------------------------------

function calculateMatchScore(product, intent) {
  let score = 0;

  const requestedProduct = normalizeText(intent.product);
  const requestedCategory = normalizeText(intent.category);
  const requestedAudience = normalizeText(intent.audience);
  const requestedPurpose = normalizeText(intent.purpose);
  const requestedBrand = normalizeText(intent.brand);

  // Product / category
  if (
    requestedProduct &&
    (
      normalizeText(product.category).includes(requestedProduct) ||
      requestedProduct.includes(normalizeText(product.category))
    )
  ) {
    score += 40;
  } else if (
    requestedCategory &&
    (
      normalizeText(product.category).includes(requestedCategory) ||
      requestedCategory.includes(normalizeText(product.category))
    )
  ) {
    score += 40;
  }

  // Audience
  if (
    requestedAudience &&
    matchesText(product.audience || [], requestedAudience)
  ) {
    score += 20;
  }

  // Purpose
  if (
    requestedPurpose &&
    matchesText(product.purpose || [], requestedPurpose)
  ) {
    score += 20;
  }

  // Brand
  if (
    requestedBrand &&
    normalizeText(product.brand) === requestedBrand
  ) {
    score += 15;
  }

  // Preferences
  const preferences = Array.isArray(intent.preferences)
    ? intent.preferences
    : [];

  for (const preference of preferences) {
    const preferenceText = normalizeText(preference);

    if (!preferenceText) {
      continue;
    }

    const matchingFeature = (product.features || []).some((feature) => {
      const featureText = normalizeText(feature);

      return (
        featureText.includes(preferenceText) ||
        preferenceText.includes(featureText)
      );
    });

    if (matchingFeature) {
      score += 10;
    }
  }

  // Price constraints
  const constraints = Array.isArray(intent.constraints)
    ? intent.constraints
    : [];

  for (const constraint of constraints) {
    const constraintText = normalizeText(constraint);

    if (!constraintText) {
      continue;
    }

    const underMatch = constraintText.match(
      /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (underMatch) {
      const maxPrice = Number(
        underMatch[1].replace(/,/g, '')
      );

      if (product.price <= maxPrice) {
        score += 15;
      }

      continue;
    }

    const overMatch = constraintText.match(
      /(?:over|above|more than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (overMatch) {
      const minPrice = Number(
        overMatch[1].replace(/,/g, '')
      );

      if (product.price >= minPrice) {
        score += 15;
      }
    }
  }

  return Math.max(score, 0);
}

// ------------------------------------
// MATCH REASONS
// ------------------------------------

function getMatchReasons(product, intent) {
  const reasons = [];

  const requestedAudience = normalizeText(intent.audience);
  const requestedPurpose = normalizeText(intent.purpose);
  const requestedBrand = normalizeText(intent.brand);

  if (
    requestedAudience &&
    matchesText(product.audience || [], requestedAudience)
  ) {
    reasons.push(`Suitable for ${intent.audience}`);
  }

  if (
    requestedPurpose &&
    matchesText(product.purpose || [], requestedPurpose)
  ) {
    reasons.push(`Good for ${intent.purpose}`);
  }

  if (
    requestedBrand &&
    normalizeText(product.brand) === requestedBrand
  ) {
    reasons.push(`Brand: ${product.brand}`);
  }

  const preferences = Array.isArray(intent.preferences)
    ? intent.preferences
    : [];

  for (const preference of preferences) {
    const preferenceText = normalizeText(preference);

    if (!preferenceText) {
      continue;
    }

    const matchingFeature = (product.features || []).find((feature) => {
      const featureText = normalizeText(feature);

      return (
        featureText.includes(preferenceText) ||
        preferenceText.includes(featureText)
      );
    });

    if (matchingFeature) {
      reasons.push(`Has ${matchingFeature} feature`);
    }
  }

  const constraints = Array.isArray(intent.constraints)
    ? intent.constraints
    : [];

  for (const constraint of constraints) {
    const constraintText = normalizeText(constraint);

    const underMatch = constraintText.match(
      /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (underMatch) {
      const maxPrice = Number(
        underMatch[1].replace(/,/g, '')
      );

      if (product.price <= maxPrice) {
        reasons.push(`Within ₹${maxPrice}`);
      }

      continue;
    }

    const overMatch = constraintText.match(
      /(?:over|above|more than)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (overMatch) {
      const minPrice = Number(
        overMatch[1].replace(/,/g, '')
      );

      if (product.price >= minPrice) {
        reasons.push(`Above ₹${minPrice}`);
      }
    }
  }

  return reasons;
}

// ------------------------------------
// FIND MATCHING PRODUCTS
// ------------------------------------

function findMatchingProducts(products, intent) {
  return products
    // IMPORTANT:
    // Explicit price limits are hard filters.
    .filter((product) => !violatesPriceConstraint(product, intent))
    .map((product) => ({
      ...product,
      matchScore: calculateMatchScore(product, intent),
      matchReasons: getMatchReasons(product, intent),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = {
  calculateMatchScore,
  getMatchReasons,
  findMatchingProducts,
  violatesPriceConstraint,
};