const bodyParser = require('body-parser')
const express = require('express');
const app = express();
const connect = { useUnifiedTopology: true }
const MongoClient = require('mongodb').MongoClient;
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const compression = require('compression')
var cors = require('cors')


const LimitMax = 100;
const LimitPerMS = 1 * 60 * 1000

const LimitDelayTime = LimitPerMS
const LimitDelayAfter = LimitMax;
const LimitDelayMsAddPerReq = 500

const url = "mongodb+srv://babauser:babauser@cluster0.6mvje.gcp.mongodb.net/?retryWrites=true&w=majority";
const databaseName = 'car_used_db';
const AutoIncrement = true;
const CorsOrigin = '*' // https://domain.com

class App {
    constructor() {
        this.query = {}
        this.limitFind = 0

        var corsOptions = {
            origin: CorsOrigin,
            optionsSuccessStatus: 200
        }
        app.use(cors(corsOptions))

        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(bodyParser.json({
            inflate: true,
            limit: '100kb',
            type: 'application/json'
        }))
        app.use(compression({
            level: 9
        }))

        // Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
        // see https://expressjs.com/en/guide/behind-proxies.html
        // app.set('trust proxy', 1);

        this.limiter = rateLimit({
            windowMs: LimitPerMS,
            max: LimitMax,
            message: `เรียกข้อมูลได้สูงสุด ${LimitMax} ครั้ง ต่อ ${LimitPerMS / 1000 / 60} นาที`
        });

        //app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

        this.speedLimiter = slowDown({
            windowMs: LimitDelayTime,
            delayAfter: LimitDelayAfter,
            delayMs: LimitDelayMsAddPerReq
        });


    }

    run() {

        app.get(['/', '/index', '/index.html'], (req, res) => {
            var path = require('path');
            res.sendFile(path.join(__dirname + '/index.html'));
        });

        app.get(['/api/:collection', '/api/:collection/:id'], [this.limiter], (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            this.ActionGet(req, res)
        });

        app.post(['/api/:collection', '/api/:collection/:id'], [this.speedLimiter, this.limiter], (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            this.ActionPost(req, res)
        });

        app.delete(['/api/:collection', '/api/:collection/:id'], [this.speedLimiter, this.limiter], (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            this.ActionDelete(req, res)
        });

        app.put(['/api/:collection'], [this.speedLimiter, this.limiter], (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            this.ActionPut(req, res)
        });

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Example app listening on ${process.env.PORT || 3000} port!`);
        });
    }

    ActionGet = (req, res) => {
        if (req.query.q) {
            this.query = JSON.parse(req.query.q)
            console.log(this.query)
        } else {
            if (req.params.id) {
                this.query._id = parseInt(req.params.id)
            }
        }

        if (req.query.limit) {
            this.limitFind = parseInt(req.query.limit)
        }

        const collectionDB = req.params.collection;
        MongoClient.connect(url, connect, (err, db) => {
            const dbo = db.db(databaseName);
            if (this.limitFind == 1) {
                dbo.collection(collectionDB)
                    .findOne(this.query, (err, result) => {
                        if (err) console.log(err);
                        res.json(result);
                        this.limitFind = 0
                        this.query = {}
                        db.close();
                    })
            } else if (this.limitFind == 0) {
                dbo.collection(collectionDB)
                    .find(this.query)
                    .toArray((err, result) => {
                        if (err) console.log(err);
                        this.limitFind = 0
                        this.query = {}
                        res.json(result);
                        db.close();
                    })
            } else {
                dbo.collection(collectionDB)
                    .find(this.query)
                    .limit(this.limitFind)
                    .toArray((err, result) => {
                        if (err) console.log(err);
                        res.json(result);
                        this.limitFind = 0
                        this.query = {}
                        db.close();
                    })
            }
        });
    }
    ActionPost = (req, res) => {

        if (req.is() == 'application/json' && req.body) {
            this.query = req.body
        }

        if (req.is() == 'application/x-www-form-urlencoded' && req.body) {
            this.query = req.body
        }

        if (req.query.limit) {
            this.limitFind = parseInt(req.query.limit)
        }

        if (req.query.q) {
            this.filter = JSON.parse(req.query.q)
        } else {
            this.filter = { '_id': parseInt(req.params.id) }
        }

        const collectionDB = req.params.collection;
        MongoClient.connect(url, connect, (err, db) => {
            const dbo = db.db(databaseName);
            dbo.collection(collectionDB).updateMany(this.filter, { $set: this.query }, (err, result) => {
                if (err) console.log(err);
                res.json({ 'ok': result.result.ok });
                db.close();
            });
        });
    }
    ActionDelete = (req, res) => {

        if (req.is() == 'application/json' && req.body) {
            this.query = req.body
        }

        if (req.is() == 'application/x-www-form-urlencoded' && req.body) {
            this.query = req.body
        }

        if (req.query.limit) {
            this.limitFind = parseInt(req.query.limit)
        }

        if (req.query.q) {
            this.filter = JSON.parse(req.query.q)
        } else {
            this.filter = { '_id': parseInt(req.params.id) }
        }

        const collectionDB = req.params.collection;
        MongoClient.connect(url, connect, (err, db) => {
            const dbo = db.db(databaseName);
            dbo.collection(collectionDB).deleteMany(this.filter, { $set: this.query }, (err, result) => {
                if (err) console.log(err);
                res.json({ 'ok': result.result.ok });
                db.close();
            });
        });
    }
    ActionPut = (req, res) => {

        if (req.is() == 'application/json' && req.body) {
            this.query = req.body
        }

        if (req.is() == 'application/x-www-form-urlencoded' && req.body) {
            this.query = req.body
        }

        if (req.query.limit) {
            this.limitFind = parseInt(req.query.limit)
        }

        const collectionDB = req.params.collection;
        MongoClient.connect(url, connect, async (err, db) => {

            const dbo = db.db(databaseName);

            if (AutoIncrement) {
                this.query._id = await this.getNextId(collectionDB, dbo)
            }

            dbo.collection(collectionDB).insertOne(this.query, (err, result) => {
                if (err) console.log(err);
                res.send(result.ops);
            });
        });
    }

    getNextId(collection, dbo) {
        return new Promise(rest => {
            dbo.collection('counters').findOneAndUpdate(
                { _id: `${collection}_id` },
                { $inc: { lastId: 1 } },
                { upsert: true },
                (err, res) => {
                    rest(res.value.lastId);
                }
            );
        })
    }


}

new App().run()