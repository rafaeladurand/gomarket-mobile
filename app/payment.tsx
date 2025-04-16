import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  StatusBar,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "./cartContext";
import httpService from "./services/httpService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_URL = "http://192.168.1.18:3000";


const PaymentScreen = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<"pix" | "card" | null>(
    null
  );

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleFakePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Atenção", "Selecione um método de pagamento.");
      return;
    }

    if (selectedMethod === "card" && (!cardNumber || !expiry || !cvv)) {
      Alert.alert("Atenção", "Preencha todos os dados do cartão.");
      return;
    }

    try {
      const purchaseId = await AsyncStorage.getItem("lastPurchaseId");

      if (!purchaseId) {
        Alert.alert("Erro", "Pedido não encontrado.");
        return;
      }

      await httpService.put(`${SERVER_URL}/api/purchases/${purchaseId}/payment`, {
        isPaid: true,
      });

      clearCart();
      await AsyncStorage.removeItem("lastPurchaseId");

      router.push("/confirmation");
    } catch (error) {
      console.error("Erro no pagamento:", error);
      Alert.alert("Erro", "Falha ao processar o pagamento.");
    }
  };

  const renderContent = () => {
    if (selectedMethod === "pix") {
      return (
        <View style={styles.methodContent}>
          <Text style={styles.subtitle}>Escaneie o QR Code:</Text>
          <Image
            source={require("../assets/images/fake-qrcode.png")}
            style={styles.qrCode}
          />
          <Text style={styles.qrHint}>QR Fictício</Text>
        </View>
      );
    }

    if (selectedMethod === "card") {
      return (
        <View style={styles.methodContent}>
          <Text style={styles.subtitle}>Digite os dados do cartão</Text>

          <View style={styles.cardPreview}>
            <Text style={styles.cardText}>
              {cardNumber || "•••• •••• •••• ••••"}
            </Text>
            <View style={styles.cardDetails}>
              <Text style={styles.cardTextSmall}>
                Validade: {expiry || "MM/AA"}
              </Text>
              <Text style={styles.cardTextSmall}>CVV: {cvv || "***"}</Text>
            </View>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Número do cartão"
            keyboardType="numeric"
            maxLength={19}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="MM/AA"
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={setExpiry}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="CVV"
              keyboardType="numeric"
              maxLength={3}
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <SafeAreaView>
          <StatusBar barStyle="dark-content" />
        </SafeAreaView>

        <Text style={styles.title}>Como você deseja pagar?</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === "pix" && styles.selected,
            ]}
            onPress={() => setSelectedMethod("pix")}
          >
            <Text style={styles.methodText}>💸 Pix</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === "card" && styles.selected,
            ]}
            onPress={() => setSelectedMethod("card")}
          >
            <Text style={styles.methodText}>💳 Cartão</Text>
          </TouchableOpacity>
        </View>

        {renderContent()}

        <TouchableOpacity style={styles.payButton} onPress={handleFakePayment}>
          <Text style={styles.payText}>Pagar Agora</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff8f0",
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4E342E",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 25,
  },
  methodButton: {
    backgroundColor: "#eee",
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: "#a5d6a7",
    borderColor: "#388e3c",
  },
  methodText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  methodContent: {
    width: "100%",
    marginBottom: 30,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4E342E",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderColor: "#bbb",
    borderWidth: 1,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  cardPreview: {
    width: "100%",
    backgroundColor: "#37474F",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardText: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 10,
  },
  cardTextSmall: {
    color: "#cfd8dc",
    fontSize: 14,
  },
  cardDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCode: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  qrHint: {
    fontSize: 14,
    color: "#999",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    elevation: 2,
  },
  payText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default PaymentScreen;
