+++
Title = "ACiDDraw Web Edition"
Date = "2023-01-14T07:27:20-0800"
Author = "Paige"
Description = "DOS-based ACiDDraw running on JS-DOS"
+++
# TODO

- Saving (can't save files anywhere currently)

# ACiDDraw

<link rel="stylesheet" href="/emulators-ui/emulators-ui.css">
<div id="dosbox-wrapper">
<div id="dosbox"></div>
</div>
<script src="/emulators/emulators.js"></script>
<script src="/emulators-ui/emulators-ui.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function(event) { 
    emulators.pathPrefix = "/emulators/";
    Dos(document.getElementById("dosbox")).run("/jsdos/acid.zip");
  });
</script>