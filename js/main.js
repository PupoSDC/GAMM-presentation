
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

Reveal.addEventListener(        'ready',   toggleHeaderAndFooter );
Reveal.addEventListener( 'slidechanged',   toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewshown',  toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewhidden', toggleHeaderAndFooter );

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

function toggleHeaderAndFooter(){
	var index = Reveal.getIndices().h;
	var over  = Reveal.isOverview();
	if( index == 0 || index == Reveal.getTotalSlides() - 1 || over ){
		$('#header').hide();
		$('#footer').hide();
		$('.progress').hide();
	} else {
		$('#header').show();
		$('#footer').show();
		$('.progress').show();
	}
}


