// Closure
(function(){

	/** 
	* PlotGraph - Linear Function
	* This is a example how apply your function to PlotGraph
	* 
	* @author Leonardo Mauro <leo.mauro.desenv@gmail.com>
	* @link http://leonardomauro.com/portfolio/ Portfolio of Leonardo Mauro
	* @link https://github.com/leomaurodesenv/jPlotGraph GitHub
	* @version 1.1.0
	* @copyright © 2016 Leonardo Mauro
	* @license https://opensource.org/licenses/GPL-2.0 GNU Public License (GPL v2)
	* @package jPlotGraph
	* @access private
	*/ 
	func_linear = {
		/**
		* The function: y = a*x + b
		* @access private
		* @var json			params	Params to use in function (a, b, x).
		* @return double	Result of f(x).
		*/
		'func':function(params){return (params.a*params.x + params.b);},
		/**
		* Draw the linear function in graph
		* @access private
		*/
		'plot':function(){
			var x = {'min':this.axis.x.min, 'max':this.axis.x.max}, 
				yi, yf, params = this.params,
				line = {'color':'#000', 'size':1.0};
			
			params.x = x.min; yi = this.func(params);
			params.x = x.max; yf = this.func(params);
			
			this.context.beginPath();
			this.context.moveTo(this.axis.x.x0+(x.min*this.axis.x.px), this.axis.y.y0-(yi*this.axis.y.py));
			this.context.lineTo(this.axis.x.x0+(x.max*this.axis.x.px), this.axis.y.y0-(yf*this.axis.y.py));
			this.context.lineWidth = line.size;
			this.context.strokeStyle = line.color; this.context.stroke();
			this.context.closePath();
		},
		/**
		* Fit max and min values of y (using variable x)
		* @access private
		*/
		'mmy':function(){
			var y0, y1,
				ymax, ymin;
			var params = this.params;
			
			params.x = this.axis.x.min; y0 = this.func(params);
			params.x = this.axis.x.max; y1 = this.func(params);
			
			if(y0 < y1){ymin=y0; ymax=y1;}
			else{ymin=y1; ymax=y0;}
			
			return {'min':ymin, 'max':ymax};
		}
	};

	/**
	* Append these functions to PlotGraph
	*/
	PlotGraph.prototype.func_mmy = func_linear.mmy;
	PlotGraph.prototype.func_plot = func_linear.plot;
	
})();
