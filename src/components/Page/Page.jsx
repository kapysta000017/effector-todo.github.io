import "./Lists.scss"
import "./Tasks.scss"
import listSvg from "../../assets/img/list.svg"
import addSvg from "../../assets/img/add.svg"
import removeSvg from "../../assets/img/remove.svg"
import editSvg from "../../assets/img/edit.svg"
import checkSvg from "../../assets/img/check.svg"
import React, { useState } from "react"
import { useStore, useGate } from "effector-react"
import {
  GateLists,
  $lists,
  $error,
  fetchLists,
  fetchAddTodo,
  $inputValue,
  changeInputList,
  onAddTodo,
  $colors,
  onSelectColor,
  fetchRemoveList,
  fetchRenameTitle,
} from "./modelLists"
import {
  fetchRenameCheck,
  GateItems,
  $items,
  fetchItems,
  $errorItems,
  changeInputItem,
  $inputValueItem,
  onAddItem,
  fetchAddItem,
  fetchRemoveItem,
} from "./modelTasks"
import { useHistory } from "react-router-dom"
import InputTodo from "../ui/InputTodo"
import AddItem from "../ui/AddItem"
import { Route, BrowserRouter } from "react-router-dom"
import classNames from "classnames"

export function Page() {
  return (
    <BrowserRouter>
      <Lists />
      <Route path="/tasks/:id" component={Tasks} />
    </BrowserRouter>
  )
}

function Lists() {
  const [active, setActive] = useState(false)
  useGate(GateLists)
  const isLoading = useStore(fetchLists.pending)
  const isLoadingAdd = useStore(fetchAddTodo.pending)
  const lists = useStore($lists)
  const error = useStore($error)
  let history = useHistory()
  useGate(GateLists)
  const onClickRoute = (tagName, id) => {
    if (tagName !== "img") {
      history.push(`/tasks/${id}`)
    }
  }
  const onRemoveList = (id) => {
    if (window.confirm("Точно удалить?")) {
      fetchRemoveList(id)
      history.push("/")
    }
  }
  if (error) {
    return <div>{`Статус ошибки ${error}`}</div>
  }
  return (
    <div className="sidebar">
      <div className="sidebar__titleLists">
        <img className="sidebar__imgTasks" src={listSvg} alt="listSvg"></img>
        <span>Все задачи</span>
      </div>
      {isLoading ? (
        <h3>Loading...</h3>
      ) : (
        lists.map((list) => (
          <li
            key={list.id}
            onClick={(e) => onClickRoute(e.target.localName, list.id)}
          >
            <i className={`title__${list.color}`}></i>
            <span className="sidebar__text">{list.title}</span>
            <img
              className="sidebar__remove"
              src={removeSvg}
              alt="remove"
              onClick={() => onRemoveList(list.id)}
            ></img>
          </li>
        ))
      )}
      {active ? (
        <InputTodo
          isLoadingAdd={isLoadingAdd}
          setActive={setActive}
          $colors={$colors}
          $inputValue={$inputValue}
          changeInputList={changeInputList}
          onAddTodo={onAddTodo}
          onSelectColor={onSelectColor}
        />
      ) : (
        <div
          className="sidebar__addTodo"
          onClick={() => setActive((state) => !state)}
        >
          <img src={addSvg} alt="add"></img>
          <span>Добавить папку</span>
        </div>
      )}
    </div>
  )
}

function Tasks({ match }) {
  let history = useHistory()
  useGate(GateItems, match.params.id)
  const lists = useStore($lists)
  const items = useStore($items)
  const isLoading = useStore(fetchItems.pending)
  const error = useStore($errorItems)
  const onRenameTitle = (list) => {
    const newTitle = window.prompt("Переименовать?", [list.title])
    fetchRenameTitle({ id: list.id, color: list.color, title: newTitle })
  }
  if (error) {
    return <div>{`Статус ошибки ${error}`}</div>
  }
  return (
    <div className="tasks">
      {lists.map((list) =>
        list.id === match.params.id ? (
          <div key={list.id}>
            <div className="tasks__title">
              <h2
                className={classNames(
                  "tasks__title__text",
                  `main__title__${list.color}`
                )}
              >
                {list.title}
              </h2>
              <img
                onClick={() => onRenameTitle(list)}
                className="tasks__title__edit"
                src={editSvg}
                alt="edit"
              ></img>
            </div>
            {isLoading ? (
              <h3>loading...</h3>
            ) : (
              items.map((item) => (
                <div key={item.id} className="tasks__item">
                  <input
                    id={`check${item.id}`}
                    className="tasks__item__check"
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      fetchRenameCheck({ ...item, completed: !item.completed })
                    }
                  ></input>
                  <label htmlFor={`check${item.id}`}>
                    <img src={checkSvg} alt="check"></img>
                  </label>
                  <li className="tasks__item__text">{item.text}</li>
                  <img
                    src={removeSvg}
                    alt="delete"
                    onClick={() =>
                      fetchRemoveItem({ id: item.id, listId: item.listId })
                    }
                  ></img>
                </div>
              ))
            )}
          </div>
        ) : null
      )}
      {history.location.pathname === "/" ? null : (
        <AddItem
          fetchAddItem={fetchAddItem}
          changeInputItem={changeInputItem}
          inputValueItem={$inputValueItem}
          onAddItem={onAddItem}
          id={match.params.id}
        />
      )}
    </div>
  )
}
