import { useState, useEffect } from "react";
import { View, Text } from "react-native"

import { TextInput } from "react-native-paper";

import {Todo} from "../../types/index.ts";

const AddTask = () => {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);

    const [todos, setTodos] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [limiteDate,setLimiteDate] = useState<Date>(null)

    // Fonction pour ajouter une nouvelle tâche
    const handleAddTodo = async () => {
        const newTodo:Todo  = {
            title: newTodoTitle,
            description: newTodoDescription,
            completed: false,
            limiteDate:limiteDate,
            createAt: new Date(),
            priority:0,
        };
    }

    return (
        <Text>
            <TextInput label={"Titre"} mode="outlined"
            />
            <TextInput label={"Description"} mode="outlined" />
            <TextInput label={"Description"} mode="outlined"/>


        </Text>
    )
}


export default AddTask;
