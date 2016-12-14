
/** 
* Class PlotGraph
* This class management all system of ploting
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
function PlotGraph(icanvas, icanvasj, ifunc, iparams){
	
	/** 
	* Variables description.
	* @var dom.canvas		canvas				Canvas element get by id.
	* @var dom.canvas		canvasj				Canvas element get by jQuery.
	* @var dom.canvas.2d	context				Context 2d of canvas (image).
	* @var function			func				Function to draw the line (e.g. linear function).
	* @var json				params				Params to use in function (e.g. [a, b, c..]).
	* @var json				canvas_dimension	Dimension of canvas element.
	* @var json				axis				Values of (x, y).
	*/ 
	this.canvas = icanvas;
	this.canvasj = icanvasj;
	this.context = icanvas.getContext('2d');
	this.func = ifunc;
	this.params = iparams;
  
	this.canvas_dimension = {
		'width':this.canvas.width, 'height':this.canvas.height,
		'left':this.canvas.offsetLeft, 'top':this.canvas.offsetTop
	};
	
	this.axis = {
		'x':{
			'min':null, 'max':null,
			'px':null, 'x0':null,
			'xi':30.0, 'xf':30.0
		},
		'y':{
			'min':null, 'max':null,
			'py':null, 'y0':null,
			'yi':25.0, 'yf':30.0
		}
	};
}

