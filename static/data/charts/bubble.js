const file = 'mongo-king-bachman.json'

function displayID(){
    d3.json(file).then(function(data) {
      // console.log(data); 
      var IDname = data.names;
      console.log(IDname); 
      var display = d3.select("#selDataset");
      for(let i = 0; i < IDname.length; i++){
        display.append("option")
        .text(IDname[i])
        .property("value",IDname[i]);
      }
      var firstsamples = IDname[0];
      charts(firstsamples);
      metadata(firstsamples);
    });
  }
  
  displayID()