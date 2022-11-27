import { useCallback, useEffect, useState } from "react";

import { axiosWrapper, useSWRBase } from "./utils";

const Todo = () => {
  const { data, isLoading, isError } = useSWRBase(`/api/todo`);
  const [todoList, setTodoList] = useState([]);
  const [count, setCount] = useState(0);

  const getCount = (todoList) => {
    let count = 0;
    todoList?.forEach((todo) => {
      if (todo.status !== "Completed") count++;
    });
    return count;
  };

  useEffect(() => {
    if (!isLoading) {
      setTodoList((prevTodoList) => {
        const newTodoList = [...prevTodoList, ...data];
        setCount(getCount(newTodoList));
        return newTodoList;
      });
    }
  }, [data, isLoading, setTodoList, setCount]);

  const handleTodo = useCallback(async (e) => {
    try {
      if (e.key === "Enter") {
        const id = parseInt(e.target.getAttribute("data-id"));
        const status = e.target.getAttribute("data-status");
        const title = e.target.value;
        if (!id && !status) {
          const res = await axiosWrapper(`/api/todo`, {
            method: "POST",
            data: { title },
          });
          setTodoList((prevTodoList) => {
            const newTodoList = [...prevTodoList, res];
            setCount(getCount(newTodoList));
            return newTodoList;
          });
        } else {
          await axiosWrapper(`/api/todo/update`, {
            method: "PUT",
            data: { title, status, id },
          });
          const newTodoList = todoList.map((todo) => {
            if (id === todo.id) {
              todo.title = title;
            }
            return todo;
          });
          setTodoList(newTodoList);
          e.target.removeAttribute("data-id");
          e.target.removeAttribute("data-status");
        }
        e.target.value = "";
      }
    } catch (e) {
      console.error(e.message);
    }
  }, [todoList, setTodoList, setCount, getCount]);

  const toggleAllCheck = useCallback((e) => {
    const htmlLis = document.getElementsByClassName("toggle");
    const lis = [...htmlLis];
    if (e.target.className === "selected") {
      e.target.className = "";
      lis.map((li) => {
        li.checked = false;
      });
    } else {
      e.target.className = "selected";
      lis.map((li) => {
        li.checked = true;
      });
    }
  }, [todoList]);

  const toggleStatus = useCallback((id) => async (e) => {
    const todo = ((id, e) => {
      for (let i = 0; i < todoList.length; i++) {
        const todo = todoList.at(i);
        if (todo.id === id) {
          if (todo.status === "Active" || todo.status === "Completed") {
            todo.status = "Pending";
            // e.target.setAttribute("checked", false);
            e.target.defaultChecked = false;
          } else {
            todo.status = "Active";
            // e.target.setAttribute("checked", true);
            e.target.defaultChecked = true;
          }
          return todo;
        }
      }
      return null;
    })(id, e);

    if (!todo) {
      console.warn("no item matched");
      return;
    }

    try {
      await axiosWrapper(`/api/todo/update`, { method: "PUT", data: todo });
    } catch (e) {
      console.error(e.essage);
    }
  }, [todoList]);

  const handleUpdate = useCallback((id, status) => async (e) => {
    const newTodo = document.getElementsByClassName("new-todo")[0];
    newTodo.value = e.target.innerText;
    newTodo.setAttribute("data-id", id);
    newTodo.setAttribute("data-status", status);
  }, [todoList, setTodoList]);

  const handleDestroy = useCallback((id) => async (e) => {
    try {
      await axiosWrapper(`/api/todo/${id}`, { method: "DELETE" });
      const newTodoList = todoList.filter((todo) => {
        if (todo.id !== id) return todo;
      });
      setCount(getCount(newTodoList));
      setTodoList(newTodoList);
    } catch (e) {
      console.error(e.message);
    }
  }, [todoList, setTodoList, setCount, getCount]);

  const getIds = () => {
    let ids = [];
    const htmlLis = document.getElementsByClassName("toggle");
    const lis = [...htmlLis];
    lis.map((li) => {
      if (li.hasAttribute("checked")) { // FIXME: cannot get checked attribute dynamically
        const id = li.getAttribute("data-id");
        ids.push(parseInt(id));
      }
    });
    console.log(ids);
    return ids;
  };

  const handleActive = useCallback(async (e) => {
    const ids = getIds();
    try {
      await axiosWrapper(`/api/todo/active`, { method: "PUT", data: ids });
      const newTodoList = todoList.map((todo) => {
        if (ids.includes(todo.id)) {
          todo.status = "Active";
        }
        return todo;
      });
      setCount(getCount(newTodoList));
      setTodoList(newTodoList);
    } catch (e) {
      console.error(e.message);
    }
  }, [todoList, setTodoList, setCount, getCount]);

  const handleCompleted = useCallback(async (e) => {
    const ids = getIds();
    try {
      await axiosWrapper(`/api/todo/completed`, { method: "PUT", data: ids });
      const newTodoList = todoList.map((todo) => {
        if (ids.includes(todo.id)) {
          todo.status = "Completed";
        }
        return todo;
      });
      setCount(getCount(newTodoList));
      setTodoList(newTodoList);
    } catch (e) {
      console.error(e.message);
    }
  }, [todoList, setTodoList, setCount, getCount]);

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
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyUp={handleTodo}
            autoFocus
          />
        </header>
        <section className="main">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {todoList?.map((todo) => {
              return (
                <li
                  key={todo.id}
                  className={todo.status === "Completed" ? "completed" : ""}
                >
                  <div className="view">
                    <input
                      className="toggle"
                      type="checkbox"
                      defaultChecked={todo.status === "Completed" ||
                        todo.status === "Active"}
                      onChange={toggleStatus(todo.id)}
                      data-id={todo.id}
                    />
                    <label onDoubleClick={handleUpdate(todo.id, todo.status)}>
                      {todo.title}
                    </label>
                    <button
                      className="destroy"
                      onClick={handleDestroy(todo.id)}
                    >
                    </button>
                  </div>
                  {/*<input className="edit" value="Create a TodoMVC template" />*/}
                </li>
              );
            })}
          </ul>
        </section>
        <footer className="footer">
          <span className="todo-count">
            <strong>{count}</strong> item left
          </span>
          <ul className="filters">
            <li>
              <a onClick={toggleAllCheck}>All</a>
            </li>
            <li>
              <a onClick={handleActive}>Active</a>
            </li>
            <li>
              <a onClick={handleCompleted}>Completed</a>
            </li>
          </ul>
          <button className="clear-completed" onClick={handleActive}>
            Clear completed
          </button>
        </footer>
      </section>
      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>
          Template by <a href="http://sindresorhus.com">Sindre Sorhus</a>
        </p>
        <p>
          Created by <a href="http://todomvc.com">you</a>
        </p>
        <p>
          Part of <a href="http://todomvc.com">TodoMVC</a>
        </p>
      </footer>
    </>
  );
};

export default Todo;
