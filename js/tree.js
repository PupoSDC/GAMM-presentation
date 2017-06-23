
var canvas = document.getElementById('myCanvas');

var tree = {
    number_of_levels: null,
    percentage: null,
    domain: [],
    nodes: [],
    canvas: null,
    context: null,

    initialise: function(canvas,number_of_levels,percentage){
        
        this.number_of_levels    = number_of_levels;
        this.percentage          = percentage
        this.canvas              = document.getElementById(canvas);
        this.context             = this.canvas.getContext('2d');
        this.context.fillStyle   = '#009DE0';
        this.context.strokeStyle = '#17253C';
        this.context.font        = "bold 20px Arial";
        this.context.lineWidth = 2;
        
        var k = 0;
        for( var i = 0; i <= this.number_of_levels; i++ ){
            var nodes_to_draw = Math.pow(2,i);
            for( var j = 0; j < nodes_to_draw ; j++){

                var node =  {
                    x: this.canvas.width  * (i+1)   / (this.number_of_levels+2) * this.percentage,
                    y: this.canvas.height * ( (j+1) / (nodes_to_draw+1) ),
                    i: k,
                    r: 20,
                    selected: false
                };
                this.nodes.push(node);
                k++;
            }
        }  

        this.canvas.onclick  = this.onclick();

        //window.onresize =  function(){ 
        //    //this.update();
        //    this.canvas.width  = this.canvas.getBoundingClientRect().width;
        //    this.canvas.height = this.canvas.getBoundingClientRect().height;
        //}
    },

    drawCircle: function(node){
        this.context.beginPath();
        this.context.arc( node.x, node.y, node.r, 0, 2 * Math.PI, false);  
        this.context.lineWidth = 2;
        this.context.stroke();
        var temp = this.context.fillStyle;
        this.context.fillStyle    = node.selected ? '#009DE0' : 'white';
        this.context.fill();
        this.context.fillStyle   = temp;
        this.context.fillText(
            node.i.toString(), 
            node.x - this.context.measureText(node.i.toString()).width / 2, 
            node.y + this.context.measureText("w").width / 2 
        );
        //context.addHitRegion({id: "node_" + i });
    },


    drawLine: function(x1,y1,x2,y2){
        this.context.beginPath();
        this.context.moveTo( x1, y1 );
        this.context.lineTo( x2, y2 );
        this.context.stroke();
    },

    drawDomain: function(){

        this.drawLine(
            this.percentage * canvas.width , 0,
            this.percentage * canvas.width , canvas.height
        );

        for( var i = 0; i < this.domain.length; i++ ){

            this.context.rect(
                this.canvas.width * this.percentage,
                i * this.canvas.height / this.domain.length,
                this.canvas.width * ( 1 - this.percentage ) * this.domain[i], 
                this.canvas.height / this.domain.length
            );
            this.context.fill();
            this.context.stroke();     
        }
    },

    update: function(){
        
        var legs = this.nodes.length - Math.pow(2,this.number_of_levels);
        for( var i = 0; i < legs ; i++ ){
            this.drawLine(
                this.nodes[i].x,
                this.nodes[i].y,
                this.nodes[i*2+1].x,
                this.nodes[i*2+1].y,
            );
            this.drawLine(
                this.nodes[i].x,
                this.nodes[i].y,
                this.nodes[i*2+2].x,
                this.nodes[i*2+2].y,
            );
        }

        for( var i = 0; i < this.nodes.length; i++ ){
            this.drawCircle( this.nodes[i] );
        };

        this.drawDomain();

    },

    onclick: function() {

        var nodes  = this.nodes
      

        return function(e){

            var rect = this.getBoundingClientRect();   

            var x = (e.clientX - rect.left );   
            var y = (e.clientY - rect.top  );  

            console.log( x+ " " + y )


            for( var i = 0; i < 1; i++ ){

                var dx   = x - nodes[i].x;
                var dy   = y - nodes[i].y;
                var dist = dx * dx + dy * dy;
                
                if( dist <= nodes[i].r * nodes[i].r ){
                    console.log(nodes[i])
                }
            }  

        };
    }

}

tree.initialise("myCanvas",4,0.8);
tree.domain = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
tree.update();

setInterval(function(){
    tree.update();
}, 100);