'use strict';

const controlador = require('./lib/07.views+api.monitorear/controller');

module.exports = {
	
	//@route('/monitorear')
	//@method(['get'])
	monitorear: function(req,res){
		controlador.monitorear(req,res);
	},
  
	//@route('/api/monitor')
	//@method(['get'])
	api: function(req,res){
		controlador.api(req,res);
	}
	
};