window.addEventListener("load", function load (event) {
  window.removeEventListener("load", load, false);
  deExtension.init();
}, false);

deksOpen = false;

const deExtension = {

  init: function () {
    let appcontent = document.getElementById("iframe_main_container"); // content
    let timecss = document.createElement('link');
    timecss.classList = ['ext-css'];
    timecss.href = chrome.runtime.getURL('css/time.css');
    timecss.type = 'text/css';
    timecss.rel = 'stylesheet';
    document.getElementsByTagName("head")[0].appendChild(timecss);
    if (appcontent) {
      this.saveRace(false);
      this.saveServer();
      this.addTimerSwitch();
      let overviewIframe = appcontent.querySelector('iframe[src="overview.php"]');
      if(overviewIframe) {
        OverviewExtension.onPageLoad(overviewIframe.contentDocument);
      }
      appcontent.addEventListener("load", function (event) {
        deExtension.onPageLoad(event);
      }, true)
      this.addMenuEntries(document);
    } else if (!!window.parent && !window.parent.document.URL.includes('dm.php')) {
      this.saveRace(true);
      this.saveServer();
      this.onMobilePageLoad(document)
    }
  },

  /**
   * Adds additional menu entries to navigation bar.
   * @param {Document} document which contains the navigation bar.
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
   * Create a new menu entry node.
   * @param {String} title the title of menu entry.
   * @param {URL} url the location of menu content.
   * @param {String} type the identifier of content.
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
   * @param {Event} page the page content of content IFrame.
   */
  onPageLoad: function (page) {
    let contentDocument = page.target.contentDocument;
    if(contentDocument) {
      this.updateExtensions(contentDocument);
    }
  },

  /**
   * Updates the content frame extensions.
   * @param {Document} contentDocument the content of the content frame.
   */
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
    let title = contentDocument.querySelector('head title');
    if (title && title.innerText === 'Auktion') {
      TradeExtension.onPageLoad(contentDocument);
    }
    if (contentDocument.querySelector('form[action="sysnews.php"]')) {
      NewsExtension.onPageLoad(contentDocument);
    }
    let allianceTitle = contentDocument.querySelector('div.cellu');
    if (allianceTitle ? allianceTitle.innerHTML.includes('Allianzinformationen') : false) {
      AllyExtension.onPageLoad(contentDocument);
    }
    if (title && title.innerHTML.includes('Übersicht')) {
      OverviewExtension.onPageLoad(contentDocument);
    }
    if (title && (title.innerText === 'Vergessene Systeme' || title.innerText === 'Systeminformationen')) {
      VSysExtension.onPageLoad(contentDocument);
    }
  },

  /**
   * Dispatcher for mobile load events.
   * @param {Document} document the content of the page
   */
  onMobilePageLoad: function (document) {
    let url = document.URL;
    if (url.includes('sector.php')) {
      SekExtension.onPageLoad(document);
    } else if (url.includes('auction.php')) {
      TradeExtension.onPageLoad(document);
    } else if (url.includes('production.php')) {
      ProductionExtension.onPageLoad(document);
    } else if (url.includes('sysnews.php')) {
      NewsExtension.onPageLoad(document);
    } else if (url.includes('map_mobile.php')) {
      VSysExtension.onPageLoad(document);
    } else if (url.includes('map_system.php')) {
      VSysExtension.onPageLoad(document);
    } else if (url.includes('overview.php')) {
      OverviewExtension.onPageLoad(document);
    } else if (url.includes('secret.php')) {
      SecretExtension.onPageLoad(document, false, true);
    } else if (url.includes('ally_detail.php')) {
      let allianceTitle = document.querySelector('div.cellu');
      if(allianceTitle ? allianceTitle.innerHTML.includes('Allianzinformationen') : false) {
        AllyExtension.onPageLoad(document);
      }
    }
  },

  /**
   * adds a battle mode switch to the tick area.
   */
  addTimerSwitch: function () {
    let element = document.querySelector('img[src="g/tb_timedata.png"]');
    if(element) {
      element.src = chrome.runtime.getURL("icons/tb_timedata.png");
      let tbTime = document.getElementById('tb_time1');
      document.getElementById('tb_time2').style = 'position: absolute; top: 24px; left: 34px;';
      document.getElementById('tb_time3').style = 'position: absolute; top: 47px; left: 34px;';
      let switcher = document.createElement('div');
      switcher.id = 'time_mode_switch'
      let switcherIcon = document.createElement('img');
      switcherIcon.style = 'width:25px; padding-left:2px; padding-top:17px';
      switcherIcon.src = chrome.runtime.getURL("icons/flight.svg");
      let config = Storage.getConfig('de', 'time');
      if (config && config.battleMode === true) {
        tbTime.style = 'position: absolute; top: 1px; left: 20px;';
        Time.startTime();
        switcher.style = 'position: absolute; right: 113px; top:0; height:66px; width: 30px; cursor: pointer; z-index:3000; background-color: #ff872c';
      } else {
        switcher.style = 'position: absolute; right: 113px; top:0; height:66px; width: 30px; cursor: pointer; z-index:3000; background-color: #454545';
      }
      switcher.insertBefore(switcherIcon, null);
      switcher.addEventListener('click', ev => {
        let config = Storage.getConfig('de', 'time');
        let switcher = ev.target.ownerDocument.querySelector('#time_mode_switch');
        if (config && config.battleMode === true) {
          ev.target.ownerDocument.querySelector('#tb_time1').style = 'position: absolute; top: 1px; left: 34px;';
          config.battleMode = false;
          Storage.storeConfig('de', 'time', config);
          Time.stopTime();
          switcher.style = 'position: absolute; right: 113px; top:0; height:66px; width: 30px; cursor: pointer; z-index:3000; background-color: #454545';
        } else {
          ev.target.ownerDocument.querySelector('#tb_time1').style = 'position: absolute; top: 1px; left: 20px;';
          config = {battleMode: true};
          Storage.storeConfig('de', 'time', config);
          Time.startTime();
          switcher.style = 'position: absolute; right: 113px; top:0; height:66px; width: 30px; cursor: pointer; z-index:3000; background-color: #ff872c';
        }
      });
      tbTime.parentElement.parentElement.insertBefore(switcher, tbTime.parentElement)
    }
  },

  /**
   * Saves the race of the player.
   * @param {Boolean} mobile is the mobile page or not.
   */
  saveRace: function (mobile) {
    let race;
    if(mobile) {
      let header = document.getElementById('resmain');
      if(header) {
        let computedStyle = getComputedStyle(header);
        if(computedStyle.backgroundImage.includes('3_top.png')) {
          race = 'K';
        } else if(computedStyle.backgroundImage.includes('2_top.png')) {
          race = 'I';
        } else if (computedStyle.backgroundImage.includes('1_top.png')) {
          race = 'E';
        } else if (computedStyle.backgroundImage.includes('4_top.png')){
          race = 'Z';
        }
      }
    } else {
      race = document.querySelector("img[src='gp/g/derassenlogo1.png']") ? 'E' : undefined;
      if(!race) {
        race = document.querySelector("img[src='gp/g/derassenlogo2.png']") ? 'I' : undefined;
      }
      if(!race) {
        race = document.querySelector("img[src='gp/g/derassenlogo3.png']") ? 'K' : undefined;
      }
      if(!race) {
        race = document.querySelector("img[src='gp/g/derassenlogo4.png']") ? 'Z' : undefined;
      }
    }
    window.race = race;
  },

  saveServer : function() {
    let host = window.document.location.host;
    window.server = host.split('.')[0];
  },

  /**
   * Event listener for additional menu entries.
   * @param {Event} event the click event on menu entry.
   * @param {String} title the title of page.
   * @param {URL} url the url of the page.
   * @param {String} type the identifier of content.
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