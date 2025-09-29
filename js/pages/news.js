/**
 * Extends the sector page of Die-Ewigen /sysnews.php
 * @type {{addAgentCalculation: NewsExtension.addAgentCalculation, addUsedAgentsText(HTMLElement): void, onPageLoad: NewsExtension.onPageLoad}}
 */
const NewsExtension = {

  agent_config : {scan_min: 0.02, scan_max: 0.06},

  onPageLoad: function(content) {
      this.addAgentCalculation(content);
  },

  /**
   * Adds calculated agent count to news entries..
   * @param {Document} content the content which contains the news list.
   */
  addAgentCalculation : function (content) {
    Array.from(content.querySelectorAll('table table tr td'))
      .filter(td => td.innerText.includes('Geheimdiensteinsatz'))
      .forEach(td => NewsExtension.addUsedAgentsText(td));
  },

  /**
   * Adds the used agent amount for scan to news scan entry.
   * @param {HTMLElement} newsEntry the news list entry of scan operation.
   */
  addUsedAgentsText(newsEntry) {
    let lostAgents = newsEntry.innerText.match(/.*entdeckt\Wund\W([0-9]+)\WAgent.*/)[1];
    let agentEntryDiv = document.createElement('div');
    agentEntryDiv.classList.add('used_agent_hint');
    let minAgents = Math.round(lostAgents / this.agent_config.scan_max);
    let maxAgents = Math.round(lostAgents / this.agent_config.scan_min);
    let minAgentsStr = minAgents.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    let maxAgentsStr = maxAgents.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    agentEntryDiv.textContent = 'Es wurden zwischen ' + minAgentsStr + ' und ' + maxAgentsStr + ' Agenten eingesetzt.';
    newsEntry.insertBefore(agentEntryDiv, null);
  }
};