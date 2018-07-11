var
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    http = require('http'),
    _ = require('lodash'),
    conf = require('./config/conf'),
    CronJob = require('cron').CronJob,
    router = require('./router/router'),
    loop = require('./actions/playActions'),
    schemas = require('./models/schemas');
    queue = require('./services/queueService');
job = new CronJob('*/1 * * * *', () => {
        loop.getData(conf, schemas,refresh=false);
    }, () => { /* CronJob every 2 seconds...*/
        console.log("Job stopped");
    },
    true,
    "Europe/Paris"
);

// loop.getData(conf, schemas,refresh=false);
app.use('/api', router.router);
app.listen(conf.PORT);
//job.start();