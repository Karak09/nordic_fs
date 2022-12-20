import React, { useState, useEffect, useRef, useCallback, useMemo, useReducer } from 'react';
import './todo.css';
import TodoFilter from './todoFilter';
import TodoForm from './todoForm';
import TodoList from './todoList';

const todoInitialState = {
  todoList: [],
  filterType: 'all',
  isLoading: false,
  hasError: null,
};

const todoReducer = (state, { type, payload }) => {
  switch (type) {
    case 'LOAD_TODO_REQUEST':
    case 'ADD_TODO_REQUEST':
    case 'UPDATE_TODO_REQUEST':
    case 'DELETE_TODO_REQUEST':{
      return{...state, isLoading:true};
    }

    case 'LOAD_TODO_SUCCESS':{
      return{...state, isLoading:false, ...payload};
    }

    case 'ADD_TODO_SUCCESS':{
      return{...state, isLoading:false, todoList:[...state.todoList, payload],};
    }

    case 'UPDATE_TODO_SUCCESS':{
      const index = state.todoList.findIndex(x => x.id === payload.id);
      return{
      ...state,
      isLoading:false,
      todoList: [
        ...state.todoList.slice(0, index),
        payload,
        ...state.todoList.slice(index + 1),
      ],
    };
    }

    case 'DELETE_TODO_SUCCESS':{
      const index = state.todoList.findIndex(x => x.id === payload.id);
      return{
      ...state,
      isLoading:false,
      todoList: [
        ...state.todoList.slice(0, index),
        ...state.todoList.slice(index + 1),
      ],
    };
    }

    case 'LOAD_TODO_FAIL':
    case 'AAD_TODO_FAIL':
    case 'UPDATE_TODO_FAIL':
    case 'DELETE_TODO_FAIL':{
      return{...state, isLoading:false, ...payload};
    }

    default:
      return state;
  }
};

