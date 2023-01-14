document.addEventListener("DOMContentLoaded", function(event) { 
  const container = document.querySelector(".container");
  const allMenus = document.querySelectorAll(".menu");

  // Hide menus on body click
  document.body.addEventListener("click", () => {
    allMenus.forEach(menu => {
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
      }
    });
  });

  // Reset menus on resize
  window.addEventListener("resize", () => {
    allMenus.forEach(menu => {
      menu.classList.remove("open");
      document.getElementsByClassName("menu__dropdown")[0].style.visibility = "hidden";
    });
  });

  // Handle desktop menu
  allMenus.forEach(menu => {
    const trigger = menu.querySelector(".menu__trigger");
    const dropdown = menu.querySelector(".menu__dropdown");

    trigger.addEventListener("click", e => {
      e.stopPropagation();

      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        document.getElementsByClassName("menu__dropdown")[0].style.visibility = "hidden";
      } else {
        // Close all menus...
        allMenus.forEach(m => m.classList.remove("open"));
        // ...before opening the current one
        menu.classList.add("open");
        document.getElementsByClassName("menu__dropdown")[0].style.visibility = "visible";
      }

      if (dropdown.getBoundingClientRect().right > container.getBoundingClientRect().right) {
        dropdown.style.left = "auto";
        dropdown.style.right = 0;
      }
    });

    dropdown.addEventListener("click", e => e.stopPropagation());
  });
});