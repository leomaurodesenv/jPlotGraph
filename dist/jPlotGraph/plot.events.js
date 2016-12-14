// Closure
(function(){
	
	/** 
	* UI Events PlotGraph
	* These functions realize the user interface interaction (like: mousemove, mouseleave and click)
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
	events = {
		/** 
		* Variables description.
		* @var json		axis		Last axis values in event.
		* @var bool		blocking	Determines whether events are blocked.
		*/ 
		'axis' : {'x':0, 'y':0},
		'blocking' : false,
		/**
		* Mouse move event (PlotGraph.init())
		* Draw in graph a line to cursor in cartesian plane (x, f(x))
		* @access public
		* @param object		event	An object containing data that will be passed to the event handler.
		* @param PlotGraph	grafic	Pointer to grafic variable.
		*/
		'mousemove' : function(event, grafic){
			if(events.blocking) return;
			events.func(event, grafic);
		},
		/**
		* Mouse click event (PlotGraph.init())
		* Pause the draw in graph
		* @access public
		* @param object		event	An object containing data that will be passed to the event handler.
		* @param PlotGraph	grafic	Pointer to grafic variable.
		*/
		'mouseclick' : function(event, grafic){
			var color = 'rgba(147, 147, 147, 0.2)';
				ball_r = (grafic.canvas_dimension.width < grafic.canvas_dimension.height) 
						 ? grafic.canvas_dimension.width/10.0 : grafic.canvas_dimension.height/10.0;
				canvasx = grafic.canvas_dimension.width/2.0,
				canvasy = grafic.canvas_dimension.height/2.0;
			
			if(events.blocking){
				events.func(event, grafic);
				events.blocking = false;
			}
			else{
				grafic.context.beginPath();
				grafic.context.arc(canvasx, canvasy, ball_r, 0, 2*Math.PI, true);
				grafic.context.lineWidth = '9';
				grafic.context.fillStyle = color;
				grafic.context.fillRect(canvasx-1.5*(ball_r/3.0), canvasy+1.5*(ball_r/3.0), (ball_r/3.0), -0.9*(ball_r));
				grafic.context.fillRect(canvasx+0.5*(ball_r/3.0), canvasy+1.5*(ball_r/3.0), (ball_r/3.0), -0.9*(ball_r));
				grafic.context.strokeStyle = color; grafic.context.stroke();
				grafic.context.closePath();
				events.blocking = true;
			}
		},
		/**
		* Mouse leave event (PlotGraph.init())
		* Clean and redraw the normal graph
		* @access public
		* @param object		event	An object containing data that will be passed to the event handler.
		* @param PlotGraph	grafic	Pointer to grafic variable.
		*/
		'mouseleave' : function(event, grafic){
			if(events.blocking) return;
			grafic.eraser();
			grafic.draw_axis();
			grafic.func_plot();
		},
		/**
		* Draw the (x, y) in cartesian plane
		* @access private
		* @param object		event	An object containing data that will be passed to the event handler.
		* @param PlotGraph	grafic	Pointer to grafic variable.
		* @param string		color	Set color.
		*/
		'func' : function(event, grafic, color='#126fb9'){
			/* Pega o (x, y) do click, com precisão */
			/* Considere: width="875px" height="700px" */
			var rect = grafic.canvas.getBoundingClientRect(),
				xc = (event.clientX - rect.left) * (875.0/grafic.canvas.offsetWidth),
				yc = (event.clientY - rect.top) * (700.0/grafic.canvas.offsetHeight),
				xa, ya, params = grafic.params;
			
			/* Mostra o (x, y) do mouse */
			xa = Math.round10((xc-grafic.axis.x.x0)/grafic.axis.x.px, -2);
			if(grafic.axis.x.min > xa || xa > grafic.axis.x.max) return;
			params.x = xa; ya = grafic.func(params);
			
			events.axis.x = xa; events.axis.y = ya;
			/* Desenhando no canvas */
			grafic.eraser();
			grafic.draw_axis(false);
			grafic.func_plot();
			grafic.show_axis(events.axis, color);
		}
	};

})();
