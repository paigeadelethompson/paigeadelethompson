+++
Title = "ACiDDraw Web Edition"
Date = "2023-01-14T07:27:20-0800"
Author = "Paige"
Description = "ACiDDraw for DOS; running on JS-DOS"
cover = "img/og.png"
+++

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


## TODO
Currently can't save files... :( In the future this may be possible using the serial port, if not with another script along side of JS-DOS, then
by configuring a serial port in JS-DOS to make a websocket connection to a server. Second, Alt-J will drop to a DOS prompt while running in ACiDDraw. 
It's perhaps possible to save the file to local / ephemeral storage, drop to a DOS prompt, and run XModem send / Kermit to transfer the file out over
serial. Something similar could possibly be done for receive as well. 

- [http://www.dosdays.co.uk/topics/Software/comm_utilities.php](http://www.dosdays.co.uk/topics/Software/comm_utilities.php)
- [https://manpages.ubuntu.com/manpages/bionic/man1/sz.1.html](https://manpages.ubuntu.com/manpages/bionic/man1/sz.1.html)
- [http://www.columbia.edu/kermit/msk30.html](http://www.columbia.edu/kermit/msk30.html)
- [https://people.ucalgary.ca/~wellings/tipspit/kermit.html](https://people.ucalgary.ca/~wellings/tipspit/kermit.html)
- [https://kermitproject.org/onlinebooks/usingmsdoskermit2e.pdf](https://kermitproject.org/onlinebooks/usingmsdoskermit2e.pdf)
