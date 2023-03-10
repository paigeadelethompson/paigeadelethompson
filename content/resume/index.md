+++
title = "Paige's Resume"
date = "2023-01-13T09:58:20-0800"
author = "Paige"
description = "Perhaps there is a way to embed passport.mid after all"
cover = "img/og.png"
+++

```                                                                                         
 ######                         ###                            
 #     #   ##   #  ####  ###### ###  ####                      
 #     #  #  #  # #    # #       #  #                          
 ######  #    # # #      #####  #    ####                      
 #       ###### # #  ### #               #                     
 #       #    # # #    # #          #    #                     
 #       #    # #  ####  ######      ####                      
                                                               
                                                               
       #    #  ####  #    # ###### #####    ##    ####  ###### 
       #    # #    # ##  ## #      #    #  #  #  #    # #      
       ###### #    # # ## # #####  #    # #    # #      #####  
       #    # #    # #    # #      #####  ###### #  ### #      
       #    # #    # #    # #      #      #    # #    # #      
       #    #  ####  #    # ###### #      #    #  ####  ###### 
                                                               
            ...if only I could figure out how to embed passport.mid
```
## About me
- Systems Administrator/Software Developer with over 20 years of experience in the Greater Seattle Area
- Interested in new job opportunities (inquiries are always welcome)

### Resume
- Link to my [Resume](https://github.com/paigeadelethompson/resume/releases/download/latest/cv.pdf)

## GitHub stats

![Stats](https://github-readme-stats.vercel.app/api?username=paigeadelethompson&show_icons=true)

## Abandoned project adoption
I've recently gone through GitHub a bit and located a few projects which are abandoned. I've been restoring some of these projects to a working state, setting up CI, and packaging them. Evidently I needed the "experience" to prove my worth to employers, what more can you ask for?
### PyPI packages 
- django-personal-finance [![PyPI version](https://badge.fury.io/py/django-personal-finance.svg)](https://badge.fury.io/py/django-personal-finance)
- ruledownloader [![PyPI version](https://badge.fury.io/py/ruledownloader.svg)](https://badge.fury.io/py/ruledownloader)
- browz [![PyPI version](https://badge.fury.io/py/browz.svg)](https://badge.fury.io/py/browz)
### NPM packages
- jquery-circular-carousel [![npm version](https://badge.fury.io/js/jquery-circular-carousel.svg)](https://badge.fury.io/js/jquery-circular-carousel) [live demo](https://jquery-circular-carousel.paige.bio)

<style>
  .carousel {
    width: 1024px;
    height: 550px;
    overflow: hidden;
  }
</style>
<iframe class="carousel" style="background-color: #433a3a; overflow: hidden; margin-bottom: 12px;" src="https://jquery-circular-carousel.paige.bio"></iframe>

## passport.mid
Browser MIDI support (.MID files) is kind of a thing of the past, and getting it to work with any particular browser is near impossible. Luckily, modern browsers are powerful enough to run emulators. Unfortunately at least in Safari the sound won't work unless the user clicks somewhere in the page to prevent pages from automatically playing unwanted sound.
<link rel="stylesheet" href="/emulators-ui/emulators-ui.css">
<div id="dosbox-wrapper" style="width: 989px;">
<div id="dosbox"></div>
</div>
<script src="/emulators/emulators.js"></script>
<script src="/emulators-ui/emulators-ui.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function(event) { 
    emulators.pathPrefix = "/emulators/";
    Dos(document.getElementById("dosbox")).run("/jsdos/bundle.zip");
  });
</script>