let multer  = require('multer')
let upload = multer({ dest: 'uploads/' })
let fs = require('fs-extra');

module.exports = (app, dbs, jwt) => {
    app.get('/products', (req, res) => {
        dbs.development.collection('products').find().toArray((err, docs) => {
            return res.header('Access-Control-Allow-Origin','*').json(docs);
        });
    })

    app.put('/products/new', (req, res) => {
        dbs.development.collection('products').insert(req.body, (err, data) => {
            if(!err) {
                const source = 'uploads/' + req.body.image;
                const destination = 'public/assets/images/products/' + data.insertedIds + '/';
                fs.ensureDir(destination, err => {
                    if(!err) {
                        fs.move(source, destination + req.body.image , err => {
                            if (err) {
                                return console.error(err);
                            }
                        });
                    }
                });
            }
        })
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','PUT');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        return res.json({send: true});
    });

    app.post('/products/image/upload', upload.single('image'), (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        return res.json(req.file);
    });
}