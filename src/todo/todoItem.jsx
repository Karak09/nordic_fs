import React, {memo} from 'react';

function TodoItem( {item, toggleComplet, deleteTodo}) {
    return (
        <div className="flex items-center m-4">
          <input
            type="checkbox"
            checked={item.isDone}
            onChange={() => toggleComplet(item)}
          />
          <p className="flex-1 px-8">{item.text}</p>
          <button
            type="submit"
            className="btn"
            onClick={() => deleteTodo(item)}
          >
            Delete
          </button>
        </div>
    );
}

export default memo(TodoItem);