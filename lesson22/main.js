const jsonUrl = "https://myjson.dit.upm.es/api/bins/710x";
const tableWrap = document.getElementById("js-table-wrapper");
let sortState = "both";
let targetSortElements = ["id", "age"];

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const createLoader = () => {
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "js-loader";
  loaderImage.src = "img/loading-circle.gif";
  loader.appendChild(loaderImage);
  return loader;
};

const loading = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loaded");
};

const fetchDataInSecond = (sec, jsonUrl) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetchJson(jsonUrl));
    }, sec);
  });
};

const fetchJson = async (jsonUrl) => {
  const response = await fetch(jsonUrl);
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`サーバーリクエストに失敗しました: ${response.status}`);
  }
};

const fetchUsersData = async () => {
  try {
    const json = await fetchDataInSecond(3000, jsonUrl);
    return json.data;
  } catch (e) {
    tableWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  }
};

/**
 * Rendering table using users data from JSON file
 * @param {Object} usersData array of users data
 */
const renderTable = (usersData) => {
  const table = createTable();
  table.appendChild(createTableHeader(usersData));
  table.appendChild(createTableData(usersData));
  tableWrap.appendChild(table);
};

const createTable = () => {
  const table = createElementWithClassName("table", "users-table");
  table.id = "js-table";
  return table;
};

/**
 *Creating table header with key of usersData
 * @param {Array} usersData The Array of usersData
 */
const createTableHeader = (usersData) => {
  const trOfThead = createElementWithClassName("tr", "users-table__tr-th");
  const fragment = document.createDocumentFragment();
  AddTextContentToThead(usersData, fragment);
  trOfThead.appendChild(fragment);
  return trOfThead;
};

/**
 *Extract key from usersData
 * @param {Object} usersData[0] value from one of userData in the object
 * @param {String} key key of userData
 */
const AddTextContentToThead = (usersData, fragment) => {
  Object.keys(usersData[0]).forEach((key) => {
    if (key === "memberId") return;
    const th = createElementWithClassName("th", "users-table__th");
    th.textContent = formingTableHeaderNameWithKey(key);
    th.id = key;
    fragment.appendChild(th);
  });
};

const formingTableHeaderNameWithKey = (key) => {
  switch (key) {
    case "id":
      return "ID";
    case "memberId":
      return "memberId";
    case "name":
      return "名前";
    case "sex":
      return "性別";
    case "age":
      return "年齢";
    default:
      console.error(`${key}は見つかりませんでした`);
  }
};

/**
 *Creating table data with value of usersData
 * @param {Array} usersData The Array of usersData
 */
const createTableData = (usersData) => {
  const fragment = document.createDocumentFragment();
  usersData.forEach((userData) => {
    const trOfTdata = createElementWithClassName("tr", "users-table__tr-td");
    Object.keys(userData).forEach((key) => {
      if (key === "id") return;
      const td = createElementWithClassName("td", "users-table__td");
      td.textContent = userData[key];
      trOfTdata.appendChild(td);
    });
    fragment.appendChild(trOfTdata);
  });
  return fragment;
};

const createSortBtn = () => {
  const btn = createElementWithClassName("button", "js-sort-btn");
  const sortArrow = createElementWithClassName("img", "sort-img");
  // bothのイメージをデフォルトとする
  sortArrow.src = "./img/both.svg";
  btn.appendChild(sortArrow);
  return btn;
};

const setDataSort = (usersData) => {
  Object.keys(usersData[0]).forEach((key) => {
    if (targetSortElements.includes(key)) {
      const element = document.getElementById(key);
      element.dataset.sort = "sort";
    }
  });
};

const renderSortBtn = (usersData) => {
  setDataSort(usersData);
  const elements = document.querySelectorAll("[data-sort]");
  elements.forEach((element) => {
    const btn = createSortBtn();
    element.appendChild(btn);
  });
};

const clickSortBtn = (usersData) => {
  const sortArrowBtns = document.querySelectorAll(".js-sort-btn");
  sortArrowBtns.forEach((sortArrowBtn) => {
    sortArrowBtn.addEventListener("click", (e) => {
      const tHeaderId = e.currentTarget.parentNode.id;
      const sortArrowImg = e.currentTarget.firstElementChild;
      initSortAndOthersSortImg(tHeaderId);
      changeSortStateAndArrowImg(sortArrowImg);
      rerenderTableData(usersData, tHeaderId);
    });
  });
};

const initSortAndOthersSortImg = (tHeaderId) => {
  const othersId = targetSortElements.find((name) => name !== tHeaderId);
  const othersBtn = document.getElementById(othersId).firstElementChild;
  const othersImg = othersBtn.firstElementChild;
  if (othersImg.getAttribute("src") !== "/img/both.svg") {
    othersImg.src = "/img/both.svg";
    sortState = "both";
  }
};

const changeSortStateAndArrowImg = (sortArrowImg) => {
  switch (sortState) {
    case "both":
      sortState = "asc";
      sortArrowImg.src = "/img/asc.svg";
      break;
    case "asc":
      sortState = "desc";
      sortArrowImg.src = "/img/desc.svg";
      break;
    default:
      sortState = "both";
      sortArrowImg.src = "/img/both.svg";
  }
};

const rerenderTableData = (usersData, tHeaderId) => {
  const table = document.getElementById("js-table");
  let copiedUsersData = [...usersData];
  if (sortState === "asc") copiedUsersData = sortAsc(usersData, tHeaderId);
  if (sortState === "desc") copiedUsersData = sortDesc(usersData, tHeaderId);
  removeTrOfTdata(table);
  table.appendChild(createTableData(copiedUsersData));
};

const sortAsc = (usersData, idName) => {
  if (idName === "id") idName = "memberId";
  let copiedUsersData = [...usersData];
  copiedUsersData.sort((a, b) => {
    return a[idName] - b[idName];
  });
  return copiedUsersData;
};

const sortDesc = (usersData, idName) => {
  if (idName === "id") idName = "memberId";
  let copiedUsersData = [...usersData];
  copiedUsersData.sort((a, b) => {
    return b[idName] - a[idName];
  });
  return copiedUsersData;
};

const removeTrOfTdata = (table) => {
  const trOfTdata = document.querySelectorAll(".users-table__tr-td");
  trOfTdata.forEach((tr) => {
    table.removeChild(tr);
  });
};

const init = async () => {
  tableWrap.insertAdjacentElement("beforebegin", createLoader());
  loading();
  let usersData;
  try {
    usersData = await fetchUsersData();
  } catch (e) {
    console.error(e);
    tableWrap.textContent = `エラーが発生しました: ${e.message}`;
  } finally {
    loaded();
    console.log("処理が完了しました。");
  }
  if (usersData.length === 0) {
    tableWrap.textContent = "データがありません。";
    return;
  }
  renderTable(usersData);
  renderSortBtn(usersData);
  clickSortBtn(usersData);
};
init();
