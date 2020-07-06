var i = 0; 			
var images = [];	
// Time Between Switch
var time = 5000;	
// Image List
images[0] = "/img/main-banner.jpg";
images[1] = "/img/banner-image1.jpg";

// Change Image
function SlideImg(){
  document.getElementById('slide').src = images[i];
  if(i < images.length - 1){
    i++; 
  } else { 
    // Reset Back To O
    i = 0;
  }

  setTimeout("SlideImg()", time);
}

// Run function when page loads
window.onload=SlideImg;  



// Show Side menu 

let menu = document.getElementById('menu');
let sideMenu = document.getElementById('sideMenu');

menu.onclick = ()=>{
  sideMenu.classList.toggle("show-side-menu")
}