document.addEventListener("DOMContentLoaded", function(event) { 
    function addCopyButtons(clipboard) {
        document.querySelectorAll('pre > code').forEach(function (codeBlock) {
            var button = document.createElement('button');
            button.className = 'copy-code-button';
            button.type = 'button';
            button.innerText = 'Copy';
    
            button.addEventListener('click', function () {
                clipboard.writeText(codeBlock.innerText).then(function () {
                    /* Chrome doesn't seem to blur automatically,
                       leaving the button in a focused state. */
                    button.blur();
    
                    button.innerText = '=)';
    
                    setTimeout(function () {
                        button.innerText = 'Copy';
                    }, 2000);
                }, function (error) {
                    button.innerText = '!!';
                });
            });
    
            var pre = codeBlock.parentNode;
            if (pre.parentNode.classList.contains('highlight')) {
                var highlight = pre.parentNode;
                highlight.parentNode.insertBefore(button, highlight);
            } else {
                pre.parentNode.insertBefore(button, pre);
            }
        });
    }

    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    }
});