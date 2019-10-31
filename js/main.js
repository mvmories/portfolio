// Hover Menu
// Select DOM Items

const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");
const menuNav = document.querySelector(".menu-nav");
const menuBranding = document.querySelector(".menu-branding");
const navItems = document.querySelectorAll(".nav-item");

// Set Initial State Of The Menu

let showMenu = false;
menuBtn.addEventListener("click", toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add("close");
    menu.classList.add("show");
    menuNav.classList.add("show");
    menuBranding.classList.add("show");
    navItems.forEach(item => item.classList.add("show"));

    //Set Menu State
    showMenu = true;
  } else {
    menuBtn.classList.remove("close");
    menu.classList.remove("show");
    menuNav.classList.remove("show");
    menuBranding.classList.remove("show");
    navItems.forEach(item => item.classList.remove("show"));

    //Set Menu State
    showMenu = false;
  }
}

// Project Images Overlay
// Select DOM Items

const itemImg1 = document.querySelector(".itemImg1");
const textOver1 = document.querySelector(".textOver1");

const itemImg2 = document.querySelector(".itemImg2");
const textOver2 = document.querySelector(".textOver2");

const itemImg3 = document.querySelector(".itemImg3");
const textOver3 = document.querySelector(".textOver3");

const itemImg4 = document.querySelector(".itemImg4");
const textOver4 = document.querySelector(".textOver4");

const itemImg5 = document.querySelector(".itemImg5");
const textOver5 = document.querySelector(".textOver5");

// Set Initial State Of The text

let showText = false;
itemImg1.addEventListener("mouseover", toggleText1);
itemImg1.addEventListener("mouseout", toggleText1);

itemImg2.addEventListener("mouseover", toggleText2);
itemImg2.addEventListener("mouseout", toggleText2);

itemImg3.addEventListener("mouseover", toggleText3);
itemImg3.addEventListener("mouseout", toggleText3);

itemImg4.addEventListener("mouseover", toggleText4);
itemImg4.addEventListener("mouseout", toggleText4);

itemImg5.addEventListener("mouseover", toggleText5);
itemImg5.addEventListener("mouseout", toggleText5);

function toggleText1() {
  if (!showText) {
    textOver1.classList.add("show");

    //Set Menu State
    showText = true;
  } else {
    textOver1.classList.remove("show");

    //Set Menu State
    showText = false;
  }
}

function toggleText2() {
  if (!showText) {
    textOver2.classList.add("show");

    //Set Menu State
    showText = true;
  } else {
    textOver2.classList.remove("show");

    //Set Menu State
    showText = false;
  }
}

function toggleText3() {
  if (!showText) {
    textOver3.classList.add("show");

    //Set Menu State
    showText = true;
  } else {
    textOver3.classList.remove("show");

    //Set Menu State
    showText = false;
  }
}

function toggleText4() {
  if (!showText) {
    textOver4.classList.add("show");

    //Set Menu State
    showText = true;
  } else {
    textOver4.classList.remove("show");

    //Set Menu State
    showText = false;
  }
}

function toggleText5() {
  if (!showText) {
    textOver5.classList.add("show");

    //Set Menu State
    showText = true;
  } else {
    textOver5.classList.remove("show");

    //Set Menu State
    showText = false;
  }
}
