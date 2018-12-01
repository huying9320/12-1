var xml = new XMLHttpRequest();
xml.open('get', '/api/data', true);
xml.onload = function(res) {
    if (res.target.status === 200) {
        var data = JSON.parse(res.target.response)
        console.log(data)
    }
}
xml.send()