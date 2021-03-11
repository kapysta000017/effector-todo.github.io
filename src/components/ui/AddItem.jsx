import React, { useState } from 'react';
import './AddTasks.scss';
import addSvg from '../../assets/img/add.svg';
import { useStore } from 'effector-react';

export default function AddItem({ changeInputItem, inputValueItem, onAddItem, id, fetchAddItem }) {
  const value = useStore(inputValueItem);
  const loading = useStore(fetchAddItem.pending);
  const [active, setActive] = useState(false);
  const onClickAddItem = (id, value) => {
    if (value.trim() !== '') {
      onAddItem({ id: id, text: value });
    }
  };
  return (
    <div>
      {active ? (
        <div className="add__input">
          <input
            type="text"
            placeholder="Названия задача"
            onChange={(e) => changeInputItem(e.target.value)}
            value={value}></input>
          <div className="add__buttons">
            <button className="add__buttons__add" onClick={() => onClickAddItem(id, value.trim())}>
              {loading ? 'Добавить...' : 'Добавить'}
            </button>
            <button onClick={() => setActive((state) => !state)} className="add__buttons__close">
              Закрыть
            </button>
          </div>
        </div>
      ) : (
        <div className="default" onClick={() => setActive((state) => !state)}>
          <img src={addSvg} alt="add"></img>
          <span className="default__add">Добавить задачу</span>
        </div>
      )}
    </div>
  );
}
