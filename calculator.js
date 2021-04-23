class Calculator {
  constructor() {
    this._aobr; // a, operator, b, result
    this._stps; // steps
    this._rslt; // result

    this.init();
  }

  get aobr() {
    return this._aobr;
  }
  set aobr(value) {
    this._aobr = value;
  }
  get stps() {
    return this._stps.innerHTML;
  }
  set stps(value) {
    this._stps.innerHTML = value;
  }
  get rslt() {
    return this._rslt.innerHTML;
  }
  set rslt(value) {
    this._rslt.innerHTML = value;
  }

  init() {
    this._aobr = [];
    this._stps = document.querySelector("#stps");
    this._rslt = document.querySelector("#rslt");

    this.setEvents();
    this.setKeyboardEvents();
  }

  // set click events
  setEvents() {
    let btns = document.querySelectorAll("button");

    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.handleClickEvents(e, btn);
      });
    });
  }

  // handle click events
  handleClickEvents(e, btn) {
    let value = btn.value;
    switch (value) {
      // ! DEV
      case "dev":
        this.handleClickEventDev();
        break;
      // control
      case "ce": // CE
        this.handleClickEventCE();
        break;
      case "c": // C (AC)
        this.handleClickEventC();
        break;
      case "del": // DEL
        this.handleClickEventDel();
        break;
      case "=": // EQUAL
        this.handleClickEventEqual();
        break;
      // operator
      case "%": // percent
      case "/": // division
      case "*": // multiplication
      case "-": // minus
      case "+": // sum
        this.handleClickEventOperator(value);
        break;
      // number
      default:
        this.handleClickEventNumber(value);
    }
  }

  // ! DEV
  handleClickEventDev() {
    console.log(this.aobr);
  }

  // CE
  handleClickEventCE() {
    this.stps = "&nbsp;";
  }

  // C (AC)
  handleClickEventC() {
    this.aobr = [];
    this.handleClickEventCE();
    this.rslt = 0;
  }

  // DEL
  handleClickEventDel() {
    // [a, operator, b, result]
    let length = this.aobr.length;

    if (length == 0) {
      return;
    }

    // operator
    if (length == 2) {
      return;
    }

    // result
    if (length == 4) {
      this.handleClickEventCE();
      return;
    }

    let index = length - 1;
    this.aobr[index].pop();

    // a or b empty
    if (!this.aobr[index].length) {
      this.rslt = 0;
      return;
    }

    // default
    this.handleDisplay();
  }

  // EQUAL
  handleClickEventEqual() {
    // repeat equal
    if (this.aobr.length == 4) {
      this.aobr[0] = this.aobr[3];
    }

    // default
    let toEval = this.aobr[0].join("") + this.aobr[1] + this.aobr[2].join("");
    this.aobr[3] = [this.doEval(toEval)];
    this.stps = toEval + "=";
    this.rslt = this.aobr[3];
  }

  // OPERATOR
  handleClickEventOperator(value) {
    let length = this.aobr.length;
    let rslt;

    if (length == 0) {
      this.aobr[0] = ["0"];
    } else if (length == 3) {
      rslt = [this.doEval(this.aobr[0].join("") + this.aobr[1] + this.aobr[2].join(""))];
      this.handleClickEventC();
      this.aobr.push(rslt);
      this.rslt = rslt;
    } else if (length == 4) {
      rslt = this.aobr[3];
      this.handleClickEventC();
      this.aobr.push(rslt);
      this.rslt = rslt;
    }

    // default
    this.aobr[1] = value;
    this.stps = this.aobr[0].join("") + value;
  }

  // NUMBER
  handleClickEventNumber(value) {
    // dot, comma
    if (isNaN(value)) {
      if (value == "," || value == ".") {
        value = ".";
      } else {
        return;
      }
    }

    let length = this.aobr.length;

    // dot first
    if (length == 0 && value == ".") {
      this.aobr.push(["0"]);
      length++;
    }

    // result
    if (length == 4) {
      this.handleClickEventC();
    }

    // if (0 or 2) else (1 or 3)
    if (!(length % 2)) {
      this.aobr.push([value]); // a or b
    } else {
      this.aobr[length - 1].push(value); // a+ or b+
    }

    // default
    this.handleDisplay();
  }

  // keyboard
  setKeyboardEvents() {
    document.addEventListener("keyup", (e) => {
      let key = e.key;
      switch (key) {
        // control
        case "Escape": // ESC
          this.handleClickEventC();
          break;
        case "Backspace": // DEL
          this.handleClickEventDel();
          break;
        case "Enter":
        case "=":
          this.handleClickEventEqual();
          break;
        // operator
        case "%": // percent
        case "/": // division
        case "*": // multiplication
        case "-": // minus
        case "+": // sum
          this.handleClickEventOperator(key);
          break;
        // number
        default:
          this.handleClickEventNumber(key);
      }
    });
  }

  // handle display
  handleDisplay() {
    this.rslt = this.aobr[this.aobr.length == 1 ? 0 : 2].join("");
  }

  // do eval
  doEval(aob) {
    return eval(aob);
  }
}
