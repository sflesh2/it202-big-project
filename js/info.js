//willneed to use the Promise.All() method to sync up the promises

let getAddr = (addr)=>{
    addr = addr.split(" ");
    addr = addr.join("+");
    
    let url ="https://maps.googleapis.com/maps/api/geocode/json";
    let address = "?address=" + addr;
    let ending = ",+Chicago,+IL&key=AIzaSyD4CUESqGN4_hOPJTQnT3JFkerOgEANnEM";
    let ret = ""; 
    url = url + address + ending;
    fetch(url)
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
        console.log(json["results"][0]["geometry"]["location"]);
        ret = json["results"][0]["geometry"]["location"]; //return the lat and long of the address
	}); 
    
}
//let getCrimeData = ()=>{
    let url = "https://data.cityofchicago.org/resource/crimes.json?&year=2020"
    //var url = "https://data.cityofchicago.org/resource/xzkq-xp2w.json?$limit=100";      
      
    fetch(url)
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
        let crimeList = document.querySelector("#crime-list");
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
        
	}); 
//}

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
    
