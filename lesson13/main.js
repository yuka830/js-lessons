"use strict";
const openModal = document.getElementById("js-open");
const closeModal = document.getElementById("js-close");
const mask = document.getElementById("js-mask");
const modal = document.getElementById("js-modal");
const requestBtn = document.getElementById("js-request");

const createLoader = () => {
  const wrapper = document.getElementById("js-wrapper");
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "loader";
  loader.classList.add("loading");
  loaderImage.src = "img/loading-circle.gif";
  wrapper.appendChild(loader).appendChild(loaderImage);
};

const loading = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("loader");
  loader.classList.add("loaded");
};

const jsonUrl = "https://jsondata.okiba.me/v1/json/PBH3M210806155341";

const createNewList = (data) => {
  const ul = document.getElementById("js-lists");
  const fragment = document.createDocumentFragment();

  data.forEach((key) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    li.classList.add("list")
    a.href = `/${key.a}`;
    a.textContent = key.text;
    img.src = key.img;
    img.alt = key.alt;

    fragment
      .appendChild(li)
      .appendChild(a)
      .insertAdjacentElement("afterbegin", img);
  });
  ul.appendChild(fragment);
};

const fetchedData = async () => {
  try {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (error) {
    const wrapper = document.getElementById("js-wrapper");
    wrapper.textContent = "データの取得ができませんでした。";
    console.error(error);
  } finally {
    loaded();
  }
};

const init = async () => {
  createLoader();
  loading();
  const val = await fetchedData();
  createNewList(val);
};

openModal.addEventListener("click", () => {
  modal.classList.remove("hidden");
  mask.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  mask.classList.add("hidden");
});

requestBtn.addEventListener("click", () => {
  init();
  modal.style.display = "none";
  mask.classList.add("hidden");
  openModal.classList.add("hidden");
});

mask.addEventListener("click", () => {
  closeModal.click();
});
