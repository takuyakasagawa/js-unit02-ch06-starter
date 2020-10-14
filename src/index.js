import MailValidator from './lib/MailValidator';
import PasswordValidator from './lib/PasswordValidator';
import NameValidator from './lib/NameValidator';
import UsernameValidator from './lib/UsernameValidator';
import 'whatwg-fetch'

const endpoint = "http://localhost:3000"

const validate = (params) => {
  const name = params.name;
  const email = params.email;
  const password = params.password;
  const username = params.username;
  const mailValidator = new MailValidator(email);
  const passwordValidator = new PasswordValidator(password);
  const nameValidator = new NameValidator(name)
  const usernameValidator = new UsernameValidator(username)
  return Promise.all([
    nameValidator.validate(),
    usernameValidator.validate(),
    mailValidator.validate(),
    passwordValidator.validate()]
  )
}

const removeErrors = () => {
  return new Promise((resolve) => {
    document.querySelectorAll('.is-invalid').forEach((el) => {
      el.classList.remove('is-invalid')
    })
    document.querySelectorAll('.invalid-feedback').forEach((el) => {
      el.parentNode.removeChild(el);
    })
    resolve();
  })
}

const addErrorMessage = (type, message) => {
  let input = document.getElementById(type);
  input.classList.add('is-invalid')
  input.insertAdjacentHTML('afterend', `<div class="invalid-feedback">${message}</div>`);
}

const signup = (params) => {
  return fetch(`${endpoint}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json; charset=utf-8',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.name,
      username: params.username,
      email: params.email,
      password: params.password
    })
  })
  .then((res) => {
    const json = res.json();
    if (res.status === 200) { // 登録成功
      return json
    } else { // 登録失敗
      return Promise.reject(new Error('ユーザー登録失敗'))
    }
  })
}

const onSubmit = async () => {
  await removeErrors()
  let emailInput = document.getElementById('email');
  let passwordInput = document.getElementById('password');
  let usernameInput = document.getElementById('username');
  let nameInput = document.getElementById('name');
  let emailVal = emailInput.value;
  let passwordlVal = passwordInput.value;
  let usernameVal = usernameInput.value;
  let nameVal = nameInput.value;
  
  const params = {
    email: emailVal,
    password: passwordlVal,
    username: usernameVal,
    name: nameVal
  }
  const results = await validate(params);
  if (results[0].success && results[1].success && results[2].success && results[3].success) {//名前のバリデーションが成功したら。ユーザー名のバリデーションが成功したら。メールアドレス、パスワードも同様。
    signup(params)
      .then((json) => {
        alert(json.message);
      })
      .catch((err) => {
        alert(err.message);
      });
      // } else if (results[0].success){
      //   addErrorMessage(results.type, results[1].message)
      // } else if (results[1].success) {
      //   addErrorMessage(results.type, results[2].message)
      // } else if (results[2].success) {
      //   addErrorMessage(results.type, results[3].message)
      // } else (
      //   addErrorMessage(results.type, results[0].message)
  } else {
    results.forEach((result) => {
      if (!result.success)addErrorMessage(result.type, result.message);
    })
  }
}
// ヒント1: usernameやnameなどの値を総称するオブジェクトのプロパティ名が、バリデーションファイルのスターターにあります以下の方法だと、バリデーションする項目があと100個増えると書き足さねばならず「再利用性」が低いので、再利用性を高くするよう書き換えてみましょう
// ヒント2: 同じ内容で配列の値が異なるだけの処理を繰り返し4回書いていますねプログラミングでは「繰り返し処理を避ける」ことが良いとされていますこの繰り返しほとんど同じ処理を書く方法を抜け出すことのできる技法が、実はfor文のとある種類のメソッドにあります配列を値として取り扱うことのできるfor文の一種の技法をヒントに、少し調べてみましょう

//for (let i = 0; i < arr.length; ++i)
//arrays.forEach(function(array) { /* return... */ })
//arrays.forEach(array => { /* return... */ })//引数１つのため省力
//arrays.forEach((array,i) => /* ... */)//１行でかける場合は{}とreturn省力

{
  const submit = document.getElementById('submit');
  submit.addEventListener('click', onSubmit);
}