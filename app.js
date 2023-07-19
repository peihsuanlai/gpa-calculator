let hero = document.querySelector(".hero");
let slider = document.querySelector(".slider");
let animation = document.querySelector("section.animation-wrapper");

const time_line = new TimelineMax();

// parameter1 是要控制的對象
// parameter2 是duration
// parameter3 是控制對象的原始狀態
// parameter4 是控制對象的動畫結束後的狀態
// parameter5 設定提早開始跑
time_line
  //讓圖片從高度0開始擴大
  .fromTo(hero, 1, { height: "0%" }, { height: "100%", ease: Power2.easeInOut })
  //讓圖片從寬度 80% 擴大到 100%
  .fromTo(
    hero,
    1.2,
    { width: "80%" },
    { width: "100%", ease: Power2.easeInOut }
  )
  //灰色圖從後面滑進來
  .fromTo(
    slider,
    1,
    { x: "-100%" }, //往左移100%
    { x: "0%", ease: Power2.easeInOut },
    "-=1.2"
  )
  //設定讓動畫經 0.3秒後消失在畫面中
  .fromTo(animation, 0.3, { opacity: 1 }, { opacity: 0 });

//畫面其實還在，蓋住整個畫面無法按，設定時間讓它消失
setTimeout(() => {
  animation.style.pointerEvents = "none";
}, 2500); //設定經 2.5s 後點不到動畫

//預防每一格輸入完按 enter 資料就不見的情況-->讓整個網站的 enter key 無法使用

window.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
  }
});

//button 預設的值是 submit-->要防止 form 內部的 button 交出表單

let allButtons = document.querySelectorAll("button");
// return 一個 nodelist，可以用 forEach()
allButtons.forEach((button) => {
  //有六個 button
  button.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

//選擇 select 內的 option 後，會改變相對應的顏色、GPA 也會更新

let allSelects = document.querySelectorAll("select"); //靜態的 nodelist
allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target); //e.target 就是 select 標籤
  });
});

//改變 credit，GPA 也要更新
let credits = document.querySelectorAll(".class-credit");
credits.forEach((credit) => {
  //每個 credit 都是 input type 是 number 的標籤
  credit.addEventListener("change", () => {
    setGPA();
  });
});

//分數顏色轉換
function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style.backgroundColor = "lightgreen";
    target.style.color = "black";
  } else if (
    target.value == "B" ||
    target.value == "B-" ||
    target.value == "B+"
  ) {
    target.style.backgroundColor = "yellow";
    target.style.color = "black";
  } else if (
    target.value == "C" ||
    target.value == "C-" ||
    target.value == "C+"
  ) {
    target.style.backgroundColor = "orange";
    target.style.color = "black";
  } else if (
    target.value == "D" ||
    target.value == "D-" ||
    target.value == "D+"
  ) {
    target.style.backgroundColor = "red";
    target.style.color = "black";
  } else if (target.value == "F") {
    target.style.backgroundColor = "grey";
    target.style.color = "white";
  } else {
    target.style.backgroundColor = "white";
  }
}

//分數轉換
function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

//給 credit 和 分數要算 GPA
function setGPA() {
  let formLength = document.querySelectorAll("form").length; //回傳 nodelist 的長度
  let credits = document.querySelectorAll(".class-credit");
  let selects = document.querySelectorAll(".select");
  let sum = 0; //分子：學分數*成績
  let creditSum = 0; //分母：學分數相加
  for (let i = 0; i < credits.length; i++) {
    //發現沒有填 credits，會 return NaN
    if (!isNaN(credits[i].valueAsNumber)) {
      //如果不是NaN，就計算
      creditSum += credits[i].valueAsNumber; //credit[i] 只是選到標籤
    }
  }

  for (let i = 0; i < formLength; i++) {
    // selects[i].value 沒有問題，credits[i].valueAsNumber 仍然必須給條件，否則會有 return NaN 的情況
    if (!isNaN(credits[i].valueAsNumber)) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
    }
  }

  // //debug
  // console.log("creditSum is" + creditSum); //NaN
  // console.log("sum is" + sum); //NaN

  let result;
  if (creditSum == 0) {
    //學分數都是0的情況
    result = (0.0).toFixed(2);
  } else {
    result = (sum / creditSum).toFixed(2); //取到小數點後第二位
  }

  document.getElementById("result-gpa").innerText = result;
}

//按新增按紐時

