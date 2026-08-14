import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const productImages: Record<string, any> = {
  Skechers: require('../assets/products/skechers.png'),
  Adidas: require('../assets/products/adidas.png'),
  Nike: require('../assets/products/nike.png'),
  Puma: require('../assets/products/puma.png'),
};

export default function ProductScreen() {
  const params = useLocalSearchParams();

  const name = String(params.name || '');
  const brand = String(params.brand || '');
  const price = String(params.price || '');
  const currency = String(params.currency || 'INR');
  const matchScore = String(params.matchScore || '0');

  const matchReasons = params.matchReasons
    ? JSON.parse(String(params.matchReasons))
    : [];

  const productImage = productImages[brand];

  const addToCart = () => {
    router.push({
      pathname: '/cart',
      params: {
        name,
        brand,
        price,
        currency,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.imageContainer}>
          {productImage && (
            <Image
              source={productImage}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{brand}</Text>

          <Text style={styles.name}>{name}</Text>

          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>
              {matchScore}% match
            </Text>
          </View>

          <Text style={styles.price}>
            {currency}{' '}
            {Number(price).toLocaleString('en-IN')}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Why this product matches
          </Text>

          <View style={styles.reasonsBox}>
            {matchReasons.map(
              (reason: string, index: number) => (
                <Text key={index} style={styles.reason}>
                  ✓ {reason}
                </Text>
              )
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.cartButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={addToCart}
          >
            <Text style={styles.cartButtonText}>
              Add to Cart
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  backButton: {
    marginTop: 55,
    marginLeft: 20,
    marginBottom: 15,
  },

  backText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },

  imageContainer: {
    height: 300,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  productImage: {
    width: '90%',
    height: '90%',
  },

  content: {
    padding: 20,
  },

  brand: {
    fontSize: 15,
    color: '#777',
    fontWeight: '600',
  },

  name: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
  },

  matchBadge: {
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: '#e9f7ef',
  },

  matchText: {
    color: '#18794e',
    fontSize: 13,
    fontWeight: '800',
  },

  price: {
    marginTop: 18,
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 22,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111',
  },

  reasonsBox: {
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  reason: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },

  cartButton: {
    height: 52,
    marginTop: 25,
    borderRadius: 12,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});