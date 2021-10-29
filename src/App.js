import React, {useEffect, useState} from "react";
import './App.css';

// какие-то константы, яхз
const buttons = ['Clear', '←', '^', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='];
const manips = ['Clear', '←', '^', '/', '*', '-', '=', '+'];

// Пожилая кнопка
const Button = (props) => {
  if (manips.includes(props.name))
    return (<button key={props.name} className="highlight" name={props.name} onClick={props.onClick}>{props.name}</button>);
  else
    return (<button key={props.name} name={props.name} onClick={props.onClick}>{props.name}</button>);
}

// приложение вот
const App = () => {
  const [result, setResult] = useState('0');
  useEffect(() => {
    window.addEventListener('keyup', (event) => {
      if (event.key.match(/^[0-9.+\-/^*]$/)) {
        document.getElementsByName(event.key)[0].click();
      } else {
        switch (event.key) {
          case 'Backspace' :
            document.getElementsByName('←')[0].click();
            break;
          case 'Escape' :
            document.getElementsByName('Clear')[0].click();
            break;
          case 'Enter' :
            document.getElementsByName('=')[0].click();
            break;
          case '=' :
            document.getElementsByName(event.key)[0].click();
            break;
          default :
            console.log('Error : unknown button ' + event.key);
        }
      }
    });
  }, []);

  const calc = () => {
    if (result.at(result.length - 1).match(/^\d$/)) {
      const Root = new node(result);
      const r = Root.parse();
      setResult(r.toString());
    }
  }

  // точка есть? а если найду?!
  const checkDots = () => {
    let counter = 0;
    for (let i = result.length - 1; i > -1; i--) {
      if (result[i].match(/^[+\-/*^]$/)) break;
      if (result[i] === '.') counter++;
    }
    return counter === 0;
  }

  // ручка вот, можешь что-нить написать
  const handleClick = (e) => {
    const clickSymbol = e.target.name;

    if (!clickSymbol.match(/^[0-9]$/)) {
      switch (clickSymbol) {
        case 'Clear' :
          setResult('0');
          break;
        case '←' :
          if (result.length > 1)
            setResult(result.slice(0, -1));
          else
            setResult('0');
          break;
        case '=' :
          calc();
          break;
        case '.' :
          if (result.at(result.length - 1).match(/^\d$/) && checkDots(result))
            setResult(result + clickSymbol);
          break;
        case '-' :
          if (result === '0') {
            setResult('-');
            break;
          }
        default :
          if (result.at(result.length - 1).match(/^\d$/)) {
            setResult(result + clickSymbol);
          } else if (!result.at(result.length - 1).match(/^\.$/))
            setResult(result.slice(0, -1) + clickSymbol);
      }
    } else if (result === '0')
      setResult(clickSymbol);
    else
      setResult(result + clickSymbol);
  }

  // ну ретерн и ретерн, че бухтеть-то
  return (
      <div className="container">
        <form>
          <input type="text" value={result} autoFocus={true} />
        </form>
        <div className="keypad">
          {buttons.map((b) => <Button name={b} onClick={handleClick}/>)}
        </div>
      </div>
  );
}

// nodeJs - hehe - а вот и нет
class node {
  constructor(expression) {
    this.left = null;
    this.right = null;
    this.op = null;
    this.expression = expression;
    this.isSimple = false;
  }

  // тут у нас типо парсер
  parse() {
    let position;
    if (this.expression.indexOf('+') !== -1) {
      this.op = '+';
      position = this.expression.indexOf('+');
    } else if (this.expression.indexOf('-') !== -1) {
      this.op = '-';
      position = this.expression.indexOf('-');
    } else if (this.expression.indexOf('/') !== -1) {
      this.op = '/';
      position = this.expression.indexOf('/');
    } else if (this.expression.indexOf('*') !== -1) {
      this.op = '*';
      position = this.expression.indexOf('*');
    } else if (this.expression.indexOf('^') !== -1) {
      this.op = '^';
      position = this.expression.indexOf('^');
    } else {
      this.isSimple = true;
    }
    if (!this.isSimple) {
      // да, тут костыль
      if (position === 0 && this.op === '-') {
        this.left = new node('0');
        this.right = new node(this.expression.slice(1, this.expression.length));
      } else {
        this.left = new node(this.expression.slice(0, position));
        this.right = new node(this.expression.slice(position + 1, this.expression.length));
      }
      this.left.parse();
      this.right.parse();
    }
    return this.evaluate();
  }

  // как eval, но не eval - eval нельзя
  evaluate() {
    if (this.isSimple) return parseFloat(this.expression);
    // не, ну а чо, нормальный switch
    switch (this.op) {
      case '+' :
        return this.left.evaluate() + this.right.evaluate();
        break;
      case '*' :
        return this.left.evaluate() * this.right.evaluate();
        break;
      case '/' :
        return this.left.evaluate() / this.right.evaluate();
        break;
      case '^' :
        return Math.pow(this.left.evaluate(), this.right.evaluate());
        break;
      case '-' :
        return this.left.evaluate() - this.right.evaluate();
        break;
      default : console.log('Error : unknown operator');
    }
  }
}


export default App