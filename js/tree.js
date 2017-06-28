var makeTree = function(id,values){

    var container         = document.getElementById(id);
    var snap              = Snap('#' + id);
    var number_of_levels  = Math.log( values.length ) / Math.log(2);
    var domain            = [];
    var height            = 640;
    var width             = 960;
    var clickedNode       = null;
    var clickedGP         = null;
    var nodecollection    = [];
    var setinterval       = null;

    var dadnode = {
        x        : width  / (number_of_levels + 2),
        y        : height / 2,
        r        : 24,
        left     : null,
        right    : null,
        leftleg  : null,
        rightleg : null,
        id       : "node_0"
    }

    function resetSelectionProcedure(){
        if( clickedNode != null ){
            clickedNode.form.attr( { stroke: "#009DE0" } );
            clickedNode = null;
        }
        if( clickedGP != null ){
            clickedGP.form.attr( { stroke: "#009DE0" } );
            clickedGP = null;
        }
    }

    function makeNode(parent,level,right){

        if( level > number_of_levels ){ return null; }

        var hd = height / ( Math.pow(2,level) * 2);
        if( !right ){ hd = hd * -1.0 }

        var node = {
            x        : width * ( level + 1 ) / ( number_of_levels + 2 ) * 0.8,
            y        : parent.y + hd,
            r        : 24 / level,
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

            // Draw nodes recusively and append to group
            printTree(  node.left ).appendTo( node.group );
            printTree( node.right ).appendTo( node.group );

        } else {

            // Leaf node, time to build the domain
            var n_values = Math.pow(2,number_of_levels);
            node.value = snap.rect(
                width * 0.7,
                domain.length * height / n_values,
                width * 0.29 * values[domain.length] + 1,
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
        nodecollection.push(node);

        node.form.click( function(e){ nodeClicked( node ); } );

        return node.group;
    }

    function nodeClicked(node){

        // Select grandpa
        if( clickedGP == null && node.left != null && node.left.left != null ){

            node.form.attr({ stroke: "red" });
            clickedGP = node;
            return;
        }
        // deselect grandpa
        if( node == clickedGP ){
            resetSelectionProcedure();
            return false;
        }
        // Select first node
        if( clickedNode == null && node.parent.parent == clickedGP ){
            node.form.attr({ stroke: "#17253C" });
            clickedNode = node;
            return;
        }
        // unselect first node
        if ( clickedNode == node ){
            resetSelectionProcedure();
            return;
        }
        // Select second node and perform change
        if (   node.parent != null && node.parent.parent == clickedGP
            && node.parent != clickedNode.parent ){
            node.form.attr({ stroke: '#009DE0' });
            node.form.attr({ stroke:  "#17253C" });
            moveTwoBranches( node, clickedNode, function(){
                node.form.attr( { stroke: "#009DE0" } );
                resetSelectionProcedure();
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

        gp2.group.animate({ transform: 't0,' + (c1.y - c2.y + t2) }, 999);
        gp1.group.animate({ transform: 't0,' + (c2.y - c1.y + t1 )}, 1001,
            function(){
                gp1.group.transform('t0,0');
                gp2.group.transform('t0,0');
                callback();
                for( var i = 0; i < v1.length; i++ ){
                    v1[i].removeClass("animate");
                    v2[i].removeClass("animate");
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
        node.left.value.addClass("animate");
        node.right.value.addClass("animate");
        node.left.value.node.width.baseVal.value = temp;
        node.right.value.node.width.baseVal.value = temp;
        return;
    }

    function applyBc(){
        domain[        0        ].addClass("animate");
        domain[        0        ].node.width.baseVal.value = 1;
        domain[domain.length - 1].addClass("animate");
        domain[domain.length - 1].node.width.baseVal.value = 1;
    }

    function advanceTime(time){
        for( var i = 0; i < domain.length; i++ ){
            domain[i].addClass("animate");
            domain[i].node.width.baseVal.value += width * 0.29 * time;
        }
    }

    dadnode.left  = makeNode(dadnode,1,0);
    dadnode.right = makeNode(dadnode,1,1);

    printTree(dadnode);

    return {

        setUpBC: function (){
            domain[        0        ].click( applyBc );
            domain[domain.length - 1].click( applyBc );
            return this;
        },
        setUpTimeAdvancement: function (time){
            for( var i = 1; i < domain.length - 1; i++ ) {
                domain[i].click( function(){ advanceTime(time); });
            }
            return this;
        },
        advanceTime: function(time){
            advanceTime(time);
        },
        applyBC: function(){
            applyBc();
        },
        randomEddy: function(){

            resetSelectionProcedure();

            var rng1 = Math.floor( Math.random() * nodecollection.length );
            var rng2 = Math.floor(Math.random() * 1);
            var rng3 = Math.floor(Math.random() * 1);

            if(    nodecollection[rng1].left == null
                || nodecollection[rng1].left.left == null ){
                return this.randomEddy();
            }
            nodeClicked( nodecollection[rng1] );
            if( rng2 == 0 ){ nodeClicked( nodecollection[rng1].left.left   ); }
            else           { nodeClicked( nodecollection[rng1].left.right  ); }
            if( rng3 == 0 ){ nodeClicked( nodecollection[rng1].right.left  ); }
            else           { nodeClicked( nodecollection[rng1].right.right ); }
        },
        play: function(){
            if( setinterval != null ){
                clearInterval(setinterval);
                setinterval = null;
                return;
            }
            setinterval = window.setInterval(function () {
                tree2.randomEddy();
            }, 1150);
            return;
        }
    }
}