let addButton = document.querySelector(".plus-btn");
addButton.addEventListener("click", () => {
  let newForm = document.createElement("form");
  let newDiv = document.createElement("div");
  newDiv.classList.add("grader");
  //製作五個小元素
  let newInput1 = document.createElement("input");
  newInput1.setAttribute("type", "text");
  newInput1.setAttribute("list", "opt");
  newInput1.classList.add("class-type");

  let newInput2 = document.createElement("input");
  newInput2.setAttribute("type", "text");
  newInput2.classList.add("class-number");

  let newInput3 = document.createElement("input");
  newInput3.setAttribute("type", "number");
  newInput3.setAttribute("min", "0");
  newInput3.setAttribute("max", "6");
  newInput3.classList.add("class-credit");
  newInput3.addEventListener("change", () => {
    //為新增的表格設定事件監聽=>如果有更新的話，GPA 分數也要更新
    setGPA();
  });

  // 新的選單
  let newSelect = document.createElement("select");
  newSelect.classList.add("select");
  var opt1 = document.createElement("option");
  opt1.setAttribute("value", "");
  let textNode1 = document.createTextNode("");
  opt1.appendChild(textNode1);
  var opt2 = document.createElement("option");
  opt2.setAttribute("value", "A");
  let textNode2 = document.createTextNode("A");
  opt2.appendChild(textNode2);
  var opt3 = document.createElement("option");
  opt3.setAttribute("value", "A-");
  let textNode3 = document.createTextNode("A-");
  opt3.appendChild(textNode3);
  var opt4 = document.createElement("option");
  opt4.setAttribute("value", "B+");
  let textNode4 = document.createTextNode("B+");
  opt4.appendChild(textNode4);
  var opt5 = document.createElement("option");
  opt5.setAttribute("value", "B");
  let textNode5 = document.createTextNode("B");
  opt5.appendChild(textNode5);
  var opt6 = document.createElement("option");
  opt6.setAttribute("value", "B-");
  let textNode6 = document.createTextNode("B-");
  opt6.appendChild(textNode6);
  var opt7 = document.createElement("option");
  opt7.setAttribute("value", "C+");
  let textNode7 = document.createTextNode("C+");
  opt7.appendChild(textNode7);
  var opt8 = document.createElement("option");
  opt8.setAttribute("value", "C");
  let textNode8 = document.createTextNode("C");
  opt8.appendChild(textNode8);
  var opt9 = document.createElement("option");
  opt9.setAttribute("value", "C-");
  let textNode9 = document.createTextNode("C-");
  opt9.appendChild(textNode9);
  var opt10 = document.createElement("option");
  opt10.setAttribute("value", "D+");
  let textNode10 = document.createTextNode("D+");
  opt10.appendChild(textNode10);
  var opt11 = document.createElement("option");
  opt11.setAttribute("value", "D");
  let textNode11 = document.createTextNode("D");
  opt11.appendChild(textNode11);
  var opt12 = document.createElement("option");
  opt12.setAttribute("value", "D-");
  let textNode12 = document.createTextNode("D-");
  opt12.appendChild(textNode12);
  var opt13 = document.createElement("option");
  opt13.setAttribute("value", "F");
  let textNode13 = document.createTextNode("F");
  opt13.appendChild(textNode13);

  newSelect.appendChild(opt1);
  newSelect.appendChild(opt2);
  newSelect.appendChild(opt3);
  newSelect.appendChild(opt4);
  newSelect.appendChild(opt5);
  newSelect.appendChild(opt6);
  newSelect.appendChild(opt7);
  newSelect.appendChild(opt8);
  newSelect.appendChild(opt9);
  newSelect.appendChild(opt10);
  newSelect.appendChild(opt11);
  newSelect.appendChild(opt12);
  newSelect.appendChild(opt13);

  //為新增的 select 設定事件監聽
  newSelect.addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  });

  //新的垃圾桶按鈕
  let newButton = document.createElement("button");
  newButton.classList.add("trash-button");
  let newItag = document.createElement("i");
  newItag.classList.add("fas");
  newItag.classList.add("fa-trash");
  newButton.appendChild(newItag);

  //為新增的垃圾桶設定事件監聽
  newButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.parentElement.parentElement.style.animation =
      "scaleDown 0.5s ease forwards";
    e.target.parentElement.parentElement.addEventListener(
      "animationend",
      (e) => {
        e.target.remove();
        setGPA();
      }
    );
  });

  //五個元素新增近 div.grader

  newDiv.appendChild(newInput1);
  newDiv.appendChild(newInput2);
  newDiv.appendChild(newInput3);
  newDiv.appendChild(newSelect);
  newDiv.appendChild(newButton);

  //div.grader 新增進 form
  newForm.appendChild(newDiv);

  //每按一次新增，一欄新的表格就出現
  document.querySelector(".all-inputs").appendChild(newForm);
  newForm.style.animation = "scaleUp 0.5s ease forwards";
});

let allTrash = document.querySelectorAll(".trash-button");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    // e.target.parentElement.parentElement.remove()  會直接被移除，沒有動畫
    //e.target 是 trash button 本身，找父標籤是 div.grader，再找父標籤 form
    e.target.parentElement.parentElement.classList.add("remove"); //新增縮小的動畫，但還是佔著空間
    // e.target.parentElement.parentElement.classList.remove(); //刪除該縮小的動畫
    //結果跑太快，還沒新增動畫就被刪掉了
  });
});

