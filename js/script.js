var synth;
var bpmVal = 120;

window.mobilecheck = function () {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

var parsePeppeNotation = function (notationString, scope) {
    var keyValues = "()0123_aAbcCdDefFgG";
    var multiKey = false;
    var timeCounter = 8;
    var timeCounterOld = 0;
    var totalCounter = 0;
    var silenceTime = 0;
    var currentNote = 0;
    var notesArray = [];
    scope.error = "";

    // Ignore spaces and newlines
    notationString = notationString.replace(/\s/g, "");
    if (notationString.length > 139) {
        scope.error = "The song is too long.";
        return null;
    }

    // Pre-process the time
    bpmVal = 120;
    if (notationString[0] == '>') {
        switch (parseInt(notationString[1])) {
            case 1:
                bpmVal = 130;
                break;
            case 2:
                bpmVal = 140;
                break;
            case 3:
                bpmVal = 150;
                break;
            case 4:
                bpmVal = 160;
                break;
            case 5:
                bpmVal = 170;
                break;
            case 6:
                bpmVal = 180;
                break;
            case 7:
                bpmVal = 190;
                break;
            case 8:
                bpmVal = 200;
                break;
            case 9:
                bpmVal = 210;
                break;
            default:
                scope.error = "Invalid speed value.";
                return null;
        }
        notationString = notationString.substring(2);
    }

    if (notationString[0] == '<') {
        switch (parseInt(notationString[1])) {
            case 1:
                bpmVal = 110;
                break;
            case 2:
                bpmVal = 100;
                break;
            case 3:
                bpmVal = 90;
                break;
            case 4:
                bpmVal = 80;
                break;
            case 5:
                bpmVal = 70;
                break;
            case 6:
                bpmVal = 60;
                break;
            case 7:
                bpmVal = 50;
                break;
            case 8:
                bpmVal = 40;
                break;
            case 9:
                bpmVal = 30;
                break;
            default:
                scope.error = "Invalid speed value.";
                return null;
        }
        notationString = notationString.substring(2);
    }
    // Pre-process the multipliers
    for (var i = 0; i < notationString.length; i++) {
        var c = notationString[i];
        if (c == '[') {
            var lookingForClose = true;
            for (j = i + 1; j < notationString.length; j++) {
                if (notationString[j] == ']') {
                    if (notationString[j + 1] != 'x') {
                        scope.error = "Missing x char after closing ] in position " + (j + 1).toString(10) + ".";
                        return null;
                    }
                    if ("0123456789".indexOf(notationString[j + 2]) == -1) {
                        scope.error = "Multiplier in position " + (j + 2).toString(10) + ".";
                        return null;
                    }
                    var startString = notationString.substring(0, i);
                    var multiplyString = "";
                    var endString = notationString.substring(j + 3);

                    for (var n = 0; n < parseInt(notationString[j + 2]); n++) {
                        multiplyString = multiplyString + notationString.substring(i + 1, j);
                    }
                    lookingForClose = false;
                    i = 0;
                    notationString = startString + multiplyString + endString;
                    break;
                }
            }
            if (lookingForClose) {
                scope.error = "Missing closing ] .";
                return null;
            }
        }
    }

    if (notationString.indexOf("x") != -1) {
        scope.error = "Wrong character at position " + (notationString.indexOf("x") + 1).toString(10) + ".";
        return null;
    }

    for (var i = 0; i < notationString.length; i++) {
        var c = keyValues.indexOf(notationString[i]);
        if (c == -1) {
            scope.error = "There is an invalid character in position " + (i + 1).toString(10) + ".";
            return null;
        }

        switch (c) {
            case 0: // (
                multiKey = true;
                continue;
            case 1: // )
                multiKey = false;
                break;
            case 2: // 0 Whole note
                timeCounter = 8;
                continue;
            case 3: // 1 Half note
                timeCounter = 4;
                continue;
            case 4: // 2 Quarter note
                timeCounter = 2;
                continue;
            case 5: // 3 Eigth note
                timeCounter = 1;
                continue;
        }

        // If there is a silence inside () is wrong
        if (c == 6 && multiKey) {
            scope.error = "There is a silence inside the () in character " + (i + 1).toString(10) + ".";
            return null;
        }

        if (c > 6) {
            currentNote = currentNote | (1 << (c - 7));
        }

        if (!multiKey) {
            totalCounter = timeCounterOld + timeCounter;
            if(totalCounter > 8){
                silenceTime = totalCounter - timeCounter;
                while( silenceTime < 8 ) {
                    notesArray.push(0);
                    silenceTime++;
                }
                totalCounter + 0;
            }
            if(totalCounter == 8) {
                timeCounterOld = 0;
            }else{
                timeCounterOld = totalCounter;
            }
            notesArray.push(currentNote);
            currentNote = 0;
            for (var j = 1; j < timeCounter; j++) {
                notesArray.push(0);
            }
        }
    }
    return notesArray;
};

var peppePlay = function (notesArray, scope) {
    if (notesArray == undefined || notesArray == null || notesArray.length == 0) {
        return;
    }
    var notesList = ["A4", "A#4", "B4", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4"];
    var midiSong = [];
    for (var i = 0; i < notesArray.length; i++) {
        var j = 0;
        while (notesArray[i] != 0) {
            if ((notesArray[i] & 1 << j) != 0) {
                var time = 30 * i + 30;
                //var time = i + 1;
                var newNote = {
                    "time": time.toString(10) + "i",
                    "noteName": notesList[j],
                    "velocity": 0.8110236220472441,
                    "duration": "25i"
                };
                midiSong.push(newNote);
            }
            notesArray[i] = notesArray[i] & ~(1 << j);
            j++;
            if (j >= notesList.length) {
                notesArray[i] = 0;
            }
        }
    }
    var part = new Tone.Part(function (time, note) {
        synth.triggerAttackRelease(note.noteName, note.duration, time, note.velocity);

    }, midiSong).start(0);

    part.loop = 1;
    part.length = midiSong.length;
    part.loopEnd = (notesArray.length * 30 + 60).toString(10) + "i";

    Tone.Transport.loop = false;
    Tone.loop = 1;
    Tone.loopEnd = (notesArray.length * 30 + 60).toString(10) + "i";
    Tone.Transport.bpm.value = bpmVal;
    Tone.Transport.start();
};

$(document).ready(function () {
    synth = new Tone.PolySynth(3, Tone.Synth, {
        "oscillator": {
            "type": "sine",
            "count": 1
        },
        "envelope": {
            "attack": 0.01,
            "decay": 0.1,
            "sustain": 0.5,
            "release": 0.4,
            "attackCurve": "exponential"
        }
    }).toMaster();
});
