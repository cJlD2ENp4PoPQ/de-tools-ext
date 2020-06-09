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
      deExtension.addMenuEntries(document);
    } else {
      deExtension.onMobilePageLoad(document)
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
      let deksEntry = deExtension.createMenuEntry("Kampfsimulator", "https://deks.popq.de", "deks");
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
   * create a new iframe node
   * @param title the title of iframe
   * @param url the location of content
   * @param type the identifier of content
   * @returns {HTMLDivElement}
   */
  createIFrame: function (title, url, type) {
    let container = document.createElement("div");
    container.id = "ext-iframe-container"
    container.style ="position: absolute; width: 65%; height: 85%; right: 0px; top: 58px; z-index: 100;";
    let iframe = document.createElement("iframe");
    iframe.setAttribute("content",type);
    iframe.id = "ext-iframe";
    iframe.src = url;
    iframe.height = "100%";
    iframe.width = "100%";
    iframe.style = "position: absolute; width: 90%; height: 100%; right: 0px; top: 58px;"
    container.insertBefore(iframe, null);
    return container;
  },

  /**
   * create a new iframe node
   * @param title the title of iframe
   * @param url the location of content
   * @returns {HTMLDivElement}
   */
  createIFrameCloser: function () {
    let container = document.createElement("div");
    container.id = "ext-iframe-closer";
    container.style = "position: absolute; right: 620px; top:58px; width: 29px; height: 31px; background-color: rgba(0,0,0, 0.8)" +
      "border-bottom: 1px solid rgba(22,22,22, 0.8); border-right: 1px solid #222222; cursor: pointer; z-index: 101;";
    container.addEventListener("click", deExtension.closeIframe, true)
    let closeImg = document.createElement("img");
    closeImg.src = "g/close_icon.png";
    closeImg.style = "height: 26px; width: auto; margin-left: 4px; margin-top: 4px;"
    container.insertBefore(closeImg, null);
    return container;
  },

  closeIframe: function() {
    let container = document.getElementById("ext-iframe-container");
    if(container) {
      container.remove();
    }
    let closer = document.getElementById("ext-iframe-closer");
    if(closer) {
      closer.remove();
    }
    let mainContainer = document.getElementById("iframe_main_container");
    if(mainContainer && mainContainer.children.length >= 1) {
      MilitaryExtension.cleanup(mainContainer.children[0].contentDocument)
      SecretExtension.cleanup(mainContainer.children[0].contentDocument)
    }
  },

  /**
   * Content IFrame change listener function.
   * @param page the page content of content IFrame.
   */
  onPageLoad: function (page) {
    let src = page.target.src;
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
  },

  /**
   * @param document
   */
  onMobilePageLoad: function (document) {
    let url = document.URL;
    if (url.includes('sector.php')) {
      SekExtension.onPageLoad(document);
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
    deExtension.closeIframe();
    let iframe = deExtension.createIFrame(title, url, type);
    let closer = deExtension.createIFrameCloser();
    document.body.insertBefore(closer, null);
    document.body.insertBefore(iframe, closer);
    let mainContainer = document.getElementById("iframe_main_container");
    if(mainContainer && mainContainer.children.length >= 1) {
      this.updateExtensions(mainContainer.children[0].contentDocument);
    }
  }
};