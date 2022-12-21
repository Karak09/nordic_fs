import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  ADD_TODO_FAIL,
  ADD_TODO_REQUEST,
  ADD_TODO_SUCCESS,
  DELETE_TODO_FAIL,
  DELETE_TODO_REQUEST,
  DELETE_TODO_SUCCESS,
  LOAD_TODO_FAIL,
  LOAD_TODO_REQUEST,
  LOAD_TODO_SUCCESS,
  UPDATE_TODO_FAIL,
  UPDATE_TODO_REQUEST,
  UPDATE_TODO_SUCCESS,
} from '../constants';
import todoReducers, { todoInitialState } from '../reducers/todoReducers';

const useTodo = () => {
  const [todoState, dispatch] = useReducer(todoReducers,todoInitialState);
 
  const inputTextRef = useRef();

  const addTodo = useCallback(async (event) => {
    try {
      event.preventDefault();
      dispatch({ type: 'ADD_TODO_REQUEST' });

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
      dispatch({ type: 'ADD_TODO_SUCCESS', payload: json });
      // setTodoList(value=>[...value, json]);

      inputTextRef.current.value = '';
    } catch (error) {
      dispatch({ type: 'ADD_TODO_FAIL', payload: { hasError: error } });
    }
  }, []);

  const toggleComplet = useCallback(async (item) => {
    try {
      dispatch({ type: 'UPDATE_TODO_REQUEST' });
      const res = await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...item, isDone: !item.isDone }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const json = await res.json();
      dispatch({ type: 'UPDATE_TODO_REQUEST', payload: json });
    } catch (error) {
      dispatch({ type: 'DELETE_TODO_FAIL', payload: { hasError: error } });
    }
  }, []);

  const deleteTodo = useCallback(async (item) => {
    try {
      dispatch({ tpe: 'DELETE_TODO_REQUEST' });
      await fetch(`http://localhost:3000/todoList/${item.id}`, {
        method: 'DELETE',
      });
      dispatch({ type: 'DELETE_TODO_SUCCESS', payload: item });
    } catch (error) {
      dispatch({ type: 'DELETE_TODO_FAIL', payload: { hasError: error } });
    }
  }, []);

  const loadTodo = useCallback(async (ft) => {
    try {
      dispatch({ type: 'LOAD_TODO_REQUEST' });
      let url = 'http://localhost:3000/todoList';
      if (ft !== 'all') {
        url += `?isDone=${ft === 'Completed'}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      dispatch({
        type: 'LOAD_TODO_SUCCESS',
        payload: {
          todoList: json,
          filterType: ft,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOAD_TODO_FAIL', payload: { hasError: error } });
    }
  }, []);

  const filterBtns = useMemo(
    () => [
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
    ],
    []
  );

  useEffect(() => {
    loadTodo('all');
  }, []);

  return {
    todoState,
    addTodo,
    toggleComplet,
    deleteTodo,
    loadTodo,
    filterBtns,
  };
};

export default useTodo;
