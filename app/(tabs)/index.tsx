import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  matchScore: number;
  matchReasons: string[];
};

const productImages: Record<string, any> = {
  Skechers: require('../../assets/products/skechers.png'),
  Adidas: require('../../assets/products/adidas.png'),
  Nike: require('../../assets/products/nike.png'),
  Puma: require('../../assets/products/puma.png'),
};

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchProducts = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await fetch(
        'http://10.87.54.112:3000/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Search failed.');
      }

      setProducts(data.results || []);
    } catch (err) {
      console.error('Search error:', err);

      setError(
        'Could not connect to SmartCart AI. Make sure the server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>SmartCart AI</Text>

        <Text style={styles.tagline}>
          Find products that fit what you need.
        </Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="What are you looking for?"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchProducts}
          returnKeyType="search"
        />

        <Pressable
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.searchButtonPressed,
            loading && styles.searchButtonDisabled,
          ]}
          onPress={searchProducts}
          disabled={loading}
        >
          <Text style={styles.searchButtonText}>
            {loading ? 'Searching...' : 'Search'}
          </Text>
        </Pressable>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Finding the best matches...
          </Text>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.results}
          ListHeaderComponent={
            <Text style={styles.resultsTitle}>
              Recommended for you
            </Text>
          }
          renderItem={({ item }) => {
            const productImage = productImages[item.brand];

            return (
              <View style={styles.card}>
                {productImage && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={productImage}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                <View style={styles.cardTop}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {item.name}
                    </Text>

                    <Text style={styles.brand}>
                      {item.brand}
                    </Text>
                  </View>

                  <View style={styles.matchBadge}>
                    <Text style={styles.matchBadgeText}>
                      {item.matchScore}% match
                    </Text>
                  </View>
                </View>

                <Text style={styles.price}>
                  {item.currency}{' '}
                  {item.price.toLocaleString('en-IN')}
                </Text>

                {item.matchReasons?.length > 0 && (
                  <View style={styles.reasonsBox}>
                    <Text style={styles.whyTitle}>
                      Why this matches
                    </Text>

                    {item.matchReasons.map((reason, index) => (
                      <Text
                        key={index}
                        style={styles.reason}
                      >
                        ✓ {reason}
                      </Text>
                    ))}
                  </View>
                )}

                <Pressable
                  style={({ pressed }) => [
                    styles.productButton,
                    pressed && styles.productButtonPressed,
                  ]}
                  onPress={() => {
                    router.push({
                      pathname: '/product',
                      params: {
                        name: item.name,
                        brand: item.brand,
                        price: String(item.price),
                        currency: item.currency,
                        matchScore: String(item.matchScore),
                        matchReasons: JSON.stringify(
                          item.matchReasons || []
                        ),
                      },
                    });
                  }}
                >
                  <Text style={styles.productButtonText}>
                    View Product
                  </Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}

      {!loading && !error && products.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            What do you want to shop for?
          </Text>

          <Text style={styles.emptyText}>
            Try something like:
          </Text>

          <Text style={styles.example}>
            "comfortable running shoes for beginner"
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },

  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111111',
  },

  tagline: {
    marginTop: 6,
    fontSize: 15,
    color: '#666666',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
  },

  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    color: '#111111',
    backgroundColor: '#fafafa',
  },

  searchButton: {
    marginLeft: 10,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  searchButtonPressed: {
    opacity: 0.7,
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666666',
  },

  error: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffecec',
    color: '#c62828',
    fontSize: 14,
  },

  results: {
    padding: 15,
    paddingBottom: 30,
  },

  resultsTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  imageContainer: {
    width: '100%',
    height: 170,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    borderRadius: 12,
  },

  productImage: {
    width: '90%',
    height: '90%',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  productInfo: {
    flex: 1,
    paddingRight: 10,
  },

  productName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111111',
  },

  brand: {
    marginTop: 4,
    fontSize: 14,
    color: '#666666',
  },

  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e8f5e9',
  },

  matchBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2e7d32',
  },

  price: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },

  reasonsBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },

  whyTitle: {
    marginBottom: 7,
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
  },

  reason: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#555555',
  },

  productButton: {
    marginTop: 15,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  productButtonPressed: {
    opacity: 0.7,
  },

  productButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 100,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#666666',
  },

  example: {
    marginTop: 8,
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
  },
});