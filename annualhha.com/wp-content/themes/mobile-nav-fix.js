/* mobile-nav-fix.js */

(function () {

  function ready(fn) {

    if (document.readyState !== "loading") fn();

    else document.addEventListener("DOMContentLoaded", fn);

  }



  function q(sel, root=document){ return root.querySelector(sel); }



  ready(function () {

    const header = document.getElementById("main-header");

    const mobileWrap = q("#et_mobile_nav_menu");

    const mobileNav = q("#et_mobile_nav_menu .mobile_nav");

    const toggle = q("#et_mobile_nav_menu .mobile_menu_bar");

    const desktopMenu = q("#top-menu");



    // If no Divi header, do nothing

    if (!header || !mobileWrap || !mobileNav || !toggle || !desktopMenu) return;



    // Ensure toggle is always clickable above anything

    toggle.style.position = "relative";

    toggle.style.zIndex = "2147483647";

    toggle.style.pointerEvents = "auto";



    header.style.position = header.style.position || "relative";

    header.style.zIndex = "2147483646";



    // Build/ensure mobile menu UL exists

    let mobileMenu = q("ul.et_mobile_menu", mobileNav);

    if (!mobileMenu) {

      mobileMenu = desktopMenu.cloneNode(true);

      mobileMenu.removeAttribute("id");

      mobileMenu.className = "et_mobile_menu";

      mobileMenu.style.display = "none";

      mobileMenu.style.margin = "0";

      mobileMenu.style.padding = "0";

      mobileNav.appendChild(mobileMenu);

    }



    // Make it dropdown under header

    mobileMenu.style.position = "absolute";

    mobileMenu.style.top = "100%";

    mobileMenu.style.left = "0";

    mobileMenu.style.right = "0";

    mobileMenu.style.zIndex = "2147483647";



    function openMenu() {

      mobileNav.classList.add("opened");

      mobileNav.classList.remove("closed");

      toggle.setAttribute("aria-expanded", "true");

      mobileMenu.style.display = "block";

    }



    function closeMenu() {

      mobileNav.classList.remove("opened");

      mobileNav.classList.add("closed");

      toggle.setAttribute("aria-expanded", "false");

      mobileMenu.style.display = "none";

    }



    function isOpen() { return mobileNav.classList.contains("opened"); }



    // Capture phase + prevent other scripts from swallowing the tap

    function onToggle(e) {

      e.preventDefault();

      e.stopPropagation();

      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

      isOpen() ? closeMenu() : openMenu();

      return false;

    }



    ["pointerdown","touchstart","click"].forEach((ev) => {

      toggle.addEventListener(ev, onToggle, { capture: true, passive: false });

    });



    // Close on link click

    mobileMenu.addEventListener("click", function (e) {

      const a = e.target.closest("a");

      if (a) closeMenu();

    }, true);



    // Close when tapping outside header/menu

    document.addEventListener("pointerdown", function (e) {

      if (!header.contains(e.target)) closeMenu();

    }, true);



    // Safety: disable pointer-events on known overlays if they exist

    const canvas = document.getElementById("golden-particles-canvas");

    if (canvas) canvas.style.pointerEvents = "none";

  });

})();

