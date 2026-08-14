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

  // Constraints
  const constraints = Array.isArray(intent.constraints)
    ? intent.constraints
    : [];

  for (const constraint of constraints) {
    const constraintText = normalizeText(constraint);

    if (!constraintText) {
      continue;
    }

    // Price constraints
    const priceMatch = constraintText.match(
      /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (priceMatch) {
      const maxPrice = Number(
        priceMatch[1].replace(/,/g, '')
      );

      if (product.price <= maxPrice) {
        score += 15;
      } else {
        score -= 10;
      }

      continue;
    }

    // Generic constraint/feature matching
    const matchingFeature = (product.features || []).some((feature) => {
      const featureText = normalizeText(feature);

      return (
        featureText.includes(constraintText) ||
        constraintText.includes(featureText)
      );
    });

    if (matchingFeature) {
      score += 10;
    }
  }

  return Math.max(score, 0);
}

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

    const priceMatch = constraintText.match(
      /(?:under|below|less than|within)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/i
    );

    if (priceMatch) {
      const maxPrice = Number(
        priceMatch[1].replace(/,/g, '')
      );

      if (product.price <= maxPrice) {
        reasons.push(`Within ₹${maxPrice}`);
      }
    }
  }

  return reasons;
}

function findMatchingProducts(products, intent) {
  return products
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
};