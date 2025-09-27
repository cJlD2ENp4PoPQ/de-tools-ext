/**
 * Extends the map page of Die-Ewigen /map.php
 * @type {{addAgentCalculation: NewsExtension.addAgentCalculation, addUsedAgentsText(HTMLElement): void, onPageLoad: NewsExtension.onPageLoad}}
 */
const MapExtension = {

  agent_config : {scan_min: 0.02, scan_max: 0.06},

  onPageLoad: function(content) {
      this.addFleetpoints(content)
  },

  /**
   * Adds FP node to all player entries
   * @param {Document} content the map content
   */
  addFleetpoints : function (content) {
    let playerNodes = content.querySelectorAll('.player-stats');
    for(let playerNode of playerNodes) {
      let pointsNode = playerNode.childNodes.item(0);
      if (pointsNode && pointsNode.innerText) {
        const isGreen = pointsNode.classList.contains('text3');
        let tooltip = pointsNode.dataset.tooltip;
        let match = tooltip.match(/Punkte:\s*([\d\.]+)/);
        let points = match ? parseInt(match[1].replace(/\./g, '')) : null
        let collectors = parseInt(playerNode.childNodes.item(1).innerText);
        let colStep = 0;
        if(collectors >= 100) {
          colStep = Math.floor(collectors / 50) - 1;
        }
        const fp = match ? (points - collectors * SekExtension.kolliPoints[colStep > 20 ? 20 : colStep]) : undefined;
        let numberFormat = new Intl.NumberFormat('de', { notation: 'compact', maximumFractionDigits: 2, compactDisplay: 'short', maximumSignificantDigits: 3 });
        const fpFormatted = fp ? numberFormat.format(fp): "n/a";
        let fpNode = document.createElement("div");
        fpNode.classList = isGreen ? ["tac text3 fp-node"] : ["tac text2 fp-node"];
        fpNode.textContent = "FP " + fpFormatted;
        playerNode.parentNode.insertBefore(fpNode, playerNode.nextSibling);
      }
    }
  },
};