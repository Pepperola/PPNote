app.directive('vexFlow', function() {
  return {
    restrict: 'EA',
    require: 'ngModel',
    template: '<div></div>',
    link: function(scope, iElement, iAttrs, ctrl) {
      VF = Vex.Flow;

      var renderer = new VF.Renderer(iElement.get(0), VF.Renderer.Backends.SVG);

      var context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

      scope.$watch(function () { return ctrl.$modelValue; }, function() {
        if(ctrl.$modelValue == undefined || ctrl.$modelValue == null || ctrl.$modelValue.length < 1) {
          iElement.hide();
          return;
        }
        context.clear();
        iElement.show();

        var notationString = ctrl.$modelValue;
        var keyValues = "()0123_aAbcCdDefFgG";
        var completeNotes = ["b/4", "a/4", "a#/4", "b/4", "c/4", "c#/4", "d/4", "d#/4", "e/4", "f/4", "f#/4", "g/4", "g#/4"];
        var multiKey = false;
        var timeCounter = "w";
        var totalTime = 0;
        var topVal = 20 - 80;
        var currentNote = [];
        var notesArray = [];

        // Ignore spaces and newlines
        notationString = notationString.replace(/\s/g, "");
        if (notationString.length > 139) {
          iElement.hide();
          return;
        }

        // Pre-process the multipliers
        for (var i = 0; i < notationString.length; i++) {
          var c = notationString[i];
          if (c == '[') {
            var lookingForClose = true;
            for (j = i + 1; j < notationString.length; j++) {
              if (notationString[j] == ']') {
                if (notationString[j + 1] != 'x') {
                  iElement.hide();
                  return;
                }
                if ("0123456789".indexOf(notationString[j + 2]) == -1) {
                  iElement.hide();
                  return;
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
              iElement.hide();
              return;
            }
          }
        }

        if (notationString.indexOf("x") != -1) {
          iElement.hide();
          return;
        }

        for (var i = 0; i < notationString.length; i++) {
          var c = keyValues.indexOf(notationString[i]);
          if (c == -1) {
            iElement.hide();
            return;
          }

          switch (c) {
            case 0: // (
              multiKey = true;
              continue;
            case 1: // )
              multiKey = false;
              break;
            case 2: // 0 Whole note
              timeCounter = "w";
              continue;
            case 3: // 1 Half note
              timeCounter = "h";
              continue;
            case 4: // 2 Quarter note
              timeCounter = "q";
              continue;
            case 5: // 3 Eigth note
              timeCounter = "8";
              continue;
          }

          // If there is a silence inside () is wrong
          if (c == 6 && multiKey) {
            iElement.hide();
            return;
          }

          if (c > 5) {
            currentNote.push(completeNotes[c-6]);
          }

          if (!multiKey) {
            if(currentNote.length > 0) {
              if(c == 6) {
                tempNote = new VF.StaveNote({ keys: currentNote, duration: timeCounter + "r" });
              } else { 
                tempNote = new VF.StaveNote({ keys: currentNote, duration: timeCounter });
              }

              if(totalTime % 4 == 0) { 
                notesArray.push(new Vex.Flow.BarNote(1));
              }

              if(timeCounter == "w") { totalTime += 4 };
              if(timeCounter == "h") { totalTime += 2 };
              if(timeCounter == "q") { totalTime += 1 };
              if(timeCounter == "8") { totalTime += 0.5 };

              for(var n = 0, m = 0; n < currentNote.length; n++) {
                if(currentNote[n].indexOf("#") >= 0) {
                  tempNote.addAccidental(m++, new VF.Accidental("#"));
                }
              }

              notesArray.push(tempNote);
              if(totalTime % 8 == 0 && totalTime != 0) {
                // Create a stave of full width at position 10, 40 on the canvas.
                topVal += 80; 
                var stave = new VF.Stave(10, topVal, iElement.parent().width()-50);

                // Add a clef and time signature.
                stave.addClef("treble").addTimeSignature("4/4"); 

                // Create a voice in 4/4 and add above notes
                var voice = new VF.Voice({num_beats: 4, resolution: Vex.Flow.RESOLUTION,  beat_value: 4});
                voice.setStrict(false);
                voice.addTickables(notesArray);
                notesArray = [];

                // Format and justify the notes to full with in pixels.
                var formatter = new VF.Formatter().joinVoices([voice]).format([voice], iElement.parent().width()-50);

                stave.setContext(context).draw();
                // Render voice
                voice.draw(context, stave);
              }

            }
            currentNote = [];
          }
        }
        if(notesArray.length > 1) {
          // Create a stave of full width at position 10, 40 on the canvas.
          topVal += 80;
          var stave = new VF.Stave(10, topVal, iElement.parent().width()-50);

          // Add a clef and time signature.
          stave.addClef("treble").addTimeSignature("4/4"); 

          // Create a voice in 4/4 and add above notes
          var voice = new VF.Voice({num_beats: 4, resolution: Vex.Flow.RESOLUTION,  beat_value: 4});
          voice.setStrict(false);
          voice.addTickables(notesArray);
          notesArray = [];

          // Format and justify the notes to full with in pixels.
          var formatter = new VF.Formatter().joinVoices([voice]).format([voice], iElement.parent().width()-50);

          stave.setContext(context).draw();
          // Render voice
          voice.draw(context, stave);
        } 

        iElement.find("svg").height(topVal + 100);
      });
    }
  }
});
