var makeTree = function(id,values){

    var container         = document.getElementById(id);
    var snap              = Snap('#' + id);
    var number_of_levels  = Math.log( values.length ) / Math.log(2);
    var domain            = [];
    var height            = 640;
    var width             = 960;
    var clickedNode       = null;
    var clickedGP         = null;

    var dadnode = {
        x        : width  / (number_of_levels + 2),
        y        : height / 2,
        r        : 12,
        left     : null,
        right    : null,
        leftleg  : null,
        rightleg : null,
        id       : "node_0"
    }

    function makeNode(parent,level,right){

        if( level > number_of_levels ){ return null; }

        var hd = height / ( Math.pow(2,level) * 2);
        if( !right ){ hd = hd * -1.0 }

        var node = {
            x        : width * ( level + 1 ) / ( number_of_levels + 2 ) * 0.8,
            y        : parent.y + hd,
            r        : 12,
            parent   : parent,
            left     : null,
            right    : null,
            group    : null,
            id       : parent.id + right.toString(),
            value    : null
        }

        node.left  = makeNode(node,level+1, 0 );
        node.right = makeNode(node,level+1, 1 );

        return node;
    }

    function printTree(node){

        if( node == null ){ return; }

        node.group = snap.group();

        if(node.left != null || node.right != null){
            
            // Draw lines            
            snap.line( node.x, node.y, node.left.x, node.left.y )
                .attr({ stroke: "#17253C", })
                .appendTo( node.group );
            snap.line( node.x, node.y, node.right.x, node.right.y )
                .attr({ stroke: "#17253C", })
                .appendTo( node.group );

            // Draw nodes recusivel and append to group
            printTree(  node.left ).appendTo( node.group );
            printTree( node.right ).appendTo( node.group );

        } else {

            // Leaf node, time to build the domain
            var n_values = Math.pow(2,number_of_levels);
            node.value = snap.rect( 
                width * 0.7,
                domain.length * height / n_values,
                width * 0.3,
                height / n_values
            ).attr({
                fill:       "#009DE0",
                stroke:     '#17253C',
                strokeWidth: 3
            });

            domain.push(node.value);
            node.value.appendTo( node.group );
        }

        // create this node and append
        node.form = snap.circle( node.x, node.y, node.r )
                        .appendTo( node.group )
                        .attr({
                            fill:       "white",
                            stroke:     '#009DE0',
                            strokeWidth: 3,
                            id:          node.id
                        });

        node.form.click( function(e){
            nodeClicked( node );
        });

        return node.group;
    }

    function nodeClicked(node){

        if( clickedGP == null && node.left != null && node.left.left != null ){
            // Select grandpa
            node.form.attr({ stroke: "red" }); 
            clickedGP = node;
            return;
        }
        if( node == clickedGP ){
            // unselect granpa if double click!
            node.form.attr({ stroke: "#009DE0" }); 
            if( clickedNode != null ){  
                clickedNode.form.attr( { stroke: "#009DE0" } );
                clickedNode = null;
            }
            clickedGP = null;
            return;
        }
        if( clickedNode == null && node.parent.parent == clickedGP ){
            // Select first node
            node.form.attr({ stroke: "#17253C" });
            clickedNode = node;
            return;
        } 
        if ( clickedNode == node ){
            // unselect first node
            node.form.attr({ stroke: '#009DE0' });
            clickedNode = null;
            return;
        }  
        if ( node.parent.parent == clickedGP && node.parent != clickedNode.parent ){
            node.form.attr({ stroke: '#009DE0' });
            node.form.attr({ stroke:  "#17253C" });

            moveTwoBranches( node, clickedNode, function(){
               node.form.attr(             { stroke: "#009DE0" } );
               clickedNode.form.attr( { stroke: "#009DE0" } );
               clickedGP.form.attr(   { stroke: "#009DE0" } );
               clickedNode = null;
               clickedGP   = null; 
            });
        }
    }

    function getCenterOfNode(node){
        var box      = node.getBoundingClientRect();
        var outerbox = container.getBoundingClientRect();
        var scalex   = width  / outerbox.width;
        var scaley   = height / outerbox.height;
        return {
            x: ( box.left + box.width  / 2 ) * scalex,
            y: ( box.top  + box.height / 2 ) * scaley
        }
    }

    function moveTwoBranches(gp1,gp2,callback){
        var c1 = getCenterOfNode(gp1.form.node);
        var c2 = getCenterOfNode(gp2.form.node);
        var t1 = gp1.group.transform().localMatrix.f;
        var t2 = gp2.group.transform().localMatrix.f;
        var v1 = getMovedValues(gp1);
        var v2 = getMovedValues(gp2);

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
    }

    function getMovedValues(node,values){
        if( values == null ){ values = []; }
        if( node.value == null){
            values = getMovedValues(node.left,values);
            values = getMovedValues(node.right,values);
        } else {
            values.push( node.value );
        }
        return values;
    }

    function mixNode(node){
        if( node.left.value == null || node.right.value == null ){
            return;
        }
        var temp = (  node.left.value.node.width.baseVal.value + 
                      node.right.value.node.width.baseVal.value  ) / 2;
        node.left.value.node.width.baseVal.value = temp;
        node.right.value.node.width.baseVal.value = temp;
        return;
    }

    function adjustPlots(values){
        for( var i = 0; i < domain.length; i++ ){
           domain[i].node.width.baseVal.value = width * 0.3 * values[i];
        }
    }

    dadnode.left  = makeNode(dadnode,1,0);
    dadnode.right = makeNode(dadnode,1,1);

    printTree(dadnode);
    adjustPlots(values);

    console.log(dadnode);
}