/* Define some functions to PlotGraph */
PlotGraph.prototype = {
	/**
	* Attach user interface events to canvas element
	* @access public
	*/
	init:function(){
		/* Funções UI */
		var data = this;
		this.canvasj.bind('mousemove', function(event){
			events.mousemove(event, data);
		}).bind('mouseleave', function(event){
			events.mouseleave(event, data);
		}).bind('click', function(event){
			events.mouseclick(event, data);
		});
	},
	/**
	* Process and Plotting the graph
	* @access public
	* @param json	x	Setting new values to variable x of f(x).
	*/
	plot:function(x){
		/* Verificando se as funções min-max e plotar função foram inseridas */
		if(!this.func_mmy || !this.func_plot) return;
		
		/* Ajustando x's e y's */
		this.fit(x);
		
		/* Imprimindo valore */
		var a = this.params.a, b = this.params.b;
		var showa = (a < 0) ? '('+a+')' : a,
			showb = (b < 0) ? '('+b+')' : b;
		$('#va').html(showa);
		$('#vb').html(showb);
		$('#ca').val(a);
		$('#cb').val(b);
		$('#cxi').val(x.min);
		$('#cxf').val(x.max);
		
		/* Plotando a função */
		this.eraser();
		this.draw_axis();
		this.func_plot();
	},
	/**
	* Clean canvas element
	* @access public
	*/
	eraser:function(){
		this.context.clearRect(0, 0, this.canvas_dimension.width, this.canvas_dimension.height);
	},
	/**
	* Adjusts values of y (using variable x), to fit in window
	* @access public
	* @param json	x	Variable x of f(x).
	*/
	fit:function(x){
		/* Verificando se as funções min-max e plotar função foram inseridas */
		if(!this.func_mmy || !this.func_plot) return;
		
		/* Capturando x's e y's */
		this.axis.x.min = x.min; this.axis.x.max = x.max;
		var y = this.func_mmy();
		this.axis.y.min = y.min; this.axis.y.max = y.max;
		
		/* Adicionando 5% aos limites */
		var porc = 0.05,
			medx = this.get_meds({'max':this.axis.x.max, 'min':this.axis.x.min}),
			medy = this.get_meds({'max':this.axis.y.max, 'min':this.axis.y.min});
		
		var x = {}, y = {};
		
		x.lmax = (this.axis.x.max < 0.1) ? medx : this.axis.x.max+medx;
		x.lmin = (this.axis.x.min > -0.1) ? -medx : this.axis.x.min-medx;
		y.lmax = (this.axis.y.max < 0.1) ? medy : this.axis.y.max+medy; 
		y.lmin = (this.axis.y.min > -0.1) ? -medy : this.axis.y.min-medy;
		
		/* Definindo os valored dos p's e 0's */
		var difx = this.axis.x.xf+this.axis.x.xi,
			dify = this.axis.y.yf+this.axis.y.yi,
			hx = Math.abs(x.lmax-x.lmin),
			hy = Math.abs(y.lmax-y.lmin);
		this.axis.x.px = (this.canvas_dimension.width-difx) / hx;
		this.axis.x.x0 = this.canvas_dimension.width - ((x.lmax*this.axis.x.px) + this.axis.x.xf);
		this.axis.y.py = (this.canvas_dimension.height-dify) / hy;
		this.axis.y.y0 = (y.lmax*this.axis.y.py) + this.axis.y.yf;
	},
	/**
	* Add margin to graph, to fit in window
	* @access private
	* @param double		val		Value to fit.
	*/
	get_meds:function(val){
		var med, porc = 0.05;
		
		if(val.max == 0.0) med = 1.0;
		else if(val.max > 0.1 && val.min < -0.1)
			med = ((val.max-val.min)*porc);
		else if(val.max > 0.1)
			med = (val.max*porc);
		else if(val.max < -0.1)
			med = (Math.abs(val.min)*porc);
		
		return med;
	},
	/**
	* Draw the axis (x, y)
	* @access public
	* @param bool	limits	Determine if show values of axis limit (x, y).
	*/
	draw_axis:function(limits=true){
		/* Variáveis de style das retas */
		var line = {'color':'#003300', 'size':1.0},
			arrow = {'color':'#003300', 'size':5.0};
		
		/* Desenhando o X */
		var xarrow = this.canvas_dimension.width-this.axis.x.xf;
		this.context.beginPath();
		this.context.moveTo(this.axis.x.xi, this.axis.y.y0);
		this.context.lineTo(xarrow, this.axis.y.y0);
		this.context.lineWidth = line.size;
		this.context.strokeStyle = line.color; this.context.stroke();
		this.context.closePath();
		/* Arrow - x */
		this.context.beginPath();
		this.context.moveTo(xarrow, this.axis.y.y0-arrow.size);
		this.context.lineTo(xarrow, this.axis.y.y0+arrow.size);
		this.context.lineTo(xarrow+(2.0*arrow.size), this.axis.y.y0);
		this.context.lineTo(xarrow, this.axis.y.y0-arrow.size);
		this.context.font = "bold 18px sans-serif";
		this.context.fillStyle = arrow.color; this.context.fill();
		this.context.fillText("x", xarrow-2.0, this.axis.y.y0-12.0);
		this.context.closePath();
		
		/* Desenhando o Y */
		this.context.beginPath();
		this.context.moveTo(this.axis.x.x0, this.axis.y.yf);
		this.context.lineTo(this.axis.x.x0, this.canvas_dimension.height-this.axis.y.yi);
		this.context.lineWidth = line.size;
		this.context.strokeStyle = line.color; this.context.stroke();
		this.context.closePath();
		/* Arrow - y */
		this.context.beginPath();
		this.context.moveTo(this.axis.x.x0-arrow.size, this.axis.y.yf);
		this.context.lineTo(this.axis.x.x0+arrow.size, this.axis.y.yf);
		this.context.lineTo(this.axis.x.x0, this.axis.y.yf-(2*arrow.size));
		this.context.lineTo(this.axis.x.x0-arrow.size, this.axis.y.yf);
		this.context.fillStyle = arrow.color; this.context.fill();
		this.context.fillText("y", this.axis.x.x0-22.0, this.axis.y.yf);
		this.context.closePath();
		
		/* Mostrando as extremidades */
		if(limits){
			this.display_axis_x({'x':this.axis.x.max});
			this.display_axis_x({'x':this.axis.x.min});
			this.display_axis_y({'y':this.axis.y.max});
			this.display_axis_y({'y':this.axis.y.min});
		}
	},
	/**
	* Get size of some value (to print in graph)
	* @access private
	* @param 	double	num		Value to be processed.
	* @param 	double	size	Fonts size to print each digit.
	*/
	get_size_number:function(num, size=5.0){
		var r = 2.0;
		if(num < 0.0){r++; num = num*(-1.0);}
		while(num > 1.0){r++; num = num/10.0;}
		if(num == 1.0) r++;
		else if(num == 0.0) r = 3.5;
		
		return (r*size);
	},
	/**
	* Get padding of some value (to print in graph)
	* @access private
	* @param 	double	num		Value to be processed.
	*/
	padding_number:function(num){
		var exp = 2;
			nfloat = Math.round10(num, -exp),
			n = nfloat.toString().split('.'),
			pad = '00',
			comp = (n[1]) ? n[1] + pad.substring(0, exp - n[1].length) : '00';
		
		return (n[0]+'.'+comp);
	},
	/**
	* Draw values in axis (x, y)
	* @access public
	* @param json		datain		Values of (x, y).
	* @param string		color		Set color.
	*/
	display_axis:function(datain, color){
		/* Rápida chamada */
		this.display_axis_x(datain, true, color);
		this.display_axis_y(datain, true, color);
	},
	/**
	* Draw values in axis (x)
	* @access public
	* @param json		datain		Values of (x, y).
	* @param string		color		Set color.
	*/
	display_axis_x:function(datain, show_relative=false, color = '#003333'){
		/* Variáveis utilizadas */
		var x = this.axis.x.x0+(datain.x*this.axis.x.px),
			show = this.padding_number(datain.x),
			axis = {'color':color, 'size':12.0},
			y_tox = (show_relative && datain.y < 0.0) ? 
				this.axis.y.y0-(axis.size+2.0) : this.axis.y.y0+(axis.size+12.0);
		/* Desenhando o marcador */
		this.context.beginPath();
		this.context.font = "18px sans-serif";
		this.context.moveTo(x, this.axis.y.y0-(axis.size/2.0));
		this.context.lineTo(x, this.axis.y.y0+(axis.size/2.0));
		this.context.fillStyle = axis.color;
		this.context.fillText(show, x-this.get_size_number(show), y_tox);
		this.context.strokeStyle = axis.color; this.context.stroke();
		this.context.closePath();
	},
	/**
	* Draw values in axis (y)
	* @access public
	* @param json		datain		Values of (x, y).
	* @param string		color		Set color.
	*/
	display_axis_y:function(datain, show_relative=false, color = '#003333'){
		/* Variáveis utilizadas */
		var y = this.axis.y.y0-(datain.y*this.axis.y.py),
			show = this.padding_number(datain.y),
			axis = {'color':color, 'size':12.0},
			x_toy = (show_relative && datain.x < 0.0) ? 
				this.axis.x.x0+(axis.size) : 
				this.axis.x.x0-(axis.size+(2.0*this.get_size_number(show))+2.0);
		/* Desenhando o marcador */
		this.context.beginPath();
		this.context.font = "18px sans-serif";
		this.context.moveTo(this.axis.x.x0-(axis.size/2.0), y);
		this.context.lineTo(this.axis.x.x0+(axis.size/2.0), y);
		this.context.fillStyle = axis.color;
		this.context.fillText(show, x_toy, y+6.0);
		this.context.strokeStyle = axis.color; this.context.stroke();
		this.context.closePath();
	},
	/**
	* Draw pointer (ball) in function and dashed line
	* @access private
	* @param json		datain		Values of (x, y).
	* @param string		color		Set color.
	*/
	show_axis:function(datain, color='#126fb9'){
		/* Variáveis utilizadas */
		var x = this.axis.x.x0+(datain.x*this.axis.x.px),
			y = this.axis.y.y0-(datain.y*this.axis.y.py),
			ball = {'color':'#094371', 'size':5.0},
			line = {'color':color};
		
		/* Bolinha no Gráfico */
		this.context.beginPath();
		this.context.arc(x, y, ball.size, 0, 2*Math.PI, true);
		this.context.fillStyle = ball.color; this.context.fill();
		this.context.closePath();
		
		/* Trasejado até os eixos */
		this.context.beginPath();
		this.context.setLineDash([6, 3]);
		this.context.moveTo(this.axis.x.x0, y);
		this.context.lineTo(x, y);
		this.context.lineTo(x, this.axis.y.y0);
		this.context.strokeStyle = line.color; this.context.stroke();
		this.context.setLineDash([0]);
		this.context.closePath();
		/* Display dos valores (x, y) */
		this.display_axis(datain, line.color);
	}
}
