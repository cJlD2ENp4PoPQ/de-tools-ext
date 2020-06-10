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
    container.id = "ext-iframe-container";
    container.style ="position: absolute; width: 55%; height: 65%; right: 0px; top: 58px; z-index: 100;";
    let closer = deExtension.createIFrameCloser();
    let mover = document.createElement("div");
    mover.id = "ext-iframe-containerheader";
    mover.style ="padding:5px; cursor: move; z-index=101; background-color: #D3E2F1; display:flex";
    let moverTitle = document.createElement("span");
    moverTitle.innerText = title;
    moverTitle.style = "text-align: center; vertical-align: middle; line-height: 50px; padding-top:5px; padding-left:50px; font: bold 18pt / 12pt Gabriola, Arial, Times New Roman";
    let moverIcon = document.createElement("img");
    moverIcon.src = chrome.runtime.getURL("icons/icons8-move-50.png");
    moverIcon.style = "height:20px";
    mover.insertBefore(moverIcon, null);
    mover.insertBefore(moverTitle, null);
    let iframe = document.createElement("iframe");
    iframe.setAttribute("content",type);
    iframe.id = "ext-iframe";
    iframe.src = url;
    iframe.height = "100%";
    iframe.width = "100%";
    container.insertBefore(mover, null);
    container.insertBefore(closer, null);
    container.insertBefore(iframe, null);
    this.dragElement(container);
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
    container.style = "position: absolute; width: 29px; height: 31px; background-color: rgba(0,0,0, 0.8)" +
      "border-bottom: 1px solid rgba(22,22,22, 0.8); border-right: 1px solid #222222; cursor: pointer; z-index: 101; background-color: #000";
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
    document.body.insertBefore(iframe, null);
    let mainContainer = document.getElementById("iframe_main_container");
    if(mainContainer && mainContainer.children.length >= 1) {
      this.updateExtensions(mainContainer.children[0].contentDocument);
    }
  },

  dragElement: function (elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      // if present, the header is where you move the DIV from:
      document.getElementById(elmnt.id + "header").onmousedown = this.dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
     function dragMouseDown (e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
       elmnt.onmousemove = elementDrag;
    }

    function elementDrag (e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      elmnt.onmouseup = null;
      elmnt.onmousemove = null;
    }
  },
};