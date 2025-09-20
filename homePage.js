
const musicBtn = document.getElementById("musicBtn");
const instructionsBtn = document.getElementById("instructionsBtn");
const musicModal = document.getElementById("musicModal");
const instructionsModal = document.getElementById("instructionsModal");
const closeMusic = document.getElementById("closeMusic");
const closeInstructions = document.getElementById("closeInstructions");
musicBtn.onclick = () => musicModal.style.display = "block";
instructionsBtn.onclick = () => instructionsModal.style.display = "block";
let audio;

closeMusic.onclick = () => musicModal.style.display = "none";
closeInstructions.onclick = () => instructionsModal.style.display = "none";
window.onclick = function(event) {
  if (event.target === musicModal) {
    musicModal.style.display = "none";
  }
  if (event.target === instructionsModal) {
    instructionsModal.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.querySelector('.menuButton');
    menuButton.addEventListener('click', toggleDropdown);
    document.querySelector('.play').addEventListener('click', play);
    document.querySelector('.Mute').addEventListener('click', stopMusic);
});
function toggleDropdown() {
  const dropdownMenu = document.querySelector('.dropdown');
  dropdownMenu.classList.toggle('show');
}

function play() {
  if(!audio) {
    audio = new Audio('./assets/wizard.mp3');
    audio.loop = true;
  } 
  audio.play();
  localStorage.setItem('musicPlaying', 'true');
}
 function goFoward(){
  window.history.go(1);
 }

function stopMusic(){

  if(audio) {
    audio.muted = true;
    localStorage.setItem('musicPlaying', 'false'); 
  }
  
} 

function setVolume(value) {
  if(audio) {
    audio.volume = value; 
  }
}

window.addEventListener('load', () => {
  if (localStorage.getItem('musicPlaying') === 'true') {
    play();
  }else{
    stopMusic();
  }
});
