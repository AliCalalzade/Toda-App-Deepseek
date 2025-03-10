// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TextInput, Card } from 'react-native-paper';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks !== null) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks', error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks', error);
    }
  };

  const addTask = () => {
    if (newTask.trim() === '') return;
    const updatedTasks = [...tasks, { id: Date.now().toString(), text: newTask, completed: false }];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask('');
  };

  const editTask = (id, newText) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditingTaskId(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Günlük Planlaşdırıcı</Text>
        <TextInput
          style={styles.input}
          placeholder="Yeni tapşırıq əlavə et..."
          value={newTask}
          onChangeText={setNewTask}
        />
        <Button title="Əlavə Et" onPress={addTask} />
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.taskCard}>
              <View style={styles.taskItem}>
                <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                  <Icon
                    name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                    size={24}
                    color={item.completed ? 'green' : 'gray'}
                  />
                </TouchableOpacity>
                {editingTaskId === item.id ? (
                  <TextInput
                    style={styles.editInput}
                    value={item.text}
                    onChangeText={(text) => editTask(item.id, text)}
                    autoFocus
                  />
                ) : (
                  <Text
                    style={[styles.taskText, item.completed && styles.completedTask]}
                    onPress={() => setEditingTaskId(item.id)}
                  >
                    {item.text}
                  </Text>
                )}
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  taskCard: {
    marginBottom: 10,
    padding: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  editInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },
});

export default App;