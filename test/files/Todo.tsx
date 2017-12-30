import * as React from "react";
import { Link } from "react-router-dom";
import * as Perf from "react-addons-perf";
import { TodoItem } from "./TodoItem";
import { List, Map, fromJS, is } from "immutable";
import testData from "./data";

import "./Todo.css";

window.Perf = Perf;

interface TodoProps {}
interface TodoState {
  todos: List<Map<string, any>>;
}

// const c1 = Map({ title: "周六欢迎致辞", check: undefined });

// const c2 = Map({ title: "周六欢迎致辞", check: undefined });

console.log(
  is(
    { title: "周六欢迎致辞", check: undefined },
    { title: "周六欢迎致辞", check: undefined }
  )
);

export class Todo extends React.Component<TodoProps, TodoState> {
  private input: HTMLInputElement | null;
  constructor(props: TodoProps) {
    super(props);
    this.state = {
      todos: fromJS(testData)
    };

    this.addItem = this.addItem.bind(this);
  }

  getVal() {
    if (!this.input || !this.input.value) {
      return "";
    }

    const value = this.input.value;

    return value;
  }

  addItem() {
    const value = this.getVal();
    if (!value) {
      return;
    }

    const { todos } = this.state;

    const item = Map({
      title: value,
      check: false
    });

    const newTodos = todos.unshift(item);

    this.setState(
      {
        todos: newTodos
      },
      () => {
        if (this.input) {
          this.input.value = "";
        }
      }
    );
  }

  changeStatus = (todo: Map<string, any>, index: number) => {
    const newTodos = this.state.todos.setIn(
      [index, "check"],
      !todo.get("check")
    );
    this.setState({
      todos: newTodos
    });
  }

  public render(): JSX.Element {
    const { todos } = this.state;

    return (
      <div>
        <p>
          <Link to="/todo">Todo</Link>
          &nbsp; vs &nbsp;
          <Link to="/normaltodo">Normal Todo</Link>
        </p>
        <div className="add">
          <input
            ref={node => {
              this.input = node;
            }}
            onKeyDown={eve => {
              if (eve.keyCode === 13) {
                this.addItem();
              }
            }}
            type="text"
          />
          <button onClick={this.addItem}>Immutablejs Add</button>
        </div>
        <br />
        <br />
        <div>
          <ul className="todos">
            {todos.map((todo, index) => {
              if (!todo || index === undefined) {
                return null;
              }

              return (
                <TodoItem
                  key={index}
                  todo={todo}
                  index={index}
                  onChange={this.changeStatus}
                />
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Todo;
