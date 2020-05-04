
let getTime = ()=>{
    let currentdate = new Date(); 
    let datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/" 
        + currentdate.getFullYear() + " @ "  
        + currentdate.getHours() + ":"  
        + currentdate.getMinutes() + ":" 
        + currentdate.getSeconds();
    return datetime;
}

let createRecord = (searchAddress, searchYear, searchRadius)=>{
    return {'address': searchAddress, 'year': searchYear, 'radius': searchRadius};
}

//a test of the database
var query = new Dexie("query-database");
query.version(1).stores({
  search: 'date,searchInfo',
  data: 'date,allCrimeData,startLongLat,overallRadius,radInMiles', 
});




let clearDatabase = () =>{
    query.search.clear().catch(e=>{alert("An Error has occured while fetching" + e);});
    query.data.clear().catch(t =>{alert("An Error has occured while fetching" + t);});
}


let getAddr = (addr)=>{
    addr = addr.split(" ");
    addr = addr.join("+");
    
    let url ="https://maps.googleapis.com/maps/api/geocode/json";
    let address = "?address=" + addr;
    let ending = ",+Chicago,+IL&key=AIzaSyD4CUESqGN4_hOPJTQnT3JFkerOgEANnEM";
    let ret = ""; 
    url = url + address + ending;
    return url; 
}


//This creates the list of crimes from the json data
let addListItems = (json)=>{
    let crimeList = document.querySelector("#crime-list");
        //allData = json;
		for(item of json){
            let type = item["primary_type"];
            let templateItem = document.querySelector(".template-crime").cloneNode(true);   
            templateItem.classList.remove("template-crime");
            let image = "";
            switch(type){
                case "THEFT":
                    image = document.querySelector("#theft").cloneNode(true);
                    break;
                case "ASSULT":
                case "BATTERY":
                case "WEAPONS VIOLATION":
                case "HOMICIDE":
                    image = document.querySelector("#violent").cloneNode(true);
                    break;
               case "NARCOTICS":
                    image = document.querySelector("#narcotics").cloneNode(true);
                    break;
                case "MOTOR VEHICLE THEFT":
                    image = document.querySelector("#vehicle").cloneNode(true);
                    break;
                case "CRIMINAL DAMAGE":
                case "DECEPTIVE PRACTICE":
                    image = document.querySelector("#deceptive").cloneNode(true);
                    break;
                case "CRIMINAL TRESPASS":
                case "BURGLARY":
                    image = document.querySelector("#trespass").cloneNode(true);
                    break;
                default:
                    image = document.querySelector("#otherCrime").cloneNode(true);
                    
            }
            
            if(image != ""){
                image.classList.remove("crime-image-template");
                templateItem.insertBefore(image, templateItem.firstChild);
                templateItem.querySelector(".crime-desc").textContent =type + ": " +  item["description"];
                templateItem.querySelector(".crime-location").textContent = item["block"];
                crimeList.appendChild(templateItem); 
            }
        }
}

let allCrimeData = [];
let startLongLat = {};
let overallRadius = 0;
let radInMiles = 0; 
let getCrimeData = (year, address, radius)=>{
    fetch(getAddr(address))
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
        startLongLat = {}; 
        let location = json["results"][0]["geometry"]["location"];
        let lat= location["lat"];
        let lng = location["lng"];
        startLongLat["lat"] = parseFloat(lat); 
        startLongLat["lng"] = parseFloat(lng);
        
        //let Baseurl = "https://data.cityofchicago.org/resource/crimes.json?";
        //let searhYear = "&year="+year;
        let metersInMile = 1609.34;
        
        radius = parseFloat(radius);
        radInMiles = radius;
        radius = radius * metersInMile;
        overallRadius = radius;
        let BaseUrl = "https://data.cityofchicago.org/resource/crimes.json?&";
        let sYear = "year=" + year; 
        let within = "&$where=within_circle(location, " + lat.toString() + " , " + lng.toString() + " , "+ radius.toString() + ")";
         
        BaseUrl = BaseUrl + sYear + within;
        return fetch(BaseUrl);
    })
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
       allCrimeData = json;
       newHistoryCard(address, year, allCrimeData, startLongLat, overallRadius, radInMiles);
        
       addListItems(json);
       
	}); 
}


