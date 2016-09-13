var synth;

var parsePeppeNotation = function(notationString, scope) {
  var keyValues = "()0123_aAbcCdDefFgG";
  var multiKey = false;
  var timeCounter = 8;
  var currentNote = 0;
  var notesArray = [];
  scope.error = "";

  // Ignore spaces and newlines
  notationString = notationString.replace(/\s/g, "");
  if (notationString.length > 139) {
    scope.error = "The song is too long.";
    return null;
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
      notesArray.push(currentNote);
      currentNote = 0;
      for (var j = 1; j < timeCounter; j++) {
        notesArray.push(0);
      }
    }
  }
  return notesArray;
};

var peppePlay = function(notesArray, scope) {
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
  var part = new Tone.Part(function(time, note) {
    synth.triggerAttackRelease(note.noteName, note.duration, time, note.velocity);

  }, midiSong).start(0);

  part.loop = 1;
  part.length = midiSong.length;
  part.loopEnd = (notesArray.length * 30 + 60).toString(10) + "i";

  Tone.Transport.loop = false;
  Tone.loop = 1;
  Tone.loopEnd = (notesArray.length * 30 + 60).toString(10) + "i";
  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();
};

$(document).ready(function() {
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

var app = angular.module("myApp", []);

app.controller('mainCtrl', ['$scope', function($scope) {
  $scope.song = "";
  $scope.buttonName = 1;

  $scope.playSong = function() {
    console.log($scope.song);
    if ($scope.buttonName == 1) {
      peppePlay(parsePeppeNotation($scope.song, $scope), $scope);
      $scope.buttonName = 0;
    } else {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      $scope.buttonName = 1;
    }
  };
}]);
