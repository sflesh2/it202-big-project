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
let allData = "";
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
let getCrimeData = (year, address, radius)=>{
    fetch(getAddr("1250 South Halstead Street"))
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
        let location = json["results"][0]["geometry"]["location"];
        let lat= location["lat"];
        let lng = location["lng"];
        
        //let Baseurl = "https://data.cityofchicago.org/resource/crimes.json?";
        //let searhYear = "&year="+year;
        let metersInMile = 1609.34;
        
        radius = parseFloat(radius);
        radius = radius * metersInMile;
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
           }
           drawer.open = false;
       });
    });
    
