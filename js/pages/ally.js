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
            this.addallianceMembers(allyInfosRows, allyInfo)
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
    },

    /**
     * Add known alliance members.
     * @param allyInfosRows
     * @param allyInfo
     */
    addallianceMembers: function (allyInfosRows, allyInfo) {
        let allyTags = Storage.getConfig('ally','tags', {});
        let headerRow = document.createElement('tr');
        let headerCell = document.createElement('td');
        headerCell.setAttribute('height',21);
        headerCell.setAttribute('colspan',2);
        headerCell.classList = ['cellu'];
        let headerText = document.createElement('h3');
        headerText.innerText = 'Bekannte Allianzmitglieder:';
        headerCell.insertBefore(headerText, null);
        headerRow.insertBefore(headerCell, null);
        let lastRow = allyInfosRows[allyInfosRows.length -1];
        let parent = lastRow.parentElement;
        parent.insertBefore(headerRow, lastRow.nextSibling);
        let allyTagMembers = allyTags[allyInfo.tag];
        if(allyTagMembers) {
            allyTagMembers.sort((a,b) => {
                //reversed sorted
                let x = b.x - a.x;
                if(x === 0) {
                    return b.y - a.y;
                }
                return x;
            }).forEach((entry, i) => {
                let memberRow = document.createElement('tr');
                let memberName = document.createElement('td');
                let memberCoords = document.createElement('td');
                memberName.setAttribute('class', 'cl');
                memberName.setAttribute('height', '21');
                memberName.innerText = entry.name;
                memberCoords.setAttribute('class', 'cl');
                memberCoords.setAttribute('height', '21');
                memberCoords.innerText = entry.x + ':' + entry.y;
                memberRow.insertBefore(memberCoords, null)
                memberRow.insertBefore(memberName, memberCoords)
                parent.insertBefore(memberRow, lastRow.nextSibling.nextSibling);
            });
        }
    }
}