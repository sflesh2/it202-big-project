//willneed to use the Promise.All() method to sync up the promises

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
        console.log(json);
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
               changeScene("Weather");
           }else if(target == "maps"){
               changeScene("Maps");
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
    
