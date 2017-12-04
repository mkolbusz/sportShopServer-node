let multer  = require('multer')
let upload = multer({ dest: 'uploads/' })
let fs = require('fs-extra');

module.exports = (app, dbs) => {
    app.get('/products', (req, res) => {
        dbs.development.collection('products').find().toArray((err, docs) => {
            return res.json(docs);
        });
    })

    app.put('/products/new', (req, res) => {
        dbs.development.collection('products').insert(req.body, (err, data) => {
            if(err) {
                return res.sendStatus(500);
            }
            
            req.body.images.map(image => {
                const source = 'uploads/' + image;
                const destination = 'public/assets/images/products/' + data.insertedIds + '/';
                fs.ensureDir(destination, err => {
                    if(err) {
                        return res.sendStatus(202);
                    }
                    fs.move(source, destination + image , err => {
                        if (err) {
                            return console.error(err);
                        }
                    })
                })
            })
            res.header('Access-Control-Allow-Origin','*');
            res.header('Access-Control-Allow-Methods','PUT');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            return res.sendStatus(200);
        })
        
    });

    app.post('/products/image/upload', upload.single('image'), (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        return res.json(req.file);
    });

    app.delete('/products/image/:name', (req, res) => {
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        let path = 'uploads/' + req.params.name;
        fs.ensureFile(path, err => {
            if(err) {
                return res.sendStatus(200);
            }
            fs.remove(path, err => {
                if(err) {
                    return res.sendStatus(500);
                }
                return res.sendStatus(200);
            })
        })
    });
}