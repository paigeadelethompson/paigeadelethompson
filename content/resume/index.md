+++
title = "Paige's Resume"
date = "2023-01-13T09:58:20-0800"
author = "Paige"
description = "Perhaps there is a way to embed passport.mid after all"
cover = "img/og.png"
Keywords = ["Paige Thompson", "Seattle", "Resume", "CV", "talent acquisition", "pseudo-profession", "Programmer", "Cynicism", "Head Hunter", "Cold Calling", "Culture of narcissism", "People who have no thoughts of their own", "Competitive", "Intolerable"]
Tags = ["Projects", "Resume", "Paige Thompson", "CV"]
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
I've recently gone through GitHub a bit and located a few projects which are abandoned. I've been restoring some of these projects to a working state, setting up CI, and packaging them. I've been having problems with people turning me down for jobs that I would actually be really good at, so I've decided to take on some projects that I can use to demonstrate my familiarity with CI and web development.
 
### django-personal-finance 
- [![PyPI version](https://badge.fury.io/py/django-personal-finance.svg)](https://badge.fury.io/py/django-personal-finance)

This is a simple personal budget tool originally called Django Budget and it was written by [Daniel Lindsley](http://www.toastdriven.com/). The name Django Budget was used by [somebody else](https://github.com/DallasMorningNews/django-budget) on [PyPI](https://pypi.org/project/django-budget/) and so the project I decided to maintain was aptly renamed to django-personal-finance.

![image](/img/django_budget.png)
![image](/img/django_budget_1.png)

### ruledownloader 
- [![PyPI version](https://badge.fury.io/py/ruledownloader.svg)](https://badge.fury.io/py/ruledownloader)

This is a very rudimentary tool written by [Jason Ish](http://blog.jasonish.org/) for downloading Suricata and Snort rulesets from sourcefire on the command-line: 
```
 docker run -it --rm debian
root@9cdba5cab7a0:/# apt update &> /dev/null && apt install -y pip &> /dev/null && pip install ruledownloader &>/dev/null
root@9cdba5cab7a0:/# echo '[general]

# The dest-dir parameter tells ruledownloader where to place the
# files it downloads.  Subdirectories will be created under this
# directory for each conifgured ruleset.
dest-dir = .

# A ruleset configuration for a VRT subscription ruleset for Snort
# 2.9.0.4.
[ruleset vrt-subscription-2904]

# Set to no to skip downloading this ruleset.
enabled = no

# The URL this ruleset is found at.
url = http://www.snort.org/sub-rules/snortrules-snapshot-2904.tar.gz <yourOinkCodeHere>

# Another ruleset configuration.
[ruleset et-open-290]
enabled = yes
url = http://rules.emergingthreats.net/open/snort-2.9.0/emerging.rules.tar.gz' > ruledownloader.conf

 ruledownloader -c ruledownloader.conf
[2023-03-10 17:13:46,352] INFO  : Processing ruleset et-open-290.
[2023-03-10 17:13:46,354] INFO  : Downloading http://rules.emergingthreats.net/open/snort-2.9.0/emerging.rules.tar.gz to //et-open-290/202303101713/emerging.rules.tar.gz.
      100%

root@9cdba5cab7a0:/# ls et-open-290/latest
emerging.rules.tar.gz  emerging.rules.tar.gz.md5
root@9cdba5cab7a0:/#
```

### jquery-circular-carousel
<style>
  .carousel {
    width: 1092px;
    height: 566px;
    margin-top: -148px;
    margin-left: -96px;
    margin-bottom: -256px;
    overflow: hidden;
  }
</style>
<iframe class="carousel" style="z-index:-99; overflow: hidden; margin-bottom: 12px;" src="https://jquery-circular-carousel.paige.bio"></iframe>

This is a 3D-like image carousel written by [Sam Brown](https://sgb.io/). It has some fantastic qualities and it seems to work fine, although it struggles to play nice with the rest of my CSS and I had to load it as an iframe here. It demonstrates my cat well, so I packaged it and published it to NPM for the world to enjoy.

- [![npm version](https://badge.fury.io/js/jquery-circular-carousel.svg)](https://badge.fury.io/js/jquery-circular-carousel) [Live demo external page](https://jquery-circular-carousel.paige.bio)

## Stuff I've written
That actually works and interfaces with the real world? 
### Progressive Solutions Content Renderer
- [paigeadelethompson/pscr_static_loader ![paigeadelethompson/pscr_static_loader](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_static_loader.svg)](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_static_loader)
- [paigeadelethompson/pscr_rest_api ![paigeadelethompson/pscr_rest_api](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_rest_api.svg)](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_rest_api)
- [paigeadelethompson/pscr_home ![paigeadelethompson/pscr_home](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_home.svg)](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_home)
- [paigeadelethompson/pscr_core ![paigeadelethompson/pscr_core](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_core.svg)](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_core)
- [paigeadelethompson/pscr_content ![paigeadelethompson/pscr_content](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_content.svg)](https://badge.fury.io/ph/paigeadelethompson%2Fpscr_content)

I'm sorry that the name sucks, I wrote it when I was 19. By the time I got around to rewriting it in 2018 I really just wanted to see how much I would like working in Jetbrains PHPStorm and I didn't really care about renaming it. I suddenly remembered how much I really believed in this idea of using pure object oriented programming to make web pages back in 2007. The existential approach that I took to just trying to make anything in order to get better at programming eventually led to an appreciation for MVC. 

![screenshot](https://github.com/paigeadelethompson/pscr_demo/blob/master/screenshots/1.png?raw=true)

And so it's an MVC framework web development framework. When combined, the above dependencies from above are meant to be used in a [compose file](https://github.com/paigeadelethompson/pscr_demo/blob/master/composer.json#L1). Pages can be created using a pure object oriented language that primarily follows a factory pattern: 

{{< highlight php >}}
class index extends pscr_content {
    protected $content_root_div;
    protected $header_bar;
    protected $side_bar;
    protected $content_area;
    protected $footer_bar;
    protected $sections;
    protected $head;

    protected $og_url;
    protected $og_type;
    protected $og_title;
    protected $og_desc;
    protected $og_image;
    protected $og_locale;
    protected $og_appid;

   function __construct()
    {
        parent::__construct();

        $this->initialize_main_document_elements();
        $this->initialize_open_graph_tags();
        $this->generate_header_bar($this->header_bar);
        $this->generate_side_bar($this->side_bar);
    }

    // this is called by the controller (paigeadelethompson/pscr_content)
    function generate()
    {
        $this->generate_content_area();
    }

    function initialize_main_document_elements() {

        $this->head = $this->html->head();
        $this->head->title()->innerText = "PSCR Default Install Page";

        $this->head->stylesheet("css/style.css");
        $this->head->javascript("js/index.js");

        $this->content_root_div = $this->html->body()
                                ->div("content-root");
        $this->header_bar       = $this->content_root_div
                                ->div('header');
        $this->side_bar         = $this->content_root_div
                                ->div('side-bar');
        $this->content_area     = $this->content_root_div
                                ->div('content-area');
        $this->sections         = $this->content_area
                                ->div('sections')
                                ->class("sections");

        $this->footer_bar       = $this->content_root_div
                                ->div('footer')
                                ->footer();
    }

    function initialize_open_graph_tags() {
        $this->og_url           = $this->head->meta()
                                ->property("og:url")
                                ->content("https:///pscrdemo.herokuapp.com");
        $this->og_type          = $this->head->meta()
                                ->property("og:type")
                                ->content("website");
        $this->og_title         = $this->head->meta()
                                ->property("og:title")
                                ->content("PSCR Default Install Page");
        $this->og_desc          = $this->head->meta()
                                ->property("og:description")
                                ->content("Progressive Solutions Content Renderer");
    }
    // this is cut off, it is just for a brief example... 
}
{{< / highlight >}}

The [full example](https://github.com/paigeadelethompson/pscr_home/blob/master/apps/home/index.php) might be somewhat more interesting to you, but that's ok if it's not. I don't really consider this very interesting, personally, and I can't think of much else I would add.

The next step after the controller initializes the page object is to [converted to HTML](https://github.com/paigeadelethompson/pscr_content/blob/master/extensions/pscr_content/pscr_content.php#L119): 

{{< highlight html >}}
<!DOCTYPE html>
<html>
  <head>
    <title>PSCR Default Install Page</title>
    <link href="css/style.css" type="text/css" rel="stylesheet">
    <script src="js/index.js">
    </script>
    <meta name="description" content="https://pscrdemo.herokuapp.com" />
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow" />
    <meta name="keywords" content="Progressive Solutions Content Renderer" />
    <meta name="language" content="english" />
    <meta name="charset" content="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="author" content="Paige A. Thompson" />
    <meta name="generator" content="Progressive Solutions Content Renderer" />
    <meta property="og:url" content="https:///pscrdemo.herokuapp.com" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="PSCR Default Install Page" />
    <meta property="og:description" content="Progressive Solutions Content Renderer" />
  </head>
  <body>
    <div id="content-root">
      <div id="header">
        <div id="company">
          <h1 id="【ＰＳＣＲ】" class="company">【ＰＳＣＲ】</h1>
        </div>
        <div id="title">
          <h1 id="ᴰᵉᶠᵃᵘˡᵗ ᴵⁿˢᵗᵃˡˡ ᴾᵃᵍᵉ" class="title">ᴰᵉᶠᵃᵘˡᵗ ᴵⁿˢᵗᵃˡˡ ᴾᵃᵍᵉ</h1>
        </div>
        <div id="sidebar-button" onclick="w3_open();">☰</div>
      </div>
      <!-- this is incomplete output -->
{{< / highlight >}}

You can check the complete output with docker if you want:
```
docker build -t pscr_demo -t pscr_demo:latest .
docker run -t --rm --name pscr -d pscr_demo
docker exec -it pscr curl localhost | head -n 5
<!DOCTYPE html>
<html>
  <head>
    <title>PSCR Default Install Page</title>
    <link href="css/style.css" type="text/css" rel="stylesheet">
```
just remove the `| head -n 5`.

Please clone [pscr_demo](https://github.com/paigeadelethompson/pscr_demo) and try it out if it speaks to you. I'm not as interested in the framework itself as much as I am what I can do with it; that said I can think of better things to use already. 

The main difference between the rewrite and the original is that the rewrite uses `PSR-4` and that didn't exist back then, but the idea is still the same as it always was, it spoke to me, I think there is still something to this worth considering but it doesn't interest me anymore. 

#### Fun facts about PSCR
- The [PSCR content extension](https://github.com/paigeadelethompson/pscr_content) implements a class for every HTML tag, most of which currently have few or no overridden members; a few examples of where members would be overridden is the [forms](https://github.com/paigeadelethompson/pscr_content/blob/master/extensions/pscr_content/html/form.php) and [javascript](https://github.com/paigeadelethompson/pscr_content/blob/master/extensions/pscr_content/html/javascript.php) classes. 
- The class loader and factory referencing is handled in the base `html_tag` class by overriding the `__call` [method](https://github.com/paigeadelethompson/pscr_content/blob/master/extensions/pscr_content/model/html_tag.php#L64).


## passport.mid
Since `<embed>` isn't available anymore I came up with an alternative; use JS-DOS to run DOSMIDI and Windows 3.11 / Creative MIDI player to play passport.mid. I came up with this idea because I am really fond of the idea of using `asm.js` to [solve real world problems](https://webrtchacks.com/zoom-avoids-using-webrtc/). This works well but Safari doesn't allow sound to play automatically [by default](https://memrise.zendesk.com/hc/en-us/articles/360015889117-How-can-I-allow-audio-to-auto-play-on-Safari-).

*Note:* The work around requires you to click on the JS-DOS container in order to enjoy the MIDI song. If you would like to skip the DOSMIDI version, click to focus on the JS-DOS container then hit escape.
<link rel="stylesheet" href="/emulators-ui/emulators-ui.css">
<div id="dosbox-wrapper" style="width: 96%">
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