document.querySelector(".search-button").addEventListener("click", (e)=>{
    let year = document.querySelector("#yearInput"); 
    let address = document.querySelector("#addressInput");
    let radius = document.querySelector("#radiusInput");
    
    let list = document.querySelector("#crime-list");
    let removeItems = list.querySelectorAll("li");
    for(let item of removeItems){
        list.removeChild(item);
    }
    
    changeScene("Data");
    getCrimeData(year.value, address.value, radius.value);
    year.value=""; 
    address.value="";
    radius.value="";
    
    //console.log(year.value + " " + address.value + " " + radius.value + " ");
});


let currScene = "Home"; //always start on the home screen
let changeScene = (e)=>{
    //move the app to the data page
        // <a class="mdc-list-item mdc-list-item--activated" href="#" id="home" aria-current="page">
        //  <i class="material-icons mdc-list-item__graphic" aria-hidden="true">queue</i>
        document.querySelector("#" + currScene).style = "display: none;";
        document.querySelector("#"+e).style = "display: block";
    
        let remove = document.querySelector("#"+currScene.toLowerCase());    
        remove.classList.remove("mdc-list-item--activated");
       
        let add = document.querySelector("#"+e.toLowerCase());
        add.classList.add("mdc-list-item--activated");
        currScene = e;
}
function getIcon(type){
    switch(type){
        case "THEFT":
            return image = document.querySelector("#theft").src;
        case "ASSULT":
        case "BATTERY":
        case "WEAPONS VIOLATION":
        case "HOMICIDE":
            return image = document.querySelector("#violent").src;
       case "NARCOTICS":
            return image = document.querySelector("#narcotics").src;
      
        case "MOTOR VEHICLE THEFT":
            return document.querySelector("#vehicle").src;
            
        case "CRIMINAL DAMAGE":
        case "DECEPTIVE PRACTICE":
            return document.querySelector("#deceptive").src;
            
        case "CRIMINAL TRESPASS":
        case "BURGLARY":
            return document.querySelector("#trespass").src;
            
        default:
            return document.querySelector("#otherCrime").src;

    }
}
document.querySelectorAll("aside.mdc-drawer a.mdc-list-item").forEach(item=>{
       
       item.addEventListener("click", even => {
           let target = item.id;
           
           let pages = document.querySelectorAll(".page"); 
           for(page of pages){
               page.style = "display:none;"
           }
           
           if(target == "home"){
              changeScene("Home");
           }else if(target == "data"){
               changeScene("Data"); 
           }else if(target == "add"){
               changeScene("Add");
           }else if(target == "weather"){
               loadWeather();
               changeScene("Weather");
           }else if(target == "maps"){
               changeScene("Maps");
           }else if(target == "history"){
               loadHistory();
               changeScene("History");
           }
           drawer.open = false;
       });
    });
let getZoom = (radius)=>{
    if(radius <= .25){
        return 16;
    }else if(radius <= .5){
        return 15;
    }else if(radius <= 1){
        return 14;
    }else if(radius <= 1.5){
        return 13; 
    }else if(radius <= 2){
        return 12; 
    }else if(radius <= 2.5){
        return 11; 
    }else if(radius <= 3){
        return 10; 
    }else{
        return 9;
    }
}

let getContentString = (item)=>{
    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">' + item["primary_type"] + '</h1>'+
      '<div id="bodyContent">'+
      '<p>Description: ' + item['description'] + '</p>'+
      '<p>Date: ' + item['date'] + '</p>'+
      '<p>Location type: '+ item['location_description'] + '</p>'+
      '<p>Arrest Made: '+item['arrest'].toString() + '</p>'+ 
      '</div>'+
      '</div>';
    
    return contentString;
};

let openWindow =""; 

// Initialize and add the map
function initMap() {
  // The location of Uluru
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: getZoom(radInMiles), center: startLongLat});
  // The marker, positioned at Uluru
  //var marker = new google.maps.Marker({position: uluru, map: map});
  var initialMark = new google.maps.Marker({
    position: startLongLat,
    icon: "https://img.icons8.com/metro/26/000000/home.png",
    map: map
  });
  for(let item of allCrimeData){
      let position = {}; 
      position["lat"] = parseFloat(item["latitude"]); 
      position["lng"] = parseFloat(item["longitude"]);
      
      let marker = new google.maps.Marker({position:position, map:map});
      //let marker = new google.maps.Marker({position:position, map:map, icon:getIcon(item["primary_type"])});
      
      let infowindow = new google.maps.InfoWindow({
        content: getContentString(item)
      });
      
      marker.addListener('click', ()=>{
        if(openWindow != ""){
            openWindow.close();
        }
          
        openWindow = infowindow;
        infowindow.open(map, marker);
      });
      
  }
    
    

     

      /*var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        title: 'Uluru (Ayers Rock)'
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
        */
        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#3399ff',
          fillOpacity: 0.35,
          map: map,
          center: startLongLat,
          radius: overallRadius
        });
    
}

