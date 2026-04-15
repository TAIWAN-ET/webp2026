var openUrl =
	"https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6";

var allData = [];
var filteredData = [];
var currentPage = 1;
var pageSize = 10;

var tableBody = document.getElementById("csieBody");
var keywordInput = document.getElementById("keywordInput");
var prevBtn = document.getElementById("prevBtn");
var nextBtn = document.getElementById("nextBtn");
var pageInfo = document.getElementById("pageInfo");
var totalInfo = document.getElementById("totalInfo");

function fetchData() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", openUrl, true);
	xhr.send();

	xhr.onreadystatechange = function () {
		if (this.readyState === 4) {
			if (this.status === 200) {
				allData = JSON.parse(this.responseText);
				applyFilter();
			} else {
				tableBody.innerHTML =
					'<tr><td colspan="4" class="text-danger text-center py-4">資料讀取失敗，請稍後重試。</td></tr>';
			}
		}
	};
}

function getPrimaryShowInfo(data) {
	if (!data.showInfo || !data.showInfo.length) {
		return { location: "", price: "", time: "" };
	}

	return {
		location: data.showInfo[0].location || "",
		price: data.showInfo[0].price || "免費",
		time: data.showInfo[0].time || ""
	};
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function del0ldData() {
	tableBody.innerHTML = "";
}

function renderTable() {
	del0ldData();

	if (!filteredData.length) {
		tableBody.innerHTML =
			'<tr><td colspan="4" class="text-center py-4 text-muted">查無符合資料</td></tr>';
		updatePaginationInfo();
		return;
	}

	var start = (currentPage - 1) * pageSize;
	var end = start + pageSize;
	var pageData = filteredData.slice(start, end);

	pageData.forEach(function (data) {
		var info = getPrimaryShowInfo(data);
		var row = document.createElement("tr");

		row.innerHTML =
			"<td>" + escapeHtml(data.title || "") + "</td>" +
			"<td>" + escapeHtml(info.location) + "</td>" +
			"<td>" + escapeHtml(info.price) + "</td>" +
			"<td class=\"small\">" + escapeHtml(info.time) + "</td>";

		tableBody.appendChild(row);
	});

	updatePaginationInfo();
}

function totalPages() {
	return Math.max(1, Math.ceil(filteredData.length / pageSize));
}

function updatePaginationInfo() {
	var pages = totalPages();
	pageInfo.textContent = currentPage + " / " + pages + " 頁";
	totalInfo.textContent = "共 " + filteredData.length + " 筆";

	prevBtn.disabled = currentPage <= 1;
	nextBtn.disabled = currentPage >= pages;
}

function applyFilter() {
	var keyword = keywordInput.value.trim().toLowerCase();

	filteredData = allData.filter(function (data) {
		var info = getPrimaryShowInfo(data);
		var title = (data.title || "").toLowerCase();
		var location = (info.location || "").toLowerCase();
		return title.indexOf(keyword) !== -1 || location.indexOf(keyword) !== -1;
	});

	currentPage = 1;
	renderTable();
}

keywordInput.addEventListener("input", applyFilter);

prevBtn.addEventListener("click", function () {
	if (currentPage > 1) {
		currentPage -= 1;
		renderTable();
	}
});

nextBtn.addEventListener("click", function () {
	if (currentPage < totalPages()) {
		currentPage += 1;
		renderTable();
	}
});

fetchData();
