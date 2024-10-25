(() =>{
 
    const openNavMenu = document.querySelector(".open-nav-menu"),
    closeNavMenu = document.querySelector(".close-nav-menu"),
    navMenu = document.querySelector(".nav-menu"),
    menuOverlay = document.querySelector(".menu-overlay"),
    mediaSize = 991;
  
    openNavMenu.addEventListener("click", toggleNav);
    closeNavMenu.addEventListener("click", toggleNav);
    // close the navMenu by clicking outside
    menuOverlay.addEventListener("click", toggleNav);
  
    function toggleNav() {
        navMenu.classList.toggle("open");
        menuOverlay.classList.toggle("active");
        document.body.classList.toggle("hidden-scrolling");
    }
  
    navMenu.addEventListener("click", (event) =>{
        if(event.target.hasAttribute("data-toggle") && 
            window.innerWidth <= mediaSize){
            // prevent default anchor click behavior
            event.preventDefault();
            const menuItemHasChildren = event.target.parentElement;
          // if menuItemHasChildren is already expanded, collapse it
          if(menuItemHasChildren.classList.contains("active")){
              collapseSubMenu();
          }
          else{
            // collapse existing expanded menuItemHasChildren
            if(navMenu.querySelector(".menu-item-has-children.active")){
              collapseSubMenu();
            }
            // expand new menuItemHasChildren
            menuItemHasChildren.classList.add("active");
            const subMenu = menuItemHasChildren.querySelector(".sub-menu");
            subMenu.style.maxHeight = subMenu.scrollHeight + "px";
          }
        }
    });
    function collapseSubMenu(){
        navMenu.querySelector(".menu-item-has-children.active .sub-menu")
        .removeAttribute("style");
        navMenu.querySelector(".menu-item-has-children.active")
        .classList.remove("active");
    }
    function resizeFix(){
         // if navMenu is open ,close it
         if(navMenu.classList.contains("open")){
             toggleNav();
         }
         // if menuItemHasChildren is expanded , collapse it
         if(navMenu.querySelector(".menu-item-has-children.active")){
              collapseSubMenu();
       }
    }
  
    window.addEventListener("resize", function(){
       if(this.innerWidth > mediaSize){
           resizeFix();
       }
    });
  
  })();

  // slider
  const initSlider = () => {
    const questions = document.querySelector(".content .questions");
    const slideButtons = document.querySelectorAll(".content .slide-button");
    const sliderScrollbar = document.querySelector(".ram .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = questions.scrollWidth - questions.clientWidth;
    //scrollWidth = mengembalikan lebar sebuah elemen, termasuk yg diluar window (konten scrollable)
    // clientWidth = mengembalikan lebar sebuah element yg terlihat (tdk termasuk padding, margin, border maupun konten sccrollable)

    var scrollWidth = questions.scrollWidth;
    var clientWidth = questions.clientWidth;

    console.log("scrollWidth = ", scrollWidth);
    console.log("clientWidth = ", clientWidth);

    scrollbarThumb.addEventListener("mousedown", (e) => {
      const startX = e.clientX;
      const thumbPosition = scrollbarThumb.offsetLeft;

      // update thumb position on mouse move
      const handelMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const newThumbPosition = thumbPosition + deltaX;
        const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

        const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
        const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

        scrollbarThumb.style.left = `${boundedPosition}px`;
        questions.scrollLeft = scrollPosition;
      }

      // Remove event listeners on mouse up
      const handelMouseUp = () => {
        document.removeEventListener("mousemove", handelMouseMove);
        document.removeEventListener("mouseup", handelMouseUp);
      }

      // Add event listeners for drag interaction
      document.addEventListener("mousemove", handelMouseMove);
      document.addEventListener("mouseup", handelMouseUp);

    });

    // slide images according to the slide buttons clicks
    slideButtons.forEach(button =>{
        button.addEventListener("click", () =>{
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = questions.clientWidth * direction;
            questions.scrollBy({left: scrollAmount, behavior: "smooth"});
        });
    });

    const handleSlideButton = () =>{
      slideButtons[0].style.display = questions.scrollLeft <= 0 ? "none" : "block";
      slideButtons[1].style.display = questions.scrollLeft >= maxScrollLeft ? "none" : "block";
    }

    //update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () =>{
        const scrollPosition = questions.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    questions.addEventListener("scroll", ()=>{
      handleSlideButton();
      updateScrollThumbPosition();
    });
}

window.addEventListener("load", initSlider);
  
  