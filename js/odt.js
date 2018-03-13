var makeODT = function(id,_values){

    var container         = document.getElementById(id);
    var snap              = Snap('#' + id);
    var height            = 640;
    var width             = 640;
    var nodecollection    = [];
    var tip_1             = null;
    var tip_2             = null;
    var trippletmap       = [];

    function resetSelectionProcedure(){
        tip_1 = null;
        tip_2 = null;
        for( var i = 0; i < nodecollection.length; i++ ){
           nodecollection[i].line.attr( { stroke: "#17253C" } );
        }
    }

    function printODT( _values ){


        for( var i = 0; i < _values.length + 1; i++ ){
            snap.rect(
                75,
                ( (i) / _values.length) * height,
                50,
                1,
            ).attr({
                fill:       "#009DE0",
                stroke:     '#17253C',
                strokeWidth: 3
            });
        }

        for( i = 0; i < _values.length; i++ ){

            nodecollection[i] = {
                index: i,
                value : snap.rect(
                            200,
                            (i / _values.length) * height,
                            _values[i] * width * 0.9 + 1,
                            (1 / _values.length) * height
                        ).attr({
                            fill:       "#009DE0",
                            stroke:     '#17253C',
                            strokeWidth: 3
                        }),
                line  : snap.rect(
                            100,
                            (i / _values.length) * height,
                            1,
                            (1 / _values.length) * height
                        ).attr({
                            fill:       "#009DE0",
                            stroke:     '#17253C',
                            strokeWidth: 3
                        }),
                group : snap.group()

            };

            const index = i;
            nodecollection[i].line.click( function(e){
                nodeClicked( index );
            });
        }
        return snap.group();
    }

    function nodeClicked( _index ){
        if( tip_1 == null ){
            nodecollection[ _index ].line.attr({ stroke: "red" });
            tip_1 = nodecollection[ _index ];
            return;
        }
        if( tip_2 == null  ){
            nodecollection[ _index ].line.attr({ stroke: "red" });
            tip_2 = nodecollection[ _index ];
        }
        if( tip_2 != null && tip_1 != null ){
            if( tip_2.index - tip_1.index < 3 ){
                resetSelectionProcedure();
                return;
            }
            for( var i = tip_1.index; i < tip_2.index; i++ ){
                nodecollection[ i ].line.attr({ stroke: "red" });
            }
            TrippletMap( tip_1, tip_2 );
        }
    }

    function TrippletMap( tip_1, tip_2 ){

        var length = tip_2.index - tip_1.index + 1;

        var t1 = snap.line(
            100,
            (tip_1.index ) / _values.length * height,
            150,
            (tip_1.index + length / 3) / _values.length * height
        ).attr({
            fill:       "green",
            stroke:     'green',
            strokeWidth: 3
        });

        var t2 = snap.line(
            150,
            (tip_1.index + length / 3) / _values.length * height,
            50,
            (tip_1.index + 2 * length / 3) / _values.length * height
        ).attr({
            fill:       "green",
            stroke:     'green',
            strokeWidth: 3
        });

        var t3 = snap.line(
            50,
            (tip_1.index + 2 * length / 3) / _values.length * height,
            100,
            (tip_1.index + length ) / _values.length * height
        ).attr({
            fill:       "green",
            stroke:     'green',
            strokeWidth: 3
        });

        var myMatrix = new Snap.Matrix();

        for( var i = tip_1.index; i <= tip_2.index; i++ ){
            myMatrix.scale(
                1.0,
                1.0/3.0,
                0,
                0
            );
            console.log(i / nodecollection.length * height);
            //myMatrix.translate(
            //    0.0,
            //    - width/nodecollection.length / 3,
            //);
            //nodecollection[i].value.animate( { transform: myMatrix },1000 );
            console.log( nodecollection[i] );
        }

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
