var interval = null;
var audio = new Audio('audio/Danger.mp3');

document.addEventListener('click', function(){

	if (!event.target.getAttribute('data-play')) return;
	
	
	document.querySelector('.music').classList.toggle('playing');
	if (interval === null){
		console.log(1);
		interval = visualization();
		audio.play();
	} else {
		audio.pause();
		clearInterval(interval);
		interval = null;
	}

});

function visualization(){
	var divs = document.querySelectorAll('.playing .visualization div');
	var interval = setInterval(function(){
		var random;
		for(var i = 0; i < divs.length; i++){
			random = Math.random() * 35;
			divs[i].style.height = random + 'px';
		}
	}, 150);
	
	return interval;
}

var a = new Audio('audio/Danger.mp3');