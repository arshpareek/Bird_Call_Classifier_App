import Storage from 'expo-native-storage';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function History() {

  interface ItemType {
    id: number;
    name: string;
    // Add other properties as needed
  }

  const STORAGE_KEY = 'history';
  const [historyData, setHistoryData] = useState<ItemType[]>([]);

  const getHistory = async () => {
    try{
      const historyList = await Storage.getItem(STORAGE_KEY);
      setHistoryData(historyList != null ? JSON.parse(historyList) : []);
    }
    catch (error) {
      console.error('Error getting search term:', error)
    }
  }

  const addToHistory = async (item: string) => {
    try{
      getHistory();
      const currentHistory = historyData;
      const newHistory = currentHistory.unshift({id: Date.now(), name: item});
      await Storage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    }
    catch (error){
      console.error('Error saving search term:', error);
    }
  }

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <View
      style={styles.container}
    >
      <Text style = {styles.text}>This is the history page.</Text>
      <View style={styles.list}>
        <FlatList data={historyData} keyExtractor={(item) => `${item.id}`} renderItem={({item}) => (
          <View>
            <Text>{item.name}</Text>
          </View>
        )}>

        </FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  list: {

  }
})