var GAPI = (function() {
    'use strict';
    const SPLIT_WORD = "data";
    const uuid = require("uuid/v4");
    const {google} = require('googleapis');
    const keys = require('../keys/keys.json');
    const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    );

    const authorize = () => {
        let authorization = client.authorize((error, tokens) => {
    
            if (error) {
                console.log(error);
                return;
            }
            console.log('Connected.');
            // deleteFile(client, "1qjaalvhdbJ88SHzPRzD9TcDm0a1Ua_no_-tYdWxEs7I");
            // const sheet = createAndTransferBasicKubisFitnessSpreadsheet(client, "akubis18@gmail.com");
        })
        console.log("Authorize:");
        console.log(authorization);
    }
    
    function transferOwnership(emailString, spreadsheetId) {
        const driveApi = google.drive({version: "v3", auth: client});
    
        const permission = {
            type: 'user',
            role: 'owner',
            emailAddress: emailString
        };
        return driveApi.permissions.create({
            resource: permission,
            fileId: spreadsheetId,
            fields: 'id',
            transferOwnership: false,
            sendNotificationEmail: false
        })
    }
    
    function deleteFile(spreadsheetId) {
        const driveApi = google.drive({version: "v3", auth: client});
    
        return driveApi.files.delete({
            'fileId':spreadsheetId
        })
    }
    
    async function createAndTransferBasicKubisFitnessSpreadsheet(emailString) {
        const gsapi = google.sheets({version: 'v4', auth: client})
    
        const creationProperties = {
            resource: {
                properties: {
                    // title: 'Kubis Fitness Spreadsheet [' + new Date().toLocaleString() + ']'
                }
            },
            auth: client.auth
        }
    
        try {
            let newFile = await gsapi.spreadsheets.create(creationProperties);
            console.log("Created new spreadsheet.")
            try {
                let transfer = await transferOwnership(client, emailString, newFile.data.spreadsheetId);
                console.log("Transfered ownership of new spreadsheet.")
            } catch (e) {
                console.error("Transfer failed. Attempting to delete new sheet.", e);
                try {
                    let deleted = await deleteFile(client, newFile.data.spreadsheetId)
                    console.log("Deleted the sheet.");
                } catch (e) {
                    console.error("Delete failed.", e);
                }
            }
        } catch (e) {
            console.error("Create failed.", e);
        }
    }
    
    async function getSheetNames(spreadsheetId) {
        const sheetsPropertyArray = (await getSheetsProperties(spreadsheetId)).data.sheets;
        // return sheetsPropertyArray;
        const names = [];
        sheetsPropertyArray.forEach((dict) => {
            names.push(dict.properties.title);
        })
        return names;
    }

    async function getSheetsProperties(spreadsheetId) {
        const gsapi = google.sheets({version: 'v4', auth: client});
        const query = {
            spreadsheetId: spreadsheetId,
            fields: "sheets.properties"
        }
        return await gsapi.spreadsheets.get(query);
    }
    
    async function getSheetData(id, sheetName) {
        const gsapi = google.sheets({version: 'v4', auth: client})   
        const fitnessSheet = {
            spreadsheetId: id,
            range: sheetName
        };
        return (await gsapi.spreadsheets.values.get(fitnessSheet)).data.values;
    }

    function isRepetition(string) {
        let splt = string.split('!');
        if (splt.length > 1 && splt[splt.length - 1] === SPLIT_WORD) {
            return true;
        } return false;
    } 

    function cleanRepetitionName(string) {
        return string.slice(0, -SPLIT_WORD.length - 1);
    }

    /*
        Expects the following data
        metadata: "some,comma,separated,metadata"
        Cols: [name1, name2!`SPLIT_WORD`, name3!`SPLIT_WORD`, name4
        data: ["a", "10,20,30", "3,2,1", "d"]

        Returns data in following form:
        {
            exactRow: [name1, name2!data, name3!data, name4]
            descriptiveColumns: [name1, name4]
            repetitionColumns: [name2, name3]
            data: [{
                date: "a",
                sets: [
                    {name2: 10, name3: 3},
                    {name2: 20, name3: 2},
                    {name2: 30, name3: 1}
                ]  
            ]  
                ]  
                name1: ...,
                name4: ...,
                _uuid: random_uuid;
            }, ...]
        }
    */
   function transformData(metaData, columns, rowsOfRows) {
        /* Get the columns that need to be split */
        if (columns === undefined || rowsOfRows === undefined) {
            return null;
        }

        const repetitionColumns = columns.filter(item => isRepetition(item));
        const repetitionColumnsClean = repetitionColumns.map(item => {
            return cleanRepetitionName(item);
        });
        const descriptiveColumns = columns.filter(item => !repetitionColumns.includes(item));


        const repetitionColumnIndices = [];
        let data = [];
        let final = {};
        for (let i = 0; i < columns.length; i++) {
            if (isRepetition(columns[i])) {
                repetitionColumnIndices.push(i);
                columns[i] = cleanRepetitionName(columns[i]);
            }
        }

        rowsOfRows.forEach(row => {
            let rowResult = {};
            /*Begin adding splitted items*/
            let maxSplit = 0;
            repetitionColumnIndices.forEach(index => 
                maxSplit = Math.max(row[index].split(',').length, maxSplit)
            );

            let splittedAttributes = [];
            for (let i = 0; i < maxSplit; i++) {
                let item = {};                
                repetitionColumnIndices.forEach(index => {
                    item[columns[index]] = get(row[index].split(','), i);
                });
                splittedAttributes.push(item);
            }
            rowResult["sets"] = splittedAttributes;

             /*Begin adding rest of the non-split items*/
            for (let i = 0; i < columns.length; i++) {
                if (!(repetitionColumnIndices.includes(i))) {
                    rowResult[columns[i]] = row[i];
                }
            }
            rowResult["_id"] = uuid();
            data.push(rowResult);
        });
        final.data = data;
        final.exactRow = columns;
        final.descriptiveColumns = descriptiveColumns;
        final.repetitionColumns = repetitionColumnsClean;
        return final;
    }

    // Return null rather than out of bounds exception
    function get(array, index) {
        if (index > array.length - 1) {
            return null;
        } return array[index];
    }

    /*
       {sheetName1: [
            [[metadata]],
            [[col1], [col2!data], [col3]],
            [[a1], [a2a,a2b,a2c], [a3]],
            [[b1], [b2a,b2b,b2c], [b3]],
            ....
       , sheetName2:
            ...
       }
    */
    async function getAllData(id) {
        const sheetNames = await getSheetNames(id);
        let result = {};
        /* Make all requests and wait to resolve */
        await Promise.all(
            sheetNames.map(async (name) => {
                result[name] = await getSheetData(id, name);
            })
        );
        return result;
    }

    /*
        Returns data in following form:
        {sheetName1:
            {
                exactRow: [name1, name2!data, name3!data, name4]
                descriptiveColumns: [name1, name4]
                repetitionColumns: [name2, name3]
                data: [
                    {
                        date: "a",
                        sets: [
                            {name2: 10, name3: 3},
                            {name2: 20, name3: 2},
                            {name2: 30, name3: 1}
                        ]  
                ]  
                        ]  
                        name1: ...,
                        name4: ...,
                        _uuid: random_uuid;
                    },
                    ...
                ]
            }
        }
    */
    async function getAllDataTransformed(id) {
        let data = await getAllData(id);
        let result = {};
        for (let key in data) {
            if (data[key] === undefined) return null;
            const meta = data[key][0][0];
            const columnNames = data[key][1];
            // Slicing here is pretty inefficient
            const entries = data[key].slice(2);
            let curr = transformData(meta, columnNames, entries);
            // console.log(curr);
            data[key] = curr;
        }
        return data;
    }

    async function addEntry(id, sheetName, dataMatrix) {
        const gsapi = google.sheets({version: 'v4', auth: client})   
        const fitnessSheet = {
            spreadsheetId: id,
            range: sheetName,
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            resource: {
                majorDimension: "ROWS",
                values: dataMatrix
            }
        };
        return (await gsapi.spreadsheets.values.append(fitnessSheet));
    }

    return {
        getSheetNames, getAllDataTransformed, addEntry
    }
}())

module.exports = { GAPI }