document.querySelector(".map-button").addEventListener("click", (e)=>{
    initMap();
    changeScene("Maps");
});


let newHistoryCard = (address, year, crimeData, longLat, oRad, radMiles)=>{

    let time = getTime(); 

    query.search.add({date: time, searchInfo: createRecord(address, year, radInMiles)}).catch(e=>{alert("Error storing history: " + e);});
    query.data.add({date: time, allCrimeData: crimeData, startLongLat: longLat, overallRadius:oRad, radInMiles: radMiles }).catch(e=>{alert("Error storing history: " + e);});
    
    
};

let loadHistory = ()=>{
    let history = document.querySelector(".page-history");
    let itr = document.querySelectorAll(".test-card"); 
    for(let child of itr){
        if(child.classList.contains("template-card")){
            
        }else{
           history.removeChild(child);
        }
        
        
    }
    
    query.search.each(info=>{
        
        let x = document.querySelector(".template-card").cloneNode(true);
   
        let time = info['date'];
        let year = info['searchInfo']['year'];
        let address = info['searchInfo']['address'];
        let radMiles = info['searchInfo']['radius'];
        
        x.classList.remove("template-card");
        x.querySelector("h2").textContent = time; //put the date of the entry here 
        x.querySelector("h3").textContent = year + ": " + address + " with " + radMiles + " miles"; //address here
        
        document.querySelector(".page-history").appendChild(x);
        
        x.querySelector(".card-delete").addEventListener("click", button=>{
            let index = x.querySelector("h2").textContent; 
            removeDatabaseIndex(index);
            document.querySelector(".page-history").removeChild(button["path"][4]);
        });

        x.querySelector(".card-search").addEventListener("click", button=>{
            let index = x.querySelector("h2").textContent; 
            query.data.get(index)
            .then(items=>{
                allCrimeData = items['allCrimeData'];
                startLongLat = items['startLongLat'];
                overallRadius = items['overallRadius'];
                radInMiles = items['radInMiles'];
                changeScene("Data");
                addListItems(allCrimeData);
            })
        });
    });
    
}


let removeDatabaseIndex = (index)=>{
    query.search.delete(index); 
    query.data.delete(index);
}



function showLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    let url = "https://api.openweathermap.org/data/2.5/weather?lat="+ latitude.toString() +"&lon=" + longitude.toString() + "&appid=91161a209e995adfc6053e1be913d137&units=imperial"
    
    fetch(url).then(e =>{
        return e.json(); 
    }).then(function (data){
        console.log(data);
        document.querySelector("#temp-display").textContent = "Temp: " + data['main']['temp'].toString() + " degrees";
        document.querySelector("#weather-description").textContent = "Description: " + data['weather'][0]['description'].toString();
        document.querySelector("#feels-like").textContent = "Feels like: " + data['main']['feels_like'].toString() + " degrees";
        document.querySelector("#max-temp").textContent = "High: " + data['main']['temp_max'].toString() + " degrees";
        document.querySelector("#min-temp").textContent = "Low: " + data['main']['temp_min'].toString() + " degrees";
        
    }).catch(er => {
        console.warn("ther was an error", er);
    });

}

 function errorHandler(err) {
    if(err.code == 1) {
       alert("Error: Access is denied!");
    } else if( err.code == 2) {
       alert("Error: Position is unavailable!");
    }
 }


let loadWeather = ()=>{
    if ("geolocation" in navigator) { 
        if(navigator.geolocation){ 
            var options = {timeout:60000};
            navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
        }else{
            alert("Geolocation is not available");
        }
    }else{ 
        alert("Geolocation is not available");
    }
}

//in the main script 
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("../serviceworker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
changeScene('Home');

