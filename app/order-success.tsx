import { router } from 'expo-router';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function OrderSuccessScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>

        <Text style={styles.subtitle}>
          Your SmartCart AI order has been placed successfully.
        </Text>

        <View style={styles.orderBox}>
          <Text style={styles.orderLabel}>ORDER STATUS</Text>

          <Text style={styles.orderStatus}>
            Confirmed
          </Text>

          <Text style={styles.deliveryText}>
            Your order will be delivered to your address.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.homeButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeButtonText}>
            Continue Shopping
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#e9f7ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  checkmark: {
    fontSize: 52,
    fontWeight: '800',
    color: '#18794e',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },

  orderBox: {
    width: '100%',
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },

  orderLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 1,
  },

  orderStatus: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: '#18794e',
  },

  deliveryText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  homeButton: {
    width: '100%',
    height: 52,
    marginTop: 25,
    borderRadius: 12,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.7,
  },

  homeButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});