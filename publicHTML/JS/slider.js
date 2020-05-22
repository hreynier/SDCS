// --------- High Charts --------- //
// -- AUTHOR: Ahmad Merii + Azza Hajjar --//
// ------- DESCRIPTION ------- //
//  All scripts that utilise the high chart and any subsidiary libraries.


//  slider.
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}



