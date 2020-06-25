window.addEventListener("load", function load (event) {
  window.removeEventListener("load", load, false);
  deExtension.init();
}, false);

deksOpen = false;

var deExtension = {

  init: function () {
    var appcontent = document.getElementById("iframe_main_container"); // content
    if (appcontent) {
      this.saveRace();
      appcontent.addEventListener("load", function (event) {
        deExtension.onPageLoad(event);
      }, true)
      this.addMenuEntries(document);
    } else {
      this.onMobilePageLoad(document)
    }
  },

  /**
   * Adds additional menu entries to navigation bar.
   * @param document document which contains the navigation bar.
   */
  addMenuEntries: function (document) {
    //find any entry first (there isn't any selector to grab the navigation bar itself)
    let techNode = document.evaluate("//span[text()='Technologien']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (techNode) {
      let menu = techNode.parentNode;
      let deksEntry = this.createMenuEntry("Kampfsimulator", "https://deks.popq.de", "deks");
      menu.insertBefore(deksEntry, null);
    }
  },

  /**
   * create a new menu entry node.
   * @param title the title of entry window.
   * @param url the location of menu content.
   * @param type the identifier of content-
   * @returns {HTMLSpanElement}
   */
  createMenuEntry: function (title, url, type) {
    let entryNode = document.createElement("span");
    entryNode.classList = ["btn"];
    entryNode.id = "menu_deks";
    entryNode.addEventListener("click", function (event) {
      deExtension.onMenuEntrySelected(event, title, url, type);
    }, true)
    entryNode.textContent = title;
    return entryNode;
  },

  /**
   * Content IFrame change listener function.
   * @param page the page content of content IFrame.
   */
  onPageLoad: function (page) {
    let contentDocument = page.target.contentDocument;
    this.updateExtensions(contentDocument);
  },

  updateExtensions: function (contentDocument) {
    if (contentDocument.querySelector('form[action="sector.php"]')) {
      SekExtension.onPageLoad(contentDocument);
    }
    if (contentDocument.querySelector('form[action="military.php"]')) {
      let iframe = document.getElementById("ext-iframe");
      let deksOpen = iframe && iframe.getAttribute("content") === 'deks';
      MilitaryExtension.onPageLoad(contentDocument, deksOpen);
    }
    if (contentDocument.querySelector('form[action="secret.php"]')) {
      let iframe = document.getElementById("ext-iframe");
      let deksOpen = iframe && iframe.getAttribute("content") === 'deks';
      SecretExtension.onPageLoad(contentDocument, deksOpen);
    }
    if (contentDocument.querySelector('form[action="production.php"]')) {
      ProductionExtension.onPageLoad(contentDocument);
    }
    if (contentDocument.querySelector('head title')
      && contentDocument.querySelector('head title').innerText === 'Auktion') {
      TradeExtension.onPageLoad(contentDocument);
    }
  },

  /**
   * @param document
   */
  onMobilePageLoad: function (document) {
    let url = document.URL;
    if (url.includes('sector.php')) {
      this.onPageLoad(document);
    }
  },

  saveRace: function () {
    let race;
    race = document.querySelector("img[src='g/derassenlogo1.png']") ? 'E' : undefined;
    if(!race) {
      race = document.querySelector("img[src='g/derassenlogo2.png']") ? 'I' : undefined;
    }
    if(!race) {
      race = document.querySelector("img[src='g/derassenlogo3.png']") ? 'K' : undefined;
    }
    if(!race) {
      race = document.querySelector("img[src='g/derassenlogo4.png']") ? 'Z' : undefined;
    }
    window.race = race;
  },

  /**
   * Event listener for additional menu entries.
   * @param event the event.
   * @param title the title of page.
   * @param url the url of the page.
   * @param the identifier of content.
   */
  onMenuEntrySelected: function (event, title, url, type) {
    frame.closeIframe();
    let iframe = frame.createIFrame(title, url, type);
    document.body.insertBefore(iframe, null);
    let mainContainer = document.getElementById("iframe_main_container");
    if(mainContainer && mainContainer.children.length >= 1) {
      this.updateExtensions(mainContainer.children[0].contentDocument);
    }
  },
};