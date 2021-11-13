import React, { useState } from "react";
import "./App.css";
import Node from "./Node";

// константы
const buttons = [
  "clear",
  "←",
  "^",
  "%",
  "7",
  "8",
  "9",
  "*",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  "0",
  ".",
  "=",
];
const manips = ["clear", "←", "^", "%", "*", "-", "=", "+"];
let tabs = 1;

const Button = (props) => {
  if (manips.includes(props.name)) {
    return (
        <button
            key={props.name}
            className="highlight"
            name={props.name}
            onClick={props.onClick}
            tabIndex={tabs++}
        >
          {props.name}
        </button>
    );
  } else {
    return (
        <button
            key={props.name}
            name={props.name}
            onClick={props.onClick}
            tabIndex={tabs++}
        >
          {props.name}
        </button>
    );
  }
};

const App = () => {
  const [result, setResult] = useState("0");

  const validMiddleWare = (value) =>
      value.match(/^[0-9./\-*+%^]+$/) &&
      !value.match(/\+{2,}|-{2,}|%{2,}|\^{2,}|\.{2,}|\*{2,}|^\.|\.\+|\+\.|-\.|\.-|%\.|\.%|\^\.|\.\^|\*\.|\.\*|^\+|^\*|^%|^\^/) &&
      !value.match(/[+\-%^*][+\-%^*]/) &&
      checkNumberOfDots(value);
  const validExp = /^0[0-9]+|\+0[0-9]+|-0[0-9]+|\*0[0-9]+|%0[0-9]+|\^0[0-9]+/;

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

  // обработка кнопок
  const handleClick = (clickSymbol) => {
    if (!clickSymbol.match(/^[0-9]$/)) {
      switch (clickSymbol) {
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
          evaluate(result + clickSymbol);
      }
    } else if (result === "0") {
      setResult(clickSymbol);
    } else {
      setResult(result + clickSymbol);
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
              onChange={(event) => evaluate(event.target.value)}
              onKeyUp={keyboardEventHandler}
          />
        </div>
        <div className="keypad">
          {buttons.map((b) => (
              <Button name={b} onClick={(e) => handleClick(e.target.name)} />
          ))}
        </div>
      </div>
  );
};

export default App;