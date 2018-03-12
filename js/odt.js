var makeODT = function(id,_values){

    var container         = document.getElementById(id);
    var snap              = Snap('#' + id);
    var height            = 640;
    var width             = 640;
    var values            = [];
    var nodecollection    = [];

    function resetSelectionProcedure(){

    }

    function printODT( _values ){

        this.values = _values;

        snap.rect( 0, 0, 50, 1 ).attr({
            fill:       "#009DE0",
            stroke:     '#17253C',
            strokeWidth: 3
        });

        for( var i = 0; i < _values.length + 1; i++ ){
            snap.rect(
                0,
                ( (i+1) / _values.length) * height,
                50,
                1,
            ).attr({
                fill:       "#009DE0",
                stroke:     '#17253C',
                strokeWidth: 3
            });
        }

        for( var i = 0; i < _values.length; i++ ){

            nodecollection[i] = {
                index: i,
                value : snap.rect(
                            100,
                            (i / _values.length) * height,
                            _values[i] * width * 0.9 + 1,
                            (1 / _values.length) * height,
                        ).attr({
                            fill:       "#009DE0",
                            stroke:     '#17253C',
                            strokeWidth: 3
                        }),
                line  : snap.rect(
                            25,
                            (i / _values.length) * height,
                            1,
                            (1 / _values.length) * height,
                        ).attr({
                            fill:       "#009DE0",
                            stroke:     '#17253C',
                            strokeWidth: 3
                        }),
                group : snap.group()

            };
            nodecollection[i].line.click( function(e){
                nodeClicked( nodecollection[i] );
            });
        }
        return snap.group();
    }

    function nodeClicked(_node){
        console.log( _node );
        //_node.line.attr({ stroke: "red" });
    }

    function getCenterOfNode(node){

    }

    function moveTwoBranches(gp1,gp2,callback){

    }

    function getMovedValues(node,values){

    }

    function mixNode(node){
    }

    function applyBc(){

    }

    function advanceTime(time){

    }
    printODT(_values);

    return {
        setUpBC: function (){

        },
        setUpTimeAdvancement: function (time){

        },
        advanceTime: function(time){

        },
        applyBC: function(){

        },
        randomEddy: function(rng1, rng2, rng3 ){

        },
        play: function(){

        },
        delete: function(){
            return snap.clear();
        }
    }
}
