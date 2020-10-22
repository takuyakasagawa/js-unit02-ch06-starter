import BaseValidator from './BaseValidator';

export default class extends BaseValidator {
  constructor(val) {
    super(val, 'パスワード', 'password');
    this._checkLength = this._checkLength.bind(this);
    this._checkFormat = this._checkFormat.bind(this);
  }
  validate() {
    return super._cannotEmpty()
      .then(this._checkLength)
      .then(this._checkFormat)
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
  _checkFormat() {
    const re = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*[.|@|_|-])[A-Za-z0-9|.@_-]*$/;
    const match = re.test(this.val);
    if (match) {
      return Promise.resolve();
    } else {
        return Promise.reject({
          success: false,
          type: this.type,
          message: `${this.type}のフォーマットが異なります。`
        })
      }
  }
}