// Closure
(function(){

	/** 
	* PlotGraph - Linear Function
	* This is a example how apply user interaction with values capture from form
	* 
	* @author Leonardo Mauro <leo.mauro.desenv@gmail.com>
	* @link http://leonardomauro.com/portfolio/ Portfolio of Leonardo Mauro
	* @link https://github.com/leomaurodesenv/jPlotGraph GitHub
	* @version 1.1.0
	* @copyright © 2016 Leonardo Mauro
	* @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
	* @package jPlotGraph
	* @access public
	*/ 
	
	/**
	* Function to be used in form.submit
	* Renew all values of PlotGraph
	* @access public
	* @var double	a	Value of var a.
	* @var double	b	Value of var b.
	* @var double	xi	Value of smaller x in axis.
	* @var double	xf	Value of bigger x in axis.
	*/
	function_ui = function(a, b, xi, xf){
		/* Libera os eventos do 'plot' */
		events.blocking = false;
		
		/* Ajustanto valores */
		grafic.params.a = parseFloat(a);
		grafic.params.b = parseFloat(b);
		var x = {'min':xi, 'max':xf};
		
		/* Plotando a função */
		if(grafic.stoping) return;
		grafic.plot(x);
	};
	
	
})();