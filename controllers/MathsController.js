import Controller from "./Controller.js";
import * as mathUtilities from "../mathUtilities.js";

export default class MathsController extends Controller {
  constructor(HttpContext) {
    super(HttpContext);
  }

  get(id) {
    let response = {};
    let x =
      this.HttpContext.path.params.x !== undefined
        ? parseFloat(this.HttpContext.path.params.x)
        : undefined;
    let y =
      this.HttpContext.path.params.y !== undefined
        ? parseFloat(this.HttpContext.path.params.y)
        : undefined;
    let n =
      this.HttpContext.path.params.n !== undefined
        ? parseFloat(this.HttpContext.path.params.n)
        : undefined;
    let op = this.HttpContext.path.params.op;

    if (
      (op === "+" || op === "-" || op === "*" || op === "/" || op === "%") &&
      (x === undefined || y === undefined)
    ) {
      response.error = "Parameters 'x' and 'y' are required for the operation";
    }

    if ((op === "!" || op === "p" || op === "np") && n === undefined) {
      response.error = "Parameter 'n' is required for this operation";
    }

    if (
      (op === "+" || op === "-" || op === "*" || op === "/" || op === "%") &&
      (isNaN(x) || isNaN(y))
    ) {
      response.error = `'${isNaN(x) ? "x" : "y"}' parameter is not a number`;
    }

    if ((op === "!" || op === "p" || op === "np") && isNaN(n)) {
      response.error = "'n' parameter is not a number";
    }
    if (n != null && (parseInt(n) !== n || n <= 0)) {
      response.error = "'n' parameter must be an integer > 0";
    }
    if (op === "!" || op === "p" || op === "np") {
      let count = 0;
      for (let par in this.HttpContext.path.params) {
        count += 1;
      }
      if (count > 2) response.error = "Too many parameters";
    }
    if (op == "undefined") response.error = "'op' parameter is missing";
    if (response.error) {
      if (op != "undefined") response.op = this.HttpContext.path.params.op;
      response.x = this.HttpContext.path.params.x;
      response.y = this.HttpContext.path.params.y;
      response.n = this.HttpContext.path.params.n;
      return this.HttpContext.response.JSON(response);
    }
    response.op = op;
    switch (op) {
      case "+":
        response.x = x;
        response.y = y;
        response.value = x + y;
        break;
      case "-":
        response.x = x;
        response.y = y;
        response.value = x - y;
        break;
      case "*":
        response.x = x;
        response.y = y;
        response.value = x * y;
        break;
      case "/":
        response.x = x;
        response.y = y;
        if (y != 0) response.value = x / y;
        else if (x != 0) response.value = "Infinity";
        else response.value = "NaN";
        break;
      case "%":
        response.x = x;
        response.y = y;
        if (y != 0) response.value = x % y;
        else response.value = "NaN";
        break;
      case "!":
        response.n = n;
        response.value = mathUtilities.factorial(n);
        break;
      case "p":
        response.n = n;
        response.value = mathUtilities.isPrime(n);
        break;
      case "np":
        response.n = n;
        response.value = mathUtilities.findPrime(n);
        break;
      default:
        response.error = "'op' parameter is missing";
        return this.HttpContext.response.JSON(response, 200);
    }

    this.HttpContext.response.JSON(response);
  }

  post(data) {
    this.HttpContext.response.JSON(
      { error: "POST is not allowed for this endpoint" },
      200
    );
  }

  put(data) {
    this.HttpContext.response.JSON(
      { error: "PUT is not allowed for this endpoint" },
      200
    );
  }

  remove(id) {
    this.HttpContext.response.JSON(
      { error: "DELETE is not allowed for this endpoint" },
      200
    );
  }
}
