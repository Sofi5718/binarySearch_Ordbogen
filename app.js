window.addEventListener("load", start);

const ENDPOINT = "http://localhost:8080/ordbogen";
async function start() {
    document.querySelector("#knap").addEventListener("click", clickHandler);
    const data = await getSize();
    console.log(data);
}

async function getSize() {
    const response = await fetch(ENDPOINT);
    const data = await response.json();
    return data;
}

async function getWord(index) {
    const response = await fetch(`${ENDPOINT}/${index}`);
    const data = await response.json();
    return data;
}

async function binarySearch(searchTerm) {
    const size = await getSize();
    let min = size.min;
    let max = size.max;
    let middel;

    let searches = 0;

    while (max >= min) {
        middel = min + Math.floor((max - min) / 2);
        let entry = await getWord(middel);
        searches++;
        document.querySelector("#request").innerHTML = searches;

        const compareResult = searchTerm.localeCompare(entry.inflected, "da-DK");
        console.log(`Entry: ${entry.inflected}, compareResult: ${compareResult}, min: ${min}, max: ${max}, middel: ${middel}`);

        if (compareResult === 0) {
            displayResult(entry);
            return middel;
        }
        if (compareResult < 0) {
            max = middel - 1;
        } else {
            min = middel + 1;
        }
    }
    document.querySelector("#result").innerHTML = "<h2>Ordet blev ikke fundet</h2>";
    return -1;
}

async function clickHandler() {
    const search = document.querySelector("#search").value;
    const startTime = performance.now();
    await binarySearch(search);
    const endTime = performance.now();
    const time = (endTime - startTime) / 1000;
    document.querySelector("#tid").innerHTML = time;
}

function displayResult(result) {
    const text = document.querySelector("#result");
    text.innerHTML = ` 
    <h2> Fundet!</h2>
    <p>Ordet ${result.inflected} er fundet i ordbogen</p>
    <p>Bøjningsform: ${result.inflected}</p>
    <p>Oplagsord: ${result.headword}</p>
    <p>Homograf: ${result.homograph}</p>
    <p>Ordklasse: ${result.partofspeech}</p>
    <p>ID: ${result.id}</p>
    `;

    console.log(result);
}
