import React, {useState} from "react";
import "./App.css";
import Node from "./Node";

// константы
const buttons = ["clear", "←", "^", "%", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="];
const manips = ["clear", "←", "^", "%", "*", "-", "=", "+"];

const Button = (props) => {
  return (
      <button
          key={props.name}
          name={props.name}
          onClick={props.onClick}
          className={ manips.includes(props.name) ? 'highlight' : ""}
      >
        {props.name}
      </button>
  );
};

const App = () => {
  const [result, setResult] = useState("0");

  const validMiddleWare = (value) =>
      value.match(/^[0-9./\-*+%^]+$/) &&
      !value.match(/\+{2,}|-{2,}|%{2,}|\^{2,}|\.{2,}|\*{2,}|^\.|\.\+|\+\.|-\.|\.-|%\.|\.%|\^\.|\.\^|\*\.|\.\*|^\+|^\*|^%|^\^/) &&
      !value.match(/[+\-%^*][+\-%^*]/) &&
      checkNumberOfDots(value);
  const validExp = /^0[0-9]+|\+0[0-9]+|-0[0-9]+|\*0[0-9]+|%0[0-9]+|\^0[0-9]+/;

  const onchangeHandler = (event) => {
    evaluate(event.target.value);
  }

  const keyboardEventHandler = (event) => {
    const key = event.key;
    if (key === "Escape") {
      handleClick("clear");
    } else if (key === "Enter") {
      handleClick("=");
    }
  };

  const evaluate = (value) => {
    if (value.charAt(value.length - 1) === "=") {
      value = value.slice(0, -1);
      if (
          validMiddleWare(value) &&
          !value.match(validExp) &&
          !value.match(/%$|\+$|-$|\^$|\.$|\*$/)
      ) {
        const v = new Node(value).parse();
        setResult(
            v > Number.MAX_SAFE_INTEGER || v < Number.MIN_SAFE_INTEGER
                ? "Error"
                : v.toString()
        );
      }
    } else {
      if (validMiddleWare(value)) {
        if (!value.match(validExp)) {
          setResult(value);
        } else if (
            value.match(/^0[0-9]+/) &&
            !value.match(/\+0[0-9]+|-0[0-9]+|\*0[0-9]+|%0[0-9]+|\^0[0-9]+/)
        ) {
          setResult(value.slice(1));
        }
      } else if (value === "") {
        setResult("0");
      }
    }
  };

  // Проверка, что нет более одной точки в числе
  const checkNumberOfDots = (value) => {
    let counter = 0;
    for (let i = value.length - 1; i > -1 && counter < 2; i--) {
      if (value[i].match(/^[+\-%*^]$/)) {
        counter = 0;
      }
      if (value[i] === ".") {
        counter++;
      }
    }
    return counter < 2;
  };

  const handleClick = (event) => {
    handleSelectedSymbol(event.target.name);
  }

  // обработка кнопок
  const handleSelectedSymbol = (selectedSymbol) => {
    if (!selectedSymbol.match(/^[0-9]$/)) {
      switch (selectedSymbol) {
        case "clear":
          setResult("0");
          break;
        case "←":
          if (result.length > 1) {
            setResult(result.slice(0, -1));
          } else {
            setResult("0");
          }
          break;
        case "=":
          evaluate(result + "=");
          break;
        case "-":
          if (result === "0") {
            setResult("-");
            break;
          }
          // eslint-disable-next-line
        default:
          evaluate(result + selectedSymbol);
      }
    } else if (result === "0") {
      setResult(selectedSymbol);
    } else {
      setResult(result + selectedSymbol);
    }
  };

  return (
      <div className="container">
        <div>
          <input
              id="input"
              type="text"
              value={result}
              autoFocus={true}
              tabIndex="0"
              onChange={onchangeHandler}
              onKeyUp={keyboardEventHandler}
          />
        </div>
        <div className="keypad">
          {buttons.map((b) => (
              <Button name={b} onClick={handleClick}/>
          ))}
        </div>
      </div>
  );
};

export default App;