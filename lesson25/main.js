const checkBox = document.getElementById("js-checkBox");
const submitBtn = document.getElementById("js-submitBtn");
const scrollEnd = document.getElementById("js-scrollEnd");
const modal = document.getElementById("js-modal");
const openModal = document.getElementById("js-openModal");
const closeModal = document.getElementById("js-closeModalBtn");
const mask = document.getElementById("js-mask");

const userNameInput = document.getElementById("userName");
const mailInput = document.getElementById("email");
const passInput = document.getElementById("pass");

const flags = {
  userName: false,
  email: false,
  pass: false,
  checkBox: false,
};

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

submitBtn.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    if (!checkBox.checked) {
      alert("利用規約を全て確認後、チェックボタンを押してから送信して下さい。");
      return;
    }
    document.location.href = "./register-done.html";
  },
  false
);

checkBox.addEventListener(
  "click",
  (e) => {
    flags.checkBox = e.target.checked;
    switchSubmitBtn();
  },
  false
);

const validations = {
  userName: {
    maxLength: 15,
    minLength: 1,
    errorMessage: "※ユーザー名は1文字以上15文字以下にしてください。",
    isValid: (val) => {
      return (
        val.length >= validations.userName.minLength &&
        val.length <= validations.userName.maxLength
      );
    },
  },
  email: {
    errorMessage: "メールアドレスが空欄・もしくは形式が異なっています。",
    isValid: (val) => /.+@.+\..+/.test(val),
  },
  pass: {
    errorMessage: "8文字以上の大小の英数字を交ぜたものにしてください。",
    isValid: (val) =>
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/.test(val),
  },
};

const checkInputVal = (targetForm) => {
  const targetInput = document.getElementById(targetForm.id);
  const result = validations[targetForm.id].isValid(targetForm.value);
  if (result) {
    flags[targetForm.id] = true;
    return;
  }
  flags[targetForm.id] = false;
  targetInput.after(createErrorMessage(targetForm));
};

const createErrorMessage = (targetForm) => {
  const errorTxt = createElementWithClassName("p", "error-txt");
  errorTxt.textContent = validations[targetForm.id].errorMessage;
  return errorTxt;
};

const validateInputVal = (targetForm) => {
  const errorTxtEle = targetForm.nextElementSibling;
  checkInputVal(targetForm);
  errorTxtEle && errorTxtEle.remove();
  switchSubmitBtn();
};

userNameInput.addEventListener("blur", (e) => validateInputVal(e.target));
mailInput.addEventListener("blur", (e) => validateInputVal(e.target));
passInput.addEventListener("blur", (e) => validateInputVal(e.target));

const observer = new IntersectionObserver((targets) => {
  if (targets[0].intersectionRatio === 1) {
    checkBox.disabled = false;
    checkBox.checked = true;
    flags.checkBox = true;
  }
  switchSubmitBtn();
});
observer.observe(scrollEnd);

const switchSubmitBtn = () => {
  const checkFlags = Object.values(flags).every((val) => val);
  checkFlags ? (submitBtn.disabled = false) : (submitBtn.disabled = true);
};

const showModal = () => {
  modal.classList.remove("hidden");
  mask.classList.remove("hidden");
};

const hiddenModal = () => {
  modal.classList.add("hidden");
  mask.classList.add("hidden");
};

mask.addEventListener("click", () => {
  closeModal.click();
});

openModal.addEventListener("click", showModal);
closeModal.addEventListener("click", hiddenModal);
