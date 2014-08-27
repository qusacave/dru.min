//------------------------------------------------------------------------------
//  音が鳴るように準備する
//------------------------------------------------------------------------------
var inst = [
    "src/kick.wav",
    "src/hat.wav",
    "src/snare.wav",
    "src/punch.wav"
];

var iString = [
    "Kick", "Hat", "Snare", "Punch"
];

var xAcceleration = 0;
var yAcceleration = 0;
var st = false;

changeAcceleration = function( mt ){
    xAcceleration = Math.abs(mt.accelerationIncludingGravity.x);
    yAcceleration = mt.accelerationIncludingGravity.y;
    console.log(xAcceleration+" "+yAcceleration);
    //var zAcceleration = mt.accelerationIncludingGravity.z;
    changeStatus();
};

checkAcceleration = function(){
    if(xAcceleration<4)
        return 1;
    else if(xAcceleration>12)
        return -1;
    else return 0;
};

changeStatus = function(){
    if(!st){
        if(checkAcceleration() == 1){
            st = true;
            window.navigator.vibrate(50);
        }
    }
    if(st){
        if(checkAcceleration() == -1){
            st = false;
            attack(); 
        }
    }
};

var gAudioContext = new AudioContext();
var buffer = null;
var gGainNode = gAudioContext.createGain();
gGainNode.gain.value = 0;
gGainNode.connect(gAudioContext.destination);

loadSample = function(url){
    console.log("load");
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = function(){
        gAudioContext.decodeAudioData(request.response, function(b){buffer=b;}, function(){});
    };
    request.send();
};

var nowInst =2;
loadSample(inst[nowInst]);

changeInst = function( num ){
    console.log(num);
    if(num<inst.length && num!=nowInst){
        loadSample( inst[num] );
        nowInst = num;
    }
};

attack = function(){
    console.log("attack");
    var gSourseNode = gAudioContext.createBufferSource();
    gSourseNode.buffer = buffer;
    gSourseNode.connect(gGainNode);
    gSourseNode.start(0);
};

//------------------------------------------------------------------------------
//  ミュートする
//
//  mute が true だったら音量を0にして false だったら音量を 1 にする
//------------------------------------------------------------------------------
setMute = function( mute ){
    if(mute == true) gGainNode.gain.value = 0;
    else gGainNode.gain.value = 1;
};
