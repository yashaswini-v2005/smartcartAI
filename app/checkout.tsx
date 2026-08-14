import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function CheckoutScreen() {
  const params = useLocalSearchParams();

  const name = String(params.name || '');
  const brand = String(params.brand || '');
  const price = Number(params.price || 0);
  const currency = String(params.currency || 'INR');
  const quantity = Number(params.quantity || 1);

  const total = price * quantity;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [error, setError] = useState('');

  const placeOrder = () => {
    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!address.trim()) {
      setError('Please enter your delivery address.');
      return;
    }

    setError('');

    router.push({
      pathname: '/order-success',
      params: {
        name,
        brand,
        price: String(price),
        currency,
        quantity: String(quantity),
        total: String(total),
        customerName,
        paymentMethod,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>Checkout</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Delivery Details
          </Text>

          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#888"
            value={customerName}
            onChangeText={setCustomerName}
          />

          <Text style={styles.label}>Phone Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />

          <Text style={styles.label}>Delivery Address</Text>

          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Enter your complete delivery address"
            placeholderTextColor="#888"
            value={address}
            onChangeText={setAddress}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Payment Method
          </Text>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'Cash on Delivery' &&
                styles.paymentOptionSelected,
            ]}
            onPress={() =>
              setPaymentMethod('Cash on Delivery')
            }
          >
            <View style={styles.radio}>
              {paymentMethod === 'Cash on Delivery' && (
                <View style={styles.radioInner} />
              )}
            </View>

            <View>
              <Text style={styles.paymentTitle}>
                Cash on Delivery
              </Text>

              <Text style={styles.paymentSubtitle}>
                Pay when your order arrives
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={[
              styles.paymentOption,
              paymentMethod === 'Demo Card Payment' &&
                styles.paymentOptionSelected,
            ]}
            onPress={() =>
              setPaymentMethod('Demo Card Payment')
            }
          >
            <View style={styles.radio}>
              {paymentMethod === 'Demo Card Payment' && (
                <View style={styles.radioInner} />
              )}
            </View>

            <View>
              <Text style={styles.paymentTitle}>
                Demo Card Payment
              </Text>

              <Text style={styles.paymentSubtitle}>
                Demo only — no real payment
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryProduct}>
              <Text style={styles.productName}>
                {name}
              </Text>

              <Text style={styles.productDetails}>
                {brand} · Quantity: {quantity}
              </Text>
            </View>

            <Text style={styles.summaryPrice}>
              {currency}{' '}
              {total.toLocaleString('en-IN')}
            </Text>
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
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.placeOrderButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={placeOrder}
        >
          <Text style={styles.placeOrderText}>
            Place Order
          </Text>
        </Pressable>

        <Text style={styles.demoNote}>
          This is a demo checkout. No real payment will be
          processed.
        </Text>
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

  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111',
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#fafafa',
    color: '#111',
    fontSize: 15,
  },

  addressInput: {
    height: 100,
    paddingTop: 14,
  },

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  paymentOptionSelected: {
    borderColor: '#111',
    backgroundColor: '#fafafa',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#777',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111',
  },

  paymentTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  paymentSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: '#777',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 15,
  },

  summaryProduct: {
    flex: 1,
  },

  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111',
  },

  productDetails: {
    marginTop: 5,
    fontSize: 13,
    color: '#777',
  },

  summaryPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 18,
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

  error: {
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#c62828',
    fontSize: 14,
    fontWeight: '600',
  },

  placeOrderButton: {
    height: 54,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  demoNote: {
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 12,
    marginBottom: 35,
    fontSize: 12,
    color: '#777',
  },
});