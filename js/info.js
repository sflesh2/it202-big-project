//let getCrimeData = ()=>{
    let url = "https://data.cityofchicago.org/resource/crimes.json?$limit=50"
    //var url = "https://data.cityofchicago.org/resource/xzkq-xp2w.json?$limit=100";      
      
    fetch(url)
	.then((response) =>{
		return response.json(); 
	})
	.then((json) => {
		for(item of json){
            console.log(item["primary_type"]);
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
    
