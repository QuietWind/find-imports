import * as React from "react";
import { Map, is } from "immutable";

export interface TTodoItem {
  title: string;
  check?: boolean;
}

interface TodoItemProps {
  index: number;
  onChange: any;
  todo: Map<string, any>;
}

interface TodoItemState {}

export class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
  shouldComponentUpdate(nextProps: TodoItemProps) {
    // if (
    //   nextProps.todo.title !== this.props.todo.title ||
    //   nextProps.todo.check !== this.props.todo.check
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }

    /**
     * immutable-js
     */
    if (!is(nextProps.todo, this.props.todo)) {
      return true;
    } else {
      return false;
    }
  }

  public render(): JSX.Element {
    const { todo, index, onChange } = this.props;
    const title = todo.get("title");
    const check = todo.get("check");

    return (
      <li className="todoitem">
        <span className="title">{title}</span>
        <span className="status">
          <input
            type="checkbox"
            onChange={() => {
              onChange(todo, index);
            }}
            checked={check ? true : false}
          />
        </span>
      </li>
    );
  }
}

export default TodoItem;
