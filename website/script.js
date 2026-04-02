/* MAP SETUP */

let map =
L.map('map').setView([3.848, 11.502], 6);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

/* Marker */

let marker =
L.marker([3.848, 11.502]).addTo(map);

/* Route Line */

let routeLine;

/* SEARCH HISTORY */

let historyList = [];

/* TRACKING DATABASE */

let trackingData = {

"123456": {

status: "In Transit",

location: "Douala",

delivery: "3 Days",

progress: 60,

coords: [4.0511, 9.7679],

route: [

"Package Received",
"Left Origin Facility",
"Arrived Douala Hub",
"In Transit"

],

path: [

[5.4781, 10.4179],
[4.0511, 9.7679]

]

},

"654321": {

status: "Delivered",

location: "Yaounde",

delivery: "Completed",

progress: 100,

coords: [3.848, 11.502],

route: [

"Package Received",
"In Transit",
"Out for Delivery",
"Delivered"

],

path: [

[4.0511, 9.7679],
[3.848, 11.502]

]

},

"999888": {

status: "Out for Delivery",

location: "Bamenda",

delivery: "Today",

progress: 80,

coords: [5.9631, 10.1591],

route: [

"Package Received",
"Arrived Bamenda Hub",
"Out for Delivery"

],

path: [

[4.0511, 9.7679],
[5.9631, 10.1591]

]

}

};

/* TRACK FUNCTION */

function trackParcel() {

let number =
document.getElementById("trackingNumber")
.value.trim();

let resultBox =
document.getElementById("resultBox");

let timeline =
document.getElementById("timeline");

let progressBar =
document.getElementById("progressBar");

let loader =
document.getElementById("loader");

/* Show Loader */

loader.style.display = "block";
resultBox.style.display = "none";

/* Simulate Loading Delay */

setTimeout(() => {

let data =
trackingData[number];

loader.style.display = "none";

resultBox.style.display = "block";

if (data) {

    /* SAVE VALID HISTORY */

if (!historyList.includes(number)) {

historyList.push(number);

updateHistory();

}
/* SAVE HISTORY */

if (number !== "") {


updateHistory();

}
updateHistory();

/* SHOW RESULT */

resultBox.innerHTML = `

<h3>Tracking Number: ${number}</h3>

<p>Status: ${data.status}</p>

<p>Location: ${data.location}</p>

<p>Delivery: ${data.delivery}</p>

<button onclick="exportReport('${number}')">
Export Report
</button>

`;

/* PROGRESS */

progressBar.style.width =
data.progress + "%";

/* TIMELINE */

timeline.innerHTML = "";

data.route.forEach(step => {

timeline.innerHTML += `
<div>
✔ ${step}
</div>
`;

});

/* DRAW ROUTE */

if (routeLine) {

map.removeLayer(routeLine);

}

routeLine =
L.polyline(data.path).addTo(map);

/* MOVE MARKER */

animateMarker(data.path);

/* SHOW NOTIFICATION */

showNotification();

}

else {

resultBox.innerHTML = `

<h3>Tracking Number: ${number}</h3>

<p>Status: Unknown</p>
<p>Location: Not Found</p>
<p>Delivery: N/A</p>

`;

}

}, 1500);

}

/* ANIMATE MARKER */

function animateMarker(path) {

let i = 0;

let interval =
setInterval(() => {

if (i < path.length) {

marker.setLatLng(path[i]);

map.setView(path[i], 8);

i++;

}

else {

clearInterval(interval);

}

}, 1000);

}

/* EXPORT REPORT */

function exportReport(number) {

let data =
trackingData[number];

let report =

`Tracking Report

Number: ${number}

Status: ${data.status}

Location: ${data.location}

Delivery: ${data.delivery}

`;

let blob =
new Blob([report], {

type: "text/plain"

});

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"tracking_report.txt";

link.click();

}

/* DARK MODE */

function toggleDarkMode() {

document.body.classList.toggle("dark");

}

/* MOBILE MENU */

function toggleMenu() {

let nav =
document.getElementById("navMenu");

if (nav.style.display === "block") {

nav.style.display = "none";

}

else {

nav.style.display = "block";

}

}
function updateHistory() {

let list =
document.getElementById("history");

list.innerHTML = "";

historyList.forEach(item => {

list.innerHTML += `
<li onclick="loadFromHistory('${item}')">
📦 ${item}
</li>
`;

});

}
function loadFromHistory(number) {

document.getElementById("trackingNumber").value = number;

trackParcel();

}
function scrollToTop() {

window.scrollTo({

top: 0,

behavior: "smooth"

});

}
function showNotification() {

let notification =
document.getElementById("notification");

notification.style.display = "block";

setTimeout(() => {

notification.style.display = "none";

}, 2000);

}