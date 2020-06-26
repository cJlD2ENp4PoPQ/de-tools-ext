const frame = {

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
    let closer = this.createIFrameCloser();
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
    container.addEventListener("click", this.closeIframe, true)
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
      MilitaryExtension.cleanup(mainContainer.children[0].contentDocument);
      SecretExtension.cleanup(mainContainer.children[0].contentDocument);
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
}