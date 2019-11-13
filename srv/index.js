const logging = require('@sap/logging');
const express = require('express');
const app = express();
const { SapCfAxios } = require('sap-cf-axios');


const dummy = SapCfAxios('DUMMY');
const appContext = logging.createAppContext();

app.use(logging.middleware({ appContext: appContext, logNetwork: true }));
app.use(express.json());

const handleRequest = async (req, res) => {
    // do the dummy request
    var logger = req.loggingContext.getLogger('/Application/Destination');

    try {
        logger.info('Starting the request to DUMMY destination ...');
        const response = await dummy({
            method: 'POST',
            url: '/BookSet',
            data: {
                title: "Using Axios in SAP Cloud Foundry",
                author: "Joachim Van Praet"
            },
            headers: {
                "content-type": "application/json"
            }
        });
        logger.info('Request done ...');
        res.send(response.data);
    } catch (error) {

        logger.info('Request failed ...');
        logger.error(error);
        res.reject(error);
    }
}

app.all('*', handleRequest);

const port = process.env.PORT || 3000;;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});