import { Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { FilterStatus } from '@/types/FilterStatus';
import { Item } from '@/components/Item';
import { useEffect, useState } from 'react';
import { itemsStorage } from '@/storage/itemsStorage';

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING)
  const [description, setDescription] = useState<string>("")
  const [items, setItems] = useState<any>([])

  function handleAddItem(){
    if(!description.trim()){
      return Alert.alert("Adicionar","Informe a descrição para adicionar o item.")
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description, 
      status: FilterStatus.PENDING
    }

    setItems((prevState: any) => [...prevState, newItem])
  }

  async function getItems(){
    try {
      const response = await itemsStorage.get()

      setItems(response)
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Não foi possível filtrar os itens.")
    }
  }

  useEffect(()=>{
    getItems()
  },[])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo} />

      <View style={styles.form}>
        <Input placeholder='O que você precisa comprar?' onChangeText={setDescription} />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => <Filter key={status} status={status} isActive onPress={()=> setFilter(status)}/>)}
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => { }}
              onRemove={() => { }}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator}></View>}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => <Text style={styles.empty}>Nenhum item aqui.</Text>}
        />
      </View>
    </View>
  );
}


