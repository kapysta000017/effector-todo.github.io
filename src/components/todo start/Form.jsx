import React from 'react';
import { useStore } from 'effector-react';
import { addTodo, $listTodo, changeInput, $valueInput } from './model';
import AddTodo from './AddTodo';

export function Form() {
  const value = useStore($valueInput);
  const listTodo = useStore($listTodo);
  return (
    <div>
      <ul>
        {listTodo.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <AddTodo addTodo={addTodo} changeInput={changeInput} value={value} />
    </div>
  );
}
