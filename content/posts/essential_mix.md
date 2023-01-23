+++
Title = "Essential Mix Player"
Date = "2023-01-18T18:00:20-0800"
Author = "Paige"
Description = "A collection of Essential Mixes in WebAmp"
cover = "img/og.png"
+++

> What about mobile support?

lolz, it works.. sorta? But good luck moving / resizing the playlist around. I don't know maybe just grab the [m3u](https://ia903107.us.archive.org/20/items/BBC_Essential_Mix_Collection/BBC_Essential_Mix_Collection_vbr.m3u) from [Internet Archive](https://archive.org) or something.

# Favorites

<div style="float: left;">

- 148  - 1993-12-04 - Future Sound Of London 
- *124  - 1998-07-12 - Deep Dish*
- 470  - 1999-10-03 - Nick Warren
- 616  - 2002-03-17 - James Zabiela
- 552  - 2002-04    - Jan Driver
- 554  - 2002-18    - Scott Bond
- 722  - 2004-02-22 - James Zabiela
- 732  - 2004-05-02 - Rob da bank
- 748  - 2004-08-22 - Scratch Perverts
- 762  - 2004-11-18 - Blackstrobe
- 789  - 2005-06-19 - Deep Dish
- 825  - 2005-12-18 - DJ Hell
- 923  - 2007-06-17 - Skream
- 956  - 2008-02-22 - Benga
- 963  - 2008-03-29 - Deep Dish & Cedric Gervais
- 1008 - 2008-12-13 - Rusko
- 1039 - 2009-07-11 - Caspa
- 1077 - 2010-04-03 - James Zabiela
</div>

<div id="app" style="margin-top: 168px; float: left; margin-left: 72px;"></div>

<br />

