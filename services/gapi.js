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
        const names = [];
        sheetsPropertyArray.forEach((dict) => {
            names.push(dict.properties.title);
        })
        return names;
    }

    async function getSheetsProperties(spreadsheetId) {
        console.log("getSheets.");
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
            range: 'BB Decline Bench!A1:B5'
        };    
        return await gsapi.spreadsheets.get(fitnessSheet);
    };

    return {
        authorize, gsRun, getSheetNames
    }
}())
module.exports = { GAPI }