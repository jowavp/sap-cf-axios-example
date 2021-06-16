const logging = require('@sap/logging');
const express = require('express');
const app = express();
const SapCfAxios = require('sap-cf-axios').default;

const passport = require('passport');
const xsenv = require('@sap/xsenv');
const JWTStrategy = require('@sap/xssec').JWTStrategy;

const dummy = SapCfAxios('GW');
const appContext = logging.createAppContext();
const services = xsenv.getServices({ xsuaa: { tag: "xsuaa" } });

console.log( `HOERA! Found UAA service credentials for client: ${services.xsuaa.clientid}` )

app.use(logging.middleware({ appContext: appContext, logNetwork: true }));
app.use(express.json());

passport.use(new JWTStrategy(services.xsuaa));

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));


const handleRequest = async (req, res) => {
    // do the dummy request
    var logger = req.loggingContext.getLogger('/Application/Destination');

    try {
        logger.info('Starting the request to DUMMY destination ...');
        const response = await dummy({
            method: 'GET',
            url: '/iwfnd/catalogservice/?$format=json',
            params: {
                "$format": 'json'
            },
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${request.user.token.accessToken}` 
            }
        });
        logger.info('Request done ...');
        res.send(response.data);
    } catch (error) {

        logger.info('Request failed ...');
        logger.error(error);
        res.error(error);
    }
}

app.all('*', handleRequest);

const port = process.env.PORT || 3000;;
app.listen(port, function () {
    console.log('myapp listening on port ' + port);
});