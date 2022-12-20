import React, { memo } from 'react';
import TodoItem from './todoItem';

function TodoList ({todoList, toggleComplet, deleteTodo}) {
    console.log('Todo Item render');

    return (
    <div className='w-full flex-1'>
      {todoList.map(item => (
        <TodoItem 
        key = {item.id}
        item = { item }
        toggleComplet = { toggleComplet }
        deleteTodo = { deleteTodo }
        />
        ))}
    </div>
    );
};

export default memo(TodoList);