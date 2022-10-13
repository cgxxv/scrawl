import {useEffect, useState} from "react";

import {useSWRBase} from "./utils";

const Todo = () => {

  const { data, mutate, isLoading, isError } = useSWRBase(`/api/todo`);
  const [ todoList, setTodoList ] = useState([]);

  useEffect(() => {
    if (!isLoading) {
      setTodoList((prevTodoList) => [...prevTodoList, ...data]);
    }
  }, [data, isLoading, setTodoList]);

  //TODO: should handle error
  if (isError) {
    console.error(isError);
    return null;
  }

  return (
    <>
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo" placeholder="What needs to be done?" autoFocus />
        </header>
        {/*This section should be hidden by default and shown when there are todos*/}
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {/*These are here just to show the structure of the list items*/}
            {/*List items should get the class `editing` when editing and `completed` when marked as completed*/}
            {todoList?.map((todo) => {
              return (
                <li key={todo.id} className={todo.status == 2?"completed":""}>
                  <div className="view">
                    <input
                      className="toggle"
                      type="checkbox"
                      checked={todo.status == 2?true:false}
                    />
                    <label>{todo.title}</label>
                    <button className="destroy"></button>
                  </div>
                  <input className="edit" value="Create a TodoMVC template" />
                </li>
              );
            })}s
          </ul>
        </section>
        {/*This footer should be hidden by default and shown when there are todos*/}
        <footer className="footer">
          {/*This should be `0 items left` by default*/}
          <span className="todo-count"><strong>0</strong> item left</span>
          {/*Remove this if you don't implement routing*/}
          <ul className="filters">
            <li>
              <a className="selected" href="#/">All</a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          {/*Hidden if no completed items are left ↓*/}
          <button className="clear-completed">Clear completed</button>
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        {/*Remove the below line ↓*/}
        <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
        {/*Change this out with your name and url ↓*/}
        <p>Created by <a href="http://todomvc.com">you</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    </>
  )
}

export default Todo;
