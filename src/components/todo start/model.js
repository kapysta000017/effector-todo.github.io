import { createStore, createEvent } from 'effector'

export const addTodo = createEvent()
export const changeInput = createEvent()

export const $valueInput = createStore('').on(changeInput, (_, value) => value)
export const $listTodo = createStore([]).on(addTodo, (state, item) => [...state, item])
$valueInput.on(addTodo, () => '')