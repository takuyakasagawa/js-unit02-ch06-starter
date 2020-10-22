import BaseValidator from './BaseValidator';

export default class extends BaseValidator {
  constructor(val) {
    super(val, 'パスワード', 'password');
    this._checkLength = this._checkLength.bind(this);
    this._checkFormat = this._checkFormat.bind(this);
    this._checkAlphabet = this._checkAlphabet.bind(this);
    this._checkSymbol = this._checkSymbol.bind(this);
    this._checkNumber = this._checkNumber.bind(this);
  }
  validate() {
    return super._cannotEmpty()
      .then(this._checkLength)
      .then(this._checkFormat)
      .then(this._checkAlphabet)
      .then(this._checkSymbol)
      .then(this._checkNumber)
      .then((res) => {
        return { success: true }; // Promise.resolve({ success: true })と同一
      })
      .catch(err => {
        return err; // Promise.resolve(err)と同一
      });
  }
  _checkLength() {
    if (this.val.length >= 8) {
      return Promise.resolve();
    } else {
      return Promise.reject({
        success: false,
        type: this.type,
        message: 'パスワードが短すぎます。'
      });
    } 
  }

  //    const re = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*[.|@|_|-])[A-Za-z0-9|.@_-]*$/;
  _checkFormat() {
    const re = /^[A-Za-z0-9.@_-]*$/;
    const match = re.test(this.val);
    if (match) {
      return Promise.resolve();
      }else {
        return Promise.reject({
          success: false,
          type: this.type,
          message: `${this.typeName}は英数字と記号@._-のみが使用できます。`
        })
      }
  }

  _checkAlphabet() {
    const re = /[A-Z]/;
    const match = re.test(this.val);
    if (match) {
      return Promise.resolve();
      }else {
        return Promise.reject({
          success: false,
          type: this.type,
          message: `大文字英字をパスワードに入力してください。`
        })
      }
  }

  _checkSymbol() {
    const re = /[_.-@]/i;
    const match = re.test(this.val);
    if (match) {
      return Promise.resolve();
      }else {
        return Promise.reject({
          success: false,
          type: this.type,
          message: `@._-の記号をどれか1文字以上入力してください。`
        })
      }
  }

  _checkNumber(){
    const re = /[0-9]/;
    const match = re.test(this.val);
    if (match) {
      return Promise.resolve();
      }else {
        return Promise.reject({
          success: false,
          type: this.type,
          message: `数字を1文字以上入力してください。`
        })
      }
  }
}
