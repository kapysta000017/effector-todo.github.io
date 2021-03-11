import { useStore } from 'effector-react';
import React, { useState } from 'react';
import classNames from 'classnames';
import closeSvg from '../../assets/img/close.svg';
import './InputTodo.scss';

export default function InputTodo({
  $inputValue,
  changeInputList,
  $colors,
  onSelectColor,
  onAddTodo,
  setActive,
  isLoadingAdd,
}) {
  const [select, setSelect] = useState(null);
  const onSelectColorId = (id, name) => {
    onSelectColor(name);
    setSelect(() => id);
  };
  const colors = useStore($colors);
  const inputValue = useStore($inputValue);
  const onClickAdd = () => {
    if (inputValue.trim() !== '' && select) {
      onAddTodo(inputValue.trim());
    }
  };
  return (
    <div className="sidebar__add">
      <img onClick={(state) => setActive(!state)} src={closeSvg} alt="closebutton"></img>
      <div className="sidebar__add__color">
        {colors.map((color) => (
          <i
            key={color.id}
            className={classNames(color.name, color.id === select && 'select')}
            onClick={() => onSelectColorId(color.id, color.name)}></i>
        ))}
      </div>
      <div className="sidebar__add__input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => changeInputList(e.target.value)}
          placeholder="Название папки"></input>
      </div>
      <div>
        <button disabled={isLoadingAdd} onClick={() => onClickAdd()}>
          {isLoadingAdd ? 'Добавить...' : 'Добавить'}
        </button>
      </div>
    </div>
  );
}
