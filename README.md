# jPlotGraph #

Links:      
[Online Example](http://projects.leonardomauro.com/jplotgraph/example/)
   
This package build a graph (cartesian plane) in **Canvas** [HTML5] through a determinate equation. Any Canvas element can be used to plot the graph, until with width and height responsives.   

The [Online Example](http://projects.leonardomauro.com/jplotgraph/example/) show a plot of linear function with many options to user interface. The user can in real-time do changes to the values of variables, `event.mousemove` to see a (x, y) in draw and `event.mouseclick` to pause the draw events. Also, use Canvas responsive (with Bootstrap) to display the program in various devices. This example is in the files.
   
## Package  

The package is in `./dist/jPlotGraph/`, and are defined by two main classes:   
- *file* plot.axis.js - *class* `PlotGraph()`
    - This class management all system of draw graph. Here you can modify colors, equation, axis, sizes, margins and texts.
- *file* plot.events.js - *json.functions* `events`
    - These functions realize the user interface (UI) interaction (like: mousemove, mouseleave and click). Here you can modify how behave the UI with the Canvas element.   

But, the package don't work without `func_mmy` and `func_plot`. That's functions have to be included before of the plot graph. Theses functions define how draw the equation and how fit max and min values of f(x). See *file* plot.func.linear.js, used in example.   


## Also look ~  	
* [License GPL v2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
* Create by Leonardo Mauro (leo.mauro.desenv@gmail.com)
* Git: [leomaurodesenv](https://github.com/leomaurodesenv/)
* Site: [Portfolio](http://leonardomauro.com/portfolio/)
