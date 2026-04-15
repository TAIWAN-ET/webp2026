var d=["資工系","資工系","資工系","資工系","資工系","資工系"];
var c=["物件導向軟體設計","計算機網路實驗","作業系統實務","生物統計","通訊系統","軟硬體專題(2)"];
var t=["黃崇源","李春良","張哲維","陳光武","陳仁暉","魏志達"];

function addOneData(i) {
    var mytable = document.getElementById("csie");
    var rowCount = c.length;
    var cellCount = mytable.rows[0].cells.length;
    var row = mytable.insertRow(-1);
    row.insertCell(0).innerHTML = d[i];
    row.insertCell(1).innerHTML = c[i];
    row.insertCell(2).innerHTML = t[i];
    console.log(d[i], c[i], t[i]);
}

timer = setInterval(myfunc, 1000,"csie");
var i = 0;
function myfunc(eid) {
    addOneData(i);
    if(i++ >=3){
        clearInterval(timer);
    }
}