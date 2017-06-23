
var tree = {

    snap:             null,
    number_of_levels: null,
    domain:           [],
    dadnode:          null,
    height:           640,
    width:            960,
    self:             this,

    clickedNode:      null,

    initialise: function(id,number_of_levels,percentage){
        
        this.snap              = Snap(id);
        this.number_of_levels  = number_of_levels;

        this.dadnode = {
            x        : this.width  / (this.number_of_levels + 2),
            y        : this.height / 2,
            r        : 12,
            left     : null,
            right    : null,
            leftleg  : null,
            rightleg : null,
            id       : "node_0"
        }

        this.dadnode.left  = this.makeNode(this.dadnode,1,0);
        this.dadnode.right = this.makeNode(this.dadnode,1,1);
        
        this.printLegs(this.dadnode);
        this.printNode(this.dadnode);

    },


    makeNode: function(parent,level,right){

        if( level > this.number_of_levels ){ return null; }

        var hd = this.height / ( Math.pow(2,level) * 2);
        if( right ){ hd = hd * -1.0 }

        var node = {
            x        : this.width * ( level + 1 ) / (this.number_of_levels+2),
            y        : parent.y + hd,
            r        : 12,
            parent   : parent,
            left     : null,
            right    : null,
            leftleg  : null,
            rightleg : null,
            id       : parent.id + right.toString()
        }

        node.left  = this.makeNode(node,level+1, 0 );
        node.right = this.makeNode(node,level+1, 1 );

        return node;
    },

    printNode(node){
        if( node == null ){ return; }

        node.form = this.snap.circle( node.x, node.y, node.r );
        node.form.attr({
            fill:       "white",
            stroke:     '#009DE0',
            strokeWidth: 3,
            id:          node.id
        });

        var self = this;
        if( node.parent != null ){
            node.form.click( function(e){
                self.nodeClicked( node );
            });
        }

        this.printNode(node.left);
        this.printNode(node.right);
    },

    printLegs(node){
        if( node.left == null || node.right == null ){
            return;
        }
        node.leftleg = this.snap.line(node.x,node.y,node.left.x,node.left.y);
        node.rightleg = this.snap.line(node.x,node.y,node.right.x,node.right.y);
        node.leftleg.attr({ stroke: "#17253C", })
        node.rightleg.attr({ stroke: "#17253C", })
        this.printLegs(node.left);
        this.printLegs(node.right);
    },

    nodeClicked(node){

        if( this.clickedNode == null ){
            node.form.attr({ stroke: "#17253C" });
            this.clickedNode = node;
        } else if ( this.clickedNode == node ){
            node.form.attr({ stroke: '#009DE0' });
            this.clickedNode = null;
        }  else {
            node.form.attr({ stroke:  "#17253C" });
            this.moveTwoBranches(node,this.clickedNode);
            this.clickedNode = null;
        }


    },

    groupAllChildren(node,group){
        if( group == null ){ group = this.snap.group(); }

        if( node.left == null || node.right == null ){ 
            return group;  
        }

        group = this.groupAllChildren(node.left,group);
        group = this.groupAllChildren(node.right,group);

        node.leftleg.appendTo( group );
        node.rightleg.appendTo( group );

        node.left.form.appendTo( group );
        node.right.form.appendTo( group );

        return group;
    },

    moveTwoBranches(gp1,gp2){
  
        var dy = gp1.form.getBBox().y - gp2.form.getBBox().y;
        var dx = gp1.form.getBBox().x - gp2.form.getBBox().x;
        if( dx != 0.0 ){ 
            gp1.form.attr({ stroke:  '#009DE0' });
            gp2.form.attr({ stroke:  '#009DE0' });
            return; 
        }

        var g1 = this.groupAllChildren( gp1 ); gp1.form.appendTo( g1 ); 
        var g2 = this.groupAllChildren( gp2 ); gp2.form.appendTo( g2 ); 

        g1.animate({ transform: 't0,' + ( -1.0 * dy ) }, 1000, function(){
            g1.transform('t0,0'); 
            gp1.form.attr({ stroke:  '#009DE0' });
        });

        g2.animate({ transform: 't0,' + (  1.0 * dy ) }, 1000, function(){  
            g2.transform('t0,0');
            gp2.form.attr({ stroke:  '#009DE0' });
        });
    }


}

tree.initialise("#svgOne",4,0.8);

/*
    },

    drawCircle: function(node){

    },


    drawLine: function(x1,y1,x2,y2){

    },

    drawDomain: function(){

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

    }

}


tree.initialise("#svgOne",4,0.8);
tree.domain = [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
//tree.update();
//
//setInterval(function(){
//    tree.update();
//}, 100);
*/