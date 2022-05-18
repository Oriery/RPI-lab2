let image = document.getElementById('image');
let video = document.getElementById('video');
let video_cont = document.getElementById('video-cont');
let title = document.getElementById('title');
let dateLabel = document.getElementById('dateText');
let explanation = document.getElementById('explanation');
let count = document.getElementById('count');
let checkbox = document.getElementById('datesCheckbox');
let date = document.getElementById('date');
let dateStart = document.getElementById('startDate');
let dateEnd = document.getElementById('endDate');
let navigation = document.getElementById('navigation');

window.onload = onLoad;
window.onkeydown = myKeyPress;
let APODS = [];
let currentIndex = 0;

function printInfo() {
    explanation.textContent = APODS[currentIndex].explanation;
    dateLabel.textContent = APODS[currentIndex].date;
    title.textContent = APODS[currentIndex].title;

    if (APODS[currentIndex].media_type == 'video') {
        video_cont.removeAttribute('hidden');
        image.setAttribute('hidden', '');
        video.src = APODS[currentIndex].url;
    } else {
        video_cont.setAttribute('hidden', '');
        image.removeAttribute('hidden');
        image.src = APODS[currentIndex].url;
    }

    count.textContent = `${currentIndex + 1}/${APODS.length}`
}

function stateChanged() {
    localStorage.setItem("Range", checkbox.checked);
    localStorage.setItem("Date", date.value)
    localStorage.setItem("StartDate", dateStart.value);
    localStorage.setItem("EndDate", dateEnd.value);
}

function stateCheckboxChanged() {
    let checkbox = document.getElementById('datesCheckbox');

    setIsDateRange(checkbox.checked);

    stateChanged();
}

function setIsDateRange(isRange) {
    if (isRange) {
        date.setAttribute('hidden', '');
        dateStart.value = date.value;
        dateEnd.value = date.value;
        dateRange.removeAttribute('hidden');
    } else {
        date.removeAttribute('hidden');
        date.value = dateStart.value;
        dateRange.setAttribute('hidden', '');
    }
}

function onLoad() {
    checkbox.checked = localStorage.getItem("Range") == "true";
    document.getElementById('date').value = localStorage.getItem("Date");
    document.getElementById('startDate').value = localStorage.getItem("StartDate");
    document.getElementById('endDate').value = localStorage.getItem("EndDate");
    setIsDateRange(checkbox.checked);
    getLinkToImage();
}

function getLinkToImage() {
    let url = '';
    if (!checkbox.checked)
        url = `https://api.nasa.gov/planetary/apod?date=${date.value}&api_key=DBREUST2JpqNl6K89gQamfIVktzitlEqrPO8OeYb`;
    else
        url = `https://api.nasa.gov/planetary/apod?start_date=${dateStart.value}&end_date=${dateEnd.value}&api_key=DBREUST2JpqNl6K89gQamfIVktzitlEqrPO8OeYb`;

    setSiteState("Loading");

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.code == 400) {
                setSiteState("Nothing");
                alert("Error: cannot find picture for given day");
                return;
            } else if (data.code > 200) {
                setSiteState("Nothing");
                alert("Error");
                return;
            }
            console.log(data);

            if (Array.isArray(data)) {
                APODS = data;
            } else {
                APODS = [];
                APODS[0] = data;
            }

            currentIndex = 0;

            if (APODS.length > 1) {
                navigation.removeAttribute('hidden');
            } else {
                navigation.setAttribute('hidden', '');
            }

            printInfo();

            setSiteState("Normal");
        });
}

function setSiteState(siteState) {
    let dataBox = document.getElementById('data');
    let loadingBox = document.getElementById('loading');

    switch (siteState) {
        case "Normal":
            dataBox.removeAttribute('hidden');
            loadingBox.setAttribute('hidden', '');
            break;
        case "Loading":
            loadingBox.removeAttribute('hidden');
            dataBox.setAttribute('hidden', '');
            break;
        case "Nothing":
            loadingBox.setAttribute('hidden', '');
            dataBox.setAttribute('hidden', '');
            break;
    }
}

function myKeyPress(e) {
    var keynum;
    if (e.which == 13) { // Enter
        getLinkToImage();
    }
}

function nextClick() {
    if (currentIndex < APODS.length - 1) {
        currentIndex++;
    }
    printInfo();
}

function prevClick() {
    if (currentIndex > 0) {
        currentIndex--;
    }
    printInfo();
}