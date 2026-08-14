const searchIntentSchema = {
  type: 'object',
  properties: {
    product: {
      type: 'string',
      description:
        'The product category the user wants. Use the closest category from the available products, such as "running shoes".',
    },

    audience: {
      type: 'string',
      description:
        'The intended user. Prefer dataset-compatible values such as "beginner" or "intermediate".',
    },

    purpose: {
      type: 'string',
      description:
        'The main activity or purpose. Prefer dataset-compatible values such as "running", "walking", or "training".',
    },

    preferences: {
      type: 'array',
      items: {
        type: 'string',
      },
      description:
        'Important product features requested by the user. Prefer dataset-compatible features such as "comfortable", "lightweight", "cushioned", "supportive", "breathable", or "soft".',
    },

    constraints: {
      type: 'array',
      items: {
        type: 'string',
      },
      description:
        'Important restrictions such as price limits, size requirements, or other requirements.',
    },
  },

  required: [
    'product',
    'audience',
    'purpose',
    'preferences',
    'constraints',
  ],
};

module.exports = {
  searchIntentSchema,
};