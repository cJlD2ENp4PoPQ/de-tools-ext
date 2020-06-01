window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    deExtension.init();
}, false);

var deExtension = {
  init: function() {
    var appcontent = document.getElementById("iframe_main_container"); // content
    if (appcontent) {
      appcontent.addEventListener("load", function(event) { deExtension.onPageLoad(event); }, true)
      addMenuEntries(document);
    } else {
      deExtension.onMobilePageLoad(document)
    }
  },

  addMenuEntries: function(document) {

  }

  /**
   * Content IFrame change listener function.
   * @param page the page content of content IFrame.
   */
  onPageLoad: function(page) {
    let src = page.target.src;
    if(src.includes('sector.php')) {
      SekExtension.onPageLoad(page.target.contentDocument);
    }
  },

  /**
   *
   * @param document
   */
  onMobilePageLoad: function(document) {
    let url = document.URL;
    if(url.includes('sector.php')) {
      SekExtension.onPageLoad(document);
    }
  },
};