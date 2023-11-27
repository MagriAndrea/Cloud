import {useState, useRef, useEffect} from 'react';
import List from '../components/List';

const ToDos = () => {
    const [text, setText] = useState("")
    const [todos, setTodos] = useState([])
    const [id, setId] = useState(0)

    const inputRef = useRef(null);

    const addTodo = () => {
        setId((id) => id+1)
        setTodos((oldTodos) => {
            return text !== "" ? [...oldTodos, {text: text, id: id}] : [...oldTodos]
        })
        setText("")
    }

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => {
            return todo.id === id ? "" : todo
        }))
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [todos]);

    return (
    <>
        <input type='text' 
        value = {text}
        ref={inputRef}
        onKeyDown={(e) => {
            if (e.keyCode === 13) {
                addTodo()
            }
        }}
        onChange={(e) => setText(e.target.value)}/>

        <button onClick={addTodo}>Add</button>
        <button onClick={() => setTodos([])}>Svota lista</button>

        <List todos={todos} deleteTodo={deleteTodo}/>
    </>
    );
};

export default ToDos;