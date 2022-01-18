const AllyExtension = {
    onPageLoad: function (content) {
        /*let allyInfosRows = content.querySelectorAll('tr.cl');
        let allyInfo = {};
        if(allyInfosRows && allyInfosRows.length > 0) {
            let allyTable = allyInfosRows[0].parentElement;
            allyInfosRows.forEach((entry, i) => {
                let rowCells = entry.querySelectorAll('td');
                if(rowCells.length > 1 && rowCells[0].innerText.includes('Allytag')) {
                    allyInfo.tag = rowCells[1].innerText;
                }
            })
            this.addAllianceStatus(allyTable, allyInfo)
        }*/
    },

    /**
     * Add ally relationship status option.
     * @param allyTable
     * @param allyInfo
     */
    addAllianceStatus: function (allyTable, allyInfo) {


    }
}