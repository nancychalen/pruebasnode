//llamar a modulos
var http     = require('http'),
	bodyParser   = require('body-parser');
var multer = require('multer'); 
const pg    = require('pg');
var express = require('express');
var exphbs  = require('express-handlebars');
var formidable = require('formidable'),
    util = require('util'),
    fs   = require('fs-extra');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
//conexion base de datos
pg.defaults.ssl = true;
const connectionString = process.env.DATABASE_URL || 'postgres://ec2-184-72-247-70.compute-1.amazonaws.com:5432/d4iiq2fmt7j93l';
//var conString = "postgres://mcnhumzbkkfqgv:0919c6de2e7e75d9b13e08c67b58d1cbf1218f08d49a8874306d0ea0954cbfb1@ec2-184-72-247-70.compute-1.amazonaws.com:5432/d4iiq2fmt7j93l";
var conString = "postgres://postgres:postgres@localhost:5432/baseexcursion";

//var conString = "postgres://ouotpxpfgzvdif:14f8728c627f11f8a487cdf5a21b6625efcf196a70f03529ebacd6aa9468c80e@ec2-54-163-249-237.compute-1.amazonaws.com:5432/df2rtm1mo3h4vl";

var app = express();

app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['123'],
 
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
//app.use(app.router);
var sesiones = require('./routes/sesiones');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'));

app.engine( 'exphbs', exphbs( { 
  extname: 'exphbs', 
  defaultLayout: 'plantilla', 
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
} ) );

app.set( 'view engine', 'exphbs' );
app.set('port', (process.env.PORT || 8080))

//LLAMO POR RUTAS
app.get('/', function (req,res) {
	res.render('partials/index');
    
    
});

//app.get('/identificacion', sesiones.get_identificacion);
app.post('/identificacion', sesiones.post_identificacion);
//app.get('/bienvenida', sesiones.bienvenida);
app.get('/salir', sesiones.salir);
app.get('/menuexcursiones', function (req,res) {
	res.render('partials/menuexcursiones');
});
app.get('/menuusuarios', function (req,res) {
	res.render('partials/menuusuarios');
});
app.get('/menualumnos', function (req,res) {
	res.render('partials/menualumnos');
});
app.get('/listarexcursionesAlumno', function (req,res) {
	res.render('partials/listarexcursionesAlumno');
});
app.get('/listarexcursionesUsuario', function (req,res) {
	res.render('partials/listarexcursionesUsuario');
});
app.get('/leerexcursionUsuario', function (req,res) {
	res.render('partials/leerexcursionUsuario');
});
app.get('/leerexcursionAlumno', function (req,res) {
	res.render('partials/leerexcursionAlumno');
});
app.get('/editarexcursion', function (req,res) {
	res.render('partials/editarexcursion');
});
app.get('/crearexcursion', function (req,res) {
	res.render('partials/crearexcursion');
});
app.get('/menu', function (req,res) {
	res.render('partials/menu');
});
app.get('/nuevoalumno', function (req,res) {
	res.render('partials/nuevoalumno');
});
app.get('/nuevousuario', function (req,res) {
	res.render('partials/nuevousuario');
});
app.get('/editaralumno', function (req,res) {
	res.render('partials/editaralumno');
});
app.get('/editarusuario', function (req,res) {
	res.render('partials/editarusuario');
});
app.get('/iniciarsesion', function (req,res) {
	res.render('partials/iniciarsesion');
});

