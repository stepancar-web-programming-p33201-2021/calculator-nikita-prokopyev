class Node {
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
    if (this.expression.indexOf("+") !== -1) {
      this.op = "+";
      position = this.expression.indexOf("+");
    } else if (this.expression.indexOf("-") !== -1) {
      this.op = "-";
      position = this.expression.indexOf("-");
    } else if (this.expression.indexOf("*") !== -1) {
      this.op = "*";
      position = this.expression.indexOf("*");
    } else if (this.expression.indexOf("%") !== -1) {
      this.op = "%";
      position = this.expression.indexOf("%");
    } else if (this.expression.indexOf("^") !== -1) {
      this.op = "^";
      position = this.expression.indexOf("^");
    } else {
      this.isSimple = true;
    }
    if (!this.isSimple) {
      // да, тут костыль
      if (position === 0 && this.op === "-") {
        this.left = new Node("0");
        this.right = new Node(this.expression.slice(1, this.expression.length));
      } else {
        this.left = new Node(this.expression.slice(0, position));
        this.right = new Node(
            this.expression.slice(position + 1, this.expression.length)
        );
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
      case "+":
        return this.left.evaluate() + this.right.evaluate();
      case "*":
        return this.left.evaluate() * this.right.evaluate();
      case "%":
        return this.left.evaluate() % this.right.evaluate();
      case "^":
        return Math.pow(this.left.evaluate(), this.right.evaluate());
      case "-":
        return this.left.evaluate() - this.right.evaluate();
      default:
        console.log("Error : unknown operator");
    }
  }
}

export default Node;