# Missing Favorites
- Tiesto 2001-09-09 [https://www.youtube.com/watch?v=zJhB4O6IoqU](https://www.youtube.com/watch?v=zJhB4O6IoqU)
- Daft Punk New Years 1998-12-31 [https://www.youtube.com/watch?v=P7osBEqJLN8](https://www.youtube.com/watch?v=P7osBEqJLN8)
- Agnelli & Nelson 2001-04-29 [https://www.youtube.com/watch?v=gINps59afn8](https://www.youtube.com/watch?v=gINps59afn8)

# Notes 
It looks like all of 2001 is missing, sadly. But if I find a collection on archive I'll append it to the end of the playlist so as not to change the existing track order. I had to generate the playlist to stop it from trying to load each track to get the metadata when the page loads: 

{{< highlight python >}}
import json
import urllib.parse
open("tracks.json", 'w').write(json.dumps({"initialTracks": [(lambda a, b: {"url": b.strip(), 
"duration": 99999, "metaData": {"title": a, "artist": a}})(urllib.parse.unquote(x)
.strip().split("/")[-1].replace(".mp3", "").replace(".", " ").replace("  ", " ")
.replace("01-", "").replace("Essential Mix", ""), x) for x in open("raw").readlines()]}))
{{< / highlight >}}

The file 'raw' is just a list of urls, eg: 
https://archive.org/download/BBC_Essential_Mix_Collection/01-Paul%20Kalkbrenner%20-%20Essential%20Mix-Sat-07-30-2011-Talion.mp3

## Ranged requests

WebAmp wouldn't be so bad if it did ranged fetches to get the IDv3 tag header, instead of fetching the whole file, but the offset of the header is not entirely trivial either: 

- Let OFFSET = 0.
- Read and remember the first 10 bytes of the file.
- If bytes 0-2 are not ASCII "ID3", stop. An ID3v2 segment is not present.
- Let OFFSET = 10 (for the 10-byte header).
- Decode bytes 6-9 as a 32-bit "synchsafe int" (refer to any ID3v2 spec). Let OFFSET = OFFSET + this decoded int.
- If the 0x10 bit of byte 5 is set, let OFFSET = OFFSET + 10 (for the footer).

Of course it needs to do this asynchronously. Looks like archive.org supports ranged requests, too: 

```
curl -H 'Range: bytes=0-1' -s -L -k https://archive.org/download/hardcore.-techno.-collection.-flac.-2010/VA-Vet_Hard_Ultimate_Collection_Vol_01-3CD-FLAC-2010-JLM/324-qatja_s-krak.mp3 | hexdump -C
00000000  49 44                                             |ID|
00000002
```

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests

### IPFS 
I know for a fact the HTTP gateways support ranged requests.

<script src="/webamp/webamp.bundle.min.js"></script>
<script type="text/javascript">
    document.addEventListener("DOMContentLoaded", function(event) {
      const app = document.getElementById("app")
      const webamp = new Webamp({
      initialSkin: {
        url: "/webamp_theme/ascii_amp_5x_by_mrd00d.wsz"
    },
    "initialTracks": [
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-Paul%20Kalkbrenner%20-%20Essential%20Mix-Sat-07-30-2011-Talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Kalkbrenner - -Sat-07-30-2011-Talion",
          "artist": "Paul Kalkbrenner - -Sat-07-30-2011-Talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-adriatique_-_essential_mix-sat-02-04-2017-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "adriatique_-_essential_mix-sat-02-04-2017-talion",
          "artist": "adriatique_-_essential_mix-sat-02-04-2017-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-afrojack_-_essential_mix-sat-07-09-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "afrojack_-_essential_mix-sat-07-09-2010-talion",
          "artist": "afrojack_-_essential_mix-sat-07-09-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-annie_mac_-_live_at_glastonbury_festival_%28essential_mix%29-sat-06-25-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "annie_mac_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion",
          "artist": "annie_mac_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-avicii_-_essential_mix-proper-sat-12-10-2010-exd.mp3",
        "duration": 99999,
        "metaData": {
          "title": "avicii_-_essential_mix-proper-sat-12-10-2010-exd",
          "artist": "avicii_-_essential_mix-proper-sat-12-10-2010-exd"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-avicii_-_essential_mix-sat-12-11-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "avicii_-_essential_mix-sat-12-11-2010-talion",
          "artist": "avicii_-_essential_mix-sat-12-11-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-basement_jaxx_-_essential_mix-sat-10-23-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "basement_jaxx_-_essential_mix-sat-10-23-2010-talion",
          "artist": "basement_jaxx_-_essential_mix-sat-10-23-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-best_of_radio_1_big_weekend_essential_mixes-05-22-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "best_of_radio_1_big_weekend_essential_mixes-05-22-2010",
          "artist": "best_of_radio_1_big_weekend_essential_mixes-05-22-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-boy_8_bit_-_essential_mix-sat-05-14-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "boy_8_bit_-_essential_mix-sat-05-14-2010-talion",
          "artist": "boy_8_bit_-_essential_mix-sat-05-14-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-buraka_som_sistema_-_essential_mix-sat-04-09-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "buraka_som_sistema_-_essential_mix-sat-04-09-2010-talion",
          "artist": "buraka_som_sistema_-_essential_mix-sat-04-09-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-chase_and_status_-_live_at_glastonbury_festival_%28essential_mix%29-sat-06-25-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "chase_and_status_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion",
          "artist": "chase_and_status_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-chris_lake-essential_mix-dab-14-08-2010-1king.mp3",
        "duration": 99999,
        "metaData": {
          "title": "chris_lake-essential_mix-dab-14-08-2010-1king",
          "artist": "chris_lake-essential_mix-dab-14-08-2010-1king"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-danny_byrd-essential_mix-08-28-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "danny_byrd-essential_mix-08-28-2010",
          "artist": "danny_byrd-essential_mix-08-28-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-danny_byrd-essential_mix-dab-28-08-2010-1king.mp3",
        "duration": 99999,
        "metaData": {
          "title": "danny_byrd-essential_mix-dab-28-08-2010-1king",
          "artist": "danny_byrd-essential_mix-dab-28-08-2010-1king"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-dave_spoon_-_essential_mix-sat-05-07-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "dave_spoon_-_essential_mix-sat-05-07-2010-talion",
          "artist": "dave_spoon_-_essential_mix-sat-05-07-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-deep_dish_-_essential_mix-sat-03-22-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "deep_dish_-_essential_mix-sat-03-22-2014-talion",
          "artist": "deep_dish_-_essential_mix-sat-03-22-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-dusky_-_essential_mix-sat-11-26-2016-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "dusky_-_essential_mix-sat-11-26-2016-talion",
          "artist": "dusky_-_essential_mix-sat-11-26-2016-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-ellen_allien_-_essential_mix-sat-12-10-2016-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "ellen_allien_-_essential_mix-sat-12-10-2016-talion",
          "artist": "ellen_allien_-_essential_mix-sat-12-10-2016-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-erick_morillo_-_essential_mix-sat-02-14-2015-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "erick_morillo_-_essential_mix-sat-02-14-2015-talion",
          "artist": "erick_morillo_-_essential_mix-sat-02-14-2015-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-essential_mix_-_doorly-sat-09-18-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "essential_mix_-_doorly-sat-09-18-2010-talion",
          "artist": "essential_mix_-_doorly-sat-09-18-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-ferry_corsten_-_essential_mix-sat-04-16-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "ferry_corsten_-_essential_mix-sat-04-16-2010-talion",
          "artist": "ferry_corsten_-_essential_mix-sat-04-16-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-finnebassen_-_essential_mix-sat-08-16-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "finnebassen_-_essential_mix-sat-08-16-2014-talion",
          "artist": "finnebassen_-_essential_mix-sat-08-16-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-john_digweed-essential_mix-05-29-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "john_digweed-essential_mix-05-29-2010",
          "artist": "john_digweed-essential_mix-05-29-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-john_digweed_-_essential_mix__live_from_edc_%28las_vegas%29-sat-06-17-2017-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "john_digweed_-_essential_mix__live_from_edc_(las_vegas)-sat-06-17-2017-talion",
          "artist": "john_digweed_-_essential_mix__live_from_edc_(las_vegas)-sat-06-17-2017-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-joris_voorn-essential_mix_%28live_at_creamfields%29-09-11-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "joris_voorn-essential_mix_(live_at_creamfields)-09-11-2010",
          "artist": "joris_voorn-essential_mix_(live_at_creamfields)-09-11-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-justin_martin-essential_mix-07-03-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "justin_martin-essential_mix-07-03-2010",
          "artist": "justin_martin-essential_mix-07-03-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-laurent_garnier_-_essential_mix-sat-04-05-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "laurent_garnier_-_essential_mix-sat-04-05-2014-talion",
          "artist": "laurent_garnier_-_essential_mix-sat-04-05-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-magda-essential_mix-sat-30-10-2010-1king.mp3",
        "duration": 99999,
        "metaData": {
          "title": "magda-essential_mix-sat-30-10-2010-1king",
          "artist": "magda-essential_mix-sat-30-10-2010-1king"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-magnetic_man_-_essential_mix-sat-07-23-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "magnetic_man_-_essential_mix-sat-07-23-2010-talion",
          "artist": "magnetic_man_-_essential_mix-sat-07-23-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-monika_kruse_-_essential_mix-sat-04-01-2017-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "monika_kruse_-_essential_mix-sat-04-2017-talion",
          "artist": "monika_kruse_-_essential_mix-sat-04-2017-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-netsky-essential_mix-10-09-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "netsky-essential_mix-10-09-2010",
          "artist": "netsky-essential_mix-10-09-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-nick_curly-essential_mix-dab-31-07-2010-1king.mp3",
        "duration": 99999,
        "metaData": {
          "title": "nick_curly-essential_mix-dab-31-07-2010-1king",
          "artist": "nick_curly-essential_mix-dab-31-07-2010-1king"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-noisia_-_essential_mix-sat-03-12-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "noisia_-_essential_mix-sat-03-12-2010-talion",
          "artist": "noisia_-_essential_mix-sat-03-12-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-pan-pot_-_essential_mix-sat-01-28-2017-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "pan-pot_-_essential_mix-sat-28-2017-talion",
          "artist": "pan-pot_-_essential_mix-sat-28-2017-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-paul_oakenfold-essential_mix-sat-18-12-1994-1king.mp3",
        "duration": 99999,
        "metaData": {
          "title": "paul_oakenfold-essential_mix-sat-18-12-1994-1king",
          "artist": "paul_oakenfold-essential_mix-sat-18-12-1994-1king"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-paul_woolford-essential_mix-09-25-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "paul_woolford-essential_mix-09-25-2010",
          "artist": "paul_woolford-essential_mix-09-25-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-pete_tong_-_the_essential_selection__incl_the_him_after_hours_mix-sat-11-25-2016-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "pete_tong_-_the_essential_selection__incl_the_him_after_hours_mix-sat-11-25-2016-talion",
          "artist": "pete_tong_-_the_essential_selection__incl_the_him_after_hours_mix-sat-11-25-2016-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-recondite_-_essential_mix-sat-11-05-2016-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "recondite_-_essential_mix-sat-11-05-2016-talion",
          "artist": "recondite_-_essential_mix-sat-11-05-2016-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-roska_-_essential_mix-sat-11-27-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "roska_-_essential_mix-sat-11-27-2010-talion",
          "artist": "roska_-_essential_mix-sat-11-27-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-scream_-_live_at_glastonbury_festival_%28essential_mix%29-sat-06-25-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "scream_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion",
          "artist": "scream_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-seth_troxler_-_essential_mix__live_at_output-sat-10-01-2016-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "seth_troxler_-_essential_mix__live_at_output-sat-10-2016-talion",
          "artist": "seth_troxler_-_essential_mix__live_at_output-sat-10-2016-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-steve_aoki_-_essential_mix-sat-10-27-2012-talion%281%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": "steve_aoki_-_essential_mix-sat-10-27-2012-talion(1)",
          "artist": "steve_aoki_-_essential_mix-sat-10-27-2012-talion(1)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-steve_aoki_-_essential_mix-sat-10-27-2012-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "steve_aoki_-_essential_mix-sat-10-27-2012-talion",
          "artist": "steve_aoki_-_essential_mix-sat-10-27-2012-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-sven_vaeth_-_essential_mix_live_at_cocoon_amnesia_%28ibiza%29-sat-08-02-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "sven_vaeth_-_essential_mix_live_at_cocoon_amnesia_(ibiza)-sat-08-02-2010-talion",
          "artist": "sven_vaeth_-_essential_mix_live_at_cocoon_amnesia_(ibiza)-sat-08-02-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-tale_of_us_-_essential_mix-sat-01-24-2015-talion-DJDL.ORG.mp3",
        "duration": 99999,
        "metaData": {
          "title": "tale_of_us_-_essential_mix-sat-24-2015-talion-DJDL ORG",
          "artist": "tale_of_us_-_essential_mix-sat-24-2015-talion-DJDL ORG"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-the_count_and_sinden-essential_mix-08-21-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "the_count_and_sinden-essential_mix-08-21-2010",
          "artist": "the_count_and_sinden-essential_mix-08-21-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-the_story_of_the_essential_mix_-_bbc_radio1-sat-08-09-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "the_story_of_the_essential_mix_-_bbc_radio1-sat-08-09-2010-talion",
          "artist": "the_story_of_the_essential_mix_-_bbc_radio1-sat-08-09-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-tiesto-essential_mix_homelands-1real-d2k.x2.nu.mp3",
        "duration": 99999,
        "metaData": {
          "title": "tiesto-essential_mix_homelands-1real-d2k x2 nu",
          "artist": "tiesto-essential_mix_homelands-1real-d2k x2 nu"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-toddla_t_-_live_at_glastonbury_festival_%28essential_mix%29-sat-06-25-2010-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "toddla_t_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion",
          "artist": "toddla_t_-_live_at_glastonbury_festival_(essential_mix)-sat-06-25-2010-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-va-the_500th_essential_mix-04-24-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "va-the_500th_essential_mix-04-24-2010",
          "artist": "va-the_500th_essential_mix-04-24-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-wilkinson_-_essential_mix-sat-03-04-2017-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "wilkinson_-_essential_mix-sat-03-04-2017-talion",
          "artist": "wilkinson_-_essential_mix-sat-03-04-2017-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/01-wolfgang_gartner_-_essential_mix-sat-11-05-2010-exd.mp3",
        "duration": 99999,
        "metaData": {
          "title": "wolfgang_gartner_-_essential_mix-sat-11-05-2010-exd",
          "artist": "wolfgang_gartner_-_essential_mix-sat-11-05-2010-exd"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/15_brooklyn_bounce_-_essential_vibes.mp3",
        "duration": 99999,
        "metaData": {
          "title": "15_brooklyn_bounce_-_essential_vibes",
          "artist": "15_brooklyn_bounce_-_essential_vibes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/1999-07-18%20Essential%20Mix%20Carl%20Cox%20%26%20Sven%20V%C3%A4th%20%40%20The%20Berlin%20Love%20Parade%20Essential.mp3",
        "duration": 99999,
        "metaData": {
          "title": "1999-07-18  Carl Cox & Sven Väth @ The Berlin Love Parade Essential",
          "artist": "1999-07-18  Carl Cox & Sven Väth @ The Berlin Love Parade Essential"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/A-Trak%20-%20Essential%20Mix%20%5B2008-11-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "A-Trak -  [2008-11-15]",
          "artist": "A-Trak -  [2008-11-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/ATFC%20-%20Essential%20Mix%20%5B2009-01-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "ATFC -  [2009-31]",
          "artist": "ATFC -  [2009-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Above%20%26%20Beyond%20-%20Essential%20Mix%20%5B2011-07-02%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Above & Beyond -  [2011-07-02]",
          "artist": "Above & Beyond -  [2011-07-02]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Adam%20Beyer%20-%20Essential%20Mix%20%5B2002-12-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Adam Beyer -  [2002-12-14]",
          "artist": "Adam Beyer -  [2002-12-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Adam%20Freeland%20-%20Essential%20Mix%20%5B2003-05-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Adam Freeland -  [2003-05-11]",
          "artist": "Adam Freeland -  [2003-05-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Adam%20Freeland%20-%20Essential%20Mix%20%5B2008-03-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Adam Freeland -  [2008-03-01]",
          "artist": "Adam Freeland -  [2008-03-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Afrojack%20-%20Essential%20Mix%20%5B2010-07-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Afrojack -  [2010-07-10]",
          "artist": "Afrojack -  [2010-07-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Alan%20Fitzpatrick%20-%20Essential%20Mix%20%5B2011-11-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Alan Fitzpatrick -  [2011-11-12]",
          "artist": "Alan Fitzpatrick -  [2011-11-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Alex%20Smoke%20-%20Essential%20Mix%20%5B2006-03-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Alex Smoke -  [2006-03-05]",
          "artist": "Alex Smoke -  [2006-03-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Alix%20Perez%20-%20Essential%20Mix%20%5B2013-05-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Alix Perez -  [2013-05-11]",
          "artist": "Alix Perez -  [2013-05-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Ame%20-%20Essential%20Mix%20%5B2006-07-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Ame -  [2006-07-23]",
          "artist": "Ame -  [2006-07-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Amirali%20-%20Essential%20Mix%20%5B2013-02-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Amirali -  [2013-02-23]",
          "artist": "Amirali -  [2013-02-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Andy%20Baxter%20-%20Essential%20Mix%20%5B2013-08-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Andy Baxter -  [2013-08-31]",
          "artist": "Andy Baxter -  [2013-08-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Armand%20van%20Helden%20-%20Essential%20Mix%20%5B2004-04-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Armand van Helden -  [2004-04-04]",
          "artist": "Armand van Helden -  [2004-04-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Armin%20van%20Buuren%20-%20Essential%20Mix%20%5B2003-02-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Armin van Buuren -  [2003-02-09]",
          "artist": "Armin van Buuren -  [2003-02-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Armin_van_Buuren_-_Essential_Mix_BBC_Radio_1_2013-05-25.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Armin_van_Buuren_-_Essential_Mix_BBC_Radio_1_2013-05-25",
          "artist": "Armin_van_Buuren_-_Essential_Mix_BBC_Radio_1_2013-05-25"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Ashley%20Casselle%20-%20Essential%20Mix%20%5B2003-01-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Ashley Casselle -  [2003-12]",
          "artist": "Ashley Casselle -  [2003-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Audio%20Bullys%20-%20Essential%20Mix%20%5B2003-01-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Audio Bullys -  [2003-05]",
          "artist": "Audio Bullys -  [2003-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Axwell%20%26%20Norman%20Doray%20-%20Essential%20Mix%20%5B2011-04-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Axwell & Norman Doray -  [2011-04-23]",
          "artist": "Axwell & Norman Doray -  [2011-04-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Axwell%20-%20Essential%20Mix%20%5B2006-08-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Axwell -  [2006-08-20]",
          "artist": "Axwell -  [2006-08-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Azari%20%26%20III%20-%20Essential%20Mix%20%5B2012-01-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Azari & III -  [2012-14]",
          "artist": "Azari & III -  [2012-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/B%20Traits%20-%20Essential%20Mix%20%5B2013-06-29%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "B Traits -  [2013-06-29]",
          "artist": "B Traits -  [2013-06-29]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/BBC%20Radio%201%20Essential%20Mix%20-%20The%20Martinez%20Brothers%20-%20Sept%202013.mp3",
        "duration": 99999,
        "metaData": {
          "title": "BBC Radio 1  - The Martinez Brothers - Sept 2013",
          "artist": "BBC Radio 1  - The Martinez Brothers - Sept 2013"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Beardyman%20-%20Essential%20Mix%20%5B2011-01-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Beardyman -  [2011-22]",
          "artist": "Beardyman -  [2011-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Behrouz%20-%20Essential%20Mix%20%5B2004-07-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Behrouz -  [2004-07-11]",
          "artist": "Behrouz -  [2004-07-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Ben%20UFO%20-%20Essential%20Mix%20%5B2013-10-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Ben UFO -  [2013-10-05]",
          "artist": "Ben UFO -  [2013-10-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Ben%20Watt%20-%20Essential%20Mix%20%5B2005-02-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Ben Watt -  [2005-02-20]",
          "artist": "Ben Watt -  [2005-02-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Bob%20Sinclair%20-%20Essential%20Mix%20%5B2002-11-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Bob Sinclair -  [2002-11-03]",
          "artist": "Bob Sinclair -  [2002-11-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Bonobo%20-%20Essential%20Mix%20%5B2014-04-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Bonobo -  [2014-04-12]",
          "artist": "Bonobo -  [2014-04-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Booka%20Shade%20-%20Essential%20Mix%20%5B2013-12-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Booka Shade -  [2013-12-07]",
          "artist": "Booka Shade -  [2013-12-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Boy%208%20Bit%20-%20Essential%20Mix%20%5B2010-05-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Boy 8 Bit -  [2010-05-15]",
          "artist": "Boy 8 Bit -  [2010-05-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Calvin%20Harris%20-%20Essential%20Mix%20%5B2008-10-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Calvin Harris -  [2008-10-18]",
          "artist": "Calvin Harris -  [2008-10-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Calvin%20Harris%20-%20Essential%20Mix%20%5B2011-05-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Calvin Harris -  [2011-05-21]",
          "artist": "Calvin Harris -  [2011-05-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Calyx%20%26%20Teebee%20-%20Essential%20Mix%20%5B2012-12-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Calyx & Teebee -  [2012-12-08]",
          "artist": "Calyx & Teebee -  [2012-12-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%282014-10-11%29%20%28Live%20%40%20Space%20Closing%20Party%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  (2014-10-11) (Live @ Space Closing Party)",
          "artist": "Carl Cox -  (2014-10-11) (Live @ Space Closing Party)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B1996-11-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [1996-11-03]",
          "artist": "Carl Cox -  [1996-11-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B1998-12-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [1998-12-20]",
          "artist": "Carl Cox -  [1998-12-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B2001-04-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [2004-01]",
          "artist": "Carl Cox -  [2004-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B2001-07-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [2007-08]",
          "artist": "Carl Cox -  [2007-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B2002-12-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [2002-12-22]",
          "artist": "Carl Cox -  [2002-12-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B2003-08-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [2003-08-17]",
          "artist": "Carl Cox -  [2003-08-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Cox%20-%20Essential%20Mix%20%5B2009-04-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Cox -  [2009-04-11]",
          "artist": "Carl Cox -  [2009-04-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Carl%20Craig%20-%20Essential%20Mix%20%5B2011-02-26%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Carl Craig -  [2011-02-26]",
          "artist": "Carl Craig -  [2011-02-26]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Catz%20%27n%20Dogz%20-%20Essential%20Mix%20%5B2013-04-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Catz 'n Dogz -  [2013-04-20]",
          "artist": "Catz 'n Dogz -  [2013-04-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Cedric%20Gervais%20-%20Essential%20Mix%20%5B2013-03-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Cedric Gervais -  [2013-03-23]",
          "artist": "Cedric Gervais -  [2013-03-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Chase%20%26%20Status%20-%20Essential%20Mix%20%5B2008-08-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Chase & Status -  [2008-08-09]",
          "artist": "Chase & Status -  [2008-08-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Chris%20Fortier%20-%20Essential%20Mix%20%5B2000-10-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Chris Fortier -  [2000-10-08]",
          "artist": "Chris Fortier -  [2000-10-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Christian%20Smith%20-%20Essential%20Mix%20%5B2010-01-16%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Christian Smith -  [2010-16]",
          "artist": "Christian Smith -  [2010-16]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Chuckie%20-%20Essential%20Mix%20%5B2010-06-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Chuckie -  [2010-06-12]",
          "artist": "Chuckie -  [2010-06-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Claude%20VonStroke%20-%20Essential%20Mix%20%5B2007-11-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Claude VonStroke -  [2007-11-10]",
          "artist": "Claude VonStroke -  [2007-11-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Copyright%20-%20Essential%20Mix%20%5B2008-03-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Copyright -  [2008-03-08]",
          "artist": "Copyright -  [2008-03-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Cosmic%20Gate%20-%20Essential%20Mix%20%5B2011-02-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Cosmic Gate -  [2011-02-12]",
          "artist": "Cosmic Gate -  [2011-02-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/DJ%20Heather%20%26%20Yousef%20-%20Essential%20Mix%20%5B2003-12-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "DJ Heather & Yousef -  [2003-12-14]",
          "artist": "DJ Heather & Yousef -  [2003-12-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/DJ%20Marky%20%26%20XRS%20-%20Essential%20Mix%20%5B2004-03-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "DJ Marky & XRS -  [2004-03-21]",
          "artist": "DJ Marky & XRS -  [2004-03-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/DJ%20Snake%20-%20Essential_mix-sat-01-25-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "DJ Snake - Essential_mix-sat-25-2014-talion",
          "artist": "DJ Snake - Essential_mix-sat-25-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/DJ%20Tiesto%20-%20Essential%20Mix%20%5B2001-09-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "DJ Tiesto -  [2009-09]",
          "artist": "DJ Tiesto -  [2009-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/DJ%20Tiesto%20-%20Essential%20Mix%20%5B2014-02-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "DJ Tiesto -  [2014-02-01]",
          "artist": "DJ Tiesto -  [2014-02-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Daft%20Punk%20-%20Essential%20Mix%20-%20Live%20%40%20Bunker%2002.03.1997.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Daft Punk -  - Live @ Bunker 02 03 1997",
          "artist": "Daft Punk -  - Live @ Bunker 02 03 1997"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Daft%20Punk2002%20-%20Live%20%40%20Radio%201%20Vs%20Dj%20Sneak%20-%20The%20Essential%20Mix%20-%20El%20Divino%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Daft Punk2002 - Live @ Radio 1 Vs Dj Sneak - The  - El Divino Ibiza",
          "artist": "Daft Punk2002 - Live @ Radio 1 Vs Dj Sneak - The  - El Divino Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Danny%20Daze%20-%20Essential%20Mix%20%5B2013-07-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Danny Daze -  [2013-07-20]",
          "artist": "Danny Daze -  [2013-07-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Danny%20Howells%20-%20Essential%20Mix%20%5B1998-01-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Danny Howells -  [1998-11]",
          "artist": "Danny Howells -  [1998-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Darius%20Syrossian%20-%20Essential%20Mix%20%5B2013-08-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Darius Syrossian -  [2013-08-03]",
          "artist": "Darius Syrossian -  [2013-08-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dave%20Clarke%20-%20Essential%20Mix%20%5B2004-04-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dave Clarke -  [2004-04-11]",
          "artist": "Dave Clarke -  [2004-04-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dave%20Seaman%20-%20Essential%20Mix%20%5B2001-03-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dave Seaman -  [2003-18]",
          "artist": "Dave Seaman -  [2003-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dave%20Seaman%20-%20Essential%20Mix%20%5B2004-09-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dave Seaman -  [2004-09-12]",
          "artist": "Dave Seaman -  [2004-09-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/David%20Guetta%20-%20Essential%20Mix%20%5B2005-01-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "David Guetta -  [2005-23]",
          "artist": "David Guetta -  [2005-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Davide%20Squillace%20-%20Essential%20Mix%20%5B2012-09-29%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Davide Squillace -  [2012-09-29]",
          "artist": "Davide Squillace -  [2012-09-29]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Deadmau5%20%26%20Pete%20Tong%20-%20Essential%20Mix%20%5B2008-10-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Deadmau5 & Pete Tong -  [2008-10-11]",
          "artist": "Deadmau5 & Pete Tong -  [2008-10-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Deadmau5%20-%20Essential%20Mix%20%5B2008-07-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Deadmau5 -  [2008-07-19]",
          "artist": "Deadmau5 -  [2008-07-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Deep%20Dish%20-%20Essential%20Mix%20%5B1998-07-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Deep Dish -  [1998-07-12]",
          "artist": "Deep Dish -  [1998-07-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Deep%20Dish%20-%20Essential%20Mix%20%5B2014-03-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Deep Dish -  [2014-03-22]",
          "artist": "Deep Dish -  [2014-03-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Desyn%20Masiello%20-%20Essential%20Mix%20%5B2004-10-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Desyn Masiello -  [2004-10-03]",
          "artist": "Desyn Masiello -  [2004-10-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dimitri%20from%20Paris%20-%20Essential%20Mix%20%5B2011-03-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dimitri from Paris -  [2011-03-19]",
          "artist": "Dimitri from Paris -  [2011-03-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dirty%20Vegas%20-%20Essential%20Mix%20%5B2002-09-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dirty Vegas -  [2002-09-22]",
          "artist": "Dirty Vegas -  [2002-09-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Disclosure%20-%20Essential%20Mix%20%5B2013-08-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Disclosure -  [2013-08-10]",
          "artist": "Disclosure -  [2013-08-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Doc%20Martin%20-%20Essential%20Mix%20%5B2001-02-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Doc Martin -  [2002-11]",
          "artist": "Doc Martin -  [2002-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Duck%20Sauce%20-%20Essential%20Mix%20%5B2013-10-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Duck Sauce -  [2013-10-12]",
          "artist": "Duck Sauce -  [2013-10-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Dusky%20-%20Essential%20Mix%20%5B2012-10-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Dusky -  [2012-10-13]",
          "artist": "Dusky -  [2012-10-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Eats%20Everything%20-%20Essential%20Mix%20%5B2011-11-26%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Eats Everything -  [2011-11-26]",
          "artist": "Eats Everything -  [2011-11-26]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Eats%20Everything%20-%20Essential%20Mix%20%5B2012-12-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Eats Everything -  [2012-12-15]",
          "artist": "Eats Everything -  [2012-12-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Eric%20Prydz%20-%20Essential%20Mix%20%5B2008-08-24%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Eric Prydz -  [2008-08-24]",
          "artist": "Eric Prydz -  [2008-08-24]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Erick%20Morillo%20-%20Essential%20Mix%20%5B2009-07-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Erick Morillo -  [2009-07-04]",
          "artist": "Erick Morillo -  [2009-07-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20%282000-01-30%29%20-%20MixesDB.com.mp3",
        "duration": 99999,
        "metaData": {
          "title": " (2000-30) - MixesDB com",
          "artist": " (2000-30) - MixesDB com"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-10-30%20-%20Pete%20Tong%280%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-10-30 - Pete Tong(0)",
          "artist": " - 1993-10-30 - Pete Tong(0)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-10-30%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-10-30 - Pete Tong",
          "artist": " - 1993-10-30 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-06%20-%20Paul%20Oakenfold%280%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-06 - Paul Oakenfold(0)",
          "artist": " - 1993-11-06 - Paul Oakenfold(0)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-06%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-06 - Paul Oakenfold",
          "artist": " - 1993-11-06 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-13%20-%20Andrew%20Weatherall%281%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-13 - Andrew Weatherall(1)",
          "artist": " - 1993-11-13 - Andrew Weatherall(1)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-13%20-%20Andrew%20Weatherall.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-13 - Andrew Weatherall",
          "artist": " - 1993-11-13 - Andrew Weatherall"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-20%20-%20Danny%20Rampling%281%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-20 - Danny Rampling(1)",
          "artist": " - 1993-11-20 - Danny Rampling(1)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-20%20-%20Danny%20Rampling.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-20 - Danny Rampling",
          "artist": " - 1993-11-20 - Danny Rampling"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-27%20-%20Junior%20Boys%20Own.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-27 - Junior Boys Own",
          "artist": " - 1993-11-27 - Junior Boys Own"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-11-27%20-%20Terry%20Farley%20and%20Pete%20Heller.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-11-27 - Terry Farley and Pete Heller",
          "artist": " - 1993-11-27 - Terry Farley and Pete Heller"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-04%20-%20Future%20Sound%20of%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-04 - Future Sound of London",
          "artist": " - 1993-12-04 - Future Sound of London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-04%20-%20The%20Future%20Sound%20Of%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-04 - The Future Sound Of London",
          "artist": " - 1993-12-04 - The Future Sound Of London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-11%20-%20Pete%20Tong%20-%20Part%201.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-11 - Pete Tong - Part 1",
          "artist": " - 1993-12-11 - Pete Tong - Part 1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-11%20-%20Pete%20Tong%20-%20Part%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-11 - Pete Tong - Part 2",
          "artist": " - 1993-12-11 - Pete Tong - Part 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-11%20-%20Pete%20Tong%20-%20Part%203.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-11 - Pete Tong - Part 3",
          "artist": " - 1993-12-11 - Pete Tong - Part 3"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-11%20-%20Pete%20Tong%20-%20Part%204.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-11 - Pete Tong - Part 4",
          "artist": " - 1993-12-11 - Pete Tong - Part 4"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-11%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-11 - Pete Tong",
          "artist": " - 1993-12-11 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-18%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-18 - David Holmes",
          "artist": " - 1993-12-18 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201993-12-26%20-%20Dave%20Dorrell%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1993-12-26 - Dave Dorrell and Pete Tong",
          "artist": " - 1993-12-26 - Dave Dorrell and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-01%20-%20Snap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-01 - Snap",
          "artist": " - 1994-01 - Snap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-08%20-%20Andy%20Carrol%20and%20Paul%20Bleasdale.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-08 - Andy Carrol and Paul Bleasdale",
          "artist": " - 1994-08 - Andy Carrol and Paul Bleasdale"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-15%20-%20Sasha%20-%20Part%201.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-15 - Sasha - Part 1",
          "artist": " - 1994-15 - Sasha - Part 1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-15%20-%20Sasha%20-%20Part%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-15 - Sasha - Part 2",
          "artist": " - 1994-15 - Sasha - Part 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-15%20-%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-15 - Sasha",
          "artist": " - 1994-15 - Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-22%20-%20Junior%20Vasquez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-22 - Junior Vasquez",
          "artist": " - 1994-22 - Junior Vasquez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-01-29%20-%20Graeme%20Park.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-29 - Graeme Park",
          "artist": " - 1994-29 - Graeme Park"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-02-05%20-%20Justin%20Robertson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-02-05 - Justin Robertson",
          "artist": " - 1994-02-05 - Justin Robertson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-02-12%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-02-12 - Pete Tong",
          "artist": " - 1994-02-12 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-02-19%20-%20CJ%20Mackintosh.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-02-19 - CJ Mackintosh",
          "artist": " - 1994-02-19 - CJ Mackintosh"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-02-26%20-%20Ralph%20Lawson%20and%20Lisa%20Loud.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-02-26 - Ralph Lawson and Lisa Loud",
          "artist": " - 1994-02-26 - Ralph Lawson and Lisa Loud"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-03-05%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-03-05 - John Digweed",
          "artist": " - 1994-03-05 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-03-12%20-%20DJ%20Professor%2C%20RAF%2C%20DJ%20Pierre.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-03-12 - DJ Professor, RAF, DJ Pierre",
          "artist": " - 1994-03-12 - DJ Professor, RAF, DJ Pierre"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-03-19%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-03-19 - Paul Oakenfold",
          "artist": " - 1994-03-19 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-03-26%20-%20Brothers%20in%20Rhythm.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-03-26 - Brothers in Rhythm",
          "artist": " - 1994-03-26 - Brothers in Rhythm"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-04-02%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-04-02 - Pete Tong",
          "artist": " - 1994-04-02 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-04-09%20-%20Alistair%20Whitehead.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-04-09 - Alistair Whitehead",
          "artist": " - 1994-04-09 - Alistair Whitehead"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-04-16%20-%20X-Press%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-04-16 - X-Press 2",
          "artist": " - 1994-04-16 - X-Press 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-04-23%20-%20Sure%20Is%20Pure.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-04-23 - Sure Is Pure",
          "artist": " - 1994-04-23 - Sure Is Pure"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-04-30%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-04-30 - Slam",
          "artist": " - 1994-04-30 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-05-07%20-%20Al%20McKenzie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-05-07 - Al McKenzie",
          "artist": " - 1994-05-07 - Al McKenzie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-05-15%20-%20Future%20Sound%20of%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-05-15 - Future Sound of London",
          "artist": " - 1994-05-15 - Future Sound of London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-05-21%20-%20Judge%20Jules%20%26%20Dave%20Lambert.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-05-21 - Judge Jules & Dave Lambert",
          "artist": " - 1994-05-21 - Judge Jules & Dave Lambert"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-05-28%20-%20Billy%20Nasty.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-05-28 - Billy Nasty",
          "artist": " - 1994-05-28 - Billy Nasty"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-06-04%20-%20Jeremy%20Healey.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-06-04 - Jeremy Healey",
          "artist": " - 1994-06-04 - Jeremy Healey"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-06-04%20-%20Jeremy%20Healy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-06-04 - Jeremy Healy",
          "artist": " - 1994-06-04 - Jeremy Healy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-06-11%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-06-11 - Dave Clarke",
          "artist": " - 1994-06-11 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-06-18%20-%20Danny%20D.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-06-18 - Danny D",
          "artist": " - 1994-06-18 - Danny D"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-06-25%20-%20Laurent%20Garnier.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-06-25 - Laurent Garnier",
          "artist": " - 1994-06-25 - Laurent Garnier"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-07-02%20-%20Terry%20Farley%20and%20Pete%20Heller%20Junior%20Boys%20Own.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-07-02 - Terry Farley and Pete Heller Junior Boys Own",
          "artist": " - 1994-07-02 - Terry Farley and Pete Heller Junior Boys Own"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-07-09%20-%20Darren%20Emerson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-07-09 - Darren Emerson",
          "artist": " - 1994-07-09 - Darren Emerson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-07-16%20-%20Jon%20Pleased%20Wimmin.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-07-16 - Jon Pleased Wimmin",
          "artist": " - 1994-07-16 - Jon Pleased Wimmin"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-07-23%20-%20Moby.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-07-23 - Moby",
          "artist": " - 1994-07-23 - Moby"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-07-30%20-%20Patrick%20Smoove.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-07-30 - Patrick Smoove",
          "artist": " - 1994-07-30 - Patrick Smoove"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-08-06%20-%20Leftfield.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-08-06 - Leftfield",
          "artist": " - 1994-08-06 - Leftfield"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-08-13%20-%20Trannies%20With%20Attitude.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-08-13 - Trannies With Attitude",
          "artist": " - 1994-08-13 - Trannies With Attitude"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-08-27%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-08-27 - Norman Jay",
          "artist": " - 1994-08-27 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-09-04%20-%20Laurent%20Garnier.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-09-04 - Laurent Garnier",
          "artist": " - 1994-09-04 - Laurent Garnier"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-09-11%20-%20DJ%20Dimitri%20from%20Deee-Lite.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-09-11 - DJ Dimitri from Deee-Lite",
          "artist": " - 1994-09-11 - DJ Dimitri from Deee-Lite"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-09-18%20-%20Tino%20Lugano%20Simon%20Gibb%20Colin%20Patterson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-09-18 - Tino Lugano Simon Gibb Colin Patterson",
          "artist": " - 1994-09-18 - Tino Lugano Simon Gibb Colin Patterson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-09-25%20-%20Judge%20Jules%2C%20Ibiza%20Special.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-09-25 - Judge Jules, Ibiza Special",
          "artist": " - 1994-09-25 - Judge Jules, Ibiza Special"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-02%20-%20Danny%20Rampling.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-02 - Danny Rampling",
          "artist": " - 1994-10-02 - Danny Rampling"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-09%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-09 - Carl Cox",
          "artist": " - 1994-10-09 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-16%20-%20Danny%20Tenaglia%280%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-16 - Danny Tenaglia(0)",
          "artist": " - 1994-10-16 - Danny Tenaglia(0)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-16%20-%20Danny%20Tenaglia.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-16 - Danny Tenaglia",
          "artist": " - 1994-10-16 - Danny Tenaglia"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-23%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-23 - Pete Tong",
          "artist": " - 1994-10-23 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-10-30%20-%20Chris%20and%20James.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-10-30 - Chris and James",
          "artist": " - 1994-10-30 - Chris and James"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-11-06%20-%20CJ%20Bolland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-11-06 - CJ Bolland",
          "artist": " - 1994-11-06 - CJ Bolland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-11-13%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-11-13 - Dave Clarke",
          "artist": " - 1994-11-13 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-11-20%20-%20Dave%20Angel.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-11-20 - Dave Angel",
          "artist": " - 1994-11-20 - Dave Angel"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-11-27%20-%20CJ%20Mackintosh%20and%20Harvey.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-11-27 - CJ Mackintosh and Harvey",
          "artist": " - 1994-11-27 - CJ Mackintosh and Harvey"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-12-04%20-%20Future%20Sound%20of%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-12-04 - Future Sound of London",
          "artist": " - 1994-12-04 - Future Sound of London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-12-11%20-%20Massive%20Attack.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-12-11 - Massive Attack",
          "artist": " - 1994-12-11 - Massive Attack"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201994-12-18%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1994-12-18 - Paul Oakenfold",
          "artist": " - 1994-12-18 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-01-08%20-%20Tony%20De%20Vit.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-08 - Tony De Vit",
          "artist": " - 1995-08 - Tony De Vit"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-01-15%20-%20DJ%20Ron.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-15 - DJ Ron",
          "artist": " - 1995-15 - DJ Ron"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-01-22%20-%20Joe%20T%20Vanelli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-22 - Joe T Vanelli",
          "artist": " - 1995-22 - Joe T Vanelli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-01-29%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-29 - Dave Clarke",
          "artist": " - 1995-29 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-02-05%20-%20E-Smoove.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-02-05 - E-Smoove",
          "artist": " - 1995-02-05 - E-Smoove"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-02-12%20-%20Gilles%20Peterson%2C%20DJ%20Krush%2C%20and%20UFO.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-02-12 - Gilles Peterson, DJ Krush, and UFO",
          "artist": " - 1995-02-12 - Gilles Peterson, DJ Krush, and UFO"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-02-19%20-%20Evil%20Eddie%20Richards.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-02-19 - Evil Eddie Richards",
          "artist": " - 1995-02-19 - Evil Eddie Richards"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-02-26%20-%20Tall%20Paul.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-02-26 - Tall Paul",
          "artist": " - 1995-02-26 - Tall Paul"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-03-05%20-%20Chemical%20Brothers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-03-05 - Chemical Brothers",
          "artist": " - 1995-03-05 - Chemical Brothers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-03-12%20-%20Lisa%20Loud.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-03-12 - Lisa Loud",
          "artist": " - 1995-03-12 - Lisa Loud"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-03-26%20-%20Paul%20Bleasdale%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-03-26 - Paul Bleasdale and Pete Tong",
          "artist": " - 1995-03-26 - Paul Bleasdale and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-04-02%20-%20Justin%20Robertson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-04-02 - Justin Robertson",
          "artist": " - 1995-04-02 - Justin Robertson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-04-09%20-%20Dimitri%20from%20Paris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-04-09 - Dimitri from Paris",
          "artist": " - 1995-04-09 - Dimitri from Paris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-04-16%20-%20MK.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-04-16 - MK",
          "artist": " - 1995-04-16 - MK"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-04-23%20-%20Portishead.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-04-23 - Portishead",
          "artist": " - 1995-04-23 - Portishead"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-04-30%20-%20Gordon%20Kaye.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-04-30 - Gordon Kaye",
          "artist": " - 1995-04-30 - Gordon Kaye"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-05-07%20-%20Snap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-05-07 - Snap",
          "artist": " - 1995-05-07 - Snap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-05-09%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-05-09 - Carl Cox",
          "artist": " - 1995-05-09 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-05-21%20-%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-05-21 - Sasha",
          "artist": " - 1995-05-21 - Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-05-28%20-%20Paul%20Oakenfold%2C%20Danny%20Rampling%2C%20Sasha%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-05-28 - Paul Oakenfold, Danny Rampling, Sasha, Pete Tong",
          "artist": " - 1995-05-28 - Paul Oakenfold, Danny Rampling, Sasha, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-06-04%20-%20Future%20Sound%20of%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-06-04 - Future Sound of London",
          "artist": " - 1995-06-04 - Future Sound of London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-06-11%20-%20Eric%20Powell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-06-11 - Eric Powell",
          "artist": " - 1995-06-11 - Eric Powell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-06-18%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-06-18 - David Holmes",
          "artist": " - 1995-06-18 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-06-25%20-%20Danny%20Rampling.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-06-25 - Danny Rampling",
          "artist": " - 1995-06-25 - Danny Rampling"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-07-02%20-%20Nicky%20Holloway.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-07-02 - Nicky Holloway",
          "artist": " - 1995-07-02 - Nicky Holloway"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-07-09%20-%20Terry%20Farley%20and%20Pete%20Heller%20%28Junior%20Boys%20Own%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-07-09 - Terry Farley and Pete Heller (Junior Boys Own)",
          "artist": " - 1995-07-09 - Terry Farley and Pete Heller (Junior Boys Own)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-07-16%20-%20LTJ%20Bukem%20and%20MC%20Conrad.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-07-16 - LTJ Bukem and MC Conrad",
          "artist": " - 1995-07-16 - LTJ Bukem and MC Conrad"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-07-23%20-%20Roger%20Sanchez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-07-23 - Roger Sanchez",
          "artist": " - 1995-07-23 - Roger Sanchez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-07-30%20-%20Luvdup.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-07-30 - Luvdup",
          "artist": " - 1995-07-30 - Luvdup"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-08-06%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-08-06 - Judge Jules",
          "artist": " - 1995-08-06 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-08-13%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-08-13 - Pete Tong",
          "artist": " - 1995-08-13 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-08-20%20-%20Nick%20Warren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-08-20 - Nick Warren",
          "artist": " - 1995-08-20 - Nick Warren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-08-27%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-08-27 - Norman Jay",
          "artist": " - 1995-08-27 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-09-03%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-09-03 - John Digweed",
          "artist": " - 1995-09-03 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-09-10%20-%20Jose%20Padilla%20at%20Cafe%20Del%20Mar%20in%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-09-10 - Jose Padilla at Cafe Del Mar in Ibiza",
          "artist": " - 1995-09-10 - Jose Padilla at Cafe Del Mar in Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-09-17%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-09-17 - Paul Oakenfold",
          "artist": " - 1995-09-17 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-09-24%20-%20BT.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-09-24 - BT",
          "artist": " - 1995-09-24 - BT"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-10-01%20-%20Carl%20Craig.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-10-01 - Carl Craig",
          "artist": " - 1995-10-01 - Carl Craig"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-10-07%20-%20A%20Guy%20Called%20Gerald.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-10-07 - A Guy Called Gerald",
          "artist": " - 1995-10-07 - A Guy Called Gerald"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-10-14%20-%20Danny%20Rampling%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-10-14 - Danny Rampling and Pete Tong",
          "artist": " - 1995-10-14 - Danny Rampling and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-10-21%20-%20DJ%20Camacho.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-10-21 - DJ Camacho",
          "artist": " - 1995-10-21 - DJ Camacho"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-10-28%20-%20John%20Digweed%2C%20Paul%20Bleasdale%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-10-28 - John Digweed, Paul Bleasdale and Pete Tong",
          "artist": " - 1995-10-28 - John Digweed, Paul Bleasdale and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-11-04%20-%20Paul%20Oakenfold%20Sasha%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-11-04 - Paul Oakenfold Sasha Pete Tong",
          "artist": " - 1995-11-04 - Paul Oakenfold Sasha Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-11-11%20-%20David%20Morales.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-11-11 - David Morales",
          "artist": " - 1995-11-11 - David Morales"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-11-18%20-%20Laurent%20Garnier.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-11-18 - Laurent Garnier",
          "artist": " - 1995-11-18 - Laurent Garnier"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-11-25%20-%20Sasha%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-11-25 - Sasha and Pete Tong",
          "artist": " - 1995-11-25 - Sasha and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-12-02%20-%20Jeremy%20Healy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-12-02 - Jeremy Healy",
          "artist": " - 1995-12-02 - Jeremy Healy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-12-09%20-%20Tall%20Paul%20Grace%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-12-09 - Tall Paul Grace Pete Tong",
          "artist": " - 1995-12-09 - Tall Paul Grace Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-12-17%20-%20John%20Kelly.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-12-17 - John Kelly",
          "artist": " - 1995-12-17 - John Kelly"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201995-12-23%20-%20Danny%20Rampling%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1995-12-23 - Danny Rampling and Pete Tong",
          "artist": " - 1995-12-23 - Danny Rampling and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-01%20-%20DJ%20Tinman%20%28Paul%20De%20Kane%29%2C%20The%20Best%20Tunes%20of%201995.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-01 - DJ Tinman (Paul De Kane), The Best Tunes of 1995",
          "artist": " - 1996-01 - DJ Tinman (Paul De Kane), The Best Tunes of 1995"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-01%20-%20DJ%20Tinman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-01 - DJ Tinman",
          "artist": " - 1996-01 - DJ Tinman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-07%20-%20Tall%20Paul.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-07 - Tall Paul",
          "artist": " - 1996-07 - Tall Paul"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-14%20-%20Dave%20Seaman%20%28incomplete%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-14 - Dave Seaman (incomplete)",
          "artist": " - 1996-14 - Dave Seaman (incomplete)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-21%20-%20Armand%20Van%20Helden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-21 - Armand Van Helden",
          "artist": " - 1996-21 - Armand Van Helden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-01-28%20-%20Boy%20George%2C%20Paul%20Bleasdale%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-28 - Boy George, Paul Bleasdale and Pete Tong",
          "artist": " - 1996-28 - Boy George, Paul Bleasdale and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-02-04%20-%20Underworld.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-02-04 - Underworld",
          "artist": " - 1996-02-04 - Underworld"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-02-11%20-%20Stacey%20Pullen.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-02-11 - Stacey Pullen",
          "artist": " - 1996-02-11 - Stacey Pullen"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-02-18%20-%20Gusto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-02-18 - Gusto",
          "artist": " - 1996-02-18 - Gusto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-02-25%20-%20Ralph%20Lawson%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-02-25 - Ralph Lawson and Pete Tong",
          "artist": " - 1996-02-25 - Ralph Lawson and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-03-03%20-%20Joey%20Negro.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-03-03 - Joey Negro",
          "artist": " - 1996-03-03 - Joey Negro"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-03-10%20-%20Pete%20Wardman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-03-10 - Pete Wardman",
          "artist": " - 1996-03-10 - Pete Wardman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-03-17%20-%20Billy%20Nasty.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-03-17 - Billy Nasty",
          "artist": " - 1996-03-17 - Billy Nasty"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-03-24%20-%20LTJ%20Bukem%20and%20MC%20Conrad.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-03-24 - LTJ Bukem and MC Conrad",
          "artist": " - 1996-03-24 - LTJ Bukem and MC Conrad"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-03-31%20-%20Pete%20Bromley%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-03-31 - Pete Bromley and Pete Tong",
          "artist": " - 1996-03-31 - Pete Bromley and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-04-07%20-%20Angel%20Moraes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-04-07 - Angel Moraes",
          "artist": " - 1996-04-07 - Angel Moraes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-04-14%20-%20Trannies%20with%20Attitude%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-04-14 - Trannies with Attitude and Pete Tong",
          "artist": " - 1996-04-14 - Trannies with Attitude and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-04-21%20-%20Daniel%20Davoli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-04-21 - Daniel Davoli",
          "artist": " - 1996-04-21 - Daniel Davoli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-04-28%20-%20Goldie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-04-28 - Goldie",
          "artist": " - 1996-04-28 - Goldie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-05-12%20-%20Tim%20Lennox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-05-12 - Tim Lennox",
          "artist": " - 1996-05-12 - Tim Lennox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-05-19%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-05-19 - Carl Cox",
          "artist": " - 1996-05-19 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-05-26%20-%20Norman%20Cook.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-05-26 - Norman Cook",
          "artist": " - 1996-05-26 - Norman Cook"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-02%20-%20Snap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-02 - Snap",
          "artist": " - 1996-06-02 - Snap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-09%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-09 - Slam",
          "artist": " - 1996-06-09 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-16%20-%20Erick%20Morillo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-16 - Erick Morillo",
          "artist": " - 1996-06-16 - Erick Morillo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-23%20-%20Brothers%20in%20Rhythm.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-23 - Brothers in Rhythm",
          "artist": " - 1996-06-23 - Brothers in Rhythm"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-23%20-%20Dave%20Seaman%20and%20Steve%20Anderson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-23 - Dave Seaman and Steve Anderson",
          "artist": " - 1996-06-23 - Dave Seaman and Steve Anderson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-06-30%20-%20Sasha%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-06-30 - Sasha and Pete Tong",
          "artist": " - 1996-06-30 - Sasha and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-07-07%20-%20Johnny%20Vicious.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-07-07 - Johnny Vicious",
          "artist": " - 1996-07-07 - Johnny Vicious"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-07-14%20-%20Stretch%20N%20Vern.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-07-14 - Stretch N Vern",
          "artist": " - 1996-07-14 - Stretch N Vern"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-07-21%20-%20John%20Digweed%2C%20Blue%20Amazon%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-07-21 - John Digweed, Blue Amazon, Pete Tong",
          "artist": " - 1996-07-21 - John Digweed, Blue Amazon, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-07-28%20-%20Sasha%2C%20Danny%20Rampling%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-07-28 - Sasha, Danny Rampling, Pete Tong",
          "artist": " - 1996-07-28 - Sasha, Danny Rampling, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-04%20-%20Chemical%20Brothers%20Jon%20Carter%20Richard%20Fearless.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-04 - Chemical Brothers Jon Carter Richard Fearless",
          "artist": " - 1996-08-04 - Chemical Brothers Jon Carter Richard Fearless"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-04%20-%20Jon%20Carter%20and%20Richard%20Fearless.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-04 - Jon Carter and Richard Fearless",
          "artist": " - 1996-08-04 - Jon Carter and Richard Fearless"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-11%20-%20Lee%20Fisher%20and%20Jools.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-11 - Lee Fisher and Jools",
          "artist": " - 1996-08-11 - Lee Fisher and Jools"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-18%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-18 - Norman Jay",
          "artist": " - 1996-08-18 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-25%20-%20LTJ%20Bukem%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-25 - LTJ Bukem and Pete Tong",
          "artist": " - 1996-08-25 - LTJ Bukem and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-08-25%20-%20LTJ%20Bukem%20at%20Creamfield%2C%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-08-25 - LTJ Bukem at Creamfield, Liverpool",
          "artist": " - 1996-08-25 - LTJ Bukem at Creamfield, Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-09-01%20-%20Derrick%20Carter.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-09-01 - Derrick Carter",
          "artist": " - 1996-09-01 - Derrick Carter"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-09-08%20-%20Paul%20Trouble%20Anderson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-09-08 - Paul Trouble Anderson",
          "artist": " - 1996-09-08 - Paul Trouble Anderson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-09-15%20-%20Howie%20B.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-09-15 - Howie B",
          "artist": " - 1996-09-15 - Howie B"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-09-22%20-%20DJ%20Griff%20and%20Alfredo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-09-22 - DJ Griff and Alfredo",
          "artist": " - 1996-09-22 - DJ Griff and Alfredo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-09-29%20-%20Mark%20Keys%2C%20Claudio%20Coccoluto%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-09-29 - Mark Keys, Claudio Coccoluto, Pete Tong",
          "artist": " - 1996-09-29 - Mark Keys, Claudio Coccoluto, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-10-06%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-10-06 - Judge Jules",
          "artist": " - 1996-10-06 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-10-13%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-10-13 - Paul Oakenfold",
          "artist": " - 1996-10-13 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-10-20%20-%20The%20Play%20Boys.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-10-20 - The Play Boys",
          "artist": " - 1996-10-20 - The Play Boys"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-10-27%20-%20Andrew%20Weatherall.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-10-27 - Andrew Weatherall",
          "artist": " - 1996-10-27 - Andrew Weatherall"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-11-03%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-11-03 - Carl Cox",
          "artist": " - 1996-11-03 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-11-10%20-%20Steve%20Bridger.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-11-10 - Steve Bridger",
          "artist": " - 1996-11-10 - Steve Bridger"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-11-17%20-%20Nicky%20Holloway%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-11-17 - Nicky Holloway and Pete Tong",
          "artist": " - 1996-11-17 - Nicky Holloway and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-11-24%20-%20Smith%20and%20Mighty.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-11-24 - Smith and Mighty",
          "artist": " - 1996-11-24 - Smith and Mighty"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-01%20-%20Nick%20Warren%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-01 - Nick Warren and Pete Tong",
          "artist": " - 1996-12-01 - Nick Warren and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-08%20-%20Graeme%20Park.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-08 - Graeme Park",
          "artist": " - 1996-12-08 - Graeme Park"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-15%20-%20The%20Psychonauts.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-15 - The Psychonauts",
          "artist": " - 1996-12-15 - The Psychonauts"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-22%20-%20Jermey%20Healy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-22 - Jermey Healy",
          "artist": " - 1996-12-22 - Jermey Healy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-29%20-%20Rhythm%20Masters.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-29 - Rhythm Masters",
          "artist": " - 1996-12-29 - Rhythm Masters"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201996-12-31%20-%20Carl%20Cox%2C%20James%20Barton%2C%20Jose%20Padilla%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1996-12-31 - Carl Cox, James Barton, Jose Padilla and Pete Tong",
          "artist": " - 1996-12-31 - Carl Cox, James Barton, Jose Padilla and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-01-05%20-%20The%20Wiseguys%20and%20Derek%20Dahlarge.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05 - The Wiseguys and Derek Dahlarge",
          "artist": " - 1997-05 - The Wiseguys and Derek Dahlarge"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-01-12%20-%20Doc%20Martin.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12 - Doc Martin",
          "artist": " - 1997-12 - Doc Martin"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-01-19%20-%20Alex%20P%20and%20Brandon%20Block.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-19 - Alex P and Brandon Block",
          "artist": " - 1997-19 - Alex P and Brandon Block"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-01-26%20-%20Grooverider.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-26 - Grooverider",
          "artist": " - 1997-26 - Grooverider"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-02-02%20-%20Marshal%20Jefferson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-02-02 - Marshal Jefferson",
          "artist": " - 1997-02-02 - Marshal Jefferson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-02-09%20-%20Scott%20Hardkiss.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-02-09 - Scott Hardkiss",
          "artist": " - 1997-02-09 - Scott Hardkiss"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-02-16%20-%20Masters%20at%20Work.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-02-16 - Masters at Work",
          "artist": " - 1997-02-16 - Masters at Work"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-02-23%20-%20Nick%20Warren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-02-23 - Nick Warren",
          "artist": " - 1997-02-23 - Nick Warren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-02%20-%20Daft%20Punk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-02 - Daft Punk",
          "artist": " - 1997-03-02 - Daft Punk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-09%20-%20Ashley%20Beedle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-09 - Ashley Beedle",
          "artist": " - 1997-03-09 - Ashley Beedle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-15%20-%20Seb%20Fontaine%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-15 - Seb Fontaine and Pete Tong",
          "artist": " - 1997-03-15 - Seb Fontaine and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-16%20-%20Dj%20Sneak.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-16 - Dj Sneak",
          "artist": " - 1997-03-16 - Dj Sneak"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-23%20-%20Murk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-23 - Murk",
          "artist": " - 1997-03-23 - Murk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-03-30%20-%20Matthew%20Roberts.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-03-30 - Matthew Roberts",
          "artist": " - 1997-03-30 - Matthew Roberts"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-04-06%20-%20Sven%20Vath.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-04-06 - Sven Vath",
          "artist": " - 1997-04-06 - Sven Vath"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-04-13%20-%20Mrs%20Wood.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-04-13 - Mrs Wood",
          "artist": " - 1997-04-13 - Mrs Wood"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-04-20%20-%20Paul%20Van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-04-20 - Paul Van Dyk",
          "artist": " - 1997-04-20 - Paul Van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-04-27%20-%20Alistair%20Whitehead%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-04-27 - Alistair Whitehead and Pete Tong",
          "artist": " - 1997-04-27 - Alistair Whitehead and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-04%20-%20Jonny%20L.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-04 - Jonny L",
          "artist": " - 1997-05-04 - Jonny L"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-05%20-%20Junior%20Vasquez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-05 - Junior Vasquez",
          "artist": " - 1997-05-05 - Junior Vasquez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-11%20-%20Fathers%20of%20Sound.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-11 - Fathers of Sound",
          "artist": " - 1997-05-11 - Fathers of Sound"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-18%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-18 - Dave Clarke",
          "artist": " - 1997-05-18 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-24%20-%20DJ%20Sneak%2C%20Kraftwerk%20and%20Pete%20Tong%20from%20Tribal%20Gathering%2C%20Luton.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-24 - DJ Sneak, Kraftwerk and Pete Tong from Tribal Gathering, Luton",
          "artist": " - 1997-05-24 - DJ Sneak, Kraftwerk and Pete Tong from Tribal Gathering, Luton"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-05-25%20-%20Sneaker%20Pimps%2C%20Justin%20Robertson%2C%20DJ%20Sneak%2C%20Kraftwerk%2C%20Paul%20Oakenfold%2C%20Way%20Out%20West.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-05-25 - Sneaker Pimps, Justin Robertson, DJ Sneak, Kraftwerk, Paul Oakenfold, Way Out West",
          "artist": " - 1997-05-25 - Sneaker Pimps, Justin Robertson, DJ Sneak, Kraftwerk, Paul Oakenfold, Way Out West"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-01%20-%20Force%20and%20Styles.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-01 - Force and Styles",
          "artist": " - 1997-06-01 - Force and Styles"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-08%20-%20Tasha%20Killer%20Pussies.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-08 - Tasha Killer Pussies",
          "artist": " - 1997-06-08 - Tasha Killer Pussies"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-15%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-15 - David Holmes",
          "artist": " - 1997-06-15 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-22%20-%20Roni%20Size.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-22 - Roni Size",
          "artist": " - 1997-06-22 - Roni Size"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-28%20-%20Armand%20Van%20Helden%2C%20Glastonbury%20Festival.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-28 - Armand Van Helden, Glastonbury Festival",
          "artist": " - 1997-06-28 - Armand Van Helden, Glastonbury Festival"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-28%20-%20Chemical%20Brothers%2C%20Glastonbury%20Festival.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-28 - Chemical Brothers, Glastonbury Festival",
          "artist": " - 1997-06-28 - Chemical Brothers, Glastonbury Festival"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-06-28%20-%20The%20Prodigy%2C%20Glastonbury%20Festival.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-06-28 - The Prodigy, Glastonbury Festival",
          "artist": " - 1997-06-28 - The Prodigy, Glastonbury Festival"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-07-06%20-%20Boy%20George%20Paul%20Oakenfold%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-07-06 - Boy George Paul Oakenfold Pete Tong",
          "artist": " - 1997-07-06 - Boy George Paul Oakenfold Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-07-13%20-%20Dimitri%20from%20Paris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-07-13 - Dimitri from Paris",
          "artist": " - 1997-07-13 - Dimitri from Paris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-07-20%20-%20Orbital%2C%20Bently%20Rhythm%20Ace%2C%20Seb%20Fontaine%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-07-20 - Orbital, Bently Rhythm Ace, Seb Fontaine, Pete Tong",
          "artist": " - 1997-07-20 - Orbital, Bently Rhythm Ace, Seb Fontaine, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-07-27%20-%20Jose%20Padilla.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-07-27 - Jose Padilla",
          "artist": " - 1997-07-27 - Jose Padilla"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-08-03%20-%20Timmy%20S.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-08-03 - Timmy S",
          "artist": " - 1997-08-03 - Timmy S"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-08-17%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-08-17 - Judge Jules",
          "artist": " - 1997-08-17 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-08-24%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-08-24 - Norman Jay",
          "artist": " - 1997-08-24 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-08-31%20-%20Felix%20Da%20Housecat.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-08-31 - Felix Da Housecat",
          "artist": " - 1997-08-31 - Felix Da Housecat"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-09-14%20-%20Lisa%20Loud%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-09-14 - Lisa Loud and Pete Tong",
          "artist": " - 1997-09-14 - Lisa Loud and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-09-21%20-%20BT.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-09-21 - BT",
          "artist": " - 1997-09-21 - BT"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-09-28%20-%20Colin%20Hamilton%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-09-28 - Colin Hamilton and Pete Tong",
          "artist": " - 1997-09-28 - Colin Hamilton and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-10-05%20-%20Adam%20Freeland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-10-05 - Adam Freeland",
          "artist": " - 1997-10-05 - Adam Freeland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-10-19%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-10-19 - Paul Oakenfold",
          "artist": " - 1997-10-19 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-10-26%20-%20Carl%20Tuff%20Enuff%20Brown%20and%20Mat%20Jam%20Lamont.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-10-26 - Carl Tuff Enuff Brown and Mat Jam Lamont",
          "artist": " - 1997-10-26 - Carl Tuff Enuff Brown and Mat Jam Lamont"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-11-02%20-%20Paul%20Van%20Dyk%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-11-02 - Paul Van Dyk and Pete Tong",
          "artist": " - 1997-11-02 - Paul Van Dyk and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-11-09%20-%20Carl%20Cox%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-11-09 - Carl Cox and Pete Tong",
          "artist": " - 1997-11-09 - Carl Cox and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-11-16%20-%20Basement%20Jaxx.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-11-16 - Basement Jaxx",
          "artist": " - 1997-11-16 - Basement Jaxx"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-11-23%20-%20Justin%20Robertson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-11-23 - Justin Robertson",
          "artist": " - 1997-11-23 - Justin Robertson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-11-30%20-%20Nick%20Warren%20and%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-11-30 - Nick Warren and Paul Oakenfold",
          "artist": " - 1997-11-30 - Nick Warren and Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-07%20-%20Blue%20Peter.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-07 - Blue Peter",
          "artist": " - 1997-12-07 - Blue Peter"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-14%20-%20Seb%20Fontaine%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-14 - Seb Fontaine and Pete Tong",
          "artist": " - 1997-12-14 - Seb Fontaine and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-21%20-%20Gilles%20Peterson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-21 - Gilles Peterson",
          "artist": " - 1997-12-21 - Gilles Peterson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-25%20-%20Dreem%20Teem.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-25 - Dreem Teem",
          "artist": " - 1997-12-25 - Dreem Teem"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-28%20-%20Photek.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-28 - Photek",
          "artist": " - 1997-12-28 - Photek"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201997-12-31%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1997-12-31 - David Holmes",
          "artist": " - 1997-12-31 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-01-01%20-%20Todd%20Terry%20Eddie%20Baez%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-01 - Todd Terry Eddie Baez Pete Tong",
          "artist": " - 1998-01 - Todd Terry Eddie Baez Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-01-04%20-%20Phil%20Perry.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-04 - Phil Perry",
          "artist": " - 1998-04 - Phil Perry"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-01-11%20-%20Danny%20Howells.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11 - Danny Howells",
          "artist": " - 1998-11 - Danny Howells"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-01-18%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-18 - Carl Cox",
          "artist": " - 1998-18 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-01-25%20-%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-25 - Seb Fontaine",
          "artist": " - 1998-25 - Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-02-01%20-%20Freddie%20Fresh.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-02-01 - Freddie Fresh",
          "artist": " - 1998-02-01 - Freddie Fresh"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-02-08%20-%20Freestylers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-02-08 - Freestylers",
          "artist": " - 1998-02-08 - Freestylers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-02-15%20-%20Ian%20Pooley.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-02-15 - Ian Pooley",
          "artist": " - 1998-02-15 - Ian Pooley"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-02-22%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-02-22 - Carl Cox",
          "artist": " - 1998-02-22 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-03-01%20-%20DJ%20Paulette.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-03-01 - DJ Paulette",
          "artist": " - 1998-03-01 - DJ Paulette"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-03-08%20-%20Air.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-03-08 - Air",
          "artist": " - 1998-03-08 - Air"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-03-15%20-%20Air.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-03-15 - Air",
          "artist": " - 1998-03-15 - Air"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-03-22%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-03-22 - Pete Tong",
          "artist": " - 1998-03-22 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-04-05%20-%20Terry%20Francis.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-04-05 - Terry Francis",
          "artist": " - 1998-04-05 - Terry Francis"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-04-12%20-%20Judge%20Jules%20and%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-04-12 - Judge Jules and John Digweed",
          "artist": " - 1998-04-12 - Judge Jules and John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-04-19%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-04-19 - Carl Cox",
          "artist": " - 1998-04-19 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-04-26%20-%20Craig%20and%20Huggy%20Burger%20Queen.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-04-26 - Craig and Huggy Burger Queen",
          "artist": " - 1998-04-26 - Craig and Huggy Burger Queen"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-02%20-%20Paul%20Oakenfold%2C%20Sasha%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-02 - Paul Oakenfold, Sasha and Pete Tong",
          "artist": " - 1998-05-02 - Paul Oakenfold, Sasha and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-10%20-%20Ashley%20Beedle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-10 - Ashley Beedle",
          "artist": " - 1998-05-10 - Ashley Beedle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-14%20-%20Carl%20Cox%20from%20Club%20Astra%2C%20Amsterdam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-14 - Carl Cox from Club Astra, Amsterdam",
          "artist": " - 1998-05-14 - Carl Cox from Club Astra, Amsterdam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-17%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-17 - Carl Cox",
          "artist": " - 1998-05-17 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-24%20-%20Scott%20Bond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-24 - Scott Bond",
          "artist": " - 1998-05-24 - Scott Bond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-05-31%20-%20DJ%20Harvey.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-05-31 - DJ Harvey",
          "artist": " - 1998-05-31 - DJ Harvey"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-06-07%20-%20Jeff%20Mills.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-06-07 - Jeff Mills",
          "artist": " - 1998-06-07 - Jeff Mills"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-06-14%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-06-14 - Carl Cox",
          "artist": " - 1998-06-14 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-06-21%20-%20Judge%20Jules%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-06-21 - Judge Jules and Pete Tong",
          "artist": " - 1998-06-21 - Judge Jules and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-06-21%20-%20Paul%20Oakenfold%2C%20Judge%20Jules%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-06-21 - Paul Oakenfold, Judge Jules, Pete Tong",
          "artist": " - 1998-06-21 - Paul Oakenfold, Judge Jules, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-06-28%20-%20Billy%20Nasty%20and%20Darren%20Emerson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-06-28 - Billy Nasty and Darren Emerson",
          "artist": " - 1998-06-28 - Billy Nasty and Darren Emerson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-07-12%20-%20Deep%20Dish.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-07-12 - Deep Dish",
          "artist": " - 1998-07-12 - Deep Dish"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-07-19%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-07-19 - Carl Cox",
          "artist": " - 1998-07-19 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-07-26%20-%20The%20Man%20With%20No%20Name.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-07-26 - The Man With No Name",
          "artist": " - 1998-07-26 - The Man With No Name"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-08-02%20-%20Danny%20Rampling%2C%20Judge%20Jules%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-08-02 - Danny Rampling, Judge Jules, Pete Tong",
          "artist": " - 1998-08-02 - Danny Rampling, Judge Jules, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-08-09%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-08-09 - Carl Cox",
          "artist": " - 1998-08-09 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-08-16%20-%20Full%20Intention.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-08-16 - Full Intention",
          "artist": " - 1998-08-16 - Full Intention"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-08-23%20-%20DJ%20Dan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-08-23 - DJ Dan",
          "artist": " - 1998-08-23 - DJ Dan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-08-30%20-%20Jon%20Carter%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-08-30 - Jon Carter and Pete Tong",
          "artist": " - 1998-08-30 - Jon Carter and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-09-06%20-%20187%20Lockdown.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-09-06 - 187 Lockdown",
          "artist": " - 1998-09-06 - 187 Lockdown"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-09-13%20-%20DJ%20Rap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-09-13 - DJ Rap",
          "artist": " - 1998-09-13 - DJ Rap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-09-20%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-09-20 - Carl Cox",
          "artist": " - 1998-09-20 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-09-27%20-%20DJ%20Sonique%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-09-27 - DJ Sonique and Pete Tong",
          "artist": " - 1998-09-27 - DJ Sonique and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-10-04%20-%20Lottie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-10-04 - Lottie",
          "artist": " - 1998-10-04 - Lottie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-10-11%20-%20Paul%20Oakenfold%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-10-11 - Paul Oakenfold and Pete Tong",
          "artist": " - 1998-10-11 - Paul Oakenfold and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-10-18%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-10-18 - Carl Cox",
          "artist": " - 1998-10-18 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-10-25%20-%20Judge%20Jules%2C%20Danny%20Rampling%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-10-25 - Judge Jules, Danny Rampling, Pete Tong",
          "artist": " - 1998-10-25 - Judge Jules, Danny Rampling, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-11-01%20-%20Bob%20Sinclair.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11-01 - Bob Sinclair",
          "artist": " - 1998-11-01 - Bob Sinclair"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-11-08%20-%20Dope%20Smugglaz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11-08 - Dope Smugglaz",
          "artist": " - 1998-11-08 - Dope Smugglaz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-11-15%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11-15 - David Holmes",
          "artist": " - 1998-11-15 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-11-22%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11-22 - Carl Cox",
          "artist": " - 1998-11-22 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-11-29%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-11-29 - Pete Tong",
          "artist": " - 1998-11-29 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-12-06%20-%20Norman%20Cook%20%28Fat%20Boy%20Slim%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-12-06 - Norman Cook (Fat Boy Slim)",
          "artist": " - 1998-12-06 - Norman Cook (Fat Boy Slim)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-12-13%20-%20Ricky%20Morrison%20and%20Fram%20Sidoli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-12-13 - Ricky Morrison and Fram Sidoli",
          "artist": " - 1998-12-13 - Ricky Morrison and Fram Sidoli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-12-20%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-12-20 - Carl Cox",
          "artist": " - 1998-12-20 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-12-27%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-12-27 - Steve Lawler",
          "artist": " - 1998-12-27 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201998-12-31%20-%20Daft%20Punk%20-%20Part%201.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1998-12-31 - Daft Punk - Part 1",
          "artist": " - 1998-12-31 - Daft Punk - Part 1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-01%20-%20Dope%20Smugglaz%2C%20Sasha%2C%20Judge%20Jules%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-01 - Dope Smugglaz, Sasha, Judge Jules and Pete Tong",
          "artist": " - 1999-01 - Dope Smugglaz, Sasha, Judge Jules and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-01%20-%20Sasha%20at%20Alexandria%20Palace.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-01 - Sasha at Alexandria Palace",
          "artist": " - 1999-01 - Sasha at Alexandria Palace"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-03%20-%20Scott%20Bond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-03 - Scott Bond",
          "artist": " - 1999-03 - Scott Bond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-10%20-%20Terry%20Farley%20and%20Pete%20Heller%20%28Junior%20Boys%20Own%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10 - Terry Farley and Pete Heller (Junior Boys Own)",
          "artist": " - 1999-10 - Terry Farley and Pete Heller (Junior Boys Own)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-17%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-17 - Paul Oakenfold",
          "artist": " - 1999-17 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-24%20-%20Carl%20Cox%20at%20Twilo%2C%20New%20york.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-24 - Carl Cox at Twilo, New york",
          "artist": " - 1999-24 - Carl Cox at Twilo, New york"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-01-31%20-%20Cassius.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-31 - Cassius",
          "artist": " - 1999-31 - Cassius"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-02-07%20-%20Ed%20Rush%20and%20Optical.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-02-07 - Ed Rush and Optical",
          "artist": " - 1999-02-07 - Ed Rush and Optical"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-02-14%20-%20Darren%20Emerson%20and%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-02-14 - Darren Emerson and Sasha",
          "artist": " - 1999-02-14 - Darren Emerson and Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-02-21%20-%20Paul%20Oakenfold%20at%20Joni%27s%20in%20Havana%2C%20Cuba.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-02-21 - Paul Oakenfold at Joni's in Havana, Cuba",
          "artist": " - 1999-02-21 - Paul Oakenfold at Joni's in Havana, Cuba"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-02-28%20-%20Carl%20Cox%20and%20Jim%20Masters.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-02-28 - Carl Cox and Jim Masters",
          "artist": " - 1999-02-28 - Carl Cox and Jim Masters"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-03-07%20-%20Mark%20Lewis.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-03-07 - Mark Lewis",
          "artist": " - 1999-03-07 - Mark Lewis"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-03-14%20-%20Murk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-03-14 - Murk",
          "artist": " - 1999-03-14 - Murk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-03-21%20-%20Dave%20Angel.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-03-21 - Dave Angel",
          "artist": " - 1999-03-21 - Dave Angel"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-03-28%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-03-28 - Paul Oakenfold",
          "artist": " - 1999-03-28 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-04-04%20-%20Peter%20Tong%20and%20Paul%20Van%20Dyk%20at%20The%20Gallery%2C%20Turnmills%20%28Cut%20Short%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-04-04 - Peter Tong and Paul Van Dyk at The Gallery, Turnmills (Cut Short)",
          "artist": " - 1999-04-04 - Peter Tong and Paul Van Dyk at The Gallery, Turnmills (Cut Short)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-04-11%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-04-11 - Carl Cox",
          "artist": " - 1999-04-11 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-04-18%20-%20Todd%20Terry.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-04-18 - Todd Terry",
          "artist": " - 1999-04-18 - Todd Terry"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-04-25%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-04-25 - Paul Oakenfold",
          "artist": " - 1999-04-25 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-05-02%20-%20Basement%20Jaxx.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-05-02 - Basement Jaxx",
          "artist": " - 1999-05-02 - Basement Jaxx"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-05-09%20-%20Tall%20Paul.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-05-09 - Tall Paul",
          "artist": " - 1999-05-09 - Tall Paul"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-05-16%20-%20John%20Digweed%2C%20Twilo%20New%20York.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-05-16 - John Digweed, Twilo New York",
          "artist": " - 1999-05-16 - John Digweed, Twilo New York"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-05-23%20-%20Freddy%20Fresh.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-05-23 - Freddy Fresh",
          "artist": " - 1999-05-23 - Freddy Fresh"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-05-30%20-%20Sasha%2C%20Pete%20Tong%20and%20Paul%20Oakenfold%2C%20at%20Homelands%2C%20Winchester.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-05-30 - Sasha, Pete Tong and Paul Oakenfold, at Homelands, Winchester",
          "artist": " - 1999-05-30 - Sasha, Pete Tong and Paul Oakenfold, at Homelands, Winchester"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-06-06%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-06-06 - Carl Cox",
          "artist": " - 1999-06-06 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-06-13%20-%20Erick%20Morillo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-06-13 - Erick Morillo",
          "artist": " - 1999-06-13 - Erick Morillo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-06-20%20-%20Paul%20Oakenfold%2C%20Judge%20Jules%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-06-20 - Paul Oakenfold, Judge Jules, Pete Tong",
          "artist": " - 1999-06-20 - Paul Oakenfold, Judge Jules, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-06-27%20-%20Carl%20Cox%2C%20Live%20at%20Phuture%202000%20Arena%2C%20Gatecrasher%2C%20Leeds.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-06-27 - Carl Cox, Live at Phuture 2000 Arena, Gatecrasher, Leeds",
          "artist": " - 1999-06-27 - Carl Cox, Live at Phuture 2000 Arena, Gatecrasher, Leeds"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-06-27%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-06-27 - Carl Cox",
          "artist": " - 1999-06-27 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-07-04%20-%20The%20Sharp%20Boys.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-07-04 - The Sharp Boys",
          "artist": " - 1999-07-04 - The Sharp Boys"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-07-11%20-%20Darren%20Emerson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-07-11 - Darren Emerson",
          "artist": " - 1999-07-11 - Darren Emerson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-07-18%20-%20Carl%20Cox%20and%20Sven%20Vath.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-07-18 - Carl Cox and Sven Vath",
          "artist": " - 1999-07-18 - Carl Cox and Sven Vath"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-07-25%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-07-25 - Paul Oakenfold",
          "artist": " - 1999-07-25 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-08-01%20-%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-08-01 - Seb Fontaine",
          "artist": " - 1999-08-01 - Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-08-08%20-%20Danny%20Rampling%2C%20Judge%20Jules%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-08-08 - Danny Rampling, Judge Jules, Pete Tong",
          "artist": " - 1999-08-08 - Danny Rampling, Judge Jules, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-08-15%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-08-15 - Carl Cox",
          "artist": " - 1999-08-15 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-08-22%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-08-22 - Carl Cox",
          "artist": " - 1999-08-22 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-08-29%20-%20Seb%20Fontaine%2C%20Paul%20Oakenfold%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-08-29 - Seb Fontaine, Paul Oakenfold and Pete Tong",
          "artist": " - 1999-08-29 - Seb Fontaine, Paul Oakenfold and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-09-05%20-%20Frankie%20Knuckles.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-09-05 - Frankie Knuckles",
          "artist": " - 1999-09-05 - Frankie Knuckles"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-09-12%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-09-12 - Carl Cox",
          "artist": " - 1999-09-12 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-09-19%20-%20Layo%20and%20Bushwacka.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-09-19 - Layo and Bushwacka",
          "artist": " - 1999-09-19 - Layo and Bushwacka"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-09-26%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-09-26 - Paul Oakenfold",
          "artist": " - 1999-09-26 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-10-03%20-%20Nick%20Warren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10-03 - Nick Warren",
          "artist": " - 1999-10-03 - Nick Warren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-10-10%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10-10 - Carl Cox",
          "artist": " - 1999-10-10 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-10-17%20-%20Basement%20Jaxx.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10-17 - Basement Jaxx",
          "artist": " - 1999-10-17 - Basement Jaxx"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-10-24%20-%20Seb%20Fontaine%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10-24 - Seb Fontaine and Pete Tong",
          "artist": " - 1999-10-24 - Seb Fontaine and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-10-31%20-%20Paul%20Oakenfold%20-%20Essential%20Mix%20World%20Tour%20at%20Home%20in%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-10-31 - Paul Oakenfold -  World Tour at Home in London",
          "artist": " - 1999-10-31 - Paul Oakenfold -  World Tour at Home in London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-11-07%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-11-07 - Judge Jules",
          "artist": " - 1999-11-07 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-11-14%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-11-14 - Carl Cox",
          "artist": " - 1999-11-14 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-11-21%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-11-21 - Norman Jay",
          "artist": " - 1999-11-21 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-11-28%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-11-28 - Paul Oakenfold",
          "artist": " - 1999-11-28 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-05%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-05 - Judge Jules",
          "artist": " - 1999-12-05 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-12%20-%20DJ%20Dan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-12 - DJ Dan",
          "artist": " - 1999-12-12 - DJ Dan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-19%20-%20Jim%20Masters.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-19 - Jim Masters",
          "artist": " - 1999-12-19 - Jim Masters"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-26%20-%20DJ%20Harvey.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-26 - DJ Harvey",
          "artist": " - 1999-12-26 - DJ Harvey"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-31%20-%20Cox%2C%20Sasha%2C%20Rampling%2C%20Hamilton%2C%20Pearce%2C%20Fatboy%20Slim%2C%20Jules%2C%20Vasquez%2C%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-31 - Cox, Sasha, Rampling, Hamilton, Pearce, Fatboy Slim, Jules, Vasquez, Oakenfold",
          "artist": " - 1999-12-31 - Cox, Sasha, Rampling, Hamilton, Pearce, Fatboy Slim, Jules, Vasquez, Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-31%20-%20Millenium%20Eve%20Celebration%20-%20Carl%20Cox%20-%20Live%20in%20Honolulu.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-31 - Millenium Eve Celebration - Carl Cox - Live in Honolulu",
          "artist": " - 1999-12-31 - Millenium Eve Celebration - Carl Cox - Live in Honolulu"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-31%20-%20Millenium%20Eve%20Celebration%20-%20Fatboy%20Slim%2C%20Live%20from%20Cream%2C%20in%20Cardiff.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-31 - Millenium Eve Celebration - Fatboy Slim, Live from Cream, in Cardiff",
          "artist": " - 1999-12-31 - Millenium Eve Celebration - Fatboy Slim, Live from Cream, in Cardiff"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-31%20-%20Millenium%20Eve%20Celebration%20-%20Junior%20Vasquez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-31 - Millenium Eve Celebration - Junior Vasquez",
          "artist": " - 1999-12-31 - Millenium Eve Celebration - Junior Vasquez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%201999-12-31%20-%20Millenium%20Eve%20Celebration%20-%20Paul%20Oakenfold%20at%20Home%20in%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 1999-12-31 - Millenium Eve Celebration - Paul Oakenfold at Home in London",
          "artist": " - 1999-12-31 - Millenium Eve Celebration - Paul Oakenfold at Home in London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-01-02%20-%20Mr%20C.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-02 - Mr C",
          "artist": " - 2000-02 - Mr C"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-01-09%20-%20Scott%20Bond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-09 - Scott Bond",
          "artist": " - 2000-09 - Scott Bond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-01-16%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-16 - Dave Clarke",
          "artist": " - 2000-16 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-01-23%20-%20Guy%20Ornadel.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-23 - Guy Ornadel",
          "artist": " - 2000-23 - Guy Ornadel"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-01-30%20-%20Laurent%20Garnier.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-30 - Laurent Garnier",
          "artist": " - 2000-30 - Laurent Garnier"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-02-06%20-%20William%20Orbit.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-02-06 - William Orbit",
          "artist": " - 2000-02-06 - William Orbit"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-02-13%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-02-13 - Paul Oakenfold",
          "artist": " - 2000-02-13 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-02-20%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-02-20 - Carl Cox",
          "artist": " - 2000-02-20 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-02-27%20-%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-02-27 - Sasha",
          "artist": " - 2000-02-27 - Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-03-05%20-%20Pete%20Tong%20%26%20Carl%20Cox%20live%20from%20Golden%27s%208th%20birthday%20%40%20The%20Void.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-03-05 - Pete Tong & Carl Cox live from Golden's 8th birthday @ The Void",
          "artist": " - 2000-03-05 - Pete Tong & Carl Cox live from Golden's 8th birthday @ The Void"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-03-12%20-%20MJ%20Cole.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-03-12 - MJ Cole",
          "artist": " - 2000-03-12 - MJ Cole"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-03-19%20-%20Trevor%20Rockliffe.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-03-19 - Trevor Rockliffe",
          "artist": " - 2000-03-19 - Trevor Rockliffe"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-03-26%20-%20DJ%20Sneak.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-03-26 - DJ Sneak",
          "artist": " - 2000-03-26 - DJ Sneak"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-04-02%20-%20Jazzy%20M%20and%20Nicky%20Holloway.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-04-02 - Jazzy M and Nicky Holloway",
          "artist": " - 2000-04-02 - Jazzy M and Nicky Holloway"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-04-09%20-%20Parks%20and%20Wilson%20%28Tilt%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-04-09 - Parks and Wilson (Tilt)",
          "artist": " - 2000-04-09 - Parks and Wilson (Tilt)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-04-16%20-%20Leftfield.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-04-16 - Leftfield",
          "artist": " - 2000-04-16 - Leftfield"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-04-23%20-%20Paul%20van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-04-23 - Paul van Dyk",
          "artist": " - 2000-04-23 - Paul van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-04-30%20-%20Roger%20Sanchez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-04-30 - Roger Sanchez",
          "artist": " - 2000-04-30 - Roger Sanchez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-06%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-06 - Judge Jules",
          "artist": " - 2000-05-06 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-14%20-%20Stewart%20Rowell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-14 - Stewart Rowell",
          "artist": " - 2000-05-14 - Stewart Rowell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-21%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-21 - Paul Oakenfold",
          "artist": " - 2000-05-21 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-28%20-%20Paul%20van%20Dyk%2C%20at%20Homelands.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-28 - Paul van Dyk, at Homelands",
          "artist": " - 2000-05-28 - Paul van Dyk, at Homelands"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-28%20-%20Pete%20Tong%2C%20at%20Homelands.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-28 - Pete Tong, at Homelands",
          "artist": " - 2000-05-28 - Pete Tong, at Homelands"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-05-28%20-%20Sasha%20and%20Digweed%2C%20at%20Homelands.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-05-28 - Sasha and Digweed, at Homelands",
          "artist": " - 2000-05-28 - Sasha and Digweed, at Homelands"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-06-04%20-%20Rocky.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-06-04 - Rocky",
          "artist": " - 2000-06-04 - Rocky"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-06-11%20-%20Cut%20and%20Paste.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-06-11 - Cut and Paste",
          "artist": " - 2000-06-11 - Cut and Paste"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-06-17%20-%20Judge%20Jules%20at%20Gatecrasher%20Summer%20Soundsystem.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-06-17 - Judge Jules at Gatecrasher Summer Soundsystem",
          "artist": " - 2000-06-17 - Judge Jules at Gatecrasher Summer Soundsystem"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-06-18%20-%20Sasha%20and%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-06-18 - Sasha and Seb Fontaine",
          "artist": " - 2000-06-18 - Sasha and Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-06-25%20-%20Bentley%20Rhythm%20Ace%20Fatboy%20Slim%20Justin%20Robertson%20Artful%20Dodger.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-06-25 - Bentley Rhythm Ace Fatboy Slim Justin Robertson Artful Dodger",
          "artist": " - 2000-06-25 - Bentley Rhythm Ace Fatboy Slim Justin Robertson Artful Dodger"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-02%20-%20The%20Sharp%20Boys%20and%20Alan%20Thompson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-02 - The Sharp Boys and Alan Thompson",
          "artist": " - 2000-07-02 - The Sharp Boys and Alan Thompson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-09%20-%20Pete%20Tong%20and%20Timo%20Maas%20at%20Love%20Parade%202000.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-09 - Pete Tong and Timo Maas at Love Parade 2000",
          "artist": " - 2000-07-09 - Pete Tong and Timo Maas at Love Parade 2000"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-09%20-%20Timo%20Maas%2C%20David%20Morales%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-09 - Timo Maas, David Morales and Pete Tong",
          "artist": " - 2000-07-09 - Timo Maas, David Morales and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-16%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-16 - Steve Lawler",
          "artist": " - 2000-07-16 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-23%20-%20Dreem%20Teem.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-23 - Dreem Teem",
          "artist": " - 2000-07-23 - Dreem Teem"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-07-30%20-%20Luke%20Neville.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-07-30 - Luke Neville",
          "artist": " - 2000-07-30 - Luke Neville"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-08-06%20-%20Danny%20Rampling%2C%20Norman%20Cook%2C%20Laurent%20Garnier%2C%20Pete%20Tong%2C%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-08-06 - Danny Rampling, Norman Cook, Laurent Garnier, Pete Tong, Seb Fontaine",
          "artist": " - 2000-08-06 - Danny Rampling, Norman Cook, Laurent Garnier, Pete Tong, Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-08-13%20-%20Carl%20Cox%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-08-13 - Carl Cox and Pete Tong",
          "artist": " - 2000-08-13 - Carl Cox and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-08-13%20-%20Pete%20Tong%20and%20Carl%20Cox%20in%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-08-13 - Pete Tong and Carl Cox in Ibiza",
          "artist": " - 2000-08-13 - Pete Tong and Carl Cox in Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-08-20%20-%20Norman%20Jay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-08-20 - Norman Jay",
          "artist": " - 2000-08-20 - Norman Jay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-08-27%20-%20Tong%2C%20Fontaine%20and%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-08-27 - Tong, Fontaine and Oakenfold",
          "artist": " - 2000-08-27 - Tong, Fontaine and Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-09-03%20-%20Angels%20of%20Love%20present%20Danny%20Rampling%20and%20Dj%20Ralf.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-09-03 - Angels of Love present Danny Rampling and Dj Ralf",
          "artist": " - 2000-09-03 - Angels of Love present Danny Rampling and Dj Ralf"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-09-10%20-%20Josh%20Wink.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-09-10 - Josh Wink",
          "artist": " - 2000-09-10 - Josh Wink"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-09-17%20-%20Frankie%20Knuckles%20at%20Pacha%2C%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-09-17 - Frankie Knuckles at Pacha, Ibiza",
          "artist": " - 2000-09-17 - Frankie Knuckles at Pacha, Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-09-24%20-%20David%20Holmes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-09-24 - David Holmes",
          "artist": " - 2000-09-24 - David Holmes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-10-01%20-%20Lisa%20Lashes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-10-01 - Lisa Lashes",
          "artist": " - 2000-10-01 - Lisa Lashes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-10-08%20-%20Chris%20Fortier%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-10-08 - Chris Fortier and Pete Tong",
          "artist": " - 2000-10-08 - Chris Fortier and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-10-15%20-%20Rhythm%20Masters.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-10-15 - Rhythm Masters",
          "artist": " - 2000-10-15 - Rhythm Masters"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-10-22%20-%20Timo%20Maas%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-10-22 - Timo Maas and Pete Tong",
          "artist": " - 2000-10-22 - Timo Maas and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-10-29%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-10-29 - Dave Clarke",
          "artist": " - 2000-10-29 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-11-05%20-%20Christian%20Smith.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-11-05 - Christian Smith",
          "artist": " - 2000-11-05 - Christian Smith"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-11-12%20-%20Craig%20Richards%20and%20Lee%20Burridge.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-11-12 - Craig Richards and Lee Burridge",
          "artist": " - 2000-11-12 - Craig Richards and Lee Burridge"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-11-19%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-11-19 - Slam",
          "artist": " - 2000-11-19 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-11-26%20-%20John%2000%20Flemming.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-11-26 - John 00 Flemming",
          "artist": " - 2000-11-26 - John 00 Flemming"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-03%20-%20Mauro%20Picotto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-03 - Mauro Picotto",
          "artist": " - 2000-12-03 - Mauro Picotto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-10%20-%20Pete%20Tong%20and%20Alex%20Anderson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-10 - Pete Tong and Alex Anderson",
          "artist": " - 2000-12-10 - Pete Tong and Alex Anderson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-17%20-%20Paul%20Van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-17 - Paul Van Dyk",
          "artist": " - 2000-12-17 - Paul Van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-25%20-%20Erick%20Morillo%20and%20Harry%20Romero.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-25 - Erick Morillo and Harry Romero",
          "artist": " - 2000-12-25 - Erick Morillo and Harry Romero"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-31%20-%20Jules%2C%20Fontaine%2C%20Nelson%2C%20Morales%2C%20Pearce%2C%20Dreem%20Teem%2C%20Oakenfold%2C%20Carter%2C%20Maas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-31 - Jules, Fontaine, Nelson, Morales, Pearce, Dreem Teem, Oakenfold, Carter, Maas",
          "artist": " - 2000-12-31 - Jules, Fontaine, Nelson, Morales, Pearce, Dreem Teem, Oakenfold, Carter, Maas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202000-12-31%20-%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2000-12-31 - Seb Fontaine",
          "artist": " - 2000-12-31 - Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-01-07%20-%20Sasha%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007 - Sasha and Pete Tong",
          "artist": " - 2007 - Sasha and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-01-14%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2014 - Fergie",
          "artist": " - 2014 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-01-21%20-%20Fontaine%2C%20Yousef%2C%20Emerson%2C%20Layo%20%26%20Bushwacka%2C%20Sasha%20-%20Live%20%40%20Love%20Weekend.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2021 - Fontaine, Yousef, Emerson, Layo & Bushwacka, Sasha - Live @ Love Weekend",
          "artist": " - 2021 - Fontaine, Yousef, Emerson, Layo & Bushwacka, Sasha - Live @ Love Weekend"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-01-21%20-%20Paul%20Jackson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2021 - Paul Jackson",
          "artist": " - 2021 - Paul Jackson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-01-28%20-%20X-Press%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2028 - X-Press 2",
          "artist": " - 2028 - X-Press 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-02-04%20-%20Jan%20Driver.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-04 - Jan Driver",
          "artist": " - 2002-04 - Jan Driver"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-02-10%20-%20Doc%20Martin.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-10 - Doc Martin",
          "artist": " - 2002-10 - Doc Martin"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-02-18%20-%20Scott%20Bond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-18 - Scott Bond",
          "artist": " - 2002-18 - Scott Bond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-02-25%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-25 - Steve Lawler",
          "artist": " - 2002-25 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-03-04%20-%20Lucien%20Foort.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-04 - Lucien Foort",
          "artist": " - 2003-04 - Lucien Foort"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-03-18%20-%20Dave%20Seaman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-18 - Dave Seaman",
          "artist": " - 2003-18 - Dave Seaman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-03-25%20-%20Anne%20Savage.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-25 - Anne Savage",
          "artist": " - 2003-25 - Anne Savage"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-01%20-%20Carl%20Cox%20live%20at%20Space%20Miami.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-01 - Carl Cox live at Space Miami",
          "artist": " - 2004-01 - Carl Cox live at Space Miami"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-05%20-%20Timo%20Mass%20from%20Planet%20Love.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05 - Timo Mass from Planet Love",
          "artist": " - 2004-05 - Timo Mass from Planet Love"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-08%20-%20Pete%20Tong%20and%20Derrick%20Carter%20%28replay%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08 - Pete Tong and Derrick Carter (replay)",
          "artist": " - 2004-08 - Pete Tong and Derrick Carter (replay)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-15%20-%20Josh%20Wink%20and%20Dave%20Clarke%2C%20Gallery%20Turnmills%2C%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-15 - Josh Wink and Dave Clarke, Gallery Turnmills, London",
          "artist": " - 2004-15 - Josh Wink and Dave Clarke, Gallery Turnmills, London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-22%20-%20Ritchie%20Hawtin%20Live%20at%20Sankeys%20Soap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-22 - Ritchie Hawtin Live at Sankeys Soap",
          "artist": " - 2004-22 - Ritchie Hawtin Live at Sankeys Soap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-04-29%20-%20Agnelli%20and%20Nelson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-29 - Agnelli and Nelson",
          "artist": " - 2004-29 - Agnelli and Nelson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-05-06%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-06 - Fergie",
          "artist": " - 2005-06 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-05-13%20-%20Tom%20Middleton.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-13 - Tom Middleton",
          "artist": " - 2005-13 - Tom Middleton"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-05-20%20-%20Timo%20Maas%20at%20Planet%20Love%2C%20Belfast.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-20 - Timo Maas at Planet Love, Belfast",
          "artist": " - 2005-20 - Timo Maas at Planet Love, Belfast"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-05-27%20-%20John%20Digweed%2C%20Layo%20and%20Bushwacka%2C%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-27 - John Digweed, Layo and Bushwacka, Pete Tong",
          "artist": " - 2005-27 - John Digweed, Layo and Bushwacka, Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-06-03%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-03 - Slam",
          "artist": " - 2006-03 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-06-09%20-%20Sander%20Kleinenberg.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-09 - Sander Kleinenberg",
          "artist": " - 2006-09 - Sander Kleinenberg"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-06-17%20-%20Paul%20Van%20Dyk%20and%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-17 - Paul Van Dyk and Judge Jules",
          "artist": " - 2006-17 - Paul Van Dyk and Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-06-24%20-%20DJ%20Pippi.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-24 - DJ Pippi",
          "artist": " - 2006-24 - DJ Pippi"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-01%20-%20Frankie%20Knuckles.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-01 - Frankie Knuckles",
          "artist": " - 2007-01 - Frankie Knuckles"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-08%20-%20Carl%20Cox%20at%20Bunker.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-08 - Carl Cox at Bunker",
          "artist": " - 2007-08 - Carl Cox at Bunker"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-14%20-%20King%20Unique.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-14 - King Unique",
          "artist": " - 2007-14 - King Unique"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-21%20-%20Seb%20Fontaine%2C%20Layo%2C%20Yousef%2C%20Darren%20Emerson%20and%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-21 - Seb Fontaine, Layo, Yousef, Darren Emerson and Sasha",
          "artist": " - 2007-21 - Seb Fontaine, Layo, Yousef, Darren Emerson and Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-22%20-%20John%20Digweed%2C%20Danny%20Rampling%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-22 - John Digweed, Danny Rampling and Pete Tong",
          "artist": " - 2007-22 - John Digweed, Danny Rampling and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-07-28%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-28 - Fergie",
          "artist": " - 2007-28 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-08-05%20-%20Seb%20Fontaine%20Darren%20Emerson%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05 - Seb Fontaine Darren Emerson Pete Tong",
          "artist": " - 2008-05 - Seb Fontaine Darren Emerson Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-08-12%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12 - Pete Tong",
          "artist": " - 2008-12 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-08-19%20-%20Oliver%20Lieb.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-19 - Oliver Lieb",
          "artist": " - 2008-19 - Oliver Lieb"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-08-26%20-%20Seb%20Fontaine%2C%20Futureshock%2C%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-26 - Seb Fontaine, Futureshock, Carl Cox",
          "artist": " - 2008-26 - Seb Fontaine, Futureshock, Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-09-02%20-%20Silicone%20Soul.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02 - Silicone Soul",
          "artist": " - 2009-02 - Silicone Soul"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-09-08%20-%20Dj%20Tiesto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08 - Dj Tiesto",
          "artist": " - 2009-08 - Dj Tiesto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-09-16%20-%20Victor%20Calderone%20at%20Tribal%20Sessions.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-16 - Victor Calderone at Tribal Sessions",
          "artist": " - 2009-16 - Victor Calderone at Tribal Sessions"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-09-23%20-%20Basement%20Jaxx.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-23 - Basement Jaxx",
          "artist": " - 2009-23 - Basement Jaxx"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-09-29%20-%20Nick%20Warren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-29 - Nick Warren",
          "artist": " - 2009-29 - Nick Warren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-07%20-%20Danny%20Rampling%20and%20Benji%20Candelario.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-07 - Danny Rampling and Benji Candelario",
          "artist": " - 2010-07 - Danny Rampling and Benji Candelario"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-14%20-%20Sander%20Kleinenberg.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-14 - Sander Kleinenberg",
          "artist": " - 2010-14 - Sander Kleinenberg"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-21%20-%20Tom%20Stephan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-21 - Tom Stephan",
          "artist": " - 2010-21 - Tom Stephan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-27%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-27 - Paul Oakenfold",
          "artist": " - 2010-27 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-28%20-%20Fergie%20and%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-28 - Fergie and Paul Oakenfold",
          "artist": " - 2010-28 - Fergie and Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-10-28%20-%20Fergie%20at%20God%27s%20Kitchen%20-%20Part%201.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-28 - Fergie at God's Kitchen - Part 1",
          "artist": " - 2010-28 - Fergie at God's Kitchen - Part 1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-11-04%20-%20Ricky%20Montanari.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04 - Ricky Montanari",
          "artist": " - 2011-04 - Ricky Montanari"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-11-11%20-%20John%2000%20Flemming.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-11 - John 00 Flemming",
          "artist": " - 2011-11 - John 00 Flemming"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-11-18%20-%20James%20Holroyd.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-18 - James Holroyd",
          "artist": " - 2011-18 - James Holroyd"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-11-25%20-%20Jason%20Bye.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-25 - Jason Bye",
          "artist": " - 2011-25 - Jason Bye"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-12-01%20-%20Richard%20Dorfmeister.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-01 - Richard Dorfmeister",
          "artist": " - 2012-01 - Richard Dorfmeister"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-12-09%20-%20Stanton%20Warriors.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-09 - Stanton Warriors",
          "artist": " - 2012-09 - Stanton Warriors"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-12-16%20-%20Jo%20Mills.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-16 - Jo Mills",
          "artist": " - 2012-16 - Jo Mills"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-12-23%20-%20Cass%20and%20Slide.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-23 - Cass and Slide",
          "artist": " - 2012-23 - Cass and Slide"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-12-30%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-30 - Judge Jules",
          "artist": " - 2012-30 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202001-xx-xx%20-%20Pete%20Tong%20and%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 20xx-xx - Pete Tong and Sasha",
          "artist": " - 20xx-xx - Pete Tong and Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-01-06%20-%20Unkle%20Sounds%20%28James%20Lavelle%20and%20Richard%20File%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06 - Unkle Sounds (James Lavelle and Richard File)",
          "artist": " - 2002-06 - Unkle Sounds (James Lavelle and Richard File)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-01-13%20-%20H%20Foundation.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-13 - H Foundation",
          "artist": " - 2002-13 - H Foundation"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-01-20%20-%20James%20Holden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-20 - James Holden",
          "artist": " - 2002-20 - James Holden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-01-26%20-%20Mistress%20Barbara.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-26 - Mistress Barbara",
          "artist": " - 2002-26 - Mistress Barbara"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-02-03%20-%20Jori%20Hulkonen.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-02-03 - Jori Hulkonen",
          "artist": " - 2002-02-03 - Jori Hulkonen"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-02-10%20-%20Yousef.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-02-10 - Yousef",
          "artist": " - 2002-02-10 - Yousef"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-02-17%20-%20Matt%20Hardwick.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-02-17 - Matt Hardwick",
          "artist": " - 2002-02-17 - Matt Hardwick"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-02-24%20-%20Parks%20and%20Wilson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-02-24 - Parks and Wilson",
          "artist": " - 2002-02-24 - Parks and Wilson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-03%20-%20Gordon%20Kaye.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-03 - Gordon Kaye",
          "artist": " - 2002-03-03 - Gordon Kaye"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-04%20-%20Craig%20Richards%2C%20Slam%2C%20X-Press%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-04 - Craig Richards, Slam, X-Press 2",
          "artist": " - 2002-03-04 - Craig Richards, Slam, X-Press 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-07%20-%20World%20DJ%20Day%20at%20Fabric.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-07 - World DJ Day at Fabric",
          "artist": " - 2002-03-07 - World DJ Day at Fabric"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-10%20-%20Tom%20Middleton%20and%20Andrew%20Weatherall.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-10 - Tom Middleton and Andrew Weatherall",
          "artist": " - 2002-03-10 - Tom Middleton and Andrew Weatherall"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-17%20-%20James%20Zabiela.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-17 - James Zabiela",
          "artist": " - 2002-03-17 - James Zabiela"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-03-24%20-%20Donald%20Glaude.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-03-24 - Donald Glaude",
          "artist": " - 2002-03-24 - Donald Glaude"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-04-07%20-%20Sasha%20and%20Digweed%20in%20Miami.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-04-07 - Sasha and Digweed in Miami",
          "artist": " - 2002-04-07 - Sasha and Digweed in Miami"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-04-14%20-%20FC%20Kahuna.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-04-14 - FC Kahuna",
          "artist": " - 2002-04-14 - FC Kahuna"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-04-21%20-%20Circulation%20%28Decks%20and%20FX%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-04-21 - Circulation (Decks and FX)",
          "artist": " - 2002-04-21 - Circulation (Decks and FX)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-04-28%20-%20Roger%20Sanchez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-04-28 - Roger Sanchez",
          "artist": " - 2002-04-28 - Roger Sanchez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-05-05%20-%20Pete%20Tong%20and%20BT%20at%20Coachella%20Festival%202002.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-05-05 - Pete Tong and BT at Coachella Festival 2002",
          "artist": " - 2002-05-05 - Pete Tong and BT at Coachella Festival 2002"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-05-12%20-%20Chris%20Cowie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-05-12 - Chris Cowie",
          "artist": " - 2002-05-12 - Chris Cowie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-05-19%20-%20Derrick%20Carter.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-05-19 - Derrick Carter",
          "artist": " - 2002-05-19 - Derrick Carter"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-05-26%20-%20Greg%20Vickers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-05-26 - Greg Vickers",
          "artist": " - 2002-05-26 - Greg Vickers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-01%20-%20Laurent%20Garnier%2C%20DJ%20Tiesto%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-01 - Laurent Garnier, DJ Tiesto and Pete Tong",
          "artist": " - 2002-06-01 - Laurent Garnier, DJ Tiesto and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-04%20-%20Sasha%20and%20Digweed%20-%20Part%201.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-04 - Sasha and Digweed - Part 1",
          "artist": " - 2002-06-04 - Sasha and Digweed - Part 1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-04%20-%20Sasha%20and%20Digweed%20-%20Part%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-04 - Sasha and Digweed - Part 2",
          "artist": " - 2002-06-04 - Sasha and Digweed - Part 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-09%20-%20Michael%20De%20Hey.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-09 - Michael De Hey",
          "artist": " - 2002-06-09 - Michael De Hey"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-16%20-%20Seamus%20Haji.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-16 - Seamus Haji",
          "artist": " - 2002-06-16 - Seamus Haji"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-23%20-%20Mr.%20C.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-23 - Mr C",
          "artist": " - 2002-06-23 - Mr C"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-06-30%20-%20Layo%20and%20Bushwacka.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-06-30 - Layo and Bushwacka",
          "artist": " - 2002-06-30 - Layo and Bushwacka"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-07-07%20-%20Fergie%20Live%20from%20Mardigras.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-07-07 - Fergie Live from Mardigras",
          "artist": " - 2002-07-07 - Fergie Live from Mardigras"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-07-14%20-%20Paul%20van%20Dyk%2C%20Columbiahalle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-07-14 - Paul van Dyk, Columbiahalle",
          "artist": " - 2002-07-14 - Paul van Dyk, Columbiahalle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-07-21%20-%20The%20MYNC%20Project.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-07-21 - The MYNC Project",
          "artist": " - 2002-07-21 - The MYNC Project"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-07-28%20-%20Danny%20Howells.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-07-28 - Danny Howells",
          "artist": " - 2002-07-28 - Danny Howells"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-04%20-%20Pete%20Tong%2C%20at%20Manumission%2C%20Privilege%20in%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-04 - Pete Tong, at Manumission, Privilege in Ibiza",
          "artist": " - 2002-08-04 - Pete Tong, at Manumission, Privilege in Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-04%20-%20Sasha%2C%20Pete%20Tong%20and%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-04 - Sasha, Pete Tong and Seb Fontaine",
          "artist": " - 2002-08-04 - Sasha, Pete Tong and Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-04%20-%20Sasha%2C%20at%20Manumission%2C%20Privilege%20in%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-04 - Sasha, at Manumission, Privilege in Ibiza",
          "artist": " - 2002-08-04 - Sasha, at Manumission, Privilege in Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-04%20-%20Seb%20Fontaine%2C%20at%20Manumission%2C%20Privilege%20in%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-04 - Seb Fontaine, at Manumission, Privilege in Ibiza",
          "artist": " - 2002-08-04 - Seb Fontaine, at Manumission, Privilege in Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-11%20-%20Pete%20Tong%20Live%20at%20Closing%20Party%2C%20Space%2C%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-11 - Pete Tong Live at Closing Party, Space, Ibiza",
          "artist": " - 2002-08-11 - Pete Tong Live at Closing Party, Space, Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-18%20-%20Timo%20Maas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-18 - Timo Maas",
          "artist": " - 2002-08-18 - Timo Maas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-25%20-%20Hernan%20Cattaneo%20at%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-25 - Hernan Cattaneo at Creamfields",
          "artist": " - 2002-08-25 - Hernan Cattaneo at Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-25%20-%20Underworld%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-25 - Underworld, Creamfields",
          "artist": " - 2002-08-25 - Underworld, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-08-25%20-%20Underworld%2C%20Hernan%20Cattaneo%2C%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-08-25 - Underworld, Hernan Cattaneo, Paul Oakenfold",
          "artist": " - 2002-08-25 - Underworld, Hernan Cattaneo, Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-09-01%20-%20X-press%202.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-09-01 - X-press 2",
          "artist": " - 2002-09-01 - X-press 2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-09-08%20-%20Tim%20Deluxe.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-09-08 - Tim Deluxe",
          "artist": " - 2002-09-08 - Tim Deluxe"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-09-15%20-%20Rui%20da%20Silva.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-09-15 - Rui da Silva",
          "artist": " - 2002-09-15 - Rui da Silva"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-09-22%20-%20Dirty%20Vegas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-09-22 - Dirty Vegas",
          "artist": " - 2002-09-22 - Dirty Vegas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-09-29%20-%20Eric%20Morillo%20at%20Shindig%2C%20Newcastle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-09-29 - Eric Morillo at Shindig, Newcastle",
          "artist": " - 2002-09-29 - Eric Morillo at Shindig, Newcastle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-10-06%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-10-06 - John Digweed",
          "artist": " - 2002-10-06 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-10-13%20-%20Groove%20Armada.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-10-13 - Groove Armada",
          "artist": " - 2002-10-13 - Groove Armada"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-10-20%20-%20Marco%20V.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-10-20 - Marco V",
          "artist": " - 2002-10-20 - Marco V"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-10-27%20-%20Dave%20Congreve%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-10-27 - Dave Congreve and Pete Tong",
          "artist": " - 2002-10-27 - Dave Congreve and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-11-03%20-%20Bob%20Sinclar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-11-03 - Bob Sinclar",
          "artist": " - 2002-11-03 - Bob Sinclar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-11-10%20-%20Sven%20Vaeth%20and%20Richie%20Hawtin.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-11-10 - Sven Vaeth and Richie Hawtin",
          "artist": " - 2002-11-10 - Sven Vaeth and Richie Hawtin"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-11-17%20-%20Daniel%20and%20John%20Kelly.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-11-17 - Daniel and John Kelly",
          "artist": " - 2002-11-17 - Daniel and John Kelly"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-11-24%20-%20Death%20In%20Vegas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-11-24 - Death In Vegas",
          "artist": " - 2002-11-24 - Death In Vegas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-12-01%20-%20Sander%20Kleinenberg%20and%20Seb%20Fontaine%20at%20Liquid%20Rooms%20Edinburgh.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-12-01 - Sander Kleinenberg and Seb Fontaine at Liquid Rooms Edinburgh",
          "artist": " - 2002-12-01 - Sander Kleinenberg and Seb Fontaine at Liquid Rooms Edinburgh"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-12-08%20-%20Francesco%20Farfa.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-12-08 - Francesco Farfa",
          "artist": " - 2002-12-08 - Francesco Farfa"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-12-15%20-%20Adam%20Beyer.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-12-15 - Adam Beyer",
          "artist": " - 2002-12-15 - Adam Beyer"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-12-22%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-12-22 - Carl Cox",
          "artist": " - 2002-12-22 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202002-12-29%20-%20Sasha%20and%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2002-12-29 - Sasha and John Digweed",
          "artist": " - 2002-12-29 - Sasha and John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-01-05%20-%20Audio%20Bully%27s.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-05 - Audio Bully's",
          "artist": " - 2003-05 - Audio Bully's"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-01-12%20-%20Ashley%20Casselle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-12 - Ashley Casselle",
          "artist": " - 2003-12 - Ashley Casselle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-01-19%20-%20Paul%20Jackson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-19 - Paul Jackson",
          "artist": " - 2003-19 - Paul Jackson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-01-26%20-%20Lottie%20and%20Youseff.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-26 - Lottie and Youseff",
          "artist": " - 2003-26 - Lottie and Youseff"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-02-02%20-%20DJ%20Onionz%20at%20Centrofly%20in%20NYC.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-02-02 - DJ Onionz at Centrofly in NYC",
          "artist": " - 2003-02-02 - DJ Onionz at Centrofly in NYC"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-02-09%20-%20Armind%20van%20Buuren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-02-09 - Armind van Buuren",
          "artist": " - 2003-02-09 - Armind van Buuren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-02-17%20-%20Guy%20Willams.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-02-17 - Guy Willams",
          "artist": " - 2003-02-17 - Guy Willams"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-02-23%20-%20Moshic.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-02-23 - Moshic",
          "artist": " - 2003-02-23 - Moshic"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-03-02%20-%20Danny%20Krivet.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-03-02 - Danny Krivet",
          "artist": " - 2003-03-02 - Danny Krivet"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-03-09%20-%20Gabriel%20and%20Dresden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-03-09 - Gabriel and Dresden",
          "artist": " - 2003-03-09 - Gabriel and Dresden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-03-16%20-%20Groove%20Armada.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-03-16 - Groove Armada",
          "artist": " - 2003-03-16 - Groove Armada"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-03-23%20-%20Sandra%20Collins.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-03-23 - Sandra Collins",
          "artist": " - 2003-03-23 - Sandra Collins"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-03-30%20-%20DJ%20Shadow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-03-30 - DJ Shadow",
          "artist": " - 2003-03-30 - DJ Shadow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-04-06%20-%20High%20Contrast.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-04-06 - High Contrast",
          "artist": " - 2003-04-06 - High Contrast"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-04-13%20-%20Nils%20Noa.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-04-13 - Nils Noa",
          "artist": " - 2003-04-13 - Nils Noa"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-04-20%20-%20DJ%20Heather.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-04-20 - DJ Heather",
          "artist": " - 2003-04-20 - DJ Heather"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-04-27%20-%20Scumfrog.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-04-27 - Scumfrog",
          "artist": " - 2003-04-27 - Scumfrog"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-05-04%20-%20Eddie%20Halliwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-05-04 - Eddie Halliwell",
          "artist": " - 2003-05-04 - Eddie Halliwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-05-11%20-%20Adam%20Freeland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-05-11 - Adam Freeland",
          "artist": " - 2003-05-11 - Adam Freeland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-05-18%20-%20Phil%20Kieran.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-05-18 - Phil Kieran",
          "artist": " - 2003-05-18 - Phil Kieran"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-05-25%20-%20Jeff%20Mills%20and%20DJ%20Marky.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-05-25 - Jeff Mills and DJ Marky",
          "artist": " - 2003-05-25 - Jeff Mills and DJ Marky"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-06-01%20-%20Nic%20Fanciulli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-06-01 - Nic Fanciulli",
          "artist": " - 2003-06-01 - Nic Fanciulli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-06-08%20-%20Sander%20Kleinenberg.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-06-08 - Sander Kleinenberg",
          "artist": " - 2003-06-08 - Sander Kleinenberg"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-06-15%20-%20Plump%20DJs.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-06-15 - Plump DJs",
          "artist": " - 2003-06-15 - Plump DJs"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-06-22%20-%20DJ%20Yoda%20and%20Greenpeace%2C%20Beach%20Tape.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-06-22 - DJ Yoda and Greenpeace, Beach Tape",
          "artist": " - 2003-06-22 - DJ Yoda and Greenpeace, Beach Tape"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-06-29%20-%20Erol%20Alkan%2C%20Mr%20C%2C%20Layo%20and%20Bushwacka.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-06-29 - Erol Alkan, Mr C, Layo and Bushwacka",
          "artist": " - 2003-06-29 - Erol Alkan, Mr C, Layo and Bushwacka"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-07-06%20-%20Murk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-07-06 - Murk",
          "artist": " - 2003-07-06 - Murk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-07-20%20-%20Planet%20Funk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-07-20 - Planet Funk",
          "artist": " - 2003-07-20 - Planet Funk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-07-27%20-%20Tom%20Stephan%20and%20Antoine%20909%2C%20Live%20from%20Crash%2C%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-07-27 - Tom Stephan and Antoine 909, Live from Crash, London",
          "artist": " - 2003-07-27 - Tom Stephan and Antoine 909, Live from Crash, London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-08-03%20-%20Agoria.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-08-03 - Agoria",
          "artist": " - 2003-08-03 - Agoria"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-08-10%20-%20Paul%20Oakenfold%2C%20DJ%20Tiesto%2C%20Judge%20Jules%2C%20Fergie%2C%20Eddie%20Halliwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-08-10 - Paul Oakenfold, DJ Tiesto, Judge Jules, Fergie, Eddie Halliwell",
          "artist": " - 2003-08-10 - Paul Oakenfold, DJ Tiesto, Judge Jules, Fergie, Eddie Halliwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-08-17%20-%20Carl%20Cox%2C%20Live%20from%20Space%2C%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-08-17 - Carl Cox, Live from Space, Ibiza",
          "artist": " - 2003-08-17 - Carl Cox, Live from Space, Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-08-24%20-%20Sasha%20and%20Pete%20Tong%2C%20at%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-08-24 - Sasha and Pete Tong, at Creamfields",
          "artist": " - 2003-08-24 - Sasha and Pete Tong, at Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-08-31%20-%20Radio%20Slave.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-08-31 - Radio Slave",
          "artist": " - 2003-08-31 - Radio Slave"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-09-07%20-%20Wall%20of%20Sound.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-09-07 - Wall of Sound",
          "artist": " - 2003-09-07 - Wall of Sound"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-09-14%20-%20Pete%20Gooding.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-09-14 - Pete Gooding",
          "artist": " - 2003-09-14 - Pete Gooding"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-09-21%20-%20Smokin%20Jo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-09-21 - Smokin Jo",
          "artist": " - 2003-09-21 - Smokin Jo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-09-28%20-%20Alan%20Simms%20and%20Pete%20Tong%2C%20live%20at%20Shine%20Belfast%2C%20Ireland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-09-28 - Alan Simms and Pete Tong, live at Shine Belfast, Ireland",
          "artist": " - 2003-09-28 - Alan Simms and Pete Tong, live at Shine Belfast, Ireland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-10-05%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-10-05 - Steve Lawler",
          "artist": " - 2003-10-05 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-10-12%20-%20Futureshock%20and%20Seb%20Fontaine%2C%20at%20Type%2C%20UK.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-10-12 - Futureshock and Seb Fontaine, at Type, UK",
          "artist": " - 2003-10-12 - Futureshock and Seb Fontaine, at Type, UK"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-10-19%20-%20Wally%20Lopez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-10-19 - Wally Lopez",
          "artist": " - 2003-10-19 - Wally Lopez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-10-26%20-%20The%20Rapture.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-10-26 - The Rapture",
          "artist": " - 2003-10-26 - The Rapture"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-11-02%20-%20Tula%20and%20Norman%20Cook%2C%20Brighton.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-11-02 - Tula and Norman Cook, Brighton",
          "artist": " - 2003-11-02 - Tula and Norman Cook, Brighton"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-11-09%20-%20Phil%20Hartnoll%2C%20Greg%20Vickers%20and%20Krysko%2C%20Tribal%20Gathering.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-11-09 - Phil Hartnoll, Greg Vickers and Krysko, Tribal Gathering",
          "artist": " - 2003-11-09 - Phil Hartnoll, Greg Vickers and Krysko, Tribal Gathering"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-11-16%20-%20Lee%20Coombs.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-11-16 - Lee Coombs",
          "artist": " - 2003-11-16 - Lee Coombs"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-11-23%20-%20Ralph%20Lawson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-11-23 - Ralph Lawson",
          "artist": " - 2003-11-23 - Ralph Lawson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-11-30%20-%20DJ%20Gregory.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-11-30 - DJ Gregory",
          "artist": " - 2003-11-30 - DJ Gregory"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-12-07%20-%20Valentino%20Kanzyani.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-12-07 - Valentino Kanzyani",
          "artist": " - 2003-12-07 - Valentino Kanzyani"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-12-14%20-%20Yousef%20and%20DJ%20Heather%2C%20at%20Circus%2C%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-12-14 - Yousef and DJ Heather, at Circus, Liverpool",
          "artist": " - 2003-12-14 - Yousef and DJ Heather, at Circus, Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-12-21%20-%20Paul%20van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-12-21 - Paul van Dyk",
          "artist": " - 2003-12-21 - Paul van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202003-12-28%20-%20Erick%20Morillo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2003-12-28 - Erick Morillo",
          "artist": " - 2003-12-28 - Erick Morillo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-01-04%20-%20Infusion.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-04 - Infusion",
          "artist": " - 2004-04 - Infusion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-01-11%20-%20Switch.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-11 - Switch",
          "artist": " - 2004-11 - Switch"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-01-18%20-%20Aldrin.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-18 - Aldrin",
          "artist": " - 2004-18 - Aldrin"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-01-25%20-%20Adam%20Sheridan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-25 - Adam Sheridan",
          "artist": " - 2004-25 - Adam Sheridan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-02-01%20-%20DJ%20Touche.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-02-01 - DJ Touche",
          "artist": " - 2004-02-01 - DJ Touche"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-02-08%20-%20Ferry%20Corsten.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-02-08 - Ferry Corsten",
          "artist": " - 2004-02-08 - Ferry Corsten"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-02-15%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-02-15 - Pete Tong",
          "artist": " - 2004-02-15 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-02-22%20-%20James%20Zabiela.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-02-22 - James Zabiela",
          "artist": " - 2004-02-22 - James Zabiela"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-02-29%20-%20Harry%20Romero.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-02-29 - Harry Romero",
          "artist": " - 2004-02-29 - Harry Romero"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-03-07%20-%20Sander%20Kleinenberg%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-03-07 - Sander Kleinenberg and Pete Tong",
          "artist": " - 2004-03-07 - Sander Kleinenberg and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-03-14%20-%20Rob%20Tissera.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-03-14 - Rob Tissera",
          "artist": " - 2004-03-14 - Rob Tissera"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-03-21%20-%20DJ%20Marky%20and%20XRS.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-03-21 - DJ Marky and XRS",
          "artist": " - 2004-03-21 - DJ Marky and XRS"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-03-28%20-%20Christopher%20Lawrence.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-03-28 - Christopher Lawrence",
          "artist": " - 2004-03-28 - Christopher Lawrence"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-04-04%20-%20Armand%20van%20Helden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-04-04 - Armand van Helden",
          "artist": " - 2004-04-04 - Armand van Helden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-04-11%20-%20Dave%20Clarke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-04-11 - Dave Clarke",
          "artist": " - 2004-04-11 - Dave Clarke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-04-18%20-%20Paul%20Woolford.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-04-18 - Paul Woolford",
          "artist": " - 2004-04-18 - Paul Woolford"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-04-25%20-%20Armin%20van%20Buuren%20and%20Tall%20Paul%2C%20Live%20from%20One%20Big%20Weekend.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-04-25 - Armin van Buuren and Tall Paul, Live from One Big Weekend",
          "artist": " - 2004-04-25 - Armin van Buuren and Tall Paul, Live from One Big Weekend"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-05-02%20-%20Rob%20Da%20Bank%20and%20The%20Cuban%20Brothers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05-02 - Rob Da Bank and The Cuban Brothers",
          "artist": " - 2004-05-02 - Rob Da Bank and The Cuban Brothers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-05-09%20-%20Sasha%20and%20Digweed%2C%20at%20Renaissance.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05-09 - Sasha and Digweed, at Renaissance",
          "artist": " - 2004-05-09 - Sasha and Digweed, at Renaissance"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-05-16%20-%20Danny%20Rampling.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05-16 - Danny Rampling",
          "artist": " - 2004-05-16 - Danny Rampling"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-05-23%20-%20Junior%20Jack%20and%20Kid%20Creme.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05-23 - Junior Jack and Kid Creme",
          "artist": " - 2004-05-23 - Junior Jack and Kid Creme"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-05-30%20-%20Plump%20DJs%20and%20Danny%20Howells%2C%20Homelands.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-05-30 - Plump DJs and Danny Howells, Homelands",
          "artist": " - 2004-05-30 - Plump DJs and Danny Howells, Homelands"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-06-06%20-%20Above%20and%20Beyond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-06-06 - Above and Beyond",
          "artist": " - 2004-06-06 - Above and Beyond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-06-13%20-%20Gilles%20Peterson%2C%20Pepe%20Bradock%2C%20Rui%20Vargas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-06-13 - Gilles Peterson, Pepe Bradock, Rui Vargas",
          "artist": " - 2004-06-13 - Gilles Peterson, Pepe Bradock, Rui Vargas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-06-20%20-%20Craig%20Richards.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-06-20 - Craig Richards",
          "artist": " - 2004-06-20 - Craig Richards"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-06-27%20-%20Sander%20Kleinenberg%2C%20Seb%20Fontaine%2C%20Timo%20Maas%2C%20Glustonbury%20Festival.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-06-27 - Sander Kleinenberg, Seb Fontaine, Timo Maas, Glustonbury Festival",
          "artist": " - 2004-06-27 - Sander Kleinenberg, Seb Fontaine, Timo Maas, Glustonbury Festival"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-07-04%20-%20BK%20and%20Pete%20Wardman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-07-04 - BK and Pete Wardman",
          "artist": " - 2004-07-04 - BK and Pete Wardman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-07-11%20-%20Behrouz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-07-11 - Behrouz",
          "artist": " - 2004-07-11 - Behrouz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-07-18%20-%20Tidy%20Boys%20and%20Lee%20Haslam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-07-18 - Tidy Boys and Lee Haslam",
          "artist": " - 2004-07-18 - Tidy Boys and Lee Haslam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-07-25%20-%20Stanton%20Warriors.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-07-25 - Stanton Warriors",
          "artist": " - 2004-07-25 - Stanton Warriors"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-08-01%20-%20Paolo%20Mojo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08-01 - Paolo Mojo",
          "artist": " - 2004-08-01 - Paolo Mojo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-08-08%20-%20Paul%20Oakenfold%2C%20Cream%2C%20Amnesia.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08-08 - Paul Oakenfold, Cream, Amnesia",
          "artist": " - 2004-08-08 - Paul Oakenfold, Cream, Amnesia"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-08-15%20-%20Sandra%20Collins.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08-15 - Sandra Collins",
          "artist": " - 2004-08-15 - Sandra Collins"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-08-22%20-%20Scratch%20Perverts.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08-22 - Scratch Perverts",
          "artist": " - 2004-08-22 - Scratch Perverts"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-08-29%20-%20Deep%20Dish%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-08-29 - Deep Dish, Creamfields",
          "artist": " - 2004-08-29 - Deep Dish, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-09-05%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-09-05 - Slam",
          "artist": " - 2004-09-05 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-09-12%20-%20Dave%20Seaman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-09-12 - Dave Seaman",
          "artist": " - 2004-09-12 - Dave Seaman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-09-19%20-%20Tiesto%2C%20Darren%20Emerson%2C%20X-Press%202%2C%20Mylo%2C%20Groove%20Armada.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-09-19 - Tiesto, Darren Emerson, X-Press 2, Mylo, Groove Armada",
          "artist": " - 2004-09-19 - Tiesto, Darren Emerson, X-Press 2, Mylo, Groove Armada"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-09-26%20-%20Mark%20Knight%20and%20Martjin%20Ten%20Velden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-09-26 - Mark Knight and Martjin Ten Velden",
          "artist": " - 2004-09-26 - Mark Knight and Martjin Ten Velden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-10-03%20-%20Desyn%20Masiello.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-10-03 - Desyn Masiello",
          "artist": " - 2004-10-03 - Desyn Masiello"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-10-10%20-%20Marco%20V.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-10-10 - Marco V",
          "artist": " - 2004-10-10 - Marco V"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-10-17%20-%20Mutiny.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-10-17 - Mutiny",
          "artist": " - 2004-10-17 - Mutiny"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-10-24%20-%20Bugz%20In%20The%20Attic.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-10-24 - Bugz In The Attic",
          "artist": " - 2004-10-24 - Bugz In The Attic"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-10-31%20-%20King%20Unique.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-10-31 - King Unique",
          "artist": " - 2004-10-31 - King Unique"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-11-07%20-%20Matthew%20Dekay.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-11-07 - Matthew Dekay",
          "artist": " - 2004-11-07 - Matthew Dekay"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-11-14%20-%20Meat%20Katie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-11-14 - Meat Katie",
          "artist": " - 2004-11-14 - Meat Katie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-11-21%20-%20Timo%20Maas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-11-21 - Timo Maas",
          "artist": " - 2004-11-21 - Timo Maas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-11-28%20-%20Blackstrobe.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-11-28 - Blackstrobe",
          "artist": " - 2004-11-28 - Blackstrobe"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-12-05%20-%20Lisa%20Lashes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-12-05 - Lisa Lashes",
          "artist": " - 2004-12-05 - Lisa Lashes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-12-12%20-%20Roni%20Size.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-12-12 - Roni Size",
          "artist": " - 2004-12-12 - Roni Size"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202004-12-19%20-%20Kings%20of%20Tomorrow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2004-12-19 - Kings of Tomorrow",
          "artist": " - 2004-12-19 - Kings of Tomorrow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-01-02%20-%20Radio%20Soulwax.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-02 - Radio Soulwax",
          "artist": " - 2005-02 - Radio Soulwax"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-01-16%20-%20Jon%20O%20Bir.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-16 - Jon O Bir",
          "artist": " - 2005-16 - Jon O Bir"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-01-23%20-%20David%20Guetta.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-23 - David Guetta",
          "artist": " - 2005-23 - David Guetta"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-01-30%20-%20Pete%20Heller.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-30 - Pete Heller",
          "artist": " - 2005-30 - Pete Heller"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-02-06%20-%20Nic%20Fanciulli%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-02-06 - Nic Fanciulli and Pete Tong",
          "artist": " - 2005-02-06 - Nic Fanciulli and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-02-13%20-%20Eddie%20Halliwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-02-13 - Eddie Halliwell",
          "artist": " - 2005-02-13 - Eddie Halliwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-02-20%20-%20Ben%20Watt.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-02-20 - Ben Watt",
          "artist": " - 2005-02-20 - Ben Watt"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-02-27%20-%20Krafty%20Kuts.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-02-27 - Krafty Kuts",
          "artist": " - 2005-02-27 - Krafty Kuts"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-03-06%20-%20Silicone%20Soul.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-03-06 - Silicone Soul",
          "artist": " - 2005-03-06 - Silicone Soul"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-03-13%20-%20Eric%20Prydz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-03-13 - Eric Prydz",
          "artist": " - 2005-03-13 - Eric Prydz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-03-20%20-%20Evil%209.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-03-20 - Evil 9",
          "artist": " - 2005-03-20 - Evil 9"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-03-27%20-%20Desyn%20Masiello%2C%20Murk%20and%20Gabriel%20and%20Dresden%2C%20WMC%2C%20Miami.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-03-27 - Desyn Masiello, Murk and Gabriel and Dresden, WMC, Miami",
          "artist": " - 2005-03-27 - Desyn Masiello, Murk and Gabriel and Dresden, WMC, Miami"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-04-03%20-%20Yoji%20Biomehanika.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-04-03 - Yoji Biomehanika",
          "artist": " - 2005-04-03 - Yoji Biomehanika"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-04-10%20-%20Mylo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-04-10 - Mylo",
          "artist": " - 2005-04-10 - Mylo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-04-16%20-%20Skolbeats.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-04-16 - Skolbeats",
          "artist": " - 2005-04-16 - Skolbeats"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-04-24%20-%20Tiesto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-04-24 - Tiesto",
          "artist": " - 2005-04-24 - Tiesto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-05-01%20-%20Andy%20C.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-05-01 - Andy C",
          "artist": " - 2005-05-01 - Andy C"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-05-08%20-%201Big%20Weekend.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-05-08 - 1Big Weekend",
          "artist": " - 2005-05-08 - 1Big Weekend"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-05-15%20-%20Tom%20Middleton.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-05-15 - Tom Middleton",
          "artist": " - 2005-05-15 - Tom Middleton"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-05-22%20-%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-05-22 - Sasha",
          "artist": " - 2005-05-22 - Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-05-30%20-%20Bob%20Sinclar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-05-30 - Bob Sinclar",
          "artist": " - 2005-05-30 - Bob Sinclar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-06-05%20-%20Tom%20Neville.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-06-05 - Tom Neville",
          "artist": " - 2005-06-05 - Tom Neville"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-06-12%20-%20Anne%20Savage.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-06-12 - Anne Savage",
          "artist": " - 2005-06-12 - Anne Savage"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-06-19%20-%20Deep%20Dish.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-06-19 - Deep Dish",
          "artist": " - 2005-06-19 - Deep Dish"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-06-26%20-%20Darren%20Emerson%20and%20James%20Lavelle.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-06-26 - Darren Emerson and James Lavelle",
          "artist": " - 2005-06-26 - Darren Emerson and James Lavelle"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-03%20-%20Masters%20at%20Work.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-03 - Masters at Work",
          "artist": " - 2005-07-03 - Masters at Work"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-10%20-%20Sneak%2C%20Richie%20Hawtin%2C%20Ricardo%20Villalobos.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-10 - Sneak, Richie Hawtin, Ricardo Villalobos",
          "artist": " - 2005-07-10 - Sneak, Richie Hawtin, Ricardo Villalobos"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-17%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-17 - Steve Lawler",
          "artist": " - 2005-07-17 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-24%20-%20Martin%20Solveig.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-24 - Martin Solveig",
          "artist": " - 2005-07-24 - Martin Solveig"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-30%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-30 - Fergie",
          "artist": " - 2005-07-30 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-30%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-30 - John Digweed",
          "artist": " - 2005-07-30 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-30%20-%20Paul%20Van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-30 - Paul Van Dyk",
          "artist": " - 2005-07-30 - Paul Van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-30%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-30 - Pete Tong",
          "artist": " - 2005-07-30 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-07-30%20-%20Roger%20Sanchez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-07-30 - Roger Sanchez",
          "artist": " - 2005-07-30 - Roger Sanchez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Above%20and%20Beyond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Above and Beyond",
          "artist": " - 2005-08-14 - Above and Beyond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Carl Cox",
          "artist": " - 2005-08-14 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Deep%20Dish.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Deep Dish",
          "artist": " - 2005-08-14 - Deep Dish"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Erick%20Morillo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Erick Morillo",
          "artist": " - 2005-08-14 - Erick Morillo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Fergie",
          "artist": " - 2005-08-14 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Judge Jules",
          "artist": " - 2005-08-14 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Laurent%20Garnier.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Laurent Garnier",
          "artist": " - 2005-08-14 - Laurent Garnier"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-14%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-14 - Pete Tong",
          "artist": " - 2005-08-14 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-21%20-%20Tanya%20Vulcano%20and%20Locodice.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-21 - Tanya Vulcano and Locodice",
          "artist": " - 2005-08-21 - Tanya Vulcano and Locodice"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-08-28%20-%20Wally%20Lopez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-08-28 - Wally Lopez",
          "artist": " - 2005-08-28 - Wally Lopez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-09-04%20-%20Murk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-09-04 - Murk",
          "artist": " - 2005-09-04 - Murk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-09-11%20-%20Audio%20Bullys.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-09-11 - Audio Bullys",
          "artist": " - 2005-09-11 - Audio Bullys"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-09-18%20-%20Pendulum.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-09-18 - Pendulum",
          "artist": " - 2005-09-18 - Pendulum"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-09-25%20-%20Steve%20Angello%20and%20Sebastian%20Ingrosso.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-09-25 - Steve Angello and Sebastian Ingrosso",
          "artist": " - 2005-09-25 - Steve Angello and Sebastian Ingrosso"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-10-02%20-%20Paul%20Woolford.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-10-02 - Paul Woolford",
          "artist": " - 2005-10-02 - Paul Woolford"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-10-09%20-%20Tidy%20Boys%20and%20Amber%20D.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-10-09 - Tidy Boys and Amber D",
          "artist": " - 2005-10-09 - Tidy Boys and Amber D"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-10-16%20-%20Chris%20Liebing.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-10-16 - Chris Liebing",
          "artist": " - 2005-10-16 - Chris Liebing"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-10-23%20-%20Matt%20Hardwick.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-10-23 - Matt Hardwick",
          "artist": " - 2005-10-23 - Matt Hardwick"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-10-30%20-%20Joey%20Negro.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-10-30 - Joey Negro",
          "artist": " - 2005-10-30 - Joey Negro"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-11-06%20-%20M.a.n.d.y.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-11-06 - M a n d y",
          "artist": " - 2005-11-06 - M a n d y"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-11-13%20-%20Tom%20Novy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-11-13 - Tom Novy",
          "artist": " - 2005-11-13 - Tom Novy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-11-20%20-%20C2C%20and%20ie%20Merge.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-11-20 - C2C and ie Merge",
          "artist": " - 2005-11-20 - C2C and ie Merge"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-11-27%20-%20Rennie%20Pilgrim.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-11-27 - Rennie Pilgrim",
          "artist": " - 2005-11-27 - Rennie Pilgrim"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-12-04%20-%20Erol%20Alkan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-12-04 - Erol Alkan",
          "artist": " - 2005-12-04 - Erol Alkan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-12-11%20-%20Shy%20FX.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-12-11 - Shy FX",
          "artist": " - 2005-12-11 - Shy FX"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-12-18%20-%20Hell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-12-18 - Hell",
          "artist": " - 2005-12-18 - Hell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-12-25%20-%20Danny%20Rampling.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-12-25 - Danny Rampling",
          "artist": " - 2005-12-25 - Danny Rampling"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202005-12-31%20-%20Sasha.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2005-12-31 - Sasha",
          "artist": " - 2005-12-31 - Sasha"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-01-08%20-%20Francois%20K.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08 - Francois K",
          "artist": " - 2006-08 - Francois K"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-01-15%20-%20Cagedbaby.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-15 - Cagedbaby",
          "artist": " - 2006-15 - Cagedbaby"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-01-22%20-%20Yousef.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-22 - Yousef",
          "artist": " - 2006-22 - Yousef"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-01-29%20-%20Coldcut.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-29 - Coldcut",
          "artist": " - 2006-29 - Coldcut"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-02-05%20-%20Layo%20and%20Bushwacka.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-02-05 - Layo and Bushwacka",
          "artist": " - 2006-02-05 - Layo and Bushwacka"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-02-12%20-%20UK%20Grime%20and%20Dubstep.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-02-12 - UK Grime and Dubstep",
          "artist": " - 2006-02-12 - UK Grime and Dubstep"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-02-19%20-%20Armin%20van%20Buuren%2C%20Trance%20Energy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-02-19 - Armin van Buuren, Trance Energy",
          "artist": " - 2006-02-19 - Armin van Buuren, Trance Energy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-02-19%20-%20Judge%20Jules%2C%20Trance%20Energy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-02-19 - Judge Jules, Trance Energy",
          "artist": " - 2006-02-19 - Judge Jules, Trance Energy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-02-26%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-02-26 - Pete Tong",
          "artist": " - 2006-02-26 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-03-05%20-%20Alex%20Smoke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-03-05 - Alex Smoke",
          "artist": " - 2006-03-05 - Alex Smoke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-03-12%20-%20Col%20Hamilton%20and%20Pete%20Tong%2C%20Lush%2010th%20Birthday%2C%20Portrush.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-03-12 - Col Hamilton and Pete Tong, Lush 10th Birthday, Portrush",
          "artist": " - 2006-03-12 - Col Hamilton and Pete Tong, Lush 10th Birthday, Portrush"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-03-19%20-%20James%20Holden%20and%20Nathan%20Fake.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-03-19 - James Holden and Nathan Fake",
          "artist": " - 2006-03-19 - James Holden and Nathan Fake"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-03-26%20-%20Desyn%20Masiello%2C%20Demi%20and%20Omid%2016b%20aka%20SOS%2C%20WMC%2C%20Miami.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-03-26 - Desyn Masiello, Demi and Omid 16b aka SOS, WMC, Miami",
          "artist": " - 2006-03-26 - Desyn Masiello, Demi and Omid 16b aka SOS, WMC, Miami"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-04-02%20-%20Mark%20Farina%20and%20Josh%20Wink.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-04-02 - Mark Farina and Josh Wink",
          "artist": " - 2006-04-02 - Mark Farina and Josh Wink"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-04-09%20-%20Tiga.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-04-09 - Tiga",
          "artist": " - 2006-04-09 - Tiga"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-04-16%20-%20Friction.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-04-16 - Friction",
          "artist": " - 2006-04-16 - Friction"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-04-23%20-%20Nic%20Fanciulli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-04-23 - Nic Fanciulli",
          "artist": " - 2006-04-23 - Nic Fanciulli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-04-30%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-04-30 - Paul Oakenfold",
          "artist": " - 2006-04-30 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-07%20-%20Gabriel%20and%20Dresden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-07 - Gabriel and Dresden",
          "artist": " - 2006-05-07 - Gabriel and Dresden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Annie%20Mac.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Annie Mac",
          "artist": " - 2006-05-13 - Annie Mac"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Dave%20Pearce.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Dave Pearce",
          "artist": " - 2006-05-13 - Dave Pearce"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Fergie",
          "artist": " - 2006-05-13 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Judge Jules",
          "artist": " - 2006-05-13 - Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Mylo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Mylo",
          "artist": " - 2006-05-13 - Mylo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-13%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-13 - Pete Tong",
          "artist": " - 2006-05-13 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-21%20-%20MYNC%20Project.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-21 - MYNC Project",
          "artist": " - 2006-05-21 - MYNC Project"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-05-28%20-%20Tiefschwarz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-05-28 - Tiefschwarz",
          "artist": " - 2006-05-28 - Tiefschwarz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-06-04%20-%20Paul%20van%20Dyk%2C%20Coloursfest%2C%20Glasgow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-06-04 - Paul van Dyk, Coloursfest, Glasgow",
          "artist": " - 2006-06-04 - Paul van Dyk, Coloursfest, Glasgow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-06-11%20-%20Damian%20Lazarus.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-06-11 - Damian Lazarus",
          "artist": " - 2006-06-11 - Damian Lazarus"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-06-18%20-%20The%20Shapeshifters.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-06-18 - The Shapeshifters",
          "artist": " - 2006-06-18 - The Shapeshifters"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-06-25%20-%20Sander%20Van%20Doorn.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-06-25 - Sander Van Doorn",
          "artist": " - 2006-06-25 - Sander Van Doorn"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-02%20-%20Booka%20Shade.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-02 - Booka Shade",
          "artist": " - 2006-07-02 - Booka Shade"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-09%20-%20Slam%20and%20Jeff%20Mills.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-09 - Slam and Jeff Mills",
          "artist": " - 2006-07-09 - Slam and Jeff Mills"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-16%20-%20Max%20Graham.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-16 - Max Graham",
          "artist": " - 2006-07-16 - Max Graham"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-23%20-%20Ame.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-23 - Ame",
          "artist": " - 2006-07-23 - Ame"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-29%20-%20Deep%20Dish%2C%20Global%20Gathering.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-29 - Deep Dish, Global Gathering",
          "artist": " - 2006-07-29 - Deep Dish, Global Gathering"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-29%20-%20Fatboy%20Slim%2C%20Global%20Gathering.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-29 - Fatboy Slim, Global Gathering",
          "artist": " - 2006-07-29 - Fatboy Slim, Global Gathering"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-29%20-%20Ferry%20Corsten%2C%20Global%20Gathering.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-29 - Ferry Corsten, Global Gathering",
          "artist": " - 2006-07-29 - Ferry Corsten, Global Gathering"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-07-29%20-%20Tiesto%2C%20Global%20Gathering.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-07-29 - Tiesto, Global Gathering",
          "artist": " - 2006-07-29 - Tiesto, Global Gathering"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-06%20-%20Ibiza%20Best%20of%202005.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-06 - Ibiza Best of 2005",
          "artist": " - 2006-08-06 - Ibiza Best of 2005"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-07%20-%20Sander%20van%20Doorn%20and%20Judge%20Jules.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-07 - Sander van Doorn and Judge Jules",
          "artist": " - 2006-08-07 - Sander van Doorn and Judge Jules"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-08%20-%20Andre%20Gazzulli%20and%20Sven%20Vath.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-08 - Andre Gazzulli and Sven Vath",
          "artist": " - 2006-08-08 - Andre Gazzulli and Sven Vath"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-09%20-%20John%20Digweed%20and%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-09 - John Digweed and Carl Cox",
          "artist": " - 2006-08-09 - John Digweed and Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-10%20-%20Oliver.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-10 - Oliver",
          "artist": " - 2006-08-10 - Oliver"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-11%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-11 - Fergie",
          "artist": " - 2006-08-11 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-12%20-%20Steve%20Lawler%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-12 - Steve Lawler and Pete Tong",
          "artist": " - 2006-08-12 - Steve Lawler and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-13%20-%20Paul%20Oakenfold%2C%20Steve%20Angello%2C%20Mauro%20Picotto%2C%20Lisa%20Lashes.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-13 - Paul Oakenfold, Steve Angello, Mauro Picotto, Lisa Lashes",
          "artist": " - 2006-08-13 - Paul Oakenfold, Steve Angello, Mauro Picotto, Lisa Lashes"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-20%20-%20Axwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-20 - Axwell",
          "artist": " - 2006-08-20 - Axwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-08-27%20-%20Seb%20Fontaine%20and%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-08-27 - Seb Fontaine and Steve Lawler",
          "artist": " - 2006-08-27 - Seb Fontaine and Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-09-03%20-%20Kerri%20Chandler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-09-03 - Kerri Chandler",
          "artist": " - 2006-09-03 - Kerri Chandler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-09-10%20-%20Paul%20van%20Dyk%20and%20Christopher%20Lawrence.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-09-10 - Paul van Dyk and Christopher Lawrence",
          "artist": " - 2006-09-10 - Paul van Dyk and Christopher Lawrence"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-09-17%20-%20Tom%20Stephan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-09-17 - Tom Stephan",
          "artist": " - 2006-09-17 - Tom Stephan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-09-24%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-09-24 - Fergie",
          "artist": " - 2006-09-24 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-01%20-%20Bob%20Sinclar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-01 - Bob Sinclar",
          "artist": " - 2006-10-01 - Bob Sinclar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-08%20-%20Marcel%20Woods%20and%20Tidy%20Boys.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-08 - Marcel Woods and Tidy Boys",
          "artist": " - 2006-10-08 - Marcel Woods and Tidy Boys"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-15%20-%20Trentemoller.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-15 - Trentemoller",
          "artist": " - 2006-10-15 - Trentemoller"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-22%20-%20Scott%20Bradford%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-22 - Scott Bradford and Pete Tong",
          "artist": " - 2006-10-22 - Scott Bradford and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-29%20-%20Andy%20Cato.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-29 - Andy Cato",
          "artist": " - 2006-10-29 - Andy Cato"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-10-29%20-%20Best%20of%202006%20Recap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-10-29 - Best of 2006 Recap",
          "artist": " - 2006-10-29 - Best of 2006 Recap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-11-05%20-%20Dan%20Ghenacia.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-11-05 - Dan Ghenacia",
          "artist": " - 2006-11-05 - Dan Ghenacia"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-11-12%20-%20Optimo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-11-12 - Optimo",
          "artist": " - 2006-11-12 - Optimo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-11-19%20-%20Mark%20Knight.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-11-19 - Mark Knight",
          "artist": " - 2006-11-19 - Mark Knight"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-11-26%20-%20DJ%20Yoda.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-11-26 - DJ Yoda",
          "artist": " - 2006-11-26 - DJ Yoda"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-12-03%20-%20Paul%20Harris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-12-03 - Paul Harris",
          "artist": " - 2006-12-03 - Paul Harris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-12-10%20-%20Adam%20Beyer.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-12-10 - Adam Beyer",
          "artist": " - 2006-12-10 - Adam Beyer"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-12-17%20-%20Sharam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-12-17 - Sharam",
          "artist": " - 2006-12-17 - Sharam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202006-12-24%20-%20Armin%20Van%20Buuren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2006-12-24 - Armin Van Buuren",
          "artist": " - 2006-12-24 - Armin Van Buuren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-01-07%20-%20Mark%20Ronson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07 - Mark Ronson",
          "artist": " - 2007-07 - Mark Ronson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-01-14%20-%20DJ%20Pierre.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-14 - DJ Pierre",
          "artist": " - 2007-14 - DJ Pierre"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-01-21%20-%20Gabriel%20Ananda.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-21 - Gabriel Ananda",
          "artist": " - 2007-21 - Gabriel Ananda"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-01-28%20-%20Seamus%20Haji.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-28 - Seamus Haji",
          "artist": " - 2007-28 - Seamus Haji"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-02-04%20-%20Radio%20Slave.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-02-04 - Radio Slave",
          "artist": " - 2007-02-04 - Radio Slave"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-02-11%20-%20John%20Askew.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-02-11 - John Askew",
          "artist": " - 2007-02-11 - John Askew"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-02-18%20-%20Danny%20Howells.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-02-18 - Danny Howells",
          "artist": " - 2007-02-18 - Danny Howells"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-02-25%20-%20Tayo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-02-25 - Tayo",
          "artist": " - 2007-02-25 - Tayo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-03-04%20-%20Eric%20Prydz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-03-04 - Eric Prydz",
          "artist": " - 2007-03-04 - Eric Prydz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-03-11%20-%20DJ%20Spen.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-03-11 - DJ Spen",
          "artist": " - 2007-03-11 - DJ Spen"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-03-18%20-%20Groove%20Armada.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-03-18 - Groove Armada",
          "artist": " - 2007-03-18 - Groove Armada"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-03-26%20-%20DJ%20Dan%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-03-26 - DJ Dan, WMC, Pool Party, Miami Beach, Florida",
          "artist": " - 2007-03-26 - DJ Dan, WMC, Pool Party, Miami Beach, Florida"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-03-26%20-%20Frankie%20Knuckles%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-03-26 - Frankie Knuckles, WMC, Pool Party, Miami Beach, Florida",
          "artist": " - 2007-03-26 - Frankie Knuckles, WMC, Pool Party, Miami Beach, Florida"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3.afpk",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk",
          "artist": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida",
          "artist": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3.png",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida png",
          "artist": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida png"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3_spectrogram.png",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida_spectrogram png",
          "artist": " - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida_spectrogram png"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-01%20-%20Richie%20Hawtin%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-01 - Richie Hawtin, WMC, Pool Party, Miami Beach, Florida",
          "artist": " - 2007-04-01 - Richie Hawtin, WMC, Pool Party, Miami Beach, Florida"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-08%20-%20Goldie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-08 - Goldie",
          "artist": " - 2007-04-08 - Goldie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-15%20-%20Phil%20Kieran.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-15 - Phil Kieran",
          "artist": " - 2007-04-15 - Phil Kieran"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-22%20-%20Fergie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-22 - Fergie",
          "artist": " - 2007-04-22 - Fergie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-04-29%20-%20Steve%20Porter.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-04-29 - Steve Porter",
          "artist": " - 2007-04-29 - Steve Porter"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-05-06%20-%20Lindstrom%20and%20Prins%20Thomas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-05-06 - Lindstrom and Prins Thomas",
          "artist": " - 2007-05-06 - Lindstrom and Prins Thomas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-05-13%20-%20D%20Ramirez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-05-13 - D Ramirez",
          "artist": " - 2007-05-13 - D Ramirez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-05-20%20-%20Pete%20Tong%2C%20Simian%20Mobile%20Disco%2C%20Judge%20Jules%20and%20Kutski%2C%20Radio%201%20Big%20Weekend%20Aftershow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-05-20 - Pete Tong, Simian Mobile Disco, Judge Jules and Kutski, Radio 1 Big Weekend Aftershow",
          "artist": " - 2007-05-20 - Pete Tong, Simian Mobile Disco, Judge Jules and Kutski, Radio 1 Big Weekend Aftershow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-05-27%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-05-27 - Carl Cox",
          "artist": " - 2007-05-27 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-06-03%20-%20Marco%20V%20and%20Simon%20Foy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-06-03 - Marco V and Simon Foy",
          "artist": " - 2007-06-03 - Marco V and Simon Foy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-06-10%20-%20Justice.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-06-10 - Justice",
          "artist": " - 2007-06-10 - Justice"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-06-17%20-%20Skream.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-06-17 - Skream",
          "artist": " - 2007-06-17 - Skream"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-06-24%20-%20Rene%20Amesz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-06-24 - Rene Amesz",
          "artist": " - 2007-06-24 - Rene Amesz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-07-01%20-%20Mauro%20Picotto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07-01 - Mauro Picotto",
          "artist": " - 2007-07-01 - Mauro Picotto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-07-08%20-%20Unabombers%2C%20Layo%20and%20Bushwacka.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07-08 - Unabombers, Layo and Bushwacka",
          "artist": " - 2007-07-08 - Unabombers, Layo and Bushwacka"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-07-15%20-%20Digitalism.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07-15 - Digitalism",
          "artist": " - 2007-07-15 - Digitalism"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-07-22%20-%20Soul%20of%20Man.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07-22 - Soul of Man",
          "artist": " - 2007-07-22 - Soul of Man"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-07-29%20-%20Paul%20Van%20Dyk%2C%20David%20Guetta%2C%20Erol%20Alkan%2C%20Sven%20Vaeth.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-07-29 - Paul Van Dyk, David Guetta, Erol Alkan, Sven Vaeth",
          "artist": " - 2007-07-29 - Paul Van Dyk, David Guetta, Erol Alkan, Sven Vaeth"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-08-05%20-%20Chris%20Lake.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-08-05 - Chris Lake",
          "artist": " - 2007-08-05 - Chris Lake"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-08-12%20-%20Sasha%2C%20Swedish%20House%20Mafia%2C%20Eddie%20Halliwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-08-12 - Sasha, Swedish House Mafia, Eddie Halliwell",
          "artist": " - 2007-08-12 - Sasha, Swedish House Mafia, Eddie Halliwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-08-19%20-%20Alex%20Wolfenden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-08-19 - Alex Wolfenden",
          "artist": " - 2007-08-19 - Alex Wolfenden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-08-26%20-%20Mike%20Pickering%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-08-26 - Mike Pickering and Pete Tong",
          "artist": " - 2007-08-26 - Mike Pickering and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-09-02%20-%20Dubfire.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-09-02 - Dubfire",
          "artist": " - 2007-09-02 - Dubfire"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-09-09%20-%20Above%20and%20Beyond%20and%20Markus%20Schulz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-09-09 - Above and Beyond and Markus Schulz",
          "artist": " - 2007-09-09 - Above and Beyond and Markus Schulz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-09-16%20-%20Diplo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-09-16 - Diplo",
          "artist": " - 2007-09-16 - Diplo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-09-23%20-%20Fedde%20Le%20Grand.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-09-23 - Fedde Le Grand",
          "artist": " - 2007-09-23 - Fedde Le Grand"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-09-29%20-%20Layo%20and%20Bushwacka%2C%20Armand%20Van%20Helden%2C%20Felix%20Da%20Housecat%2C%20Krysko.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-09-29 - Layo and Bushwacka, Armand Van Helden, Felix Da Housecat, Krysko",
          "artist": " - 2007-09-29 - Layo and Bushwacka, Armand Van Helden, Felix Da Housecat, Krysko"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-10-07%20-%20High%20Contrast.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-10-07 - High Contrast",
          "artist": " - 2007-10-07 - High Contrast"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-10-13%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-10-13 - John Digweed",
          "artist": " - 2007-10-13 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-10-20%20-%20Seb%20Fontaine.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-10-20 - Seb Fontaine",
          "artist": " - 2007-10-20 - Seb Fontaine"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-10-27%20-%20Armin%20Van%20Buuren%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-10-27 - Armin Van Buuren and Pete Tong",
          "artist": " - 2007-10-27 - Armin Van Buuren and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-11-03%20-%20Bodyrox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-11-03 - Bodyrox",
          "artist": " - 2007-11-03 - Bodyrox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-11-10%20-%20Claude%20VonStroke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-11-10 - Claude VonStroke",
          "artist": " - 2007-11-10 - Claude VonStroke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-11-17%20-%20Harri%20and%20Domenic%20Capello.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-11-17 - Harri and Domenic Capello",
          "artist": " - 2007-11-17 - Harri and Domenic Capello"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-11-24%20-%20Umek.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-11-24 - Umek",
          "artist": " - 2007-11-24 - Umek"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-12-01%20-%20Mr%20Scruff%20and%20DJ%20Marky.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-12-01 - Mr Scruff and DJ Marky",
          "artist": " - 2007-12-01 - Mr Scruff and DJ Marky"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-12-08%20-%20Nic%20Fanciulli%20and%20James%20Zabiela.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-12-08 - Nic Fanciulli and James Zabiela",
          "artist": " - 2007-12-08 - Nic Fanciulli and James Zabiela"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-12-15%20-%20Streetlife%20DJs.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-12-15 - Streetlife DJs",
          "artist": " - 2007-12-15 - Streetlife DJs"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-12-22%20-%20Axwell%2C%20Pete%20Tong%20and%20David%20Guetta%2C%20The%20Warehouse%20Project.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-12-22 - Axwell, Pete Tong and David Guetta, The Warehouse Project",
          "artist": " - 2007-12-22 - Axwell, Pete Tong and David Guetta, The Warehouse Project"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202007-12-29%20-%20Hot%20Chip.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2007-12-29 - Hot Chip",
          "artist": " - 2007-12-29 - Hot Chip"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-01-05%20-%20Herve%20and%20Sinden.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05 - Herve and Sinden",
          "artist": " - 2008-05 - Herve and Sinden"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-01-12%20-%20Gareth%20Emery.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12 - Gareth Emery",
          "artist": " - 2008-12 - Gareth Emery"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-01-19%20-%20TC.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-19 - TC",
          "artist": " - 2008-19 - TC"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-01-26%20-%20Luciano.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-26 - Luciano",
          "artist": " - 2008-26 - Luciano"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-02-02%20-%20Benga.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-02-02 - Benga",
          "artist": " - 2008-02-02 - Benga"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-02-09%20-%20Mark%20Brown.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-02-09 - Mark Brown",
          "artist": " - 2008-02-09 - Mark Brown"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-02-16%20-%20Hernan%20Cattaneo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-02-16 - Hernan Cattaneo",
          "artist": " - 2008-02-16 - Hernan Cattaneo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-02-23%20-%20Laidback%20Luke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-02-23 - Laidback Luke",
          "artist": " - 2008-02-23 - Laidback Luke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-03-01%20-%20Adam%20Freeland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-03-01 - Adam Freeland",
          "artist": " - 2008-03-01 - Adam Freeland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-03-08%20-%20Copyright.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-03-08 - Copyright",
          "artist": " - 2008-03-08 - Copyright"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-03-22%20-%20Shlomi%20Aber.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-03-22 - Shlomi Aber",
          "artist": " - 2008-03-22 - Shlomi Aber"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-03-29%20-%20Deep%20Dish%20%26%20Cedric%20Gervais%2C%20WMC%2C%20Miami%2C%20USA.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-03-29 - Deep Dish & Cedric Gervais, WMC, Miami, USA",
          "artist": " - 2008-03-29 - Deep Dish & Cedric Gervais, WMC, Miami, USA"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-05%20-%20Moby%20%26%20Carl%20Cox%2C%20Ultra%20Festival%2C%20Miami%2C%20USA.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-05 - Moby & Carl Cox, Ultra Festival, Miami, USA",
          "artist": " - 2008-04-05 - Moby & Carl Cox, Ultra Festival, Miami, USA"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-12%20-%20Barry%20Connell%2C%20Inside%20Out%20In%20Glasgow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-12 - Barry Connell, Inside Out In Glasgow",
          "artist": " - 2008-04-12 - Barry Connell, Inside Out In Glasgow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-12%20-%20Judge%20Jules%2C%20Inside%20Out%20In%20Glasgow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-12 - Judge Jules, Inside Out In Glasgow",
          "artist": " - 2008-04-12 - Judge Jules, Inside Out In Glasgow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-12%20-%20Pete%20Tong%20and%20Martin%20Doorly.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-12 - Pete Tong and Martin Doorly",
          "artist": " - 2008-04-12 - Pete Tong and Martin Doorly"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-19%20-%20Judge%20Jules%20%26%20Barry%20Connell%2C%20Live%20From%20Inside%20Out%2C%20Glasgow%2C%20Scotland.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-19 - Judge Jules & Barry Connell, Live From Inside Out, Glasgow, Scotland",
          "artist": " - 2008-04-19 - Judge Jules & Barry Connell, Live From Inside Out, Glasgow, Scotland"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-04-26%20-%20Jaymo%20%26%20Andy%20George%20%26%20Kissy%20Sell%20Out%2C%20Live%20From%20Moda%2C%20Lincoln%2C%20UK.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-04-26 - Jaymo & Andy George & Kissy Sell Out, Live From Moda, Lincoln, UK",
          "artist": " - 2008-04-26 - Jaymo & Andy George & Kissy Sell Out, Live From Moda, Lincoln, UK"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-05-03%20-%20Tom%20Maddicott%20and%20Annie%20Mac%2C%20Metripolis%2C%20Bath%2C%20UK.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05-03 - Tom Maddicott and Annie Mac, Metripolis, Bath, UK",
          "artist": " - 2008-05-03 - Tom Maddicott and Annie Mac, Metripolis, Bath, UK"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-05-10%20-%20Sebastien%20Leger.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05-10 - Sebastien Leger",
          "artist": " - 2008-05-10 - Sebastien Leger"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-05-16%20-%20Alex%20Kidd.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05-16 - Alex Kidd",
          "artist": " - 2008-05-16 - Alex Kidd"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-05-23%20-%20MSTRKRFT.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05-23 - MSTRKRFT",
          "artist": " - 2008-05-23 - MSTRKRFT"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-05-31%20-%20Dirty%20South.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-05-31 - Dirty South",
          "artist": " - 2008-05-31 - Dirty South"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-07%20-%20DJQ.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-07 - DJQ",
          "artist": " - 2008-06-07 - DJQ"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-14%20-%20Paul%20Van%20Dyk%2C%20Coloursfest.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-14 - Paul Van Dyk, Coloursfest",
          "artist": " - 2008-06-14 - Paul Van Dyk, Coloursfest"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-14%20-%20Richard%20Durand%2C%20Coloursfest.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-14 - Richard Durand, Coloursfest",
          "artist": " - 2008-06-14 - Richard Durand, Coloursfest"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-14%20-%20Wonderland%20In%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-14 - Wonderland In Ibiza",
          "artist": " - 2008-06-14 - Wonderland In Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-21%20-%20Crookers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-21 - Crookers",
          "artist": " - 2008-06-21 - Crookers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-06-28%20-%20Roger%20Sanchez.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-06-28 - Roger Sanchez",
          "artist": " - 2008-06-28 - Roger Sanchez"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-07-05%20-%20James%20Zabiela%20and%20Booka%20Shade.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-07-05 - James Zabiela and Booka Shade",
          "artist": " - 2008-07-05 - James Zabiela and Booka Shade"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-07-12%20-%20John%20O%20Callaghan.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-07-12 - John O Callaghan",
          "artist": " - 2008-07-12 - John O Callaghan"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-07-19%20-%20Deadmau5.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-07-19 - Deadmau5",
          "artist": " - 2008-07-19 - Deadmau5"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-07-26%20-%20Fred%20Falke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-07-26 - Fred Falke",
          "artist": " - 2008-07-26 - Fred Falke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-07-26%20-%20Kris%20Menace.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-07-26 - Kris Menace",
          "artist": " - 2008-07-26 - Kris Menace"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-09%20-%20Chase%20and%20Status.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-09 - Chase and Status",
          "artist": " - 2008-08-09 - Chase and Status"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-16%20-%20Paolo%20Mojo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-16 - Paolo Mojo",
          "artist": " - 2008-08-16 - Paolo Mojo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-24%20-%202Many%20Djs%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-24 - 2Many Djs, Creamfields",
          "artist": " - 2008-08-24 - 2Many Djs, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-24%20-%20Eric%20Prydz%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-24 - Eric Prydz, Creamfields",
          "artist": " - 2008-08-24 - Eric Prydz, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-24%20-%20Noisia%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-24 - Noisia, Creamfields",
          "artist": " - 2008-08-24 - Noisia, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-24%20-%20Pete%20Tong%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-24 - Pete Tong, Creamfields",
          "artist": " - 2008-08-24 - Pete Tong, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-24%20-%20Sasha%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-24 - Sasha, Creamfields",
          "artist": " - 2008-08-24 - Sasha, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-08-30%20-%20Peace%20Division.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-08-30 - Peace Division",
          "artist": " - 2008-08-30 - Peace Division"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-09-06%20-%20Mason.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-09-06 - Mason",
          "artist": " - 2008-09-06 - Mason"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-09-13%20-%20Mauro%20Picotto%20%26%20Sander%20van%20Doorn%2C%20Planet%20Love.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-09-13 - Mauro Picotto & Sander van Doorn, Planet Love",
          "artist": " - 2008-09-13 - Mauro Picotto & Sander van Doorn, Planet Love"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-09-20%20-%20Riton.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-09-20 - Riton",
          "artist": " - 2008-09-20 - Riton"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-09-27%20-%20Dennis%20Ferrer.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-09-27 - Dennis Ferrer",
          "artist": " - 2008-09-27 - Dennis Ferrer"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-10-04%20-%20John%20Dahlback.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-10-04 - John Dahlback",
          "artist": " - 2008-10-04 - John Dahlback"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-10-11%20-%20Pete%20Tong%20%26%20Deadmau5.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-10-11 - Pete Tong & Deadmau5",
          "artist": " - 2008-10-11 - Pete Tong & Deadmau5"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-10-18%20-%20Calvin%20Harris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-10-18 - Calvin Harris",
          "artist": " - 2008-10-18 - Calvin Harris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-10-25%20-%20Steve%20Mac.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-10-25 - Steve Mac",
          "artist": " - 2008-10-25 - Steve Mac"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-11-01%20-%20James%20Lavelle%20and%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-11-01 - James Lavelle and Pete Tong",
          "artist": " - 2008-11-01 - James Lavelle and Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-11-08%20-%20London%20Elektricity.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-11-08 - London Elektricity",
          "artist": " - 2008-11-08 - London Elektricity"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-11-15%20-%20Erol%20Alkan%20and%20A-Trak.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-11-15 - Erol Alkan and A-Trak",
          "artist": " - 2008-11-15 - Erol Alkan and A-Trak"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-11-22%20-%20Loco%20Dice.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-11-22 - Loco Dice",
          "artist": " - 2008-11-22 - Loco Dice"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-11-29%20-%20Flying%20Lotus.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-11-29 - Flying Lotus",
          "artist": " - 2008-11-29 - Flying Lotus"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-12-06%20-%20Markus%20Schulz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12-06 - Markus Schulz",
          "artist": " - 2008-12-06 - Markus Schulz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-12-13%20-%20Rusko.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12-13 - Rusko",
          "artist": " - 2008-12-13 - Rusko"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-12-20%20-%20Slam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12-20 - Slam",
          "artist": " - 2008-12-20 - Slam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202008-12-27%20-%20Swedish%20House%20Mafia.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2008-12-27 - Swedish House Mafia",
          "artist": " - 2008-12-27 - Swedish House Mafia"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-01-02%20-%20Jesse%20Rose.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02 - Jesse Rose",
          "artist": " - 2009-02 - Jesse Rose"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-01-09%20-%20Funk%20Agenda.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-09 - Funk Agenda",
          "artist": " - 2009-09 - Funk Agenda"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-01-16%20-%20Greg%20Wilson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-16 - Greg Wilson",
          "artist": " - 2009-16 - Greg Wilson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-01-24%20-%20Josh%20Wink.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-24 - Josh Wink",
          "artist": " - 2009-24 - Josh Wink"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-01-30%20-%20Atfc.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-30 - Atfc",
          "artist": " - 2009-30 - Atfc"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-02-06%20-%20Mr%20Scruff.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02-06 - Mr Scruff",
          "artist": " - 2009-02-06 - Mr Scruff"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-02-13%20-%20Sean%20Tyas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02-13 - Sean Tyas",
          "artist": " - 2009-02-13 - Sean Tyas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-02-21%20-%20Herve.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02-21 - Herve",
          "artist": " - 2009-02-21 - Herve"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-02-28%20-%20Blame.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-02-28 - Blame",
          "artist": " - 2009-02-28 - Blame"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-06%20-%20Kidd%20Chaos.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-06 - Kidd Chaos",
          "artist": " - 2009-03-06 - Kidd Chaos"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-06%20-%20Showtek%20and%20Kidd%20Kaos%2C%20Hard%20Dance%20Awards%202009.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-06 - Showtek and Kidd Kaos, Hard Dance Awards 2009",
          "artist": " - 2009-03-06 - Showtek and Kidd Kaos, Hard Dance Awards 2009"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-06%20-%20Showtek.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-06 - Showtek",
          "artist": " - 2009-03-06 - Showtek"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-14%20-%20Fake%20Blood.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-14 - Fake Blood",
          "artist": " - 2009-03-14 - Fake Blood"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-21%20-%20Marc%20Romboy.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-21 - Marc Romboy",
          "artist": " - 2009-03-21 - Marc Romboy"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-03-27%20-%20Gui%20Boratto.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-03-27 - Gui Boratto",
          "artist": " - 2009-03-27 - Gui Boratto"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-04-04%20-%20Tiga.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-04-04 - Tiga",
          "artist": " - 2009-04-04 - Tiga"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-04-10%20-%20Carl%20Cox.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-04-10 - Carl Cox",
          "artist": " - 2009-04-10 - Carl Cox"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-04-17%20-%20Joris%20Voorn.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-04-17 - Joris Voorn",
          "artist": " - 2009-04-17 - Joris Voorn"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-04-24%20-%20Subfocus.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-04-24 - Subfocus",
          "artist": " - 2009-04-24 - Subfocus"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-05-02%20-%20Toddla%20T.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-05-02 - Toddla T",
          "artist": " - 2009-05-02 - Toddla T"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-05-08%20-%20Big%20Weekend.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-05-08 - Big Weekend",
          "artist": " - 2009-05-08 - Big Weekend"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-05-16%20-%20Steve%20Lawler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-05-16 - Steve Lawler",
          "artist": " - 2009-05-16 - Steve Lawler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-05-30%20-%20Armin%20van%20Buuren.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-05-30 - Armin van Buuren",
          "artist": " - 2009-05-30 - Armin van Buuren"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-06-05%20-%20Style%20Of%20Eye.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-06-05 - Style Of Eye",
          "artist": " - 2009-06-05 - Style Of Eye"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-06-13%20-%20Paul%20Ritch.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-06-13 - Paul Ritch",
          "artist": " - 2009-06-13 - Paul Ritch"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-06-19%20-%20Sander%20van%20Doorn.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-06-19 - Sander van Doorn",
          "artist": " - 2009-06-19 - Sander van Doorn"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-06-27%20-%20Friendly%20Fires.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-06-27 - Friendly Fires",
          "artist": " - 2009-06-27 - Friendly Fires"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-07-04%20-%20Erick%20Morillo.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-07-04 - Erick Morillo",
          "artist": " - 2009-07-04 - Erick Morillo"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-07-11%20-%20Caspa.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-07-11 - Caspa",
          "artist": " - 2009-07-11 - Caspa"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-07-18%20-%20VA%2C%20The%20Exit%20Festival.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-07-18 - VA, The Exit Festival",
          "artist": " - 2009-07-18 - VA, The Exit Festival"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-07-24%20-%20Switch%20and%20Diplo%20Aka%20Major%20Lazer.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-07-24 - Switch and Diplo Aka Major Lazer",
          "artist": " - 2009-07-24 - Switch and Diplo Aka Major Lazer"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-01%20-%20Annie%20Mac.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-01 - Annie Mac",
          "artist": " - 2009-08-01 - Annie Mac"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-01%20-%20Eric%20Prydz%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-01 - Eric Prydz, Privilege Ibiza",
          "artist": " - 2009-08-01 - Eric Prydz, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-01%20-%20Laidback%20Luke%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-01 - Laidback Luke, Privilege Ibiza",
          "artist": " - 2009-08-01 - Laidback Luke, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-01%20-%20Luciano%2C%20Wonderland%20Eden%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-01 - Luciano, Wonderland Eden Ibiza",
          "artist": " - 2009-08-01 - Luciano, Wonderland Eden Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-01%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-01 - Pete Tong",
          "artist": " - 2009-08-01 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-15%20-%20Steve%20Bug.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-15 - Steve Bug",
          "artist": " - 2009-08-15 - Steve Bug"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-21%20-%20Felix%20Da%20Housecat.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-21 - Felix Da Housecat",
          "artist": " - 2009-08-21 - Felix Da Housecat"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-08-28%20-%20Sharam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-08-28 - Sharam",
          "artist": " - 2009-08-28 - Sharam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-09-05%20-%20Creamfields%20Special.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-09-05 - Creamfields Special",
          "artist": " - 2009-09-05 - Creamfields Special"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-09-11%20-%20Crazy%20Cousinz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-09-11 - Crazy Cousinz",
          "artist": " - 2009-09-11 - Crazy Cousinz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-09-19%20-%20James%20Talk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-09-19 - James Talk",
          "artist": " - 2009-09-19 - James Talk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-09-25%20-%20Paul%20van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-09-25 - Paul van Dyk",
          "artist": " - 2009-09-25 - Paul van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-10-02%20-%20Jamie%20Jones.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-10-02 - Jamie Jones",
          "artist": " - 2009-10-02 - Jamie Jones"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-10-10%20-%20Boys%20Noize.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-10-10 - Boys Noize",
          "artist": " - 2009-10-10 - Boys Noize"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-10-16%20-%20Terry%20Francis%20and%20Dj%20Hype.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-10-16 - Terry Francis and Dj Hype",
          "artist": " - 2009-10-16 - Terry Francis and Dj Hype"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-10-23%20-%20Dusty%20Kid.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-10-23 - Dusty Kid",
          "artist": " - 2009-10-23 - Dusty Kid"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-10-30%20-%20Sasha%2C%20Maida%20Vale%20Rewind%202005%20Special.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-10-30 - Sasha, Maida Vale Rewind 2005 Special",
          "artist": " - 2009-10-30 - Sasha, Maida Vale Rewind 2005 Special"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-11-07%20-%20DJ%20Mehdi%20%26%20Busy%20P.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-11-07 - DJ Mehdi & Busy P",
          "artist": " - 2009-11-07 - DJ Mehdi & Busy P"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-11-13%20-%20Dj%20Zinc.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-11-13 - Dj Zinc",
          "artist": " - 2009-11-13 - Dj Zinc"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-11-21%20-%20Simon%20Patterson.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-11-21 - Simon Patterson",
          "artist": " - 2009-11-21 - Simon Patterson"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-11-27%20-%20Hudson%20Mohawke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-11-27 - Hudson Mohawke",
          "artist": " - 2009-11-27 - Hudson Mohawke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-04%20-%20Tocadisco.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-04 - Tocadisco",
          "artist": " - 2009-12-04 - Tocadisco"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-11%20-%20Reboot.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-11 - Reboot",
          "artist": " - 2009-12-11 - Reboot"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-19%20-%20The%20Twelves.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-19 - The Twelves",
          "artist": " - 2009-12-19 - The Twelves"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-31%20-%20Deadmau5%2C%20O2%20Arena%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-31 - Deadmau5, O2 Arena London",
          "artist": " - 2009-12-31 - Deadmau5, O2 Arena London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-31%20-%20Eric%20Prydz%2C%20O2%20Arena%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-31 - Eric Prydz, O2 Arena London",
          "artist": " - 2009-12-31 - Eric Prydz, O2 Arena London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202009-12-31%20-%20Justice%2C%20O2%20Arena%20London.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2009-12-31 - Justice, O2 Arena London",
          "artist": " - 2009-12-31 - Justice, O2 Arena London"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-01-08%20-%20Simian%20Mobile%20Disco%20and%20Dirty%20South.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08 - Simian Mobile Disco and Dirty South",
          "artist": " - 2010-08 - Simian Mobile Disco and Dirty South"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-01-15%20-%20Christian%20Smith.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-15 - Christian Smith",
          "artist": " - 2010-15 - Christian Smith"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-01-23%20-%20Four%20Tet.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-23 - Four Tet",
          "artist": " - 2010-23 - Four Tet"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-02-12%20-%20John%2000%20Fleming.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-02-12 - John 00 Fleming",
          "artist": " - 2010-02-12 - John 00 Fleming"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-02-20%20-%20Jack%20Beats.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-02-20 - Jack Beats",
          "artist": " - 2010-02-20 - Jack Beats"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-02-26%20-%20Faithless%20Soundsystem.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-02-26 - Faithless Soundsystem",
          "artist": " - 2010-02-26 - Faithless Soundsystem"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-03-06%20-%20Kissy%20Sell%20Out%20and%20Alex%20Metric.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-03-06 - Kissy Sell Out and Alex Metric",
          "artist": " - 2010-03-06 - Kissy Sell Out and Alex Metric"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-03-19%20-%20Sebastien%20Leger.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-03-19 - Sebastien Leger",
          "artist": " - 2010-03-19 - Sebastien Leger"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-03%20-%20James%20Zabiela.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-03 - James Zabiela",
          "artist": " - 2010-04-03 - James Zabiela"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-23%20-%20Aeroplane%2C%20Circus%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-23 - Aeroplane, Circus Liverpool",
          "artist": " - 2010-04-23 - Aeroplane, Circus Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-23%20-%20Pete%20Tong%2C%20Circus%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-23 - Pete Tong, Circus Liverpool",
          "artist": " - 2010-04-23 - Pete Tong, Circus Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-23%20-%20Richie%20Hawtin%2C%20Circus%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-23 - Richie Hawtin, Circus Liverpool",
          "artist": " - 2010-04-23 - Richie Hawtin, Circus Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-23%20-%20Sasha%20and%20Richie%20Hawtin%2C%20Circus%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-23 - Sasha and Richie Hawtin, Circus Liverpool",
          "artist": " - 2010-04-23 - Sasha and Richie Hawtin, Circus Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-23%20-%20Sasha%2C%20Circus%20Liverpool.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-23 - Sasha, Circus Liverpool",
          "artist": " - 2010-04-23 - Sasha, Circus Liverpool"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-04-30%20-%20Breakage.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-04-30 - Breakage",
          "artist": " - 2010-04-30 - Breakage"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-05-28%20-%20John%20Digweed.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-05-28 - John Digweed",
          "artist": " - 2010-05-28 - John Digweed"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-06-04%20-%20Tim%20Green.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-06-04 - Tim Green",
          "artist": " - 2010-06-04 - Tim Green"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-06-12%20-%20Chuckie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-06-12 - Chuckie",
          "artist": " - 2010-06-12 - Chuckie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-08%20-%20Above%20and%20Beyond%2C%20Privilege%2C%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-08 - Above and Beyond, Privilege, Ibiza",
          "artist": " - 2010-08-08 - Above and Beyond, Privilege, Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-08%20-%20Annie%20Mac%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-08 - Annie Mac, Privilege Ibiza",
          "artist": " - 2010-08-08 - Annie Mac, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-08%20-%20Pete%20Tong%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-08 - Pete Tong, Privilege Ibiza",
          "artist": " - 2010-08-08 - Pete Tong, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-08%20-%20Underworld%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-08 - Underworld, Privilege Ibiza",
          "artist": " - 2010-08-08 - Underworld, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-14%20-%20Chris%20Lake.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-14 - Chris Lake",
          "artist": " - 2010-08-14 - Chris Lake"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-08-29%20-%20Swedish%20House%20Mafia%2C%20Creamfields.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-08-29 - Swedish House Mafia, Creamfields",
          "artist": " - 2010-08-29 - Swedish House Mafia, Creamfields"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-11-20%20-%202000%20and%20One.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-11-20 - 2000 and One",
          "artist": " - 2010-11-20 - 2000 and One"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202010-12-04%20-%20Sander%20Kleinenberg.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2010-12-04 - Sander Kleinenberg",
          "artist": " - 2010-12-04 - Sander Kleinenberg"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-01-07%20-%20Retro%20Grade.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07 - Retro Grade",
          "artist": " - 2011-07 - Retro Grade"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-01-15%20-%20Gareth%20Wyn.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-15 - Gareth Wyn",
          "artist": " - 2011-15 - Gareth Wyn"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-01-22%20-%20Beardyman.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-22 - Beardyman",
          "artist": " - 2011-22 - Beardyman"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-02-05%20-%20Marco%20Carola.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-02-05 - Marco Carola",
          "artist": " - 2011-02-05 - Marco Carola"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-02-12%20-%20Cosmic%20Gate.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-02-12 - Cosmic Gate",
          "artist": " - 2011-02-12 - Cosmic Gate"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-02-19%20-%20Laidback%20Luke.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-02-19 - Laidback Luke",
          "artist": " - 2011-02-19 - Laidback Luke"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-02-26%20-%20Carl%20Craig.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-02-26 - Carl Craig",
          "artist": " - 2011-02-26 - Carl Craig"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-03-05%20-%20Soul%20Clap.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-03-05 - Soul Clap",
          "artist": " - 2011-03-05 - Soul Clap"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-03-12%20-%20Kode9.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-03-12 - Kode9",
          "artist": " - 2011-03-12 - Kode9"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-03-19%20-%20Dimitri%20From%20Paris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-03-19 - Dimitri From Paris",
          "artist": " - 2011-03-19 - Dimitri From Paris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-03-26%20-%20Robert%20Babicz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-03-26 - Robert Babicz",
          "artist": " - 2011-03-26 - Robert Babicz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-04-02%20-%20Brodinski.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04-02 - Brodinski",
          "artist": " - 2011-04-02 - Brodinski"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-04-09%20-%20Pete%20Tong.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04-09 - Pete Tong",
          "artist": " - 2011-04-09 - Pete Tong"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-04-16%20-%20Alex%20Metric.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04-16 - Alex Metric",
          "artist": " - 2011-04-16 - Alex Metric"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-04-23%20-%20Axwell%20and%20Norman%20Doray.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04-23 - Axwell and Norman Doray",
          "artist": " - 2011-04-23 - Axwell and Norman Doray"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-04-30%20-%20Riva%20Starr%20and%20Funkagenda.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-04-30 - Riva Starr and Funkagenda",
          "artist": " - 2011-04-30 - Riva Starr and Funkagenda"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-05-07%20-%20Seth%20Troxler.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-05-07 - Seth Troxler",
          "artist": " - 2011-05-07 - Seth Troxler"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-05-14%20-%20Sharam.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-05-14 - Sharam",
          "artist": " - 2011-05-14 - Sharam"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-05-21%20-%20Calvin%20Harris.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-05-21 - Calvin Harris",
          "artist": " - 2011-05-21 - Calvin Harris"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-06-04%20-%20Derrick%20Carter.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-06-04 - Derrick Carter",
          "artist": " - 2011-06-04 - Derrick Carter"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-06-11%20-%20The%20Japanese%20Popstars.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-06-11 - The Japanese Popstars",
          "artist": " - 2011-06-11 - The Japanese Popstars"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-06-25%20-%20Scuba%20and%20Redlight%2C%20Sonar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-06-25 - Scuba and Redlight, Sonar",
          "artist": " - 2011-06-25 - Scuba and Redlight, Sonar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-07-02%20-%20Above%20And%20Beyond.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07-02 - Above And Beyond",
          "artist": " - 2011-07-02 - Above And Beyond"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-07-09%20-%20Maya%20Jane%20Coles.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07-09 - Maya Jane Coles",
          "artist": " - 2011-07-09 - Maya Jane Coles"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-07-16%20-%20Martin%20Solveig.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07-16 - Martin Solveig",
          "artist": " - 2011-07-16 - Martin Solveig"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-07-23%20-%20Brookes%20Brothers.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07-23 - Brookes Brothers",
          "artist": " - 2011-07-23 - Brookes Brothers"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-07-30%20-%20Paul%20Kalkbrenner.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-07-30 - Paul Kalkbrenner",
          "artist": " - 2011-07-30 - Paul Kalkbrenner"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Annie%20Mac%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Annie Mac, Space Ibiza",
          "artist": " - 2011-08-06 - Annie Mac, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Chuckie%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Chuckie, Space Ibiza",
          "artist": " - 2011-08-06 - Chuckie, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Deadmau5%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Deadmau5, Space Ibiza",
          "artist": " - 2011-08-06 - Deadmau5, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Funkagenda%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Funkagenda, Space Ibiza",
          "artist": " - 2011-08-06 - Funkagenda, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Jamie%20Jones%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Jamie Jones, Space Ibiza",
          "artist": " - 2011-08-06 - Jamie Jones, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Judge%20Jules%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Judge Jules, Space Ibiza",
          "artist": " - 2011-08-06 - Judge Jules, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Knife%20Party%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Knife Party, Space Ibiza",
          "artist": " - 2011-08-06 - Knife Party, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Kutski%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Kutski, Space Ibiza",
          "artist": " - 2011-08-06 - Kutski, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Magnetic%20Man%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Magnetic Man, Space Ibiza",
          "artist": " - 2011-08-06 - Magnetic Man, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Mark%20Knight%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Mark Knight, Space Ibiza",
          "artist": " - 2011-08-06 - Mark Knight, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Skream%20and%20Benga%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Skream and Benga, Space Ibiza",
          "artist": " - 2011-08-06 - Skream and Benga, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-06%20-%20Zane%20Lowe%2C%20Space%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-06 - Zane Lowe, Space Ibiza",
          "artist": " - 2011-08-06 - Zane Lowe, Space Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-19%20-%20Stacey%20Pullen.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-19 - Stacey Pullen",
          "artist": " - 2011-08-19 - Stacey Pullen"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-08-27%20-%20Jamie%20Xx.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-08-27 - Jamie Xx",
          "artist": " - 2011-08-27 - Jamie Xx"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-09-10%20-%20Kaskade.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-09-10 - Kaskade",
          "artist": " - 2011-09-10 - Kaskade"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-09-17%20-%20James%20Blake.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-09-17 - James Blake",
          "artist": " - 2011-09-17 - James Blake"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-09-24%20-%20Julio%20Bashmore.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-09-24 - Julio Bashmore",
          "artist": " - 2011-09-24 - Julio Bashmore"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-10-01%20-%20Luciano.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-10-01 - Luciano",
          "artist": " - 2011-10-01 - Luciano"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-10-08%20-%20Modeselektor.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-10-08 - Modeselektor",
          "artist": " - 2011-10-08 - Modeselektor"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-10-15%20-%20Sbtrkt.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-10-15 - Sbtrkt",
          "artist": " - 2011-10-15 - Sbtrkt"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-10-22%20-%20Art%20Department.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-10-22 - Art Department",
          "artist": " - 2011-10-22 - Art Department"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-11-05%20-%20An21%20and%20Max%20Vangeli.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-11-05 - An21 and Max Vangeli",
          "artist": " - 2011-11-05 - An21 and Max Vangeli"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-11-12%20-%20Alan%20Fitzpatrick.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-11-12 - Alan Fitzpatrick",
          "artist": " - 2011-11-12 - Alan Fitzpatrick"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-11-19%20-%20Joker.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-11-19 - Joker",
          "artist": " - 2011-11-19 - Joker"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-11-26%20-%20Eats%20Everything.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-11-26 - Eats Everything",
          "artist": " - 2011-11-26 - Eats Everything"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-12-03%20-%20Pearson%20Sound.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-12-03 - Pearson Sound",
          "artist": " - 2011-12-03 - Pearson Sound"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202011-12-10%20-%20Michael%20Woods.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2011-12-10 - Michael Woods",
          "artist": " - 2011-12-10 - Michael Woods"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-07%20-%20L-Vis%201990.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-07 - L-Vis 1990",
          "artist": " - 2012-07 - L-Vis 1990"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-14%20-%20Azari%20and%20Iii.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-14 - Azari and Iii",
          "artist": " - 2012-14 - Azari and Iii"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-21%20-%20The%202%20Bears.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-21 - The 2 Bears",
          "artist": " - 2012-21 - The 2 Bears"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-27%20-%20Chuckie%2C%20Hull.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-27 - Chuckie, Hull",
          "artist": " - 2012-27 - Chuckie, Hull"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-28%20-%20Judge%20Jules%2C%20Hull.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-28 - Judge Jules, Hull",
          "artist": " - 2012-28 - Judge Jules, Hull"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-01-28%20-%20Porter%20Robinson%2C%20Hull.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-28 - Porter Robinson, Hull",
          "artist": " - 2012-28 - Porter Robinson, Hull"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-02-11%20-%20Arty.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-02-11 - Arty",
          "artist": " - 2012-02-11 - Arty"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-02-18%20-%20Maceo%20Plex.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-02-18 - Maceo Plex",
          "artist": " - 2012-02-18 - Maceo Plex"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-02-25%20-%20Scuba.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-02-25 - Scuba",
          "artist": " - 2012-02-25 - Scuba"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-03-03%20-%20Butch.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-03-03 - Butch",
          "artist": " - 2012-03-03 - Butch"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-03-10%20-%20Moguai.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-03-10 - Moguai",
          "artist": " - 2012-03-10 - Moguai"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-03-17%20-%20Martyn.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-03-17 - Martyn",
          "artist": " - 2012-03-17 - Martyn"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-03-24%20-%20Alesso.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-03-24 - Alesso",
          "artist": " - 2012-03-24 - Alesso"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-03-31%20-%20Guti.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-03-31 - Guti",
          "artist": " - 2012-03-31 - Guti"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-04-07%20-%20Rustie.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-04-07 - Rustie",
          "artist": " - 2012-04-07 - Rustie"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-04-14%20-%20Flux%20Pavilion.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-04-14 - Flux Pavilion",
          "artist": " - 2012-04-14 - Flux Pavilion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-04-28%20-%20Nicky%20Romero.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-04-28 - Nicky Romero",
          "artist": " - 2012-04-28 - Nicky Romero"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-05-05%20-%20Groove%20Armada.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-05-05 - Groove Armada",
          "artist": " - 2012-05-05 - Groove Armada"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-05-12%20-%20Nina%20Kraviz.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-05-12 - Nina Kraviz",
          "artist": " - 2012-05-12 - Nina Kraviz"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-05-19%20-%20Nicolas%20Jaar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-05-19 - Nicolas Jaar",
          "artist": " - 2012-05-19 - Nicolas Jaar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-05-26%20-%20Dubfire.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-05-26 - Dubfire",
          "artist": " - 2012-05-26 - Dubfire"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-06-02%20-%20Hot%20Chip.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-06-02 - Hot Chip",
          "artist": " - 2012-06-02 - Hot Chip"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-06-23%20-%20Nicole%20Moudaber.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-06-23 - Nicole Moudaber",
          "artist": " - 2012-06-23 - Nicole Moudaber"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-07-14%20-%20Jacques%20Lu%20Cont.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-07-14 - Jacques Lu Cont",
          "artist": " - 2012-07-14 - Jacques Lu Cont"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-07-21%20-%20Paul%20Oakenfold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-07-21 - Paul Oakenfold",
          "artist": " - 2012-07-21 - Paul Oakenfold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-07-28%20-%20Solomun.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-07-28 - Solomun",
          "artist": " - 2012-07-28 - Solomun"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-11%20-%20Benny%20Benassi%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-11 - Benny Benassi, Privilege Ibiza",
          "artist": " - 2012-08-11 - Benny Benassi, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-11%20-%20Chase%20and%20Status%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-11 - Chase and Status, Privilege Ibiza",
          "artist": " - 2012-08-11 - Chase and Status, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-11%20-%20Pete%20Tong%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-11 - Pete Tong, Privilege Ibiza",
          "artist": " - 2012-08-11 - Pete Tong, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-11%20-%20Sebastian%20Ingrosso%20and%20Alesso%2C%20Privilege%20Ibiza.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-11 - Sebastian Ingrosso and Alesso, Privilege Ibiza",
          "artist": " - 2012-08-11 - Sebastian Ingrosso and Alesso, Privilege Ibiza"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-18%20-%20Totally%20Enormous%20Extinct%20Dinosaurs.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-18 - Totally Enormous Extinct Dinosaurs",
          "artist": " - 2012-08-18 - Totally Enormous Extinct Dinosaurs"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-08-25%20-%20Miguel%20Campbell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-08-25 - Miguel Campbell",
          "artist": " - 2012-08-25 - Miguel Campbell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-09-15%20-%20Karlsson%20and%20Winnberg%20of%20Miike%20Snow.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-09-15 - Karlsson and Winnberg of Miike Snow",
          "artist": " - 2012-09-15 - Karlsson and Winnberg of Miike Snow"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-09-22%20-%20Drumsound%20and%20Bassline%20Smith.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-09-22 - Drumsound and Bassline Smith",
          "artist": " - 2012-09-22 - Drumsound and Bassline Smith"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-09-29%20-%20Davide%20Squillace.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-09-29 - Davide Squillace",
          "artist": " - 2012-09-29 - Davide Squillace"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-10-06%20-%20Photek.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-10-06 - Photek",
          "artist": " - 2012-10-06 - Photek"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-10-13%20-%20Dusky.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-10-13 - Dusky",
          "artist": " - 2012-10-13 - Dusky"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-10-20%20-%20Yousef.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-10-20 - Yousef",
          "artist": " - 2012-10-20 - Yousef"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-11-03%20-%20Thomas%20Gold.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-11-03 - Thomas Gold",
          "artist": " - 2012-11-03 - Thomas Gold"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-11-10%20-%20Lee%20Foss.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-11-10 - Lee Foss",
          "artist": " - 2012-11-10 - Lee Foss"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-11-17%20-%20Deetron.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-11-17 - Deetron",
          "artist": " - 2012-11-17 - Deetron"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-11-24%20-%20Hardwell.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-11-24 - Hardwell",
          "artist": " - 2012-11-24 - Hardwell"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-12-01%20-%20The%20Gaslamp%20Killer.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-12-01 - The Gaslamp Killer",
          "artist": " - 2012-12-01 - The Gaslamp Killer"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-12-08%20-%20Calyx%20and%20Teebee.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-12-08 - Calyx and Teebee",
          "artist": " - 2012-12-08 - Calyx and Teebee"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202012-12-15%20-%20Eats%20Everything.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2012-12-15 - Eats Everything",
          "artist": " - 2012-12-15 - Eats Everything"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%202014.01.04%20-%20Kolsch.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - 2014 01 04 - Kolsch",
          "artist": " - 2014 01 04 - Kolsch"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%20Global%20Gathering%20with%20Paul%20van%20Dyk%2C%20David%20Guetta%2C%20Erol%20Alkan%2C%20Sven%20Vath%20and%20Pete%20Tong%20-%2029-Jul-2007.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - Global Gathering with Paul van Dyk, David Guetta, Erol Alkan, Sven Vath and Pete Tong - 29-Jul-2007",
          "artist": " - Global Gathering with Paul van Dyk, David Guetta, Erol Alkan, Sven Vath and Pete Tong - 29-Jul-2007"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%20-%20Miami%20WMC.mp3",
        "duration": 99999,
        "metaData": {
          "title": " - Miami WMC",
          "artist": " - Miami WMC"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%2019-02-2006%20-%20Trance%20Energy%20%28Armin%20Van%20Buuren%20and%20Judge%20Jules%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 19-02-2006 - Trance Energy (Armin Van Buuren and Judge Jules)",
          "artist": " 19-02-2006 - Trance Energy (Armin Van Buuren and Judge Jules)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%2019.05.2012%20-%20Nicolas%20Jaar.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 19 05 2012 - Nicolas Jaar",
          "artist": " 19 05 2012 - Nicolas Jaar"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%202000-12-31%20-%20Dave%20Pearce%20%26%20David%20Morales%2C%20Dreem%20Team%2C%20Paul%20Oakenfold%2C%20Jon%20Carter%2C%20Judge%20Jules%2C%20Seb%20Fontain.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 2000-12-31 - Dave Pearce & David Morales, Dreem Team, Paul Oakenfold, Jon Carter, Judge Jules, Seb Fontain",
          "artist": " 2000-12-31 - Dave Pearce & David Morales, Dreem Team, Paul Oakenfold, Jon Carter, Judge Jules, Seb Fontain"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%202006-02-19%20-%20Armin%20van%20Buuren%2C%20Judge%20Jules%20%28Trance%20Energy%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 2006-02-19 - Armin van Buuren, Judge Jules (Trance Energy)",
          "artist": " 2006-02-19 - Armin van Buuren, Judge Jules (Trance Energy)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%202008-06-14%20-%20Groove%20Armada%2C%20Richard%20Durrand%2C%20Paul%20Van%20Dyk.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 2008-06-14 - Groove Armada, Richard Durrand, Paul Van Dyk",
          "artist": " 2008-06-14 - Groove Armada, Richard Durrand, Paul Van Dyk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix%202009-02-14%20-%20Sean%20Tyas.mp3",
        "duration": 99999,
        "metaData": {
          "title": " 2009-02-14 - Sean Tyas",
          "artist": " 2009-02-14 - Sean Tyas"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential%20Mix.mp3",
        "duration": 99999,
        "metaData": {
          "title": "",
          "artist": ""
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential-Mix-2008-01-26-LUCIANO--www.Filter27.com.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Essential-Mix-2008-26-LUCIANO--www Filter27 com",
          "artist": "Essential-Mix-2008-26-LUCIANO--www Filter27 com"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential.DJTeam.-.TranceEscape.Live.%2808.02.03%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Essential DJTeam - TranceEscape Live (08 02 03)",
          "artist": "Essential DJTeam - TranceEscape Live (08 02 03)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Essential_Mix_-_2009-07-18_-_Richie_Hawtin___Dubfire__Magda___Locodice.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Essential_Mix_-_2009-07-18_-_Richie_Hawtin___Dubfire__Magda___Locodice",
          "artist": "Essential_Mix_-_2009-07-18_-_Richie_Hawtin___Dubfire__Magda___Locodice"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Felix%20Da%20Housecat%20-%20Essential%20Mix%20%5B2013-02-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Felix Da Housecat -  [2013-02-23]",
          "artist": "Felix Da Housecat -  [2013-02-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Felix_Da_Housecat_-_Essential_Mix_-_23-02-2013-www.mixing.dj.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Felix_Da_Housecat_-_Essential_Mix_-_23-02-2013-www mixing dj",
          "artist": "Felix_Da_Housecat_-_Essential_Mix_-_23-02-2013-www mixing dj"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Fergie%20-%20Essential%20Mix%20%5B2001-05-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Fergie -  [2005-06]",
          "artist": "Fergie -  [2005-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Frankie%20Knuckles%20-%20BBC%20Radio%201%27s%20Essential%20Mix%20%28Essential%20Mix%20Masters%29%20-%204%20April%202015.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Frankie Knuckles - BBC Radio 1's  ( Masters) - 4 April 2015",
          "artist": "Frankie Knuckles - BBC Radio 1's  ( Masters) - 4 April 2015"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Friendly%20Fires%20-%20Essential%20Mix%20%5B2009-06-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Friendly Fires -  [2009-06-27]",
          "artist": "Friendly Fires -  [2009-06-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Funkagenda%20-%20Essential%20Mix%20%5B2009-01-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Funkagenda -  [2009-10]",
          "artist": "Funkagenda -  [2009-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Future%20Sound%20of%20London%20-%20Essential%20Mix%20%5B1993-12-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Future Sound of London -  [1993-12-04]",
          "artist": "Future Sound of London -  [1993-12-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Gabriel%20%26%20Dresden%20-%20Essential%20Mix%20%5B2003-03-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Gabriel & Dresden -  [2003-03-09]",
          "artist": "Gabriel & Dresden -  [2003-03-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Gareth%20Wyn%20-%20Essential%20Mix%20%5B2011-01-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Gareth Wyn -  [2011-15]",
          "artist": "Gareth Wyn -  [2011-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/George%20Fitzgerald%20-%20Essential%20Mix%20%5B2013-01-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "George Fitzgerald -  [2013-19]",
          "artist": "George Fitzgerald -  [2013-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Gordon%20Kaye%20-%20Essential%20Mix%20%5B2002-03-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Gordon Kaye -  [2002-03-03]",
          "artist": "Gordon Kaye -  [2002-03-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Greg%20Vickers%20-%20Essential%20Mix%20%5B2002-05-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Greg Vickers -  [2002-05-06]",
          "artist": "Greg Vickers -  [2002-05-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Greg%20Wilson%20-%20Essential%20Mix%20%5B2009-01-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Greg Wilson -  [2009-17]",
          "artist": "Greg Wilson -  [2009-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Groove%20Armada%20-%20Essential%20Mix%20%5B2002-10-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Groove Armada -  [2002-10-13]",
          "artist": "Groove Armada -  [2002-10-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Groove%20Armada%20-%20Essential%20Mix%20%5B2007-03-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Groove Armada -  [2007-03-18]",
          "artist": "Groove Armada -  [2007-03-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Groove%20Armada%20-%20Essential%20Mix%20%5B2008-06-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Groove Armada -  [2008-06-14]",
          "artist": "Groove Armada -  [2008-06-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Groove%20Armada%20-%20Essential%20Mix%20%5B2012-05-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Groove Armada -  [2012-05-05]",
          "artist": "Groove Armada -  [2012-05-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Gui%20Boratto%20-%20Essential%20Mix%20%5B2009-03-28%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Gui Boratto -  [2009-03-28]",
          "artist": "Gui Boratto -  [2009-03-28]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Guti%20-%20Essential%20Mix%20%5B2012-03-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Guti -  [2012-03-31]",
          "artist": "Guti -  [2012-03-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Guy%20Gerber%20-%20Essential%20Mix%20%5B2013-09-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Guy Gerber -  [2013-09-21]",
          "artist": "Guy Gerber -  [2013-09-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Harri%20%26%20Domenic%20Capello%20-%20Essential%20Mix%20%5B2007-11-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Harri & Domenic Capello -  [2007-11-17]",
          "artist": "Harri & Domenic Capello -  [2007-11-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Herve%20-%20Essential%20Mix%20%5B2009-02-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Herve -  [2009-02-21]",
          "artist": "Herve -  [2009-02-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/High%20Contrast%20-%20Essential%20Mix%20%5B2003-04-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "High Contrast -  [2003-04-06]",
          "artist": "High Contrast -  [2003-04-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Hot%20Chip%20-%20Essential%20Mix%20%5B2012-06-02%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Hot Chip -  [2012-06-02]",
          "artist": "Hot Chip -  [2012-06-02]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Hot%20Natured%20-%20Essential%20Mix%20%5B2014-04-26%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Hot Natured -  [2014-04-26]",
          "artist": "Hot Natured -  [2014-04-26]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Hot%20Since%2082%20-%20Essential%20Mix%20%5B2013-08-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Hot Since 82 -  [2013-08-17]",
          "artist": "Hot Since 82 -  [2013-08-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Infusion%20-%20Essential%20Mix%20%5B2004-01-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Infusion -  [2004-04]",
          "artist": "Infusion -  [2004-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jackmaster%20-%20Essential%20Mix%20%5B2014-03-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jackmaster -  [2014-03-15]",
          "artist": "Jackmaster -  [2014-03-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jakwob%20-%20Essential%20Mix%20%5B2014-05-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jakwob -  [2014-05-03]",
          "artist": "Jakwob -  [2014-05-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/James%20Holden%20-%20Essential%20Mix%20%5B2002-01-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "James Holden -  [2002-20]",
          "artist": "James Holden -  [2002-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/James%20Talk%20-%20Essential%20Mix%20%5B2009-09-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "James Talk -  [2009-09-19]",
          "artist": "James Talk -  [2009-09-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/James%20Zabiela%20-%20Essential%20Mix%20%5B2002-03-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "James Zabiela -  [2002-03-17]",
          "artist": "James Zabiela -  [2002-03-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/James%20Zabiela%20-%20Essential%20Mix%20%5B2004-02-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "James Zabiela -  [2004-02-22]",
          "artist": "James Zabiela -  [2004-02-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jamie%20Jones%20-%20Essential%20Mix%20%5B2013-08-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jamie Jones -  [2013-08-03]",
          "artist": "Jamie Jones -  [2013-08-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jamie%20XX%20-%20Essential%20Mix%20%5B2011-08-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jamie XX -  [2011-08-27]",
          "artist": "Jamie XX -  [2011-08-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Japanese%20Popstars%20-%20Essential%20Mix%20%5B2011-06-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Japanese Popstars -  [2011-06-11]",
          "artist": "Japanese Popstars -  [2011-06-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jaymo%20%26%20Andy%20George%20-%20Essential%20Mix%20%5B2013-04-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jaymo & Andy George -  [2013-04-06]",
          "artist": "Jaymo & Andy George -  [2013-04-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jeff%20Mills%20-%20Essential%20Mix%20%5B1998-06-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jeff Mills -  [1998-06-07]",
          "artist": "Jeff Mills -  [1998-06-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Jesse%20Rose%20-%20Essential%20Mix%20%5B2009-01-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Jesse Rose -  [2009-03]",
          "artist": "Jesse Rose -  [2009-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/John%20%2700%27%20Fleming%20-%20Essential%20Mix%20%5B2010-02-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "John '00' Fleming -  [2010-02-13]",
          "artist": "John '00' Fleming -  [2010-02-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/John%20Digweed%20-%20Essential%20Mix%20%5B1995-09-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "John Digweed -  [1995-09-03]",
          "artist": "John Digweed -  [1995-09-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/John%20Digweed%20-%20Essential%20Mix%20%5B1999-05-16%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "John Digweed -  [1999-05-16]",
          "artist": "John Digweed -  [1999-05-16]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Joris%20Voorn%20-%20Essential%20Mix%20%5B2009-04-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Joris Voorn -  [2009-04-18]",
          "artist": "Joris Voorn -  [2009-04-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Joris%20Voorn%20-%20Essential%20Mix%20%5B2010-09-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Joris Voorn -  [2010-09-11]",
          "artist": "Joris Voorn -  [2010-09-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Josh%20Wink%20-%20Essential%20Mix%20%5B2009-01-24%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Josh Wink -  [2009-24]",
          "artist": "Josh Wink -  [2009-24]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Juan%20MacLean%20-%20Essential%20Mix%20%5B2013-06-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Juan MacLean -  [2013-06-08]",
          "artist": "Juan MacLean -  [2013-06-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Judge%20Jules%20-%20Essential%20Mix%20%5B1995-08-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Judge Jules -  [1995-08-06]",
          "artist": "Judge Jules -  [1995-08-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Judge%20Jules%20-%20Essential%20Mix%20%5B1997-08-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Judge Jules -  [1997-08-17]",
          "artist": "Judge Jules -  [1997-08-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Judge%20Jules%20-%20Essential%20Mix%20%5B1999-12-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Judge Jules -  [1999-12-05]",
          "artist": "Judge Jules -  [1999-12-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Judge%20Jules%20-%20Essential%20Mix%20%5B2013-09-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Judge Jules -  [2013-09-07]",
          "artist": "Judge Jules -  [2013-09-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Julio%20Bashmore%20-%20Essential%20Mix%20%5B2011-09-24%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Julio Bashmore -  [2011-09-24]",
          "artist": "Julio Bashmore -  [2011-09-24]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Kink%20-%20Essential%20Mix%20%5B2014-05-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Kink -  [2014-05-31]",
          "artist": "Kink -  [2014-05-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Kolsch%20-%20Essential%20Mix%20%5B2014-01-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Kolsch -  [2014-04]",
          "artist": "Kolsch -  [2014-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Kolsch%20-%20Essential_mix-sat-01-04-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Kolsch - Essential_mix-sat-04-2014-talion",
          "artist": "Kolsch - Essential_mix-sat-04-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Laidback%20Luke%20-%20Essential%20Mix%20%5B2011-02-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Laidback Luke -  [2011-02-19]",
          "artist": "Laidback Luke -  [2011-02-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Laurent%20Garnier%20-%20Breezeblock%20%5B2005-01-25%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Laurent Garnier - Breezeblock [2005-25]",
          "artist": "Laurent Garnier - Breezeblock [2005-25]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Laurent%20Garnier%20-%20Essential%20Mix%2005-04-2014.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Laurent Garnier -  05-04-2014",
          "artist": "Laurent Garnier -  05-04-2014"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Laurent%20Garnier%20-%20Essential%20Mix%20%5B2014-04-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Laurent Garnier -  [2014-04-05]",
          "artist": "Laurent Garnier -  [2014-04-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Laurent%20Garnier%20-%20Essential%20Mix%2C%202000.01.30%2C%20BBC%20Radio.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Laurent Garnier - , 2000 01 30, BBC Radio",
          "artist": "Laurent Garnier - , 2000 01 30, BBC Radio"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Layo%20%26%20Bushwacka%20-%20Essential%20Mix%20%5B1999-09-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Layo & Bushwacka -  [1999-09-19]",
          "artist": "Layo & Bushwacka -  [1999-09-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Layo%20%26%20Bushwacka%20-%20Essential%20Mix%20%5B2006-02-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Layo & Bushwacka -  [2006-02-05]",
          "artist": "Layo & Bushwacka -  [2006-02-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Lee%20Foss%20-%20Essential%20Mix%20%5B2012-11-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Lee Foss -  [2012-11-10]",
          "artist": "Lee Foss -  [2012-11-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Leftfield%20-%20Essential%20Mix%20%5B2000-04-16%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Leftfield -  [2000-04-16]",
          "artist": "Leftfield -  [2000-04-16]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Lucien%20Foort%20-%20Essential%20Mix%20%5B2001-03-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Lucien Foort -  [2003-04]",
          "artist": "Lucien Foort -  [2003-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Maceo%20Plex%20-%20Essential%20Mix%20%5B2012-02-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Maceo Plex -  [2012-02-18]",
          "artist": "Maceo Plex -  [2012-02-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Magda%20-%20Essential%20Mix%20%5B2010-10-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Magda -  [2010-10-30]",
          "artist": "Magda -  [2010-10-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Magda%20-%20Essential_mix-sat-03-08-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Magda - Essential_mix-sat-03-08-2014-talion",
          "artist": "Magda - Essential_mix-sat-03-08-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mala%20-%20Essential%20Mix%20%5B2013-04-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mala -  [2013-04-13]",
          "artist": "Mala -  [2013-04-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Marcel%20Dettmann%20-%20Essential%20Mix%20%5B2014-04-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Marcel Dettmann -  [2014-04-19]",
          "artist": "Marcel Dettmann -  [2014-04-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Marco%20Carola%20-%20Essential%20Mix%20%5B2011-02-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Marco Carola -  [2011-02-05]",
          "artist": "Marco Carola -  [2011-02-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Marco%20V%20-%20Essential%20Mix%20%5B2004-10-10%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Marco V -  [2004-10-10]",
          "artist": "Marco V -  [2004-10-10]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mark%20Brown%20-%20Essential%20Mix%20%5B2008-02-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mark Brown -  [2008-02-09]",
          "artist": "Mark Brown -  [2008-02-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Markus%20Schulz%20-%202004-05-24%20-%20Global%20DJ%20Broadcast%2C%20Essentials%2C%20Party931.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Markus Schulz - 2004-05-24 - Global DJ Broadcast, Essentials, Party931",
          "artist": "Markus Schulz - 2004-05-24 - Global DJ Broadcast, Essentials, Party931"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Markus%20Schulz%20-%202004-10-11%20-%20Global%20DJ%20Broadcast%2C%20Essentials.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Markus Schulz - 2004-10-11 - Global DJ Broadcast, Essentials",
          "artist": "Markus Schulz - 2004-10-11 - Global DJ Broadcast, Essentials"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Markus%20Schulz%20-%202004-11-08%20-%20Global%20DJ%20Broadcast%2C%20Essentials.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Markus Schulz - 2004-11-08 - Global DJ Broadcast, Essentials",
          "artist": "Markus Schulz - 2004-11-08 - Global DJ Broadcast, Essentials"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Markus%20Schulz%20-%202007-05-05%20-%20Club%20Essential%20Riga%20-%20Part1.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Markus Schulz - 2007-05-05 - Club Essential Riga - Part1",
          "artist": "Markus Schulz - 2007-05-05 - Club Essential Riga - Part1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Markus%20Schulz%20-%202007-05-05%20-%20Club%20Essential%20Riga%20-%20Part2.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Markus Schulz - 2007-05-05 - Club Essential Riga - Part2",
          "artist": "Markus Schulz - 2007-05-05 - Club Essential Riga - Part2"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Martin%20Solveig%20-%20Essential%20Mix%20%5B2005-07-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Martin Solveig -  [2005-07-23]",
          "artist": "Martin Solveig -  [2005-07-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Martinez%20Brothers%20-%20Essential%20Mix%20%5B2013-09-28%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Martinez Brothers -  [2013-09-28]",
          "artist": "Martinez Brothers -  [2013-09-28]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Martyn%20-%20Essential%20Mix%20%5B2012-03-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Martyn -  [2012-03-17]",
          "artist": "Martyn -  [2012-03-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mason%20-%20Essential%20Mix%20%5B2008-09-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mason -  [2008-09-06]",
          "artist": "Mason -  [2008-09-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Maya%20Jane%20Coles%20-%20Essential%20Mix%20%5B2011-07-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Maya Jane Coles -  [2011-07-09]",
          "artist": "Maya Jane Coles -  [2011-07-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Maya%20Jane%20Coles%20-%20Essential%20Mix%20%5B2013-05-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Maya Jane Coles -  [2013-05-04]",
          "artist": "Maya Jane Coles -  [2013-05-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Misstress%20Barbara%20-%20Essential%20Mix%20%5B2002-01-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Misstress Barbara -  [2002-27]",
          "artist": "Misstress Barbara -  [2002-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Moby%20-%20Essential%20Mix%20%5B1994-07-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Moby -  [1994-07-23]",
          "artist": "Moby -  [1994-07-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mr%20C%20-%20Essential%20Mix%20%5B2002-06-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mr C -  [2002-06-23]",
          "artist": "Mr C -  [2002-06-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mrs%20Wood%20-%20Essential%20Mix%20%5B1997-04-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mrs Wood -  [1997-04-13]",
          "artist": "Mrs Wood -  [1997-04-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Mutiny%20-%20Essential%20Mix%20%5B2004-10-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Mutiny -  [2004-10-17]",
          "artist": "Mutiny -  [2004-10-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nathan%20Fake%20%26%20James%20Holden%20-%20Essential%20Mix%20%5B2006-03-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nathan Fake & James Holden -  [2006-03-19]",
          "artist": "Nathan Fake & James Holden -  [2006-03-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Netsky%20-%20Essential%20Mix%20-%2009-10-2010.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Netsky -  - 09-10-2010",
          "artist": "Netsky -  - 09-10-2010"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nic%20Fanciulli%20-%20Essential%20Mix%20%5B2003-06-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nic Fanciulli -  [2003-06-01]",
          "artist": "Nic Fanciulli -  [2003-06-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nick%20Curly%20-%20Essential%20Mix%20%5B2010-07-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nick Curly -  [2010-07-31]",
          "artist": "Nick Curly -  [2010-07-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nick%20Warren%20-%20Essential%20Mix%20%5B1999-10-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nick Warren -  [1999-10-03]",
          "artist": "Nick Warren -  [1999-10-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nicolas%20Jaar%20-%20Essential%20Mix%20%5B2012-05-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nicolas Jaar -  [2012-05-19]",
          "artist": "Nicolas Jaar -  [2012-05-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nils%20Noa%20-%20Essential%20Mix%20%5B2003-04-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nils Noa -  [2003-04-13]",
          "artist": "Nils Noa -  [2003-04-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Nina%20Kraviz%20-%20Essential%20Mix%20%5B2012-05-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Nina Kraviz -  [2012-05-12]",
          "artist": "Nina Kraviz -  [2012-05-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Noir%20-%20Essential%20Mix%20%5B2013-06-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Noir -  [2013-06-22]",
          "artist": "Noir -  [2013-06-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paolo%20Mojo%20-%20Essential%20Mix%20%5B2004-08-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paolo Mojo -  [2004-08-01]",
          "artist": "Paolo Mojo -  [2004-08-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paolo%20Mojo%20-%20Essential%20Mix%20%5B2008-08-16%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paolo Mojo -  [2008-08-16]",
          "artist": "Paolo Mojo -  [2008-08-16]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Parks%20%26%20Wilson%20-%20Essential%20Mix%20%5B2000-04-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Parks & Wilson -  [2000-04-09]",
          "artist": "Parks & Wilson -  [2000-04-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Jackson%20-%20Essential%20Mix%20%5B2003-01-19%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Jackson -  [2003-19]",
          "artist": "Paul Jackson -  [2003-19]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Kalkbrenner%20-%20Essential%20Mix%20%5B2011-07-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Kalkbrenner -  [2011-07-30]",
          "artist": "Paul Kalkbrenner -  [2011-07-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Kalkbrenner%20Essential%20Mix%202014.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Kalkbrenner  2014",
          "artist": "Paul Kalkbrenner  2014"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Oakenfold%20-%20Essential%20Mix%20%5B1998-10-11%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Oakenfold -  [1998-10-11]",
          "artist": "Paul Oakenfold -  [1998-10-11]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Oakenfold%20-%20Essential%20Mix%20%5B1999-01-17%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Oakenfold -  [1999-17]",
          "artist": "Paul Oakenfold -  [1999-17]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Ritch%20-%20Essential%20Mix%20%5B2009-06-13%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Ritch -  [2009-06-13]",
          "artist": "Paul Ritch -  [2009-06-13]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Van%20Dyk%20-%202007-08-06%20-%20Bbc%20Radio1.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Van Dyk - 2007-08-06 - Bbc Radio1",
          "artist": "Paul Van Dyk - 2007-08-06 - Bbc Radio1"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20Woolford%20-%20Essential%20Mix%20%5B2004-04-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul Woolford -  [2004-04-18]",
          "artist": "Paul Woolford -  [2004-04-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20van%20Dyk%20-%20Essential%20Mix%20%5B1997-04-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul van Dyk -  [1997-04-20]",
          "artist": "Paul van Dyk -  [1997-04-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20van%20Dyk%20-%20Essential%20Mix%20%5B1999-04-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul van Dyk -  [1999-04-04]",
          "artist": "Paul van Dyk -  [1999-04-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Paul%20van%20Dyk%20-%20Essential%20Mix%20%5B2002-07-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Paul van Dyk -  [2002-07-14]",
          "artist": "Paul van Dyk -  [2002-07-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Peace%20Division%20-%20Essential%20Mix%20%5B2008-08-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Peace Division -  [2008-08-30]",
          "artist": "Peace Division -  [2008-08-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Pearson%20Sound%20-%20Essential%20Mix%20%5B2011-12-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Pearson Sound -  [2011-12-03]",
          "artist": "Pearson Sound -  [2011-12-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Perseus%20%26%20Jonas%20Rathsman%20-%20Essential%20Mix%20%5B2013-01-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Perseus & Jonas Rathsman -  [2013-05]",
          "artist": "Perseus & Jonas Rathsman -  [2013-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Pete%20Tong%20-%20Essential%20Mix%20%5B2011-04-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Pete Tong -  [2011-04-09]",
          "artist": "Pete Tong -  [2011-04-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Photek%20-%20Essential%20Mix%20%5B2012-10-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Photek -  [2012-10-06]",
          "artist": "Photek -  [2012-10-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Planet%20Funk%20-%20Essential%20Mix%20%5B2003-07-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Planet Funk -  [2003-07-20]",
          "artist": "Planet Funk -  [2003-07-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Plump%20DJs%20%26%20Danny%20Howells%20-%20Essential%20Mix%20%5B2004-05-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Plump DJs & Danny Howells -  [2004-05-30]",
          "artist": "Plump DJs & Danny Howells -  [2004-05-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Plump%20DJs%20-%20Essential%20Mix%20%5B2003-06-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Plump DJs -  [2003-06-15]",
          "artist": "Plump DJs -  [2003-06-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/R3hab%20-%20Essential_mix-sat-02-15-2014-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "R3hab - Essential_mix-sat-02-15-2014-talion",
          "artist": "R3hab - Essential_mix-sat-02-15-2014-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Retro%20Grade%20-%20Essential%20Mix%20%5B2011-01-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Retro Grade -  [2011-08]",
          "artist": "Retro Grade -  [2011-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Richie%20Hawtin%20%26%20Dubfire%20-%20Essential%20Mix%20%5BExit%20Festival%2009%5D%2018-07-2009.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Richie Hawtin & Dubfire -  [Exit Festival 09] 18-07-2009",
          "artist": "Richie Hawtin & Dubfire -  [Exit Festival 09] 18-07-2009"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Riva%20Starr%20%26%20Funkagenda%20-%20Essential%20Mix%20%5B2011-04-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Riva Starr & Funkagenda -  [2011-04-30]",
          "artist": "Riva Starr & Funkagenda -  [2011-04-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Robert%20Babicz%20-%20Essential%20Mix%20%5B2011-03-26%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Robert Babicz -  [2011-03-26]",
          "artist": "Robert Babicz -  [2011-03-26]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Roger%20Sanchez%20-%20Essential%20Mix%20%5B2000-04-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Roger Sanchez -  [2000-04-30]",
          "artist": "Roger Sanchez -  [2000-04-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Roger%20Sanchez%20-%20Essential%20Mix%20%5B2008-06-28%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Roger Sanchez -  [2008-06-28]",
          "artist": "Roger Sanchez -  [2008-06-28]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Roni%20Size%20-%20Essential%20Mix%20%5B2004-12-12%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Roni Size -  [2004-12-12]",
          "artist": "Roni Size -  [2004-12-12]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Rudimental%20-%20Essential%20Mix%20%5B2013-12-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Rudimental -  [2013-12-14]",
          "artist": "Rudimental -  [2013-12-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Rui%20Da%20Silva%20-%20Essential%20Mix%20%5B2002-09-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Rui Da Silva -  [2002-09-15]",
          "artist": "Rui Da Silva -  [2002-09-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sander%20Kleinenberg%20%26%20Pete%20Tong%20-%20Essential%20Mix%20%5B2004-03-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sander Kleinenberg & Pete Tong -  [2004-03-07]",
          "artist": "Sander Kleinenberg & Pete Tong -  [2004-03-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sander%20Kleinenberg%20-%20Essential%20Mix%20%5B2001-10-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sander Kleinenberg -  [2010-14]",
          "artist": "Sander Kleinenberg -  [2010-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sander%20Kleinenberg%20-%20Essential%20Mix%20%5B2003-06-08%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sander Kleinenberg -  [2003-06-08]",
          "artist": "Sander Kleinenberg -  [2003-06-08]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sander%20Kleinenberg%20-%20Essential%20Mix%20%5B2010-12-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sander Kleinenberg -  [2010-12-04]",
          "artist": "Sander Kleinenberg -  [2010-12-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sander%20Van%20Doorn%20-%20Essential%20Mix%20%5B2009-06-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sander Van Doorn -  [2009-06-20]",
          "artist": "Sander Van Doorn -  [2009-06-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sandra%20Collins%20%26%20Pete%20Tong%20-%20Essential%20Mix%20%5B2003-03-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sandra Collins & Pete Tong -  [2003-03-23]",
          "artist": "Sandra Collins & Pete Tong -  [2003-03-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sandra%20Collins%20-%20Essential%20Mix%20%5B2003-03-23%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sandra Collins -  [2003-03-23]",
          "artist": "Sandra Collins -  [2003-03-23]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20%26%20John%20Digweed%20-%20Essential%20Mix%20%5B2002-04-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha & John Digweed -  [2002-04-07]",
          "artist": "Sasha & John Digweed -  [2002-04-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20%26%20John%20Digweed%20-%20Essential%20Mix%20%5B2002-12-29%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha & John Digweed -  [2002-12-29]",
          "artist": "Sasha & John Digweed -  [2002-12-29]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20%26%20John%20Digweed%20-%20Essential%20Mix%20%5B2004-05-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha & John Digweed -  [2004-05-09]",
          "artist": "Sasha & John Digweed -  [2004-05-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20-%20Essential%20Mix%20%5B1994-01-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha -  [1994-15]",
          "artist": "Sasha -  [1994-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20-%20Essential%20Mix%20%5B2000-02-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha -  [2000-02-27]",
          "artist": "Sasha -  [2000-02-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20-%20Essential%20Mix%20%5B2009-10-31%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha -  [2009-10-31]",
          "artist": "Sasha -  [2009-10-31]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sasha%20-%20Essential%20Mix%20%5B2013-11-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sasha -  [2013-11-30]",
          "artist": "Sasha -  [2013-11-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Seamus%20Haji%20-%20Essential%20Mix%20%5B2002-06-16%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Seamus Haji -  [2002-06-16]",
          "artist": "Seamus Haji -  [2002-06-16]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Seb%20Fontaine%20%26%20Pete%20Tong%20-%20Essential%20Mix%20%5B1997-03-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Seb Fontaine & Pete Tong -  [1997-03-15]",
          "artist": "Seb Fontaine & Pete Tong -  [1997-03-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Seth%20Troxler%20-%20Essential%20Mix%20%5B2011-05-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Seth Troxler -  [2011-05-07]",
          "artist": "Seth Troxler -  [2011-05-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sharam%20-%20Essential%20Mix%20%5B2009-08-29%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sharam -  [2009-08-29]",
          "artist": "Sharam -  [2009-08-29]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sharam%20-%20Essential%20Mix%20%5B2011-05-14%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sharam -  [2011-05-14]",
          "artist": "Sharam -  [2011-05-14]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Silicone%20Soul%20-%20Essential%20Mix%20%5B2001-09-02%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Silicone Soul -  [2009-02]",
          "artist": "Silicone Soul -  [2009-02]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Slam%20-%20Essential%20Mix%20%5B2001-06-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Slam -  [2006-03]",
          "artist": "Slam -  [2006-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Slam%20-%20Essential%20Mix%20%5B2004-09-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Slam -  [2004-09-05]",
          "artist": "Slam -  [2004-09-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Smokin%20Jo%20-%20Essential%20Mix%20%5B2003-09-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Smokin Jo -  [2003-09-21]",
          "artist": "Smokin Jo -  [2003-09-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Soul%20Clap%20-%20Essential%20Mix%20%5B2011-03-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Soul Clap -  [2011-03-05]",
          "artist": "Soul Clap -  [2011-03-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Stacey%20Pullen%20-%20Essential%20Mix%20%5B2011-08-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Stacey Pullen -  [2011-08-20]",
          "artist": "Stacey Pullen -  [2011-08-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Stanton%20Warriors%20-%20Essential%20Mix%20%5B2004-07-25%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Stanton Warriors -  [2004-07-25]",
          "artist": "Stanton Warriors -  [2004-07-25]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Steve%20Angello%20-%20Essential%20Mix%20%5B2013-03-30%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Steve Angello -  [2013-03-30]",
          "artist": "Steve Angello -  [2013-03-30]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Steve%20Bug%20-%20Essential%20Mix%20%5B2009-08-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Steve Bug -  [2009-08-15]",
          "artist": "Steve Bug -  [2009-08-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Steve%20Lawler%20-%20Essential%20Mix%20%5B2001-02-25%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Steve Lawler -  [2002-25]",
          "artist": "Steve Lawler -  [2002-25]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Steve%20Lawler%20-%20Essential%20Mix%20%5B2003-10-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Steve Lawler -  [2003-10-05]",
          "artist": "Steve Lawler -  [2003-10-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Sven%20Vath%20%26%20Andre%20Galluzzi%20-%20Essential%20Mix%20%5B2010-08-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Sven Vath & Andre Galluzzi -  [2010-08-07]",
          "artist": "Sven Vath & Andre Galluzzi -  [2010-08-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tanya%20Vulcano%20%26%20Locodice%20-%20Essential%20Mix%20%5B2005-08-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tanya Vulcano & Locodice -  [2005-08-21]",
          "artist": "Tanya Vulcano & Locodice -  [2005-08-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tensnake%20-%20Essential%20Mix%20%5B2013-02-06%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tensnake -  [2013-02-06]",
          "artist": "Tensnake -  [2013-02-06]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Terry%20Francis%20-%20Essential%20Mix%20%5B1998-05-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Terry Francis -  [1998-05-04]",
          "artist": "Terry Francis -  [1998-05-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/The%202%20Bears%20-%20Essential%20Mix%20%5B2012-01-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "The 2 Bears -  [2012-21]",
          "artist": "The 2 Bears -  [2012-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/The%20Gaslamp%20Killer%20-%20Essential%20Mix%20%5B2012-12-01%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "The Gaslamp Killer -  [2012-12-01]",
          "artist": "The Gaslamp Killer -  [2012-12-01]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Thomas%20Gold%20-%20Essential%20Mix%20%5B2012-11-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Thomas Gold -  [2012-11-03]",
          "artist": "Thomas Gold -  [2012-11-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tiesto%20-%202014-02-02%20-%20Essential%20Mix%20%28BBC%20Radio1%29.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tiesto - 2014-02-02 -  (BBC Radio1)",
          "artist": "Tiesto - 2014-02-02 -  (BBC Radio1)"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tiga%20-%20Essential%20Mix%20%5B2006-04-09%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tiga -  [2006-04-09]",
          "artist": "Tiga -  [2006-04-09]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tiga%20-%20Essential%20Mix%20%5B2009-04-04%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tiga -  [2009-04-04]",
          "artist": "Tiga -  [2009-04-04]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tim%20Green%20-%20Essential%20Mix%20%5B2010-06-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tim Green -  [2010-06-05]",
          "artist": "Tim Green -  [2010-06-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Timo%20Maas%20-%20Essential%20Mix%20%5B2000-10-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Timo Maas -  [2000-10-22]",
          "artist": "Timo Maas -  [2000-10-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Timo%20Maas%20-%20Essential%20Mix%20%5B2001-05-20%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Timo Maas -  [2005-20]",
          "artist": "Timo Maas -  [2005-20]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Timo%20Maas%20-%20Essential%20Mix%20%5B2002-08-18%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Timo Maas -  [2002-08-18]",
          "artist": "Timo Maas -  [2002-08-18]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tini%20-%20Essential%20Mix%20%5B2013-08-03%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tini -  [2013-08-03]",
          "artist": "Tini -  [2013-08-03]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Todd%20Terje%20-%20Essential%20Mix%20%5B2013-07-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Todd Terje -  [2013-07-27]",
          "artist": "Todd Terje -  [2013-07-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Todd%20Terje%20Essential%20Mix%202013.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Todd Terje  2013",
          "artist": "Todd Terje  2013"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Tom%20Stephan%20-%20Essential%20Mix%20%5B2001-10-21%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Tom Stephan -  [2010-21]",
          "artist": "Tom Stephan -  [2010-21]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Trentemoller%20-%20Essential%20Mix%20%5B2006-10-15%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Trentemoller -  [2006-10-15]",
          "artist": "Trentemoller -  [2006-10-15]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Valentino%20Kanzyani%20-%20Essential%20Mix%20%5B2003-12-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Valentino Kanzyani -  [2003-12-07]",
          "artist": "Valentino Kanzyani -  [2003-12-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Wankelmut%20-%20Essential%20Mix%20%5B2014-06-07%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Wankelmut -  [2014-06-07]",
          "artist": "Wankelmut -  [2014-06-07]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Will%20Saul%20-%20Essential%20Mix%20%5B2013-04-27%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Will Saul -  [2013-04-27]",
          "artist": "Will Saul -  [2013-04-27]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/X-Press%202%20-%20Essential%20Mix%20%5B2001-01-28%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "X-Press 2 -  [2028]",
          "artist": "X-Press 2 -  [2028]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Yousef%20%26%20Mark%20Knight%20-%20Essential%20Mix%20%5B2009-09-05%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Yousef & Mark Knight -  [2009-09-05]",
          "artist": "Yousef & Mark Knight -  [2009-09-05]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Yousef%20-%20Essential%20Mix%20%5B2006-01-22%5D.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Yousef -  [2006-22]",
          "artist": "Yousef -  [2006-22]"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/Zeds_Dead_-_Essential_Mix_-_02-03-2013-www.mixing.dj.mp3",
        "duration": 99999,
        "metaData": {
          "title": "Zeds_Dead_-_Essential_Mix_-_02-03-2013-www mixing dj",
          "artist": "Zeds_Dead_-_Essential_Mix_-_02-03-2013-www mixing dj"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/_HOUR_00_Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3.afpk",
        "duration": 99999,
        "metaData": {
          "title": "_HOUR_00_ - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk",
          "artist": "_HOUR_00_ - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/_HOUR_01_Essential%20Mix%20-%202007-04-01%20-%20James%20Zabiela%20and%20Nic%20Fanciulli%2C%20WMC%2C%20Pool%20Party%2C%20Miami%20Beach%2C%20Florida.mp3.afpk",
        "duration": 99999,
        "metaData": {
          "title": "_HOUR_01_ - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk",
          "artist": "_HOUR_01_ - 2007-04-01 - James Zabiela and Nic Fanciulli, WMC, Pool Party, Miami Beach, Florida afpk"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/adam.beyer.at.Essential.Underground.klubnacht%2C.polar.tv.berlin.29-05-2004.mp3",
        "duration": 99999,
        "metaData": {
          "title": "adam beyer at Essential Underground klubnacht, polar tv berlin 29-05-2004",
          "artist": "adam beyer at Essential Underground klubnacht, polar tv berlin 29-05-2004"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/adam_beyer_essential_mix_2002_12_15.mp3",
        "duration": 99999,
        "metaData": {
          "title": "adam_beyer_essential_mix_2002_12_15",
          "artist": "adam_beyer_essential_mix_2002_12_15"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/christopher_lawrence_essential_mix_2004_03_28.mp3",
        "duration": 99999,
        "metaData": {
          "title": "christopher_lawrence_essential_mix_2004_03_28",
          "artist": "christopher_lawrence_essential_mix_2004_03_28"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/maceo_plex_-_essential_mix-sat-02-18-2012-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "maceo_plex_-_essential_mix-sat-02-18-2012-talion",
          "artist": "maceo_plex_-_essential_mix-sat-02-18-2012-talion"
        }
      },
      {
        "url": "https://archive.org/download/BBC_Essential_Mix_Collection/marco_carola_-_essential_mix-sat-02-05-2011-talion.mp3",
        "duration": 99999,
        "metaData": {
          "title": "marco_carola_-_essential_mix-sat-02-05-2011-talion",
          "artist": "marco_carola_-_essential_mix-sat-02-05-2011-talion"
        }
      }
    ]
}
);
      webamp.renderWhenReady(app);
    });
</script>

