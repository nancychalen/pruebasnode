//exports.get_identificacion = function(req, res){
//   res.render('sesiones/identificacion');
//};
exports.post_identificacion = function(req, res){
   req.session.idlogoeado = req.body.idusuariologeado;
   res.redirect('/menu');
};
//exports.bienvenida = function(req, res){
//   if(req.session.nombre){
//      res.render('sesiones/bienvenida', {nombre: req.session.nombre});
//   }else{
//      res.redirect('/identificacion');
//   }
//};
exports.salir = function(req, res){
   req.session.idlogoeado = null;
   req.session.destroy();
   res.redirect('/');
};