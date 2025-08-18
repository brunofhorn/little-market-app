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

  async function handleAddItem(){
    if(!description.trim()){
      return Alert.alert("Adicionar","Informe a descrição para adicionar o item.")
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description, 
      status: FilterStatus.PENDING
    }

    await itemsStorage.add(newItem)

    setDescription("")
    setFilter(FilterStatus.PENDING)
    Alert.alert("Adicionado", `O item ${description} foi adicionado.`)
  }

  async function itemsByStatus(){
    try {
      const response = await itemsStorage.getByStatus(filter)

      setItems(response)
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Não foi possível filtrar os itens.")
    }
  }

  async function handleRemove(id: string){
    try {
      await itemsStorage.remove(id)
      await itemsByStatus()
    } catch (error) {
      console.error(error)
      Alert.alert("Remover","Não foi possível remover o item.")
    }
  }

  useEffect(()=>{
    itemsByStatus()
  },[filter])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo} />

      <View style={styles.form}>
        <Input value={description} placeholder='O que você precisa comprar?' onChangeText={setDescription} />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => <Filter key={status} status={status} isActive={filter === status} onPress={()=> setFilter(status)}/>)}
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
              onRemove={() => handleRemove(item.id)}
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


