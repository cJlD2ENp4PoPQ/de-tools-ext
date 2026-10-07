/**
 * Extends the sector page of Die-Ewigen /map_mobile.php
 * @type {{storeShownSystems: VSysExtension.storeShownSystems, onPageLoad: VSysExtension.onPageLoad, addFilterEventListener(Document): void, onUpdate: VSysExtension.onUpdate}}
 */
const VSysExtension = {

  storageKey: 'Vsys',

  isRedesign: false,

  /**
   * Observer for V-System overview page to detect changes when navigating through systems (not a page load, JS dom manipulation).
   * Trigger the onPageLoad function when a change is detected.
   */
  observer: new MutationObserver(function(mutationsList) {
    let ownerDocument = mutationsList[0].target.ownerDocument;
    VSysExtension.onPageLoad(ownerDocument);
  }),
  /**
   * Add V-System extensions.
   * @param {Document} content
   */
  onPageLoad: async function (content) {
    this.isRedesign = content.querySelector('.mod');
    let sysElements;
    if (this.isRedesign) {
      let mutationParent = content.querySelector('#vs-main');
      if (mutationParent) {
        //observe changes in the V-System detail changes
        this.observer.observe(mutationParent, {
          childList: true,
          subtree: true
        });
      }
      sysElements = content.querySelectorAll('.f_system:not([style*="display: none"])');
    } else {
      sysElements = content.querySelectorAll('tr.f_system[style*="height: 30px;"]:not([style*="display: none"])');
    }
    if(sysElements && sysElements.length > 0) {
      //system overview page
      this.addFilterEventListener(content);
      content.querySelectorAll('a[href*="?id="]').forEach(a => {
          a.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            if (!!content.querySelector('.mod')) {
              let sysElements = content.querySelectorAll('.f_system:not([style*="display: none"])');
              this.storeShownSystems(sysElements);
              return false;
            } else {
              let sysElements = content.querySelectorAll('tr.f_system[style*="height: 30px;"]:not([style*="display: none"])');
              this.storeShownSystems(sysElements);
              return true;
            }
          });
        });
      await this.storeShownSystems(sysElements);
    } else {
      //system details page
      let higher = content.getElementById('link_higher');
      let systems = await Storage.getConfig(this.storageKey, 'syslist');
      if (systems && systems.length > 0 && higher) {
        let current = content.getElementById('input_system_id').value;
        Array.from(content.getElementsByTagName('a'))
            .filter(link => link.href.includes('?id='))
            .forEach(a => {
              if (a.innerText.includes('<<') || a.innerText.includes('«')) {
                a.href = '?id=' + systems[0];
              } else if (a.id === 'link_lower') {
                let lowerIndex = systems.indexOf(current);
                if (lowerIndex === 0) {
                  a.href = '?id=' + current;
                } else if (lowerIndex > 0) {
                  a.href = '?id=' + systems[lowerIndex - 1];
                }
              } else if (a.id === 'link_higher') {
                let higherIndex = systems.indexOf(current);
                if (higherIndex >= systems.length - 1) {
                  a.href = '?id=' + current;
                } else if (higherIndex < systems.length - 1) {
                  a.href = '?id=' + systems[higherIndex + 1];
                }
              } else if (a.innerText.includes('>>') || a.innerText.includes('»')) {
                a.href = '?id=' + systems[systems.length - 1];
              }
            })
      }
      const arrayOfFindings = []
      if (this.isRedesign) {
        const findings = Array.from(content.querySelectorAll('.ms-fund'));
        for (let i = 0; i < findings.length; i++) {
          const findingElement = findings[i];
          const fieldElement = findingElement.querySelector('.bk-leise');
          const fieldId = fieldElement?.textContent?.split(' ')[1];
          arrayOfFindings.push({buildingId: fieldId});
        }
      } else {
        const findingHeadline = Array.from(content.querySelectorAll('div'))
            .filter(div => div.textContent.includes('Fundstücke:')).pop()
        if (findingHeadline) {
          let finding = findingHeadline.nextSibling;
          while (finding) {
            let tokens = finding.textContent.split(' ');
            if (tokens.length > 2 && tokens[0] === 'Feld') {
              arrayOfFindings.push({buildingId: tokens[1].replace(':', '')});
            }
            finding = finding.nextSibling;
          }
        }
      }
      for (let i = 0; i < arrayOfFindings.length; i++) {
        let upgradeElement = content
            .querySelector(`input[name="fieldid"][value="${arrayOfFindings[i].buildingId}"]`)
            ?.parentElement?.parentElement;
        if (upgradeElement) {
          upgradeElement.style.backgroundColor = 'rgba(255,0,0,0.23)';
        }
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
    let resetButton = content.querySelector('.vs-filter > button');
    if (resetButton) {
        resetButton.addEventListener('click', this.onUpdate)
    }
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
  storeShownSystems: async function (sysElements) {
    systems = [];
    sysElements.forEach(node => {
      let cols = node.getElementsByTagName('td');
      if (cols.length >= 1) {
        let sysNameCell = cols.item(0);
        let sysId = sysNameCell.innerText.match(/.*#([0-9]+)\W.*/)[1];
        systems.push(sysId);
      }
    })
    await Storage.storeConfig(this.storageKey, 'syslist', systems);
  }
};