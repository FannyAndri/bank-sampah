import { View, Text, TouchableOpacity } from "react-native";

export default function TransactionCard({ data, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 16, borderBottomWidth: 1 }}>
        <Text>{data.transaction_code}</Text>
        <Text>Rp {data.total_amount}</Text>
      </View>
    </TouchableOpacity>
  );
}
