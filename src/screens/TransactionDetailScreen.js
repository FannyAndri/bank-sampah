import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getTransactionDetail } from "../api/user";

export default function TransactionDetailScreen({ route }) {
  const { id } = route.params;
  const [trx, setTrx] = useState(null);

  useEffect(() => {
    getTransactionDetail(id).then((res) => setTrx(res.data));
  }, []);

  if (!trx) return null;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>
        Kode: {trx.transaction_code}
      </Text>
      <Text>Kasir: {trx.cashier_name}</Text>
      <Text>Total: Rp {trx.total_amount}</Text>

      <FlatList
        data={trx.items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 8 }}>
            <Text>{item.waste_type_name}</Text>
            <Text>
              {item.weight} kg x Rp {item.price_per_kg}
            </Text>
            <Text>Subtotal: Rp {item.subtotal}</Text>
          </View>
        )}
      />
    </View>
  );
}
