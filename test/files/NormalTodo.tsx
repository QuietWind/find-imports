import * as React from "react";
import { Link } from "react-router-dom";
import { TodoItem, TTodoItem } from "./TodoItem";
import { Map } from "immutable";
import * as Perf from "react-addons-perf";
import testData from "./data";

import "./Todo.css";

window.Perf = Perf;

interface TodoProps {}

interface TodoState {
  normalTodos: TTodoItem[];
}

function normalAddItem(data: TTodoItem[], item: TTodoItem) {
  const newData = [...data];
  newData.unshift(item);

  return newData;
}

export class Todo extends React.Component<TodoProps, TodoState> {
  private input: HTMLInputElement | null;
  constructor(props: TodoProps) {
    super(props);
    this.state = {
      normalTodos: testData
    };
    this.normalAdd = this.normalAdd.bind(this);
  }

  getVal() {
    if (!this.input || !this.input.value) {
      return "";
    }

    const value = this.input.value;

    return value;
  }

  normalAdd() {
    const value = this.getVal();
    if (!value) {
      return;
    }

    const newTodos = normalAddItem(this.state.normalTodos, {
      title: value,
      check: false
    });

    this.setState({
      normalTodos: newTodos
    });
  }

  changeStatus = (todo: TTodoItem, index: number) => {
    const { normalTodos } = this.state;
    const newTodos = [
      ...normalTodos.slice(0, index),
      {
        title: todo.title,
        check: !todo.check
      },
      ...normalTodos.slice(index + 1)
    ];

    this.setState({
      normalTodos: newTodos
    });
  };

  public render(): JSX.Element {
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
                this.normalAdd();
              }
            }}
            type="text"
          />
          <button onClick={this.normalAdd}>Normal add</button>
        </div>
        <br />
        <br />
        <div>
          <ul className="todos">
            {this.state.normalTodos.map((todo, index) => {
              if (!todo) {
                return null;
              }
              return (
                <TodoItem
                  key={index}
                  todo={Map(todo)}
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
