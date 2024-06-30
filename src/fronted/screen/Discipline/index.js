import React, { useState } from "react";

import {
    Pressable,

    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native"

import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useDerivedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from "react-native-paper";
import Vector from "react-native-vector-icons/MaterialCommunityIcons";
import sheetStyles from "./sheetStyles ";

const storeLastAccessed = async () => {
    try {
        await AsyncStorage.setItem('@last_accessed', new Date().toISOString());
    } catch (error) {
        // Handle error
    }
};




const getLastAccessed = async () => {
    try {
        const value = await AsyncStorage.getItem('@last_accessed');
        if (value !== null) {
            return new Date(value);
        }
    } catch (error) {
        // Handle error
    }
};



function BottomSheet({ isOpen, toggleSheet, duration = 500, children }) {
    const { colorScheme } = useColorScheme();
    const height = useSharedValue(0);
    const progress = useDerivedValue(() =>
        withTiming(isOpen.value ? 0 : 1, { duration })
    );

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: progress.value * 2 * height.value }],
    }));

    const backgroundColorSheetStyle = {
        backgroundColor: colorScheme === 'light' ? '#f8f9ff' : '#272B3C',
    };

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
        zIndex: isOpen.value
            ? 1
            : withDelay(duration, withTiming(-1, { duration: 0 })),
    }));

    return (
        <>
            <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
                <TouchableOpacity style={styles.flex} onPress={toggleSheet} />
            </Animated.View>

            <Animated.View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                }}
                style={[sheetStyles.sheet, sheetStyle, backgroundColorSheetStyle]}>
                {children}
            </Animated.View>
        </>
    );
}




const AddTask = () => {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);

    const handleAddTask = () => {
        if (task) {
            if (editIndex !== -1) {
                // Edit existing task
                const updatedTasks = [...tasks];
                updatedTasks[editIndex] = task;
                setTasks(updatedTasks);
                setEditIndex(-1);
            } else {
                // Add new task 
                setTasks([...tasks, task]);
            }
            setTask("");
        }
    };

    const handleEditTask = (index) => {
        const taskToEdit = tasks[index];
        setTask(taskToEdit);
        setEditIndex(index);
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
    };

    return
    (
        <>



        </>

    );
}


const Discipline = () => {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);
    const [addTask, setAddTask] = useState(true);
    const [isOpen, setIsOten] = useState(true)
    const handleEditTask = (index) => {
        const taskToEdit = tasks[index];
        setTask(taskToEdit);
        setEditIndex(index);
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.task}>
            <Text
                style={styles.itemList}>{item}</Text>
            <View
                style={styles.taskButtons}>
                <TouchableOpacity
                    onPress={() => handleEditTask(index)}>
                    <Text
                        style={styles.editButton}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteTask(index)}>
                    <Text
                        style={styles.deleteButton}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 39 }}>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row" }}><Vector name="chart-arc" size={20} /><Text>Chart</Text></TouchableOpacity>
                <TouchableOpacity style={{ display: "flex", flexDirection: "row" }}><Vector name="av-timer" size={20} /><Text>Discipline</Text></TouchableOpacity>
            </View>
            {
                !addTask ? (<>
                    <Text style={styles.heading}>Discipline master</Text>
                    <Text style={styles.title}>List de tache</Text>
                    <FlatList
                        data={tasks}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                        <TouchableOpacity style={{ backgroundColor: "black", padding: 10, borderRadius: 30, width: 50, alignItems: "flex-end" }}>
                            <Vector name="plus" size={30} color={"white"} />
                        </TouchableOpacity>
                    </View></>) : (<>
                        <BottomSheet isOpen={isOpen} toggleSheet={toggleSheet}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={styles.container}>
                                    <Text style={styles.heading}>Geeksforgeeks</Text>
                                    <Text style={styles.title}>ToDo App</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter task"
                                        value={task}
                                        onChangeText={(text) => setTask(text)}
                                    />
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={handleAddTask}>
                                        <Text style={styles.addButtonText}>
                                            {editIndex !== -1 ? "Update Task" : "Add Task"}
                                        </Text>
                                    </TouchableOpacity>
                                    <FlatList
                                        data={tasks}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>


                            <View style={styles.buttonContainer}>
                                <Pressable style={[styles.bottomSheetButton]}>
                                    <Text style={[styles.bottomSheetButtonText, contentStyle]}>
                                        Read more
                                    </Text>
                                </Pressable>
                            </View>
                        </BottomSheet>

                    </>)
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 7,
        color: "#7C2BFF",
    },
    input: {
        borderWidth: 3,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 18,
    },
    addButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
    },
    task: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        fontSize: 18,
    },
    itemList: {
        fontSize: 19,
    },
    taskButtons: {
        flexDirection: "row",
    },
    editButton: {
        marginRight: 10,
        color: "green",
        fontWeight: "bold",
        fontSize: 18,
    },
    deleteButton: {
        color: "red",
        fontWeight: "bold",
        fontSize: 18,
    },
});



export default Discipline;