allTrash.forEach((trash) => {
  let form = trash.parentElement.parentElement;
  form.addEventListener("transitionend", (e) => {
    //監聽動畫結束的時間
    e.target.remove(); //移除 form，空間釋出
    setGPA(); //刪除一欄也要重新計算
  });
});

//排序演算法 mergesort

let btn1 = document.querySelector(".sort-descending");
let btn2 = document.querySelector(".sort-ascending");
btn1.addEventListener("click", () => {
  handleSorting("descending"); // 大到小
});
btn2.addEventListener("click", () => {
  handleSorting("ascending"); // 小到大
});

function handleSorting(direction) {
  let graders = document.querySelectorAll("div.grader");
  let objectArray = []; //製作要比較的項目

  for (let i = 0; i < graders.length; i++) {
    let class_name = graders[i].children[0].value; //class category //value 回傳的都是 string
    let class_number = graders[i].children[1].value; // class number
    let class_credit = graders[i].children[2].value; //class credit
    let class_grade = graders[i].children[3].value; //class grade
    //四個同時是空字串，就不製作 class_object；反之，只要其中一個有填，就會製作
    if (
      !(
        class_name == "" &&
        class_number == "" &&
        class_credit == "" &&
        class_grade == ""
      )
    ) {
      let class_object = {
        //物件中，屬性名稱的值等同於上面宣告過相同變數名稱的值
        //-->屬性名稱:變數名稱 但因為這種寫法太常見，可直接寫 屬性名稱
        class_name,
        class_number,
        class_credit,
        class_grade,
      };
      objectArray.push(class_object);
    }
  }

  // 取得object array後，把成績String換成數字
  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].class_grade_number = convertor(objectArray[i].class_grade);
  }

  objectArray = mergeSort(objectArray);
  //預設由小到大排
  if (direction == "descending") {
    objectArray = objectArray.reverse();
  }
  // 根據object array的內容，來更新網頁
  let allInputs = document.querySelector(".all-inputs");
  allInputs.innerHTML = "";

  for (let i = 0; i < objectArray.length; i++) {
    allInputs.innerHTML += `<form>
    <div class="grader">
        <input
        type="text"
        placeholder="class category"
        class="class-type"
        list="opt"
        value=${objectArray[i].class_name}
        /><!--
        --><input
        type="text"
        placeholder="class number"
        class="class-number"
        value=${objectArray[i].class_number}
        /><!--
        --><input
        type="number"
        placeholder="credits"
        min="0"
        max="6"
        class="class-credit"
        value=${objectArray[i].class_credit}
        /><!--
        --><select name="select" class="select">
        <option value=""></option>
        <option value="A">A</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B">B</option>
        <option value="B-">B-</option>
        <option value="C+">C+</option>
        <option value="C">C</option>
        <option value="C-">C-</option>
        <option value="D+">D+</option>
        <option value="D">D</option>
        <option value="D-">D-</option>
        <option value="F">F</option></select
        ><!--
        --><button class="trash-button">
        <i class="fas fa-trash"></i>
        </button>
    </div>
    </form>`;
  }

  //select 無法用 string 做更改-->直接用 JS 改
  graders = document.querySelectorAll("div.grader"); //nodelist 是靜態的，要再抓一次
  for (let i = 0; i < graders.length; i++) {
    graders[i].children[3].value = objectArray[i].class_grade;
  }
  //排序後用 innerHTML 新增，還沒加上事件監聽-->為 select 加上事件監聽
  allSelects = document.querySelectorAll("select");
  allSelects.forEach((select) => {
    changeColor(select);
    select.addEventListener("change", (e) => {
      setGPA();
      changeColor(e.target);
    });
  });

  //排序後用 innerHTML 新增，還沒加上事件監聽-->為credit 事件監聽
  let allCredits = document.querySelectorAll(".class-credit");
  allCredits.forEach((credit) => {
    credit.addEventListener("change", () => {
      setGPA();
    });
  });

  //排序後用 innerHTML 新增，還沒加上事件監聽-->為垃圾桶事件監聽
  let allTrash = document.querySelectorAll(".trash-button");
  allTrash.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      e.preventDefault();
      e.target.parentElement.parentElement.style.animation =
        "scaleDown 0.5s ease forwards";
      e.target.parentElement.parentElement.addEventListener(
        "animationend",
        (e) => {
          e.target.remove();
          setGPA();
        }
      );
    });
  });
}

//更好的時間複雜度 比較時間較短 先把陣列中每個元素都視為一個個體 倆倆比較融合

function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number > a2[j].class_grade_number) {
      result.push(a2[j]);
      j++;
    } else {
      result.push(a1[i]);
      i++;
    }
  }

  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }
  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  }

  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right));
  }
}
