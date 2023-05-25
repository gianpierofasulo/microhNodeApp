/*
const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
        if (entry.identifier === "big-image") {
            console.log(entry.renderTime);
        }
    });
});
observer.observe({ entryTypes: ["element"] });*/

document.addEventListener('readystatechange', function() {
    console.log("Fiered '" + document.readyState + "' after " + performance.now() + " ms");
});

document.addEventListener('DOMContentLoaded', function() {
    console.log("Fiered DOMContentLoaded after " + performance.now() + " ms");
    }, false);

window.addEventListener('load', function() {
    console.log("Fiered load after " + performance.now() + " ms");
    }, false);
