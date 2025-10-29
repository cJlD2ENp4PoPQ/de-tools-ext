/**
 * Extends the sector page of Die-Ewigen /sector.php
 * @type {{onPageLoad: SekExtension.onPageLoad, addFleetpoints: SekExtension.addFleetpoints}}
 */

const SekExtension = {
    
  kolliPoints : {0:10000,1:10500,2:11000,3:11500,4:12000,5:12500,6:13000,7:13500,8:14000,9:14500,10:15000,11:15500
    ,12:16000,13:16500,14:17000,15:17500,16:18000,17:18500,18:19000,19:19500,20:20000},

  allyContextMenuCfg : [
    {
      renderer: (params) => {
        const td = params.originEvent.target.closest('td');
        return '<b>' + td.textContent + '</b>';
      },
      disabled: true,
      style: {
        backgroundColor: 'black',
        borderBottom: 'solid',
        borderColor: 'white'
      }
    },
    {
      renderer: 'Anzeigen',
      onClick: ({api, originEvent}) => {
        let parent = originEvent.target.parentElement;
        if(originEvent.target.firstChild !== String.fromCharCode(160)) {
          let href = parent.getAttribute('href');
          if(href) {
            originEvent.target.ownerDocument.location = href;
          } else {
            originEvent.target.ownerDocument.location= "ally_detail.php?allytag="+originEvent.target.firstChild.textContent;
          }
        }
      },
      disabled: (params) => {
        return params.originEvent.target.closest('td').textContent === String.fromCharCode(160);
      },
      style: {
        backgroundColor: 'black',
        borderBottom: 'solid',
        borderColor: 'white'
      }
    },
    {
      renderer: 'Ändern',
      onClick: ({api, originEvent}) => {
        let row = originEvent.target.closest('tr');
        let allianceCell = row.childNodes[4];
        if(allianceCell.querySelector('input')) {
          return;
        }
        let alliance = allianceCell.childNodes[0].textContent.replace(String.fromCharCode(160),'');
        allianceCell.removeChild(allianceCell.childNodes[0]);
        let allyEditInput = document.createElement('input');
        allyEditInput.id = 'ally_edit';
        allyEditInput.value = alliance;
        allyEditInput.addEventListener('change',
          (event) => {
            let row = event.target.closest('tr');
            let coords = SekExtension.getCoordinates(row);
            let name = row.childNodes[2].innerText;
            name = name.replace('*', '').trim();
            let player = {name: name, x:coords.sector, y:coords.sys, replaced: true};
            SekExtension.overrideAlliance(player, event.target.value);
            originEvent.target.ownerDocument.location = originEvent.target.ownerDocument.location;
          });
        allianceCell.insertBefore(allyEditInput, null);
        api.close();
      },
      disabled: false,
      style: {
        backgroundColor: 'black',
        borderBottom: 'solid',
        borderColor: 'white'
      }
    },
    {
      renderer: 'Zurücksetzen',
      onClick: ({api, originEvent}) => {
        let allyTags = Storage.getConfig('ally','tags');
        let row = originEvent.target.closest('tr');
        let name = row.childNodes[2].innerText;
        name = name.replace(' *', '').trim();
        Object.getOwnPropertyNames(allyTags).forEach(ally => {
          let allyMembers = allyTags[ally];
          let index = allyMembers.findIndex(member => member.name === name);
          if (index >= 0) {
            allyMembers.splice(index, 1);
            allyTags[ally] = allyMembers;
            Storage.storeConfig('ally', 'tags', allyTags);
          }
        });
        api.close();
        originEvent.target.ownerDocument.location = originEvent.target.ownerDocument.location;
      },
      disabled: false,
      style: {
        backgroundColor: 'black',
        borderBottom: 'solid',
        borderColor: 'white'
      }
    },
    {
      renderer: 'Abbrechen',
      onClick: ({api, originEvent}) => {
        api.close();
      },
      disabled: false,
      style: {
        backgroundColor: 'black'
      }
    }
  ],

  onPageLoad: function(content) {
    this.allyContextMenu = new ContextMenu(this.allyContextMenuCfg, content);

    let fpNodes = content.querySelectorAll('td.fp-node');
    if(fpNodes.length === 0) {

      let tableContent = content.querySelectorAll("form[name='secform'] ~ table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
      let isAlienSector = tableContent[0].childElementCount < 8;
      this.addFleetpoints(tableContent, isAlienSector);
      if(!isAlienSector) {
        let sectorAllies = this.readAlliance(tableContent);
        this.saveSectorAlliances(sectorAllies);
      }
    }
  },

  /**
   * Adds fleet point column to given table row array.
   * @param {Array.<HTMLTableRowElement>} tableContent the content which contains the player table.
   * @param {boolean} alienSector the current sector is a bot sector.
   */
  addFleetpoints : function (tableContent, alienSector) {
    let players = [];
    let playerCounter = 0;
    tableContent.forEach((node,i) => {
      if(i>0) {
        //skip the table header
        let pointOrCollectorNodes = node.querySelectorAll("td.text2,td.text3");
        pointOrCollectorNodes.forEach((pointOrCollectorNode,j) => {
          if (j % 2 === 0) {
            let player = {points: pointOrCollectorNode.innerText.split('.').join('')};
            players.push(player);
          } else {
            players[playerCounter].kollis = pointOrCollectorNode.innerText.split('.').join('');
            playerCounter++;
          }
        })

      }
    })

    let pointColumnIndex = alienSector ? 2 : 5;
    let pointHeaderColumnIndex = alienSector ? 6 : 12;
    tableContent.forEach((node, i) => {
        if(i <= players.length && i > 0) {
          let kolliStep = 0;
          if(players[i-1].kollis >= 100) {
            kolliStep = Math.floor(players[i-1].kollis / 50) - 1;
          }
          let fp = (players[i-1].points - players[i-1].kollis * SekExtension.kolliPoints[kolliStep > 20 ? 20 : kolliStep]);
          let pointNode = node.childNodes[pointColumnIndex];
          let isGreen = false;
          if(pointNode) {
            isGreen = pointNode.classList.contains("text3");
          }
          let fpNode = document.createElement("td");
          fpNode.classList = isGreen ? ["cell tac text3 fp-node"] : ["cell tac text2 fp-node"];
          fpNode.style = "text-align: right; padding-left: 8px";
          fpNode.textContent = fp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          node.insertBefore(fpNode, node.childNodes[pointColumnIndex+1]);
        } else if (i === 0) {
          let header = document.createElement("td");
          header.textContent = "Flottenpunkte"
          header.setAttribute("class", "cell tac")
          node.insertBefore(header, node.childNodes[pointHeaderColumnIndex]);
        }
      });
  },

  /**
   * Saves alliances from sector page.
   * @param {Array.<HTMLTableRowElement>} tableContent the content which contains the player table.
   * @return {Map<String, Object>} player alliances
   */
  readAlliance : function (tableContent) {
    let config = Storage.getConfig('ally', 'tags');
    let allyInfos = Storage.getConfig('ally', 'info');
    let allianceMap = new Map();
    tableContent.forEach((row, i) => {
      let allianceCell = row.childNodes[4];
      if(allianceCell) {
        let coords = this.getCoordinates(row);
        let alliance = allianceCell.innerText;
        let name = row.childNodes[2].innerText;
        if (name && alliance) {
          name = name.replace(' *', '').trim();
          if (config) {
            Object.getOwnPropertyNames(config).forEach(ally => {
              let allyMembers = config[ally];
              let index = allyMembers.findIndex(member => member.name === name);
              if (index >= 0 && allyMembers[index].replaced) {
                if (allianceCell.childNodes[0].childNodes[0]) {
                  allianceCell.childNodes[0].childNodes[0].innerText = ally;
                } else {
                  let span = document.createElement('span');
                  span.classList.add('tc4');
                  span.innerText = ally;
                  allianceCell.insertBefore(span, null);
                }
              }
            });
          }
          let player = {name: name, x: coords.sector, y: coords.sys, replaced: false};
          SekExtension.allyContextMenu.attach(allianceCell);
          let playerList = allianceMap.get(alliance);
          playerList = playerList ? playerList : [];
          playerList.push(player);
          allianceMap.set(alliance, playerList);
          if (allyInfos) {
            let allyInfo = allyInfos[alliance];
            if (allyInfo) {
              let span = allianceCell.querySelector('span');
              switch (allyInfo.relation) {
                case 'enemy':
                  span.classList = ['tc2'];
                  break;
                case 'friend':
                  span.classList = ['tc3'];
                  break;
                case 'own':
                  span.classList = ['tc1'];
                  break;
              }
            }
          }
        }
      }
    });
    return allianceMap;
  },

  /**
   * Get player coordinates from HTML table row.
   * @param {HTMLTableRowElement} row the sector player row.
   * @return {{sys, sector}} the coordinates of player.
   */
  getCoordinates(row) {
    let militaryLinkElement = row.querySelector('a[href*="military.php"]');
    let sector;
    let sys;
    if(militaryLinkElement) {
      let militaryLink = militaryLinkElement.getAttribute("href");
      if(militaryLink) {
        let militaryLinkMatcher = militaryLink.match("military\\.php\\?se=(\\d+)&sy=(\\d+)$");
        if(militaryLinkMatcher) {
          sector = militaryLinkMatcher[1];
          sys = militaryLinkMatcher[2];
        }
      }
    }
    return {sector:sector, sys:sys};
  },

  /**
   * Save all alliances from sector.
   * @param {Map<String, Object>} alliancePlayers alliances alliancePlayers
   */
  saveSectorAlliances(alliancePlayers) {
    let allyTags = Storage.getConfig('ally','tags');
    if(!allyTags) {
      allyTags = {};
    }
    alliancePlayers.forEach((playerList, alliance) => {
      if (alliance !== String.fromCharCode(160)) {
        playerList.forEach(player => {
          this.mergeWithLocalStorage(allyTags, alliance, player, false);
        })
      }
    });
    Storage.storeConfig('ally', 'tags', allyTags);
  },

  /**
   * Overrides a alliance of a player.
   * @param player the player
   * @param alliance the alliance value
   */
  overrideAlliance(player, alliance) {
    let allyTags = Storage.getConfig('ally','tags');
    if(!allyTags) {
      allyTags = {};
    }
    if (alliance !== String.fromCharCode(160)) {
      this.mergeWithLocalStorage(allyTags, alliance, player, true);
    }
    Storage.storeConfig('ally', 'tags', allyTags);
  },

  /**
   * Merge a player with alliance in existing ally tags object.
   * @param allyTags the merge result/source
   * @param alliance the alliance of the player
   * @param player the player
   * @param override override existing alliance of player in allyTags
   */
  mergeWithLocalStorage(allyTags, alliance, player, override) {
    let members = allyTags[alliance];
    if (!members) {
      Object.getOwnPropertyNames(allyTags).forEach(ally => {
        let allyMembers = allyTags[ally];
        let index = allyMembers.findIndex(member => member.name === player.name);
        if (index >= 0) {
          allyMembers.splice(index, 1);
          allyTags[ally] = allyMembers;
        }
      });
      members = [];
      members.push(player);
      allyTags[alliance] = members;
    } else {
      let matchIndex = members.findIndex(member => member.name === player.name);
      if (matchIndex < 0) {
        let existingAlly;
        Object.getOwnPropertyNames(allyTags).forEach(ally => {
          let allyMembers = allyTags[ally];
          let index = allyMembers.findIndex(member => member.name === player.name);
          if (index >= 0) {
            existingAlly = ally;
            if(override || !allyMembers[index].replaced) {
              allyMembers.splice(index, 1);
              allyTags[ally] = allyMembers;
            }
          }
        });
        if(override || !existingAlly) {
          members.push(player);
          allyTags[alliance] = members;
        }
      }
    }
  }
};
