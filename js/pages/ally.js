const AllyExtension = {

    relationStates: [
        {id: 'own', value: 'Eigene'},
        {id: 'neutral', value: 'Neutral'},
        {id: 'enemy', value: 'Feind'},
        {id: 'friend', value: 'Freund'},
    ],

    onPageLoad: function (content) {
        let allyInfosRows = content.querySelectorAll('tr.cl');
        let allyInfo = {};
        if(allyInfosRows && allyInfosRows.length > 0) {
            let allyTable = allyInfosRows[0].parentElement;
            allyInfosRows.forEach((entry, i) => {
                let rowCells = entry.querySelectorAll('td');
                if(rowCells.length > 1 && rowCells[0].innerText.includes('Allytag')) {
                    allyInfo.tag = rowCells[1].innerText;
                }
            })
            this.addAllianceStatus(allyInfosRows, allyInfo)
        }
    },

    /**
     * Add ally relationship status option.
     * @param allyInfosRows
     * @param allyInfo
     */
    addAllianceStatus: function (allyInfosRows, allyInfo) {

        let config = Storage.getConfig('ally','info', {}, {});
        if(!config[allyInfo.tag]) {
            config[allyInfo.tag] = { relation: 'neutral'};
            Storage.storeConfig('ally', 'info', config);
        }
        let lastRow = allyInfosRows[allyInfosRows.length -1];
        let parent = lastRow.parentElement;
        let statusRow = document.createElement('tr');
        let statusLabel = document.createElement('td');
        let statusValue = document.createElement('td');
        statusLabel.setAttribute('class', 'cl');
        console.log('test');
        statusLabel.setAttribute('height', '21');
        statusLabel.innerText = 'Beziehungsstatus';
        statusValue.setAttribute('class', 'cl');
        statusValue.setAttribute('height', '21');
        let selectField = fields.createSelectField('relation', this.relationStates, this.changeAllyStatus, config[allyInfo.tag].relation);
        selectField.setAttribute('tag', allyInfo.tag);
        statusValue.insertBefore(selectField, null);
        statusRow.insertBefore(statusValue, null)
        statusRow.insertBefore(statusLabel, statusValue)
        parent.insertBefore(statusRow, lastRow);
    },

    changeAllyStatus: function (event) {
        let selectedOption = event.target.selectedOptions[0];
        let allyTag = event.target.getAttribute('tag');
        let config = Storage.getConfig('ally','info');
        config[allyTag].relation = selectedOption.id;
        Storage.storeConfig('ally', 'info', config);
    }
}