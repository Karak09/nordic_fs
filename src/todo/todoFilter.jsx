import React, { memo } from 'react';

function TodoFilter({filterBtns, filterType, loadTodo}) {
    console.log('Todo Filter render');
    return (
        <div className="w-full flex">
        {filterBtns.map(x => (
          <button
            key={x.key}
            type="submit"
            className={`btn flex-1 rounded-none ${
              filterType === x.key && `bg-red-600`
            }`}
            onClick={() => loadTodo(x.key)}
          >
            {x.name}
          </button>
        ))}
      </div>
    );
}

export default memo(TodoFilter);