app.get('/flistarexcursiones', (req, res, next) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT * FROM excursiones', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/flistarexcursionesporusuario', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("SELECT * FROM excursiones WHERE idusuario="+req.body.idusuario+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/fcargaralumnoporid', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("SELECT * FROM alumnos WHERE id="+req.body.idalumno+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/fcargarusuarioporid', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("SELECT * FROM usuarios WHERE id="+req.body.iduser+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.get('/flistaralumnos', (req, res, next) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT * FROM alumnos', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.get('/flistarusuarios', (req, res, next) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT * FROM usuarios', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/frecibirexcursion', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("SELECT * FROM excursiones WHERE id="+req.body.idExcursion+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/feditarPaso', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        client.query("UPDATE pasos SET video='"+req.body.pasovideo+"',pregunta='"+req.body.pregunta+"',respuesta="+req.body.respuesta+",opciona='"+req.body.opciona+"',opcionb='"+req.body.opcionb+"',opcionc='"+req.body.opcionc+"' WHERE id="+req.body.id+";", function(err, result) {
            if(err) {
                return console.error('error running query paso', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/fguardarPaso', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        client.query("INSERT INTO pasos (video,pregunta,respuesta,opciona,opcionb,opcionc,idexcursion) VALUES ('"+req.body.pasovideo+"','"+req.body.pregunta+"',"+req.body.respuesta+",'"+req.body.opciona+"','"+req.body.opcionb+"','"+req.body.opcionc+"',"+req.body.idexcursion+");", function(err, result) {
            if(err) {
                return console.error('error running query paso', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/fguardarAlumno', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        client.query("INSERT INTO alumnos (nombre,puntaje,avatar) VALUES ('"+req.body.nombre+"',"+req.body.puntaje+",'"+req.body.avatar+"');", function(err, result) {
            if(err) {
                return console.error('error running query paso', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});


app.post('/fguardarUsuario', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        client.query("INSERT INTO usuarios (nombre,usuario,pass,avatar) VALUES ('"+req.body.nombre+"','"+req.body.usuario+"','"+req.body.pass+"','"+req.body.avatar+"');", function(err, result) {
            if(err) {
                return console.error('error running query paso', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});


app.get('/ultimoidEx', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        client.query('SELECT id FROM excursiones ORDER BY id DESC ;', function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            console.log("mi: "+result.rows[0].idcuento);
            client.end();
            return res.json(result.rows);
        });
    });
});

app.post('/fguardarpuntajealumno', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        console.error(req.body.id);
        client.query("UPDATE alumnos SET puntaje="+req.body.nvpuntaje+" WHERE id="+req.body.idalumno+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/fguardarEditarExcursion', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        console.error(req.body.id);
        client.query("UPDATE excursiones SET titulo='"+req.body.titulo+"',portada='"+req.body.portada+"',descripcion='"+req.body.descripcion+"',creditos='"+req.body.creditos+"' WHERE id="+req.body.id+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/feditaralumnoporid', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        console.error(req.body.id);
        client.query("UPDATE alumnos SET nombre='"+req.body.nombre+"',puntaje='"+req.body.puntaje+"',avatar='"+req.body.avatar+"' WHERE id="+req.body.idalumno+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});


app.post('/feditarusuarioporid', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        console.error(req.body.id);
        client.query("UPDATE usuarios SET nombre='"+req.body.nombre+"',usuario='"+req.body.usuario+"',pass='"+req.body.pass+"',avatar='"+req.body.avatar+"' WHERE id="+req.body.idusuario+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/fguardarExcursion', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }
        console.error(req.body.id);
        client.query("INSERT INTO excursiones (titulo,portada,descripcion,creditos,idusuario) VALUES ('"+req.body.titulo+"','"+req.body.portada+"','"+req.body.descripcion+"','"+req.body.creditos+"',"+req.body.idUsuario+");", function(err, result) {
            if(err) {
                return console.error('error running query ex', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/flistarpasos', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("SELECT * FROM pasos WHERE idexcursion="+req.body.idExcursion+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});

app.post('/feliminarexcursion', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("DELETE FROM excursiones WHERE id="+req.body.idExcursion+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/feliminaralumno', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("DELETE FROM alumnos WHERE id="+req.body.idalumno+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/feliminarusuario', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("DELETE FROM usuarios WHERE id="+req.body.idusuario+";", function(err, result) {
            if(err) {
                return console.error('error running query elus', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/feliminarpasos', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("DELETE FROM pasos WHERE idexcursion="+req.body.idExcursion+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/feliminarpasoporid', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("DELETE FROM pasos WHERE id="+req.body.idPaso+";", function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }

            client.end();
            return res.json(result.rows);
            
        }); 
    });
});
app.post('/subir', (req, res) => {
    req.fields; // contains non-file fields 
    req.files; // contains files 
    var form = new formidable.IncomingForm();
 
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});

    });

    form.on('end', function(fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = 'public/excursiones/';
        fs.copy(temp_path, new_location + file_name, function(err) {  
            if (err) {
                console.error(err);
            } else {
                console.log("success!")
            }
        });
        res.end(file_name);
    });
    

});


console.log("Iniciar Servidor");
// escuchar
console.log("Servidor iniciado");
    // escuchar
    app.listen(process.env.PORT || 8080, function(){console.log("the server is running");});