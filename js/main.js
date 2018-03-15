////////////////////////////////////////////////////////////////////////////////
// Create tree animations //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var treeEE = makeTree("treeEE",[0,0,0,0,1,1,1,1] );
var treeME = makeTree("treeME",[0,0,1,1,1,1,1,1] );

var tree2 = makeTree("treeTwo",[0,0.05,0.1,0.2,0.4,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
	0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.4,0.2,0.1,
	0.05,0]).setUpTimeAdvancement(0.1).setUpBC();

////////////////////////////////////////////////////////////////////////////////
// Configure Reveal ////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Reveal.initialize({
	controls: false,
	progress: true,
	history:  true,
	center:   true,
	transition: 'none', // none/fade/slide/convex/concave/zoom

	// Factor of the display size that should remain empty around the content
	margin: 0.2,

	math: {
		mathjax: 'plugin/math/mathjax/MathJax.js',
		config:  'TeX-AMS_HTML-full',
		showMathMenu: true
	},

	dependencies: [
		{ src: 'lib/js/classList.js' },
		{ src: 'plugin/math/math.js' },
	],
	keyboard: {
	    87: function(){ // w
	    	tree2.play();
	    },
	    65: function(){ // a
	    	treeEE.randomEddy(14,0,1);
	    },
	    83: function() { // s
	    	treeME.randomEddy(6,0,1);
	    },
	    68: function(){ // d
			treeME.delete();
			treeEE.delete();
			treeME = makeTree("treeME",[0,0,1,1,1,1,1,1] );
			treeEE = makeTree("treeEE",[0,0,0,0,1,1,1,1] );
	    },

	}

});

Reveal.addEventListener( 'slidechanged',   toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewshown',  toggleHeaderAndFooter );
Reveal.addEventListener( 'overviewhidden', toggleHeaderAndFooter );

Reveal.addEventListener('ready', function(){
	toggleHeaderAndFooter();
	fillDayToday();
});

////////////////////////////////////////////////////////////////////////////////
// Auxiliary functions /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

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
	if( index == 0 || over ){
		$('#header').hide();
		$('#footer').hide();
		$('.progress').hide();
		$('.slide-number').hide();
	} else {
		$('#header').show();
		$('#slide-title').html( Reveal.getCurrentSlide().title );
		$('#footer').show();
		$('.progress').show();
		$('.slide-number').show();
	}
	$('#page_number').html( Reveal.getIndices().h + 1 );
}

//Reveal.configure({ pdfMaxPagesPerSlide: 1 });


