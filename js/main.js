
// Configure Reveal
Reveal.initialize({
	controls: false,
	progress: true,
	history:  true,
	center:   true,

	transition: 'none', // none/fade/slide/convex/concave/zoom

	math: {
		config: 'TeX-AMS_HTML-full'
	},

	dependencies: [
		{ src: 'lib/js/classList.js' },
		{ src: 'plugin/math/math.js' },
	]
});


function fillDayToday(){
	var  t = document.getElementsByClassName("datetoday");
	for( var i = 0; i < t.length; i++ ){
		t[i].innerHTML = today();
		console.log("hiii")
	}
}

function today(){
	var d = new Date();
	var m = ["January","February","March","April","May","June","July","August",
			 "September","October","November","December"];

	return d.getDate() + " of " + m[d.getMonth()] + ", " + d.getFullYear();
}

