
// Configure Reveal
Reveal.initialize({
	controls: false,
	progress: true,
	history: true,
	center: true,

	transition: 'none', // none/fade/slide/convex/concave/zoom

	math: { 
		mathjax: "plugin/math/mathjax.js",
		config: 'TeX-AMS_HTML-full' 	
	},

	dependencies: [
		{ src: 'lib/js/classList.js' },
		{ src: 'plugin/math/math.js' },
		{ src: 'plugin/title-footer/title-footer.js', 
			async: true, callback: function() { 
				title_footer.initialize(); 
			} 
		}
	]
});


document.addEventListener('keypress', function(){
	console.log("hi");
});

function fillDayToday(){
	var  t = document.getElementsByClassName("datetoday");
	for( var i = 0; i < t.length; i++ ){
		t[i].innerHTML = today();
		console.log("hiii")
	}
}

function doStuff(){
	
	var footer   = document.getElementById("footer").classList;
	var header   = document.getElementById("header").classList;
	var progress = document.getElementsByClassName("progress")[0].classList;
 	
	if( Reveal.isFirstSlide() || Reveal.isLastSlide() ){
		if( !header.contains("hide")   ){ header.add("hide");   }
		if( !footer.contains("hide")   ){ footer.add("hide");   }
		if( !progress.contains("hide") ){ progress.add("hide"); }
		return;
	}
	else {
		console.log("hi")
		if( header.contains("hide")   ){ header.remove("hide");   }
		if( footer.contains("hide")   ){ footer.remove("hide");   }
		if( progress.contains("hide") ){ progress.remove("hide"); }
		return;
	}
}

function today(){
	var d = new Date();
	var m = ["January","February","March","April","May","June","July","August",
			 "September","October","November","December"];

	return d.getDate() + " of " + m[d.getMonth()] + ", " + d.getFullYear();
}