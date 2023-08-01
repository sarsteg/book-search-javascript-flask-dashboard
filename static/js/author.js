d3.json('http://127.0.0.1:5000/api/v1.0/authors').then(function (data) {
    let title = 'Books Published by Stephen King with pseudonym and co authors'
    let books = []
    let timesRead = []
    
    for (const property in data) {
        books.push(property)
        timesRead.push(data[property].length)
    }

    let trace1 = {
        x: books,
        y: timesRead,
        type: 'bar'
    };

    let info = [trace1];

    let layout = {
        title: title
    };

    Plotly.newPlot("plot", info, layout);
});


d3.json('http://127.0.0.1:5000/api/v1.0/published').then(function (data) {
    let title = 'Books Published by Stephen King throughout the years'
    years = []
    counts = []
    for(const property in data){
        years.push(property)
        counts.push(data[property])
    }


    let trace1 = {
        x: years,
        y: counts,
        type: 'scatter'
    };

    let info = [trace1];

    let layout = {
        title: title
    };

    Plotly.newPlot("line", info, layout);
});

