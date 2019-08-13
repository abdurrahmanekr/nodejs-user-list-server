const express = require('express');
const app = express();
const CDNOnGitServer = require('cdn-on-gitserver');
const SQLMaster = require('sqlmaster');

const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

const database = require('./database');

const PORT = process.env.PORT || 8080;

const GitCDN = new CDNOnGitServer({
    libName: 'gitlab',
    auth: '<sizin gitlab anahtarınız>',
    libOptions: {
        projectId: '<projenizin idsi>'
    }
});

app.get('/', (req, res) => {
    res.send('Bu projenin dokümanına erişmek için README.md dosyasının okuyabilirsiniz.');
});

app.get('/users', (req, res) => {
    var query = SQLMaster
    .from('users')
    .select([
        "*"
    ])
    .exec();

    database.query(query)
    .then(data => {
        res.send(data.rows);
    })
    .catch(err => {
        res.status(500).send(String(err));
    });
});

app.post('/users', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        res
        .status(400)
        .send({
            error: 'file is required'
        });
        return;
    }

    const body = req.body;
    const avatar = req.file.buffer;

    const user = {
        name: body.name,
        email: body.email,
        avatar: +new Date(), // Dosyanın unique ismi
        created_date: new Date(),
    };

    // burada öncelikle kullanıcının resmi GitLab'a yükleniyor.
    GitCDN.set({
        fileName: user.avatar,
        content: avatar,
    })
    .then(status => {
        var query = SQLMaster
        .from('users')
        .insert(user)
        .returning('id')
        .exec();

        // Sonra kullanıcı veritabanına ekleniyor
        database.query(query)
        .then(data => {
            res.send(data.rows[0]);
        })
        .catch(err => {
            res.status(500).send(String(err));
        });
    })
    .catch(err => {
        res
        .status(500)
        .send({
            error: 'File upload failed',
        });
    });
});

app.get('/users/:id(\\d+)/avatar', (req, res) => {
    const id = req.params.id;

    // id değeri gelen kullanıcı veritabanından getiriliyor
    var query = SQLMaster
    .from('users')
    .where('id = :id', {
        ':id': id
    })
    .select([
        "avatar"
    ])
    .exec();

    database.query(query)
    .then(data => {
        var user = data.rows[0];
        if (!user) {
            res.status(404).send('User Not Found');
            return;
        }

        // Kullanıcının resmi getiriliyor
        GitCDN.get(user.avatar)
        .then(data => {
            res
            .set('Content-Type', 'image/png')
            .set('Cache-Control', 'max-age=300')
            .set('Content-Security-Policy', 'default-src \'none\'')
            .send(data);
        })
        .catch(err => {
            res
            .status(500)
            .send('File Fetch Failed');
        });
    })
    .catch(err => {
        res.status(500).send(String(err));
    });
});


app.listen(PORT, () => {
    console.log('Uygulama ' + PORT + ' portunda çalışıyor!');
});
