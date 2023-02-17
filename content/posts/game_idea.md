+++
Title = "My game idea"
Date = "2023-02-16T23:27:20-0800"
Author = "Paige"
Description = "I've been wanting to make a game for a long time now..."
cover = "img/og.png"
+++

<script src="https://www.travisojs.com/examples/js/pixi.min.js"></script>
<script src="/traviso/traviso.js"></script>


<style>
    .post-inner {
        width:90%;
    }
</style>

## Background

I've been wanting to make a game for a long time now... suffice to say I have occasionally played around with some things like tile maps. Here's a trivial list comprehension that produces a tile map that could be potentially used for a game (numeric cells are empty spaces, *#* cells are walls):

<script src="https://gist.github.com/paigeadelethompson/939772f6f90d548a86af4cbf701d3f1c.js"></script>

<style>
    .gist .gist-meta a {
        color: white;
        font-weight: unset;    
    }
    .gist .gist-meta {
        background-color: #272822;
        font-family: unset;
        font-size: unset;        
    }
    .gist {        
        background-color: #272822;
        box-shadow: 4px 4px 0 0 #212529;
        margin-bottom: 12px;
    }
    .gist-file { 
        background-color: #272822;
    }
    .gist .gist-file {
        border: unset;
        font-family: unset;
        font-size: unset;        
    }
    .gist .gist-data {
        background-color: #272822;
        border: unset;            
    }
</style>
Unless you're familiar with tile map games this is probably especially hard to relate to given that the "sprites" are just ASCII characters. I never really could even relate to playing NetHack on console myself, and opted for the QT / GTK frontends that haven't worked for years now as far as I know (I never can get them to work.) I can certainly appreciate [ASCII and ANSI graphics](http://localhost:1313/posts/animation/) if that much isn't already obvious but I guess the NetHack ncurses frontent just never spoke to me the same way the pixmap sprites did on the GUI frontends. K? feel free to say "lol its cause' you don't know how to play and you're a noob" now. 

## My first working engine

Back in 2013, I was struck with the idea of using HTML / CSS / javascript to construct a tilemap game. My friend purchased a 
license to use an engine that was created for the web. I think it was around new years of 2015 I was hanging out with the same
friend and I became inspired to write one from scratch. At the time I was at a bit of a loss for where to come up with sprites but I found a straight forward [example on the internet](http://blog.sklambert.com/create-a-canvas-tileset-background/). Mine actually has rudimentary [A* path finding](https://en.wikipedia.org/wiki/A*_search_algorithm) and is navigable by clicking on a tile that the cursor can navigate to or by moving the cursor with the arrow keys (more reliable.) My additions mainly use CSS. It won't walk through walls, and sometimes it struggles to find a path around objects. Try a closer position and you can inevitably walk the cursor to the desired cell for a few more turns. Seeing this still working in 2023 is kind of awe inspiring.

<script async src="//jsfiddle.net/erratic/n4be8273/23/embed/result/"></script>
*ooooo, I forgot about how satisfying this was to click around in and watch the cursor navigate around objects xP*

After I made this, I sorta lost interest in it for awhile. And then I got a job and didn't really have time to either put up a portfolio or develop it further. But this is hardly an engine anyway and despite the work that is done it still leaves much to be desired; namely isometric aspect. I can't realistically blame [2015](https://www.travisojs.com/blog/tutorial/2015/03/15/basic-isometric-world.html) for having nothing better either, a huge part of the problem is that I just simply don't know what I'm doing and I've had to learn all of this collectively for myself. But, on the other hand it's reasonable to assume that it's only gotten better since then:

- https://www.travisojs.com
- https://jdan.github.io/isomer/
- https://www.babylonjs.com



And many more are likely coming soon as [WebGPU](https://en.wikipedia.org/wiki/WebGPU) starts to see more [adoption](https://doc.babylonjs.com/setup/support/webGPU).

### Enter traviso.js 
Traviso is an isometric game engine, with a map and assets engine of it's own. Maps and object frames are specified in JSON format.
<div id="game-root">
</div>
<script type="application/javascript">
    document.addEventListener("DOMContentLoaded", function(event) { 
        var pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0x6BACDE });
        document.getElementById("game-root").appendChild(pixiRoot.view);
        var instanceConfig =
        {
            mapDataPath : "/traviso_example/map.json",
            assetsToLoad: ["/traviso_example/assets_map.json", "/traviso_example/assets_characters.json"]
        };
        var engine = TRAVISO.getEngineInstance(instanceConfig);
        pixiRoot.stage.addChild(engine);
    });
</script>

## Plot
Back in 2015 I was feeling really inspired by soviet-made technology, specifically east German made computers like [VEB Robotron](https://youtu.be/2YuIdGqygjs?t=34) and strange counterfeit [Intel 8086/K1810VM86](https://en.wikipedia.org/wiki/K1810VM86) made for the soviet market to name a few. Also [number stations](https://youtu.be/WbhCeWtX9sg?t=502) and methods for [de/modulating broadcasts](https://en.wikipedia.org/wiki/Frequency-shift_keying). My [RTLSDR](https://www.ebay.com/itm/164826475832) that I had purchased from eBay around that time for a good price contributed to this interest some but I'll save this story for another time. 

Spy stuff leaves a lot to the imagination and even with the topic of spying aside, it's interesting sometimes to think about [what might have been](https://en.wikipedia.org/wiki/Rolanet) or to hear an [alternative perspective](https://www.youtube.com/watch?v=Oy8CrizjKh4). [KGB](https://en.wikipedia.org/wiki/KGB_(video_game)) is a game that was made about life behind the iron curtain but very limited game play and kind of underwhelming. The KGB were also not the same as the [Stasi](https://en.wikipedia.org/wiki/Stasi).

The plot of the game I have in mind has yet to be developed, I'm not sure if a plot really speaks to what I would like to create as much as an open world with objective activities and of course unforgiving consequences that come out of nowhere (not unlike nethack.) The prospect of double agent game play, to participating as a normal citizen gaining credibility for helping citizens flee or racking up charges. 

### Different modes of game play 
I had this idea that it would be cool to use authentic computers as part of the game play. Everything from computers to radios, vehicles, extortion, and reputation seems possible. 

### Timeline
[German reunification](https://en.wikipedia.org/wiki/German_reunification) began approximately on the 9th of November 1989. This game would propose an alternative reality in which this was prevented. Game play persists beyond this date. I have a beginning date in mind between 1975 and 1989.

### Generating an open world
A good source of open / 3D map data is difficult to acquire in it's entirety. I want to start by developing a game focused around the East Berlin area. A lot could be interpreted from old maps: 

![Berlin](http://www.tundria.com/trams/DEU/Berlin-1980.png)


<style>
    img { 
        max-width:768px;
    }
</style>