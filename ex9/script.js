var apiKey = "ca370d51a054836007519a00ff4ce59e";
var perPage = 4;
var imgListUrl =
	"https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=" +
	apiKey +
	"&per_page=" +
	perPage +
	"&format=json&nojsoncallback=1";

var gallery = document.getElementById("gallery");
var loadBtn = document.getElementById("loadBtn");

function clearGallery() {
	gallery.innerHTML = "";
}

function buildPhotoUrl(photo) {
	return "https://live.staticflickr.com/" +
		photo.server +
		"/" +
		photo.id +
		"_" +
		photo.secret +
		"_q.jpg";
}

function addNewImg(photos) {
	clearGallery();

	if (!photos.length) {
		return;
	}

	photos.forEach(function (item) {
		var img = document.createElement("img");
		img.src = buildPhotoUrl(item);
		img.alt = "Flickr photo";
		img.loading = "lazy";
		gallery.appendChild(img);
	});

}

function getimg() {
	loadBtn.disabled = true;

	var xhr = new XMLHttpRequest();
	xhr.open("GET", imgListUrl, true);
	xhr.send();

	xhr.onload = function () {
		loadBtn.disabled = false;

		if (xhr.status >= 200 && xhr.status < 300) {
			var data = JSON.parse(xhr.responseText);
			var photoList = data.photos && data.photos.photo ? data.photos.photo : [];
			addNewImg(photoList);
		}
	};

	xhr.onerror = function () {
		loadBtn.disabled = false;
	};
}

loadBtn.addEventListener("click", getimg);