function TodoApp() {
  const [{todoList, filterType, isLoading, hasError }, dispatch ] = useReducer(todoReducer, todoInitialState );
  // const [todoList, setTodoList] = useState([]);
  // const [filterType, setfilterType] = useState('all');
  // const [isLoading, setIsLoding] = useState(false);
  // const [hasError, setHasError] = useState(null);
  const inputTextRef = useRef();

  const addTodo = useCallback(async event => {
     try {
      event.preventDefault();
      dispatch({type: 'ADD_TODO_REQUEST'});
      
      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: inputTextRef.current.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();
      dispatch({type: 'ADD_TODO_SUCCESS', payload: json});
      // setTodoList(value=>[...value, json]);

      inputTextRef.current.value = '';
      } catch (error) {
      dispatch({type: 'ADD_TODO_FAIL', payload:{hasError:error}});
    }
  },[]);

  const toggleComplet = useCallback(async item => {
    try {
      dispatch({type:'UPDATE_TODO_REQUEST'});
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, isDone: !item.isDone }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();
      dispatch({type: 'UPDATE_TODO_REQUEST', payload: json});
    } catch (error) {
      dispatch({type: 'DELETE_TODO_FAIL', payload:{hasError:error}});
    }
  },[]);

  const deleteTodo = useCallback(async item => {
    try {
      dispatch({tpe: 'DELETE_TODO_REQUEST'});
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });
      dispatch({type: 'DELETE_TODO_SUCCESS', payload: item});
    } catch (error) {
      dispatch({type: 'DELETE_TODO_FAIL', payload:{hasError:error}});
    }
  },[]);
 
  const loadTodo = useCallback (async ft => {
    try {
      dispatch({ type: 'LOAD_TODO_REQUEST'});
      let url = 'http://localhost:3000/todoList';
      if (ft !== 'all') {
        url += `?isDone=${ft === 'Completed'}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      dispatch({ type: 'LOAD_TODO_SUCCESS', 
      payload: {
        todoList: json,
        filterType: ft,
      }});
    } catch (error) {
      dispatch({type: 'LOAD_TODO_FAIL', payload:{ hasError:error }});
    }
  },[]);

  useEffect(() => {
    loadTodo('all');
  }, []);

  const filterBtns = useMemo (() => [
      {
        name: 'All',
        key: 'all',
      },
      {
        name: 'Pending',
        key: 'Pending',
      },
      {
        name: 'Completed',
        key: 'Completed',
      },
    ],[]);

  return (
    <div className="wrapper">
      <h1 className="heading">Karak Software</h1>
      <TodoForm addTodo={addTodo} ref= {inputTextRef} />
      {hasError && <p>{hasError.message}</p>}
      {isLoading && <p>Loading...</p>}
      {todoList && (
        <TodoList 
        todoList={todoList} 
        toggleComplet={toggleComplet} 
        deleteTodo={deleteTodo} 
        />
      )}
      <TodoFilter 
      filterBtns={filterBtns} 
      filterType={filterType}
      loadTodo={loadTodo}
       />
    </div>
  );

}

export default TodoApp;



// import Child1 from './child1';
//  import Child2 from './child2';

/*

function Xyz(){
  const [counter, setCounter] = useState(0);
  const [number, setNumber] = useState(0);
  const isMounted  = useRef(false);

  const increment = () => {
    setCounter(value => value+1);
  };

  const decrement = () => {
    setCounter(value => value-1);
  };

  useEffect(() => {
    if (isMounted.current === true){
     console.log('component mounted & updated for counter');
    }
  },[counter]);

  useEffect(() => {
    if (isMounted.current === true){
    console.log('component mounted & updated for counter and number');
    }
 },[counter, number]);

 useEffect(() => {
  console.log('component mounted');
  isMounted.current = true;
},[]);

  return (  
    <div>
    <div>
      <button type='button' onClick={increment}>
        +
      </button>
      {counter}
      <button type='button' onClick={decrement}>
        -
      </button>
      </div>
      <div>
      <button type='button' onClick={() => setNumber(val => val + 1)}>
        +
      </button>
      {number}
      <button type='button' onClick={() => setNumber(val => val - 1)}>
        -
      </button>
    </div>
    {counter < 5 && <Child2 />}
    </div>
  );
}

export default Xyz;
*/



/*

export default class Index extends PureComponent {

  filterBtns = [
    {
      name: 'All',
      key: 'all',
    },
    {
      name: 'Pending',
      key: 'Pending',
    },
    {
      name: 'Completed',
      key: 'Completed',
    },
  ];

  constructor(props) {
    super(props);
    this.state = { 
      todoList: [], 
      filterType: 'all', 
      isLoading: false, 
      hasError: false,
    }; 
    this.inputTextRef = createRef();

  }

  async componentDidMount() {
    this.loadTodo('all');
  }

  loadTodo = async (filterType) => {
    try {
      this.setState({ isLoading: true });
      let url = 'http://localhost:3000/todoList';
      if (filterType !== 'all') {
        url += `?isDone=${filterType === 'Completed'}`;
      }
      const res = await fetch(url);
      const json = await res.json();
     // console.log(json);
      this.setState({ todoList: json, filterType });
    } catch (error) {
      console.error(error);
      this.setState({ hasError: error });
    }finally {
      this.setState({ isLoading: false });
    }
  };

  /*  changeTodoText = (event) => {
  //  console.log(event.taget.value);
    this.setState({ todoText: event.target.value });
  };

*/
/*

  addTodo = async (event) => {
    try {
      this.setState({ isLoading: true });
      event.preventDefault();
      // const todoTextInput = this.inputTextRef;

      // const todoText = this.inputTextRef.value;

      const res = await fetch('http://localhost:3000/todoList', {
        method: 'POST',
        body: JSON.stringify({
          text: this.inputTextRef.current.value,
          isDone: false,
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      this.setState(
        ({ todoList }) => ({
          todoList: [...todoList, json],
        }),
        () => {
          this.inputTextRef.current.value = '';
        },
      );
    } catch (error) {
      console.error(error);
      this.setState({ hasError: error });
    }
    // console.log('hello');
  };

   static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  render() {
    const { error } = this.state;
    if (error) {
      return <h1>somthing went wrong...</h1>;
    }
  }

  toggleComplet = async (item) => {
    //  console.log(item);
      console.log(item);
    this.setState(({ todoList }) => ({
      todoList: todoList.map((x) => {
        if (x.id === item.id) {
          return { ...x, isDone: !x.isDone};
        }
        return x;
      }),
    }));

    try {
      this.setState({ isLoading: true });
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, isDone: !item.isDone }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();

      this.setState(({ todoList }) => {
        const index = todoList.findIndex((x) => x.id === item.id);
        return {
          todoList: [
            ...todoList.slice(0, index),
            json,
            ...todoList.slice(index + 1),
          ],
        };
      });
    } catch (error) {
    console.error(error);
    this.setState({ hasError: error });
    }finally {
      this.setState({ isLoading: false });
    }
  };

  deleteTodo = async (item) => {
    try {
      this.setState({ isLoading: true });
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });
      this.setState(({ todoList }) => {
        const index = todoList.findIndex((x) => x.id === item.id);
        return {
          todoList: [...todoList.slice(0, index), ...todoList.slice(index + 1)],
        };
      });
    } catch (error) {
      console.error(error);
      this.setState({ hasError: error });
    }finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { todoList, filterType, isLoading, hasError } = this.state;

    if (hasError) {
      return <h1 className='text-3xl text-bold text-red-800'>Something Went Wrong,Please Try Again After Some Time...</h1>;
    }

    console.log('render');
    return (
      <div className="wrapper">
        <h1 className="heading">Karak Software</h1>
        <TodoForm addTodo={this.addTodo} ref= {this.inputTextRef} />
        <TodoList 
        todoList={todoList} 
        toggleComplet={this.toggleComplet} 
        deleteTodo={this.deleteTodo} 
        />
        <TodoFilter 
        filterBtns={this.filterBtns} 
        filterType={filterType}
        loadTodo={this.loadTodo}
         />
      </div>
    );
  }
}

*/


