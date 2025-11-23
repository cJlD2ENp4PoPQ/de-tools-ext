/**
 * Extends the sector page of Die-Ewigen /map_mobile.php
 * @type {{storeShownSystems: VSysExtension.storeShownSystems, onPageLoad: VSysExtension.onPageLoad, addFilterEventListener(Document): void, onUpdate: VSysExtension.onUpdate}}
 */
const VSysExtension = {

  storageKey: 'Vsys',

  /**
   * Add V-System extensions.
   * @param {Document} content
   */
  onPageLoad: function (content) {
    let sysElements = content.querySelectorAll('tr.f_system+tr[style*="height: 30px;"]:not([style*="display: none"])');
    if(sysElements && sysElements.length > 0) {
      this.addFilterEventListener(content);
      content.querySelectorAll('a[href*="?id="]').forEach(a => {
          a.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            let sysElements = content.querySelectorAll('tr.f_system+tr[style*="height: 30px;"]:not([style*="display: none"])');
            this.storeShownSystems(sysElements);
            return true;
          });
        });
      this.storeShownSystems(sysElements);
    } else {
      let higher = content.getElementById('link_higher');
      let systems = Storage.getConfig(this.storageKey,'syslist');
      if(systems && systems.length > 0 && higher) {
        let current = content.getElementById('input_system_id').value;
        Array.from(content.getElementsByTagName('a'))
          .filter(link => link.href.includes('?id='))
          .forEach(a => {
          if(a.innerText.includes('<<')) {
            a.href = '?id='+ systems[0];
          } else if(a.id === 'link_lower') {
            let lowerIndex = systems.indexOf(current);
            if(lowerIndex === 0) {
              a.href = '?id='+current;
            } else if(lowerIndex > 0) {
              a.href = '?id=' + systems[lowerIndex - 1];
            }
          } else if(a.id === 'link_higher') {
            let higherIndex = systems.indexOf(current);
             if(higherIndex >= systems.length - 1) {
              a.href = '?id=' + current;
            } else if(higherIndex < systems.length - 1) {
              a.href = '?id=' + systems[higherIndex + 1];
            }
          } else if(a.innerText.includes('>>')) {
            a.href = '?id=' + systems[systems.length - 1];
          }
        })
      }
    }
  },

  /**
   * Add update hook to V-System filter.
   * @param {Document} content
   */
  addFilterEventListener(content) {
    let vsf0a = content.getElementById('vsf0a');
    let vsf0b = content.getElementById('vsf0b');
    let vsf0c = content.getElementById('vsf0c');
    if(vsf0a) {
      vsf0a.addEventListener('change', this.onUpdate)
    }
    if(vsf0b) {
      vsf0b.addEventListener('change', this.onUpdate)
    }
    if(vsf0c) {
      vsf0c.addEventListener('change', this.onUpdate)
    }
  },

  /**
   * Update page event hook.
   * @param {Event} event
   */
  onUpdate: function(event) {
    VSysExtension.onPageLoad(event.target.ownerDocument);
  },

  /**
   * Stores all shown V-Systems.
   * @param {[HTMLElement]} sysElements
   */
  storeShownSystems: function (sysElements) {
    systems = [];
    sysElements.forEach(node => {
      let cols = node.getElementsByTagName('td');
      if (cols.length >= 1) {
        let sysNameCell = cols.item(0);
        let sysId = sysNameCell.innerText.match(/.*#([0-9]+)\W.*/)[1];
        systems.push(sysId);
      }
    })
    Storage.storeConfig(this.storageKey, 'syslist', systems);
  }
};