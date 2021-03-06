import BaseValidator from './BaseValidator';

export default class extends BaseValidator {
  constructor(val) {
    super(val, '名前', 'name');
    this._checkFormat = this._checkFormat.bind(this);
  }
  validate() {
    return super._cannotEmpty()
      .then(this._checkFormat)
      .then((res) => {
        return { success: true };
      })
      .catch(err => {
        return err;
      });
  }
  _checkFormat() {
    /* 
      名前は必ず一つのスペースを含みます。
      名前には半角英字のみが利用可能です。
    */
    const re = /^[a-z]*\s[a-z]*$/i;
    const match = re.test(this.val);
   if (match) {
     return Promise.resolve();
   } else {
     return Promise.reject({
       success: false,
       type: this.type,
       message:`${this.type}のフォーマットが異なります。`
     })
   }
  }
  
  _errorResult(message) {
    return{
      success: false,
      type: this.type,
      message
    }
  }
}