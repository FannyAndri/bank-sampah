import { FlatList } from "react-native";
import { useEffect, useState } from "react";
import { getTransactions } from "../api/user";
import TransactionCard from "../components/TransactionCard";

export default function TransactionsScreen({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getTransactions().then((res) => setData(res.data.data));
  }, []);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TransactionCard
          data={item}
          onPress={() =>
            navigation.navigate("TransactionDetail", { id: item.id })
          }
        />
      )}
    />
  );
}
