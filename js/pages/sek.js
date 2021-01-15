/**
 * Extends the sector page of Die-Ewigen /sector.php
 * @type {{onPageLoad: SekExtension.onPageLoad, addFleetpoints: SekExtension.addFleetpoints}}
 */
const SekExtension = {

  kolliPoints : {0:10000,1:10500,2:11000,3:11500,4:12000,5:12500,6:13000,7:13500,8:14000,9:14500,10:15000,11:15500
    ,12:16000,13:16500,14:17000,15:17500,16:18000,17:18500,18:19000,19:19500,20:20000},

  allyContextMenu : [
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
        if(originEvent.target.textContent !== String.fromCharCode(160)) {
          originEvent.target.ownerDocument.location = parent.getAttribute('href');
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
        let alliance = allianceCell.childNodes[0].textContent.replace(String.fromCharCode(160),'');
        allianceCell.removeChild(allianceCell.childNodes[0]);
        let allyEditInput = document.createElement('input');
        allyEditInput.id = 'ally_edit';
        allyEditInput.value = alliance;
        allyEditInput.addEventListener('change',
          (event) => {
            let row = event.target.closest('tr');
            let name = row.childNodes[2].innerText;
            name = name.replace('*', '').trim();
            let player = {name: name, replaced: true};
            SekExtension.saveAlliance(player, event.target.value, true);
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
        name = name.replace('*', '').trim();
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
    let fpNodes = content.querySelectorAll('td.fp-node');
    if(fpNodes.length === 0) {
      this.addFleetpoints(content);
      this.readAlliance(content);
    }
  },

  /**
   * Adds fleet point column to given document.
   * @param {Document} content the content which contains the player table.
   */
  addFleetpoints : function (content) {
    let players = [];
    let playerCounter = 0;
    content.querySelectorAll("td.text2,td.text3").forEach((node, i) => {
      if(i%2 === 0) {
        let player = {points:node.innerText.split('.').join('')};
        players.push(player);
      } else {
        players[playerCounter].kollis = node.innerText.split('.').join('');
        playerCounter++;
      }
    });
    let tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(8) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
    if(tableContent.length === 0) {
      tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(6) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
    }
    if(tableContent.length === 0) {
      tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
    }
    tableContent.forEach((node, i) => {
        if(i <= players.length && i > 0) {
          let kolliStep = 0;
          if(players[i-1].kollis >= 100) {
            kolliStep = Math.floor(players[i-1].kollis / 50) - 1;
          }
          let fp = (players[i-1].points - players[i-1].kollis * SekExtension.kolliPoints[kolliStep > 20 ? 20 : kolliStep]);
          let fpNode = document.createElement("td");
          fpNode.classList = ["cell tac text2 fp-node"];
          fpNode.style = "text-align: right;"
          fpNode.textContent = fp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          node.insertBefore(fpNode, node.childNodes[6]);
        } else if (i === 0) {
          let header = document.createElement("td");
          header.textContent = "Flottenpunkte"
          node.insertBefore(header, node.childNodes[12]);
        }
      });
  },

  /**
   * Saves alliances from sector page.
   * @param {Document} content the content which contains the player table.
   */
  readAlliance : function (content) {
    let tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(6) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
    if(tableContent.length === 0) {
      tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
    }
    tableContent.forEach((row, i) => {
      let allianceCell = row.childNodes[4];
      let alliance = allianceCell.innerText;
      let name = row.childNodes[2].innerText;
      if(name && alliance) {
        name = name.replace('*', '').trim();
        let config = Storage.getConfig('ally','tags');
        if(config) {
          Object.getOwnPropertyNames(config).forEach(ally => {
            let allyMembers = config[ally];
            let index = allyMembers.findIndex(member => member.name === name);
            if (index >= 0 && allyMembers[index].replaced) {
              if(allianceCell.childNodes[0].childNodes[0]) {
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
        new VanillaContext(allianceCell, {nodes: SekExtension.allyContextMenu, autoClose: true});
        let player = {name: name, replaced: false};
        SekExtension.saveAlliance(player, alliance);
      }
    });
  },

  saveAlliance(player, alliance, override) {
    let allyTags = Storage.getConfig('ally','tags');
    if(!allyTags) {
      allyTags = {};
    }
    if (alliance !== String.fromCharCode(160)) {
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
        } else {
          let player = members[matchIndex];
          if(override) {

          }
        }
      }
    }
    Storage.storeConfig('ally', 'tags', allyTags);
  }
};
