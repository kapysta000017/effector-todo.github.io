import React from "react"

export default function AddTodo({ changeInput, addTodo, value }) {
  return (
    <div>
      <input
        type="text"
        onChange={(e) => changeInput(e.target.value)}
        value={value}
      ></input>
      <button
        onClick={() => (value.trim() !== "" ? addTodo(value.trim()) : null)}
      >
        add
      </button>
    </div>
  )
}
