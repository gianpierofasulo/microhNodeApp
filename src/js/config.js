
const fetchData = () => {
    return fetch('/config/generali').then((res) => res.json()).then((data) => {
        //console.log('manager js')
        //console.log(data)
        return data;
    });
}

exports.fetchData = fetchData;