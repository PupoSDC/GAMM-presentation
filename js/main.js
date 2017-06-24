// Creete tree animations
var tree1 = makeTree("treeOne",[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1] );

var tree2 = makeTree("treeTwo",[0,0.05,0.1,0.2,0.4,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
	0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.4,0.2,0.1,
	0.05,0]).setUpTimeAdvancement(0.1).setUpBC();


// Configure Reveal
Reveal.initialize({
	controls: false,
	progress: true,
	history:  true,
	center:   true,

	transition: 'none', // none/fade/slide/convex/concave/zoom

	// Factor of the display size that should remain empty around the content
	margin: 0.2,

	math: {
		config: 'TeX-AMS_HTML-full'
	},

	dependencies: [
		{ src: 'lib/js/classList.js' },
		{ src: 'plugin/math/math.js' },
	],
	keyboard: {
	    13: tree2.play
	}
});

Reveal.addEventListener( 'slidechanged',   toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewshown',  toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewhidden', toggleHeaderAndFooter );

Reveal.addEventListener(        'ready',   function(){
	toggleHeaderAndFooter();
	fillDayToday();
});

function fillDayToday(){
	var  t = document.getElementsByClassName("datetoday");
	for( var i = 0; i < t.length; i++ ){
		t[i].innerHTML = today();
	}
}

function today(){
	var d = new Date();
	var m = ["January","February","March","April","May","June","July","August",
			 "September","October","November","December"];

	return m[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
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
		$('#slide-title').html( Reveal.getCurrentSlide().title );
		$('#footer').show();
		$('.progress').show();
	}
}




