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

const EXAMPLE_QUERY = 'comfortable running shoes for beginner';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchProducts = async (searchText?: string) => {
    const finalQuery = (searchText ?? query).trim();

    if (!finalQuery) {
      return;
    }

    setQuery(finalQuery);
    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const response = await fetch(
        'https://smartcartai-qtnp.onrender.com/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: finalQuery,
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
        'Could not connect to SmartCart AI. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const useExample = () => {
    setQuery(EXAMPLE_QUERY);
  };

  return (
    <View style={styles.container}>
      {!loading && products.length === 0 ? (
        <View style={styles.homeContent}>
          <View style={styles.heroSection}>
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>S</Text>
              </View>

              <Text style={styles.logo}>SmartCart AI</Text>
            </View>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                ✦ AI-POWERED SHOPPING
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Shop smarter.
            </Text>

            <Text style={styles.heroTitleAccent}>
              Find exactly what you need.
            </Text>

            <Text style={styles.heroDescription}>
              Tell SmartCart AI what you are looking for in your
              own words. We'll understand your needs and find
              products that match.
            </Text>
          </View>

          <View style={styles.searchSection}>
            <Text style={styles.searchLabel}>
              What are you looking for?
            </Text>

            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                style={styles.input}
                placeholder="Describe your ideal product..."
                placeholderTextColor="#999999"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => searchProducts()}
                returnKeyType="search"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && styles.searchButtonPressed,
                  loading && styles.searchButtonDisabled,
                ]}
                onPress={() => searchProducts()}
                disabled={loading}
              >
                <Text style={styles.searchButtonText}>
                  {loading ? '...' : 'Search'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.searchHint}>
              Try describing your activity, experience level,
              preferences, or budget.
            </Text>
          </View>

          <View style={styles.exampleSection}>
            <Text style={styles.exampleLabel}>
              NOT SURE WHAT TO TYPE?
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.exampleCard,
                pressed && styles.exampleCardPressed,
              ]}
              onPress={useExample}
            >
              <View style={styles.exampleIcon}>
                <Text style={styles.exampleIconText}>💡</Text>
              </View>

              <View style={styles.exampleContent}>
                <Text style={styles.exampleSmall}>
                  TRY THIS EXAMPLE
                </Text>

                <Text style={styles.exampleText}>
                  "{EXAMPLE_QUERY}"
                </Text>
              </View>

              <Text style={styles.exampleArrow}>›</Text>
            </Pressable>

            <Text style={styles.exampleHint}>
              Tap the example to use it
            </Text>
          </View>

          <View style={styles.featuresSection}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text>✦</Text>
              </View>

              <Text style={styles.featureText}>
                AI understands your needs
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text>✓</Text>
              </View>

              <Text style={styles.featureText}>
                Personalized matches
              </Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Text>⚡</Text>
              </View>

              <Text style={styles.featureText}>
                Fast recommendations
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {loading && (
        <View style={styles.loadingScreen}>
          <View style={styles.loadingLogo}>
            <Text style={styles.loadingLogoText}>S</Text>
          </View>

          <ActivityIndicator
            size="large"
            style={styles.spinner}
          />

          <Text style={styles.loadingTitle}>
            Finding your best matches
          </Text>

          <Text style={styles.loadingText}>
            SmartCart AI is understanding your request...
          </Text>
        </View>
      )}

      {error && !loading ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorBox}>
            <Text style={styles.errorIcon}>!</Text>

            <Text style={styles.errorTitle}>
              Something went wrong
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => searchProducts()}
            >
              <Text style={styles.retryButtonText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {!loading && products.length > 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsTop}>
            <View>
              <View style={styles.resultsBrandRow}>
                <View style={styles.smallLogoIcon}>
                  <Text style={styles.smallLogoText}>S</Text>
                </View>

                <Text style={styles.resultsBrand}>
                  SmartCart AI
                </Text>
              </View>

              <Text style={styles.resultsTitle}>
                Recommended for you
              </Text>

              <Text style={styles.resultsSubtitle}>
                Based on: "{query}"
              </Text>
            </View>

            <Pressable
              style={styles.newSearchButton}
              onPress={() => {
                setProducts([]);
                setQuery('');
                setError('');
              }}
            >
              <Text style={styles.newSearchText}>
                New search
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.results}
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

                      <View style={styles.matchBadge}>
                        <Text style={styles.matchBadgeText}>
                          {item.matchScore}% MATCH
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.productHeader}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>
                        {item.name}
                      </Text>

                      <Text style={styles.brand}>
                        {item.brand}
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
                        <View
                          key={`${item.id}-reason-${index}`}
                          style={styles.reasonRow}
                        >
                          <View style={styles.checkCircle}>
                            <Text style={styles.checkText}>
                              ✓
                            </Text>
                          </View>

                          <Text style={styles.reason}>
                            {reason}
                          </Text>
                        </View>
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

                    <Text style={styles.arrow}>→</Text>
                  </Pressable>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  homeContent: {
    flex: 1,
  },

  heroSection: {
    paddingTop: 58,
    paddingHorizontal: 22,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  logoIconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },

  logo: {
    fontSize: 25,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    marginTop: 28,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
  },

  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#5B4BDB',
  },

  heroTitle: {
    marginTop: 18,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -1,
  },

  heroTitleAccent: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    color: '#5B4BDB',
    letterSpacing: -1,
  },

  heroDescription: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    color: '#707070',
    maxWidth: 350,
  },

  searchSection: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },

  searchLabel: {
    marginBottom: 9,
    fontSize: 14,
    fontWeight: '800',
    color: '#222222',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingLeft: 14,
    paddingRight: 6,
    borderWidth: 1,
    borderColor: '#DCDDE5',
    borderRadius: 16,
    backgroundColor: '#FAFAFC',
  },

  searchIcon: {
    marginRight: 7,
    fontSize: 26,
    color: '#777777',
  },

  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 14,
    color: '#111111',
  },

  searchButton: {
    height: 44,
    paddingHorizontal: 17,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },

  searchButtonPressed: {
    opacity: 0.7,
  },

  searchButtonDisabled: {
    opacity: 0.5,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  searchHint: {
    marginTop: 9,
    fontSize: 11,
    lineHeight: 17,
    color: '#929292',
  },

  exampleSection: {
    paddingHorizontal: 18,
    paddingTop: 19,
  },

  exampleLabel: {
    marginBottom: 9,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#999999',
  },

  exampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E2FF',
    borderRadius: 16,
    backgroundColor: '#F8F7FF',
  },

  exampleCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  exampleIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  exampleIconText: {
    fontSize: 19,
  },

  exampleContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  exampleSmall: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    color: '#777777',
  },

  exampleText: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: '#28223F',
  },

  exampleArrow: {
    fontSize: 27,
    color: '#5B4BDB',
    fontWeight: '300',
  },

  exampleHint: {
    marginTop: 7,
    fontSize: 11,
    color: '#999999',
    textAlign: 'center',
  },

  featuresSection: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 15,
    gap: 8,
  },

  featureItem: {
    flex: 1,
    alignItems: 'center',
  },

  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 7,
  },

  featureText: {
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: '#777777',
  },

  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F7FB',
  },

  loadingLogo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },

  loadingLogoText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },

  spinner: {
    marginTop: 28,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: '800',
    color: '#151515',
    textAlign: 'center',
  },

  loadingText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: '#777777',
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F7FB',
  },

  errorBox: {
    width: '100%',
    padding: 22,
    borderRadius: 18,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },

  errorIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFEAEA',
    color: '#C62828',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 42,
  },

  errorTitle: {
    marginTop: 13,
    fontSize: 18,
    fontWeight: '800',
    color: '#222222',
  },

  errorText: {
    marginTop: 7,
    fontSize: 13,
    lineHeight: 19,
    color: '#777777',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 18,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: '#111111',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  resultsContainer: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  resultsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 18,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },

  resultsBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  smallLogoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },

  smallLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },

  resultsBrand: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#222222',
  },

  resultsTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#151515',
  },

  resultsSubtitle: {
    marginTop: 5,
    maxWidth: 245,
    fontSize: 12,
    lineHeight: 18,
    color: '#777777',
  },

  newSearchButton: {
    marginTop: 29,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F0EFFF',
  },

  newSearchText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#5B4BDB',
  },

  results: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  card: {
    marginBottom: 17,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  imageContainer: {
    width: '100%',
    height: 180,
    marginBottom: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8FA',
    position: 'relative',
  },

  productImage: {
    width: '88%',
    height: '88%',
  },

  matchBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E8F7EC',
  },

  matchBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#26813A',
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#151515',
  },

  brand: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#777777',
  },

  price: {
    marginTop: 9,
    fontSize: 21,
    fontWeight: '900',
    color: '#111111',
  },

  reasonsBox: {
    marginTop: 14,
    padding: 13,
    borderRadius: 14,
    backgroundColor: '#F7F8FA',
  },

  whyTitle: {
    marginBottom: 7,
    fontSize: 13,
    fontWeight: '900',
    color: '#333333',
  },

  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#E5F5E9',
  },

  checkText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#2E7D32',
  },

  reason: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#555555',
  },

  productButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 15,
    borderRadius: 12,
    backgroundColor: '#111111',
  },

  productButtonPressed: {
    opacity: 0.7,
  },

  productButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  arrow: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});