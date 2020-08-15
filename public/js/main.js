var i = 0;
var images = ["/img/main-banner.jpg", "/img/banner-image1.jpg"];
// Time Between Switch
var time = 5000;
// Image List


// Change Image
function SlideImg() {
  document.getElementById('slide').src = images[i];
  if (i < images.length - 1) {
    i++;
  } else {
    // Reset Back To O
    i = 0;
  }

  setTimeout("SlideImg()", time);
}

// Run function when page loads
window.onload = SlideImg;



// Show Side menu 

let menu = document.getElementById('menu');
let sideMenu = document.getElementById('sideMenu');

menu.onclick = () => {
  sideMenu.classList.toggle("show-side-menu")
}



const quanityForm = document.getElementById("validation")



quanityForm.addEventListener("submit", (event) => {
  let value = document.getElementById("productquantity").value
  console.log(document.getElementById("productquantity").value)
  if (Number(value) < 1) {
    
    alert("Please Enter  a proper quanity")
    event.preventDefault();
    return
  }

})
