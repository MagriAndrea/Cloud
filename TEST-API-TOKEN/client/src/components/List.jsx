import React from 'react';

const List = ({todos, deleteTodo}) => {
    return (
        <ul>
            {todos.map(item => (
            <>
                <li key={item.id}>({item.id}) {item.text}</li>
                <button onClick={() => deleteTodo(item.id)}>Cancella</button>
                </>
                )) }
        </ul>
    );
};

export default List;