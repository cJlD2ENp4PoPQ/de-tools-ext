/**
 * Extends the sector page of Die-Ewigen /sector.php
 * @type {{onPageLoad: SekExtension.onPageLoad, addFleetpoints: SekExtension.addFleetpoints}}
 */
const SekExtension = {

  kolliPoints : {0:10000,1:10500,2:11000,3:11500,4:12000,5:12500,6:13000,7:13500,8:14000,9:14500,10:15000,11:15500
    ,12:16000,13:16500,14:17000,15:17500,16:18000,17:18500,18:19000,19:19500,20:20000},

  onPageLoad: function(content) {
    let fpNodes = content.querySelectorAll('td.fp-node');
    if(fpNodes.length === 0) {
      SekExtension.addFleetpoints(content);
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
    let tableContent = content.querySelectorAll("body > div:nth-child(1) > div:nth-child(6) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table:nth-child(1) > tbody > tr");
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
  }
};