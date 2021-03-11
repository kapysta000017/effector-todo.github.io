import { createStore, createEffect, sample, createEvent, guard } from 'effector'
import { createGate } from 'effector-react'
import axios from 'axios'

export const GateItems = createGate()
export const fetchItems = createEffect(async (id) => await axios.get(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${id}/items`))
export const $errorItems = createStore(null).on(fetchItems.failData, (_, { response }) => response.status)
export const $items = createStore([]).on(fetchItems.doneData, (_, { data }) => data)
guard({
  source: GateItems.state,
  filter: id => typeof (id) === "string",
  target: fetchItems
})

export const fetchRenameCheck = createEffect(async (params) => await axios.put((`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${params.listId}/items/${params.id}`), params))
sample({
  clock: fetchRenameCheck,
  source: $items,
  fn: (items, params) => items.map(item => item.id === params.id ? params : item),
  target: $items
})

export const fetchRemoveItem = createEffect(async (params) => await axios.delete(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${params.listId}/items/${params.id}`))
const removeItem = fetchRemoveItem.map(({ id }) => id)
sample({
  clock: removeItem,
  source: $items,
  fn: (items, removeItemId) => items.filter(item => item.id !== removeItemId),
  target: $items
})

export const changeInputItem = createEvent();
export const onAddItem = createEvent()
export const fetchAddItem = createEffect(async (params) => await axios.post(`https://6047f10db801a40017ccd2ba.mockapi.io/lists/${params.id}/items`, { completed: false, text: params.text }))
export const $inputValueItem = createStore('').on(changeInputItem, (_, value) => value).reset(fetchAddItem)
sample({
  clock: onAddItem,
  target: fetchAddItem
})
sample({
  clock: fetchAddItem.doneData,
  source: $items,
  fn: (items, { data }) => [...items, data],
  target: $items
})