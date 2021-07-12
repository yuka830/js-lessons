"use strict";

const insert = new Promise((resolve, reject) => {
  const listItems = [
    { to: "bookmark.html", img: "1.png", alt: "画像1", text: "ブックマーク" },
    { to: "message.html", img: "2.png", alt: "画像2", text: "メッセージ" },
  ];
  resolve(listItems);
});

function newList(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((key) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    const img = document.createElement("img");

    a.href = `/${key.to}`;
    a.textContent = key.text;
    img.src = key.img;
    img.alt = key.alt;

    fragment
      .appendChild(li)
      .appendChild(a)
      .insertAdjacentElement("afterbegin", img);
  });
  return fragment;
}

function insertList(data) {
  const ul = document.getElementById("js-lists");
  ul.appendChild(data);
}

insert.then((listItems) => insertList(newList(listItems)));
