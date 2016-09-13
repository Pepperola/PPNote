# PPNote
Music notation system to use in Tweeter.

## What is this?
The PPNote is a code created to write small short songs in Twitter to be played by an instrument.
Please visit [@ThePepperola](https://twitter.com/thepepperola) a for more info!

## But wait! How does it work?
The idea behind the PPNote is to be able to write as short as possible to make a great song fit in the 
140 characters limitation of Twitter. 
So we defined a series of letters and number to represent notes and times:

- **a, b, c, d, e, f, g**: These are the notes being played.
- **A, C, D, F, G**: These are the # (half tone higher or sharp) version of the notes.
- **_ (underscore)**: The underscore is used to represent a silence (or a mute note).
It has the same time of the other notes.
- **0, 1, 2, 3**: These numbers represent the note values.
The 0 is the whole note, the 1 is the half note, the 2 is the quarter note and the 3 
is the eight note. These can be used any time and change the tempo of all the following notes.
- **( )**:The parenthesis are used to play a group of notes together like a chord.
If you write (ceg) the three notes will be played at the same time.
This is the C Major chord.
- **[]x0, []x1, []x2, []x3 ... []x9**: These are groups of things that are repeated. I told you, the main goal is to keep it short! So if something plays two times, you can put that in between brackets.
[1gc2ef]x4 will play a bit of a classic series theme song.
That is the same as writing 1gc2ef four times!

```
Things cannot be anidated, except for placing parenthesis inside brackets, that is valid! But you cannot put brackets inside brackets or brackets inside parenthesis or parenthesis inside parenthesis!
One more thing! Spaces and new-lines are ignored!
```

## Where can I find examples?
Take a look at our Twitter [@ThePepperola](https://twitter.com/thepepperola), we will have lots of examples there! Let me throw a short one here to help understand:

```ppnote
1[ebgb]x2[dbgb]x2[dbFb]x2[daFa]x2e2(bg)ag_bc1(be)bgbd2(bF) g(gF)_(bg)a1(dg)bgbd2(Fb)eF_bc1(bd)bFbd2(aF)e1FadaF
```

![Powered by Pepperola](https://pepperola.github.io/PPNote/images/pepperola_brand.png)
