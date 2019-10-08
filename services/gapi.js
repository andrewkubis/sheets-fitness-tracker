var GAPI = (function() {
    'use strict';
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
    
    async function gsRun() {
    
        console.log("GSRUN.");
        const gsapi = google.sheets({version: 'v4', auth: client})    
        const fitnessSheet = {
            spreadsheetId: '1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY',
            range: 'BB Decline Bench!A1:B2'
        };    
        return await gsapi.spreadsheets.get(fitnessSheet);
    };

    async function test() {
        console.log("TEST START.");
        const gsapi = google.sheets({version: 'v4', auth: client})    
        const fitnessSheet = {
            spreadsheetId: '1-8Pn3RysJRxDPzqMSiHd6aRQXJyPrkjbBzBOD-29vyY',
            range: 'BB Decline Bench!A1:B'
        };    
        const res = await gsapi.spreadsheets.values.get(fitnessSheet);
        console.log("TEST COMPLETED.");
        return res;
    }

    async function getSheetData(id, sheetName) {
        const gsapi = google.sheets({version: 'v4', auth: client})   
        const fitnessSheet = {
            spreadsheetId: id,
            range: sheetName + '!A:E'
        };
        return (await gsapi.spreadsheets.values.get(fitnessSheet)).data.values;
    }

    function shouldSplit(string) {
        let splt = string.split('!');
        if (splt.length > 1 && splt[splt.length - 1] === "split") {
            return true;
        } return false;
    } 

   function transformData(metaData, columns, rowsOfRows) {
        /* Get the columns that need to be split */
        const splittableColumns = [];
        let final = [];
        for (let i = 0; i < columns.length; i++) {
            if (shouldSplit(columns[i])) {
                splittableColumns.push(i);
                columns[i] = columns[i].slice(0, -6);
            }
        }

        rowsOfRows.forEach(row => {
            let rowResult = {};
            /*Begin adding splitted items*/
            let maxSplit = 0;
            splittableColumns.forEach(index => 
                maxSplit = Math.max(row[index].split(',').length, maxSplit)
            );

            let splittedAttributes = [];
            for (let i = 0; i < maxSplit; i++) {
                let item = {};                
                splittableColumns.forEach(index => {
                    item[columns[index]] = get(row[index].split(','), i);
                });
                splittedAttributes.push(item);
            }
            rowResult["sets"] = splittedAttributes;

             /*Begin adding rest of the non-split items*/
            for (let i = 0; i < columns.length; i++) {
                if (!(splittableColumns.includes(i))) {
                    rowResult[columns[i]] = row[i];
                }
            }
            final.push(rowResult);
        });
        return final;
    }

    // Return null rather than out of bounds exception
    function get(array, index) {
        if (index > array.length - 1) {
            return null;
        } return array[index];
    }

    /*
       {sheetName1: 
            [[metadata]]
            [[col1], [col2!data], [col3]]
            [[a1], [a2a,a2b,a2c], [a3]]
            [[b1], [b2a,b2b,b2c], [b3]]
            ....
       , sheetName2:
            ...
       }
    */
    async function getAllData(id) {
        var d = Date.now();
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

    return {
        authorize, gsRun, getSheetNames, test, getSheetData, transformData
    }
}())

module.exports = { GAPI }