import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const productImages: Record<string, any> = {
  Skechers: require('../assets/products/skechers.png'),
  Adidas: require('../assets/products/adidas.png'),
  Nike: require('../assets/products/nike.png'),
  Puma: require('../assets/products/puma.png'),
};

export default function CartScreen() {
  const params = useLocalSearchParams();

  const name = String(params.name || '');
  const brand = String(params.brand || '');
  const price = Number(params.price || 0);
  const currency = String(params.currency || 'INR');

  const [quantity, setQuantity] = useState(1);

  const total = price * quantity;

  const productImage = productImages[brand];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Your Cart</Text>

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

          <View style={styles.productInfo}>
            <Text style={styles.brand}>
              {brand}
            </Text>

            <Text style={styles.productName}>
              {name}
            </Text>

            <Text style={styles.price}>
              {currency}{' '}
              {price.toLocaleString('en-IN')}
            </Text>
          </View>

          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>
              Quantity
            </Text>

            <View style={styles.quantityControls}>
              <Pressable
                style={[
                  styles.quantityButton,
                  quantity === 1 &&
                    styles.quantityButtonDisabled,
                ]}
                onPress={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
                disabled={quantity === 1}
              >
                <Text style={styles.quantityButtonText}>
                  −
                </Text>
              </Pressable>

              <View style={styles.quantityBox}>
                <Text style={styles.quantity}>
                  {quantity}
                </Text>
              </View>

              <Pressable
                style={styles.quantityButton}
                onPress={() => {
                  setQuantity(quantity + 1);
                }}
              >
                <Text style={styles.quantityButtonText}>
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalPrice}>
              {currency}{' '}
              {total.toLocaleString('en-IN')}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.checkoutButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => {
              router.push({
                pathname: '/checkout',
                params: {
                  name,
                  brand,
                  price: String(price),
                  currency,
                  quantity: String(quantity),
                },
              });
            }}
          >
            <Text style={styles.checkoutButtonText}>
              Proceed to Checkout
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
    marginBottom: 10,
  },

  backText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  imageContainer: {
    height: 220,
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: '90%',
    height: '90%',
  },

  productInfo: {
    marginTop: 18,
  },

  brand: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },

  productName: {
    marginTop: 5,
    fontSize: 21,
    fontWeight: '800',
    color: '#111',
  },

  price: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: '800',
    color: '#111',
  },

  quantityRow: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonDisabled: {
    opacity: 0.35,
  },

  quantityButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },

  quantityBox: {
    width: 45,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 22,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },

  totalPrice: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111',
  },

  checkoutButton: {
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

  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});