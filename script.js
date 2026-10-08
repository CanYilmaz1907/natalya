(function () {
  var button = document.getElementById("open-heart");
  var story = document.getElementById("story");

  if (!button || !story) {
    return;
  }

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var opened = false;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show(element, delay) {
    element.style.transitionDelay = delay + "ms";
    element.classList.add("is-visible");
  }

  function revealAll() {
    reveals.forEach(function (element) {
      show(element, 0);
    });
  }

  var observer = null;

  if ("IntersectionObserver" in window && !reduceMotion) {
    observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top;
          });

        visible.forEach(function (entry, index) {
          show(entry.target, Math.min(index, 8) * 80);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -6% 0px"
      }
    );
  }

  button.addEventListener("click", function () {
    if (opened) {
      story.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      return;
    }

    opened = true;
    document.body.classList.add("opened");
    story.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");

    window.requestAnimationFrame(function () {
      if (observer) {
        reveals.forEach(function (element) {
          observer.observe(element);
        });
      } else {
        revealAll();
      }

      story.focus({ preventScroll: true });
      story.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
})();
