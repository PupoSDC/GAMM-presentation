
var tree = {

    container:        null,
    snap:             null,
    number_of_levels: null,
    domain:           [],
    dadnode:          null,
    height:           640,
    width:            960,
    self:             this,

    clickedNode:      null,
    clickedGP:        null,

    initialise: function(id,number_of_levels,percentage,values){
        this.container         = document.getElementById(id);
        this.snap              = Snap('#' + id);
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
        
        this.printTree(this.dadnode);

        this.adjustPlots(values);
    },

    makeNode: function(parent,level,right){

        if( level > this.number_of_levels ){ return null; }

        var hd = this.height / ( Math.pow(2,level) * 2);
        if( !right ){ hd = hd * -1.0 }

        var node = {
            x        : this.width * ( level + 1 ) / (this.number_of_levels+2) * 0.8,
            y        : parent.y + hd,
            r        : 12,
            parent   : parent,
            left     : null,
            right    : null,
            group    : null,
            id       : parent.id + right.toString(),
            value    : null
        }

        node.left  = this.makeNode(node,level+1, 0 );
        node.right = this.makeNode(node,level+1, 1 );

        return node;
    },

    printTree(node){

        if( node == null ){ return; }

        node.group = this.snap.group();

        if(node.left != null || node.right != null){
            // Draw the subtrees recursively and add them to a single group
            var line_1 = this.snap.line(node.x,node.y,node.left.x,node.left.y);
            var line_2 = this.snap.line(node.x,node.y,node.right.x,node.right.y);
            line_1.attr({ stroke: "#17253C", });
            line_2.attr({ stroke: "#17253C", });
            line_1.appendTo( node.group );
            line_2.appendTo( node.group );
            this.printTree(node.left).appendTo( node.group );
            this.printTree(node.right).appendTo( node.group );
        } else {

            var n_values = Math.pow(2,this.number_of_levels);
            node.value = this.snap.rect( 
                this.width * 0.7,
                this.domain.length * this.height / n_values,
                this.width * 0.3,
                this.height / n_values
            ).attr({
                fill:       "#009DE0",
                stroke:     '#17253C',
                strokeWidth: 3
            });

            this.domain.push(node.value);
            node.value.appendTo( node.group );
        }


        node.form = this.snap.circle( node.x, node.y, node.r );
        node.form.appendTo( node.group );
 
        node.form.attr({
            fill:       "white",
            stroke:     '#009DE0',
            strokeWidth: 3,
            id:          node.id
        });

        var self = this;

        node.form.click( function(e){
            self.nodeClicked( node );
        });

        return node.group;
    },

    nodeClicked(node){

        if( this.clickedGP == null && node.left != null && node.left.left != null ){
            // Select grandpa
            node.form.attr({ stroke: "red" }); 
            this.clickedGP = node;
            return;
        }
        if( node == this.clickedGP ){
            // unselect granpa if double click!
            node.form.attr({ stroke: "#009DE0" }); 
            if( this.clickedNode != null ){  
                this.clickedNode.form.attr( { stroke: "#009DE0" } );
                this.clickedNode = null;
            }
            this.clickedGP = null;
            return;
        }
        if( this.clickedNode == null && node.parent.parent == this.clickedGP ){
            // Select first node
            node.form.attr({ stroke: "#17253C" });
            this.clickedNode = node;
            return;
        } 
        if ( this.clickedNode == node ){
            // unselect first node
            node.form.attr({ stroke: '#009DE0' });
            this.clickedNode = null;
            return;
        }  
        if ( node.parent.parent == this.clickedGP ){
            node.form.attr({ stroke: '#009DE0' });
            node.form.attr({ stroke:  "#17253C" });
            var self = this;
            this.moveTwoBranches(node,this.clickedNode,function(){
               node.form.attr(             { stroke: "#009DE0" } );
               self.clickedNode.form.attr( { stroke: "#009DE0" } );
               self.clickedGP.form.attr(   { stroke: "#009DE0" } );
               self.clickedNode = null;
               self.clickedGP   = null; 
            });
        }
    },

    getCenterOfNode(node){
        var box      = node.getBoundingClientRect();
        var outerbox = this.container.getBoundingClientRect();
        var scalex = this.width  / outerbox.width;
        var scaley = this.height / outerbox.height;
        return {
            x: ( box.left + box.width  / 2 ) * scalex,
            y: ( box.top  + box.height / 2 ) * scaley
        }
    },

    moveTwoBranches(gp1,gp2,callback){
        var c1 = this.getCenterOfNode(gp1.form.node);
        var c2 = this.getCenterOfNode(gp2.form.node);
        var t1 = gp1.group.transform().localMatrix.f;
        var t2 = gp2.group.transform().localMatrix.f;
        var v1 = this.getMovedValues(gp1);
        var v2 = this.getMovedValues(gp2);

        mixNode = this.mixNode;

        gp1.group.animate({ 
            transform: 't0,' + (c2.y - c1.y + t1 )  
            }, 1000, function(){
                callback();
                gp1.group.transform('t0,0');

                for( var i = 0; i < v1.length; i++ ){
                    var temp = v1[i].node.width.baseVal.value;
                    v1[i].node.width.baseVal.value = v2[i].node.width.baseVal.value
                    v2[i].node.width.baseVal.value = temp
                }

                if( v1.length == 1 ){
                    mixNode(gp1.parent);
                    mixNode(gp2.parent);
                    return;
                }

        });
        gp2.group.animate({ 
            transform: 't0,' + (c1.y - c2.y + t2) 
            }, 1000, function(){
                gp2.form.attr({ stroke:  '#009DE0' });
                gp2.group.transform('t0,0');
        });
        

    },

    getMovedValues: function(node,values){
        if( values == null ){ values = []; }
        if( node.value == null){
            values = this.getMovedValues(node.left,values);
            values = this.getMovedValues(node.right,values);
        } else {
            values.push( node.value );
        }
        return values;
    },

    mixNode(node){
        if( node.left.value == null || node.right.value == null ){
            return;
        }
        var temp = (  node.left.value.node.width.baseVal.value + 
                      node.right.value.node.width.baseVal.value  ) / 2;
        node.left.value.node.width.baseVal.value = temp;
        node.right.value.node.width.baseVal.value = temp;
        return;
    },

    adjustPlots(values){
        for( var i = 0; i < this.domain.length; i++ ){
            this.domain[i].node.width.baseVal.value = tree.width * 0.3 * values[i];
        }
    },
}

tree.initialise("svgOne",4,0.8,[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1]);

