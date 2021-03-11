import { createStore, createEffect, sample, createEvent, guard } from 'effector'
import { createGate } from 'effector-react'
import axios from 'axios'

export const GateLists = createGate()
export const fetchLists = createEffect(async () => await axios.get('https://6047f10db801a40017ccd2ba.mockapi.io/lists'))
const fetchColors = createEffect(async () => await axios.get('https://6047f10db801a40017ccd2ba.mockapi.io/colors'))

sample({
  clock: GateLists.open,
  target: [fetchLists, fetchColors]
})
export const $lists = createStore([]).on(fetchLists.doneData, (_, { data }) => data)
export const $error = createStore(null).on(fetchLists.failData, (_, { response }) => response.status)
export const $colors = createStore([]).on(fetchColors.doneData, (_, { data }) => data)

export const changeInputList = createEvent()
export const fetchAddTodo = createEffect(async (params) => await axios.post('https://6047f10db801a40017ccd2ba.mockapi.io/lists', params))
export const $inputValue = createStore('').on(changeInputList, (_, value) => value).reset(fetchAddTodo)
export const onSelectColor = createEvent()
const $color = createStore(null).on(onSelectColor, (_, color) => color)
export const onAddTodo = createEvent()

export const fetchRemoveList = createEffect(async (id) => {
  const { data } = await axios.get(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${id}/items`)
  await data.forEach(element => axios.delete(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${id}/items/${element.id}`))
  return await axios.delete(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${id}`)
})
const removeList = fetchRemoveList.map((id) => id)


sample({
  clock: onAddTodo,
  source: $color,
  fn: (color, todo) => ({ title: todo, color: color }),
  target: fetchAddTodo
})

sample({
  clock: fetchAddTodo.doneData,
  source: $lists,
  fn: (state, { data }) => [...state, data],
  target: $lists
})

sample({
  clock: removeList,
  source: $lists,
  fn: (lists, id) => lists.filter(list => list.id !== id),
  target: $lists
})


export const fetchRenameTitle = createEffect(async (params) => await axios.put(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${params.id}`, { ...params }))
const renameTitle = fetchRenameTitle.map(params => params)
sample({
  clock: renameTitle,
  source: $lists,
  fn: (lists, newTitle) => lists.map(list => list.id === newTitle.id ? { ...list, title: newTitle.title } : list),
  target: $lists
})