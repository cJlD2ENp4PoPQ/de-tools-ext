window.addEventListener("load", function load (event) {
  window.removeEventListener("load", load, false);
  deExtension.init();
}, false);

var deExtension = {
  init: function () {
    var appcontent = document.getElementById("iframe_main_container"); // content
    if (appcontent) {
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
      let deksEntry = deExtension.createMenuEntry("Kampfsimulator", "https://deks.popq.de");
      menu.insertBefore(deksEntry, null);
    }
  },

  /**
   * create a new menu entry node.
   * @param title the title of entry window.
   * @param url the location of menu content.
   * @returns {HTMLSpanElement}
   */
  createMenuEntry: function (title, url) {
    let entryNode = document.createElement("span");
    entryNode.classList = ["btn"];
    entryNode.id = "menu_deks";
    entryNode.addEventListener("click", function (event) {
      deExtension.onMenuEntrySelected(event, title, url);
    }, true)
    entryNode.textContent = title;
    return entryNode;
  },

  /**
   * create a new iframe node
   * @param title the title of iframe
   * @param url the location of content
   * @returns {HTMLDivElement}
   */
  createIFrame: function (title, url) {
    let container = document.createElement("div");
    container.style = "position: absolute; height: 395px; width: 430px; top: 581px; left: 1487px; display: block;";
    container.tabIndex = "-2";
    container.role = "dialog";
    container.setAttribute("aria-describedby", "chat_popup");
    container.setAttribute("aria-labelledby", "ui-id-1");

    // Header
    let header = document.createElement("div");
    header.classList = ["ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix"];
    let titleNode = document.createElement("span")
    titleNode.classList = ["ui-dialog-title"];
    titleNode.textContent = title;
    let closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.classList = ["ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close"];
    let closeButtonInner1 = document.createElement("span");
    closeButtonInner1.classList = ["ui-button-icon ui-icon ui-icon-closethick"];
    let closeButtonInner2 = document.createElement("span");
    closeButtonInner2.classList = ["ui-button-icon-space"];
    closeButton.insertBefore(closeButtonInner1, null);
    closeButton.insertBefore(closeButtonInner2, null);
    header.insertBefore(titleNode, null);
    header.insertBefore(closeButton, null);

    //Body
    let body = document.createElement("div");
    body.style = "overflow: hidden; height: 366px; width: 426px; min-height: 0px; max-height: none;";
    body.classList = "ui-dialog-content ui-widget-content";
    body.id = "chat_popup";
    let iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.height = "100%";
    iframe.width = "100%";
    iframe.frameBorder = 0;
    body.insertBefore(iframe, null);

    container.insertBefore(header, null);
    container.insertBefore(body, null);

    //resizeable anchor
    container.insertBefore(deExtension.createResizeable("ui-resizable-n"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-e"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-s"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-w"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-sw"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-nw"), null);
    container.insertBefore(deExtension.createResizeable("ui-resizable-ne"), null);
    return container;
  },

  /**
   * create anchor for resizable iframe
   * @param classValue css classes
   * @returns {HTMLDivElement}
   */
  createResizeable: function (classValue) {
    let res = document.createElement("div");
    res.classList = ["ui-resizable-handle " + classValue];
    res.style = "z-index: 90;";
    return res;
  },

  /**
   * Content IFrame change listener function.
   * @param page the page content of content IFrame.
   */
  onPageLoad: function (page) {
    let src = page.target.src;
    if (src.includes('sector.php')) {
      SekExtension.onPageLoad(page.target.contentDocument);
    }
  },

  /**
   *
   * @param document
   */
  onMobilePageLoad: function (document) {
    let url = document.URL;
    if (url.includes('sector.php')) {
      SekExtension.onPageLoad(document);
    }
  },

  /**
   * Event listener for additional menu entries.
   * @param event the event.
   * @param title the title of page.
   * @param url the url of the page.
   */
  onMenuEntrySelected: function (event, title, url) {
    let iframe = deExtension.createIFrame(title, url);
    document.body.insertBefore(iframe, null);
  }
};