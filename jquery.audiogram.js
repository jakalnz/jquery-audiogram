/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "audiogram"
 * by Matt Hollis - contact via my name at gmail.com
 *
 * Copyright (c) 2010 Matt Hollis
 * Version: 0.1.1-2010.06.02
 *
 * --------------------------------------------------------------------
 **/
(function($) {
	$.fn.audiogram = function(settings) {
		
		// Default settings
		var defaults = {
			cvHeight : 600,
			cvWidth : 600,
			xOffset : 40,
			yOffset : 20,
			leftUnmaskedIcon : '/matt/media/img/left.air.unmasked.png',
			rightUnmaskedIcon : '/matt/media/img/right.air.unmasked.png',
			newGraph : false,
			backgroundColor : '#eeeeee',
			activeEar : 'left',
			activeTransducer : 'air',
			editable : false,
			removePoint : false,
		};
		
		// Replace defautls with any user passed settings
		var option = $.extend(defaults, settings);
		
		// Audiogram grid size (offset + 5 to ensure we don't overlap our borders)
		option.audiogramHeight = option.cvHeight - (option.yOffset + 5);
		
		// Aspect ratio based on UTMG audiogram
		option.audiogramWidth = option.audiogramHeight * 0.92857;
		
		// Canvas variables
		var xLabels = ['125', '250', '500', '1k', '2k', '4k', '8k'],
		    yLabels = ['-10', '0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120'];
		
		// Audiometric variables 
		var frequencies = ['t125', 't180', 't250', 't375', 't500', 't750', 't1k', 't1500', 't2k', 't3k', 't4k', 't6k', 't8k'],
		    thresholds  = ['-10', '-5', '0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90', '95', '100', '105', '110', '115', '120'];
		
		// Audiometric data object w/ empty values
		var audiometricData = {
			left : {
				air : {
					unmasked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					},
					masked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					}
				},
				bone : {
					unmasked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					},
					masked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					}
				},
			},
			right : {
				air : {
					unmasked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					},
					masked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					}
				},
				bone : {
					unmasked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					},
					masked : {
						t125  : false,
						t180  : false,
						t250  : false,
						t375  : false,
						t500  : false,
						t750  : false,
						t1k   : false,
						t1500 : false,
						t2k   : false,
						t3k   : false,
						t4k   : false,
						t6k   : false,
						t8k   : false,
						t12k  : false,
					}
				}
			},
			soundfield : {
				unaided : {
					t125  : false,
					t180  : false,
					t250  : false,
					t375  : false,
					t500  : false,
					t750  : false,
					t1k   : false,
					t1500 : false,
					t2k   : false,
					t3k   : false,
					t4k   : false,
					t6k   : false,
					t8k   : false,
					t12k  : false,
				},
				aided : {
					t125  : false,
					t180  : false,
					t250  : false,
					t375  : false,
					t500  : false,
					t750  : false,
					t1k   : false,
					t1500 : false,
					t2k   : false,
					t3k   : false,
					t4k   : false,
					t6k   : false,
					t8k   : false,
					t12k  : false,
				},
				ci : {
					t125  : false,
					t180  : false,
					t250  : false,
					t375  : false,
					t500  : false,
					t750  : false,
					t1k   : false,
					t1500 : false,
					t2k   : false,
					t3k   : false,
					t4k   : false,
					t6k   : false,
					t8k   : false,
					t12k  : false,
				}
			}
		};
		
		// The table to be replaced with the canvas
		var dataSource = $(this).attr('id');
		
		var canvas = $('#audiogram-'+dataSource).get(0);
		
		// Images to be used for audiometric data points
		var icon = {
			left : {
				air : new Image(),
				bone : new Image(),
			},
			right : {
				air: new Image(),
				bone : new Image(),
			},
		};
		
		icon.left.air.src  = option.leftUnmaskedIcon;
		icon.right.air.src = option.rightUnmaskedIcon;
		icon.left.bone.src = '/matt/media/img/left.bone.unmasked.png';
		icon.right.bone.src = '/matt/media/img/right.bone.unmasked.png';
		
		/**
		 * Canvas object handles drawing everything except data points
		 **/
		Canvas = function() {
			/** Private properties and methods **/
			var firstRun = true,
				ctx,
				previous = {
					x : false,
					y : false,
				},
				current = {
					x : false,
					y : false,
				};

			
			/**
			 * Creates the canvas and injects it into the DOM after the data source table
			 * Also sets the 2d rendering context
			 **/
			var init = function() {
				// Inject our canvas into the DOM and hide our data table. Note that the table is not
				// being removed from the DOM, merely hidden so that we can still parse its data.
				$('#'+dataSource).after('<canvas id="audiogram-'+dataSource+'" class="audiogram"></canvas>').hide();
				
				// Obtain a reference to the canvas and set some of its properties
				canvas = $('#audiogram-'+dataSource).get(0);
				canvas.width  = option.cvWidth;
				canvas.height = option.cvHeight;
				
				// Set 2d rendering context
				ctx = canvas.getContext('2d');
				
				// Test that initialization went as expected
				if (!ctx) {
					console.log('Error initializing canvas.');
					return false;
				}
				firstRun = false;
			}
			
			/**
			 * Sets a border around the entire canvas and puts the gradient in place
			 * (this is the extent of my graphic design skills)
			 **/
			var shadeBackground = function() {
				// Fill the full canvas with a solid background
				ctx.fillStyle = '#ffffff';
				ctx.strokeStyle = '#000000';
				
				ctx.fillRect(0, 0, option.cvWidth, option.cvHeight);
				ctx.strokeRect(0, 0, option.cvWidth, option.cvHeight);
				
				// Create our gradient for the actual audiogram grid
				var gradient = ctx.createLinearGradient(0, 0, 0, option.audiogramHeight);
				gradient.addColorStop(0.0, '#ffffff');
				gradient.addColorStop(0.2, '#ffffff');
				gradient.addColorStop(1.0, option.backgroundColor);
				
				// Render a rectangle filled by our gradient
				ctx.fillStyle = gradient;
				ctx.fillRect(option.xOffset, option.yOffset, option.audiogramWidth, option.audiogramHeight - option.yOffset * 2);
			}
			
			/**
			 * Sets up the audiogram grid lines
			 **/
			var drawGrid = function() {
				var verticalLines = 6,
					horizontalLines = 14;
				
				// Line styling
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#000000';
				
				// Horizontal lines
				var xStart = option.xOffset,
					xEnd = option.xOffset + option.audiogramWidth;
				
				for (i = 0; i <= horizontalLines; i++) {
					// Begin line 
					ctx.beginPath();
					
					// Calculate our y-coordinate (parentheses simply to make it easy to read, not necessary per order of operations)
					// Adding 0.5px is necessary to avoid anti-aliasing artifact from the canvas rendering engine
					// See http://developer.mozilla.org/en/Canvas_tutorial/Applying_styles_and_colors
					var y = (i * (option.audiogramHeight / horizontalLines)) + 0.5 - option.yOffset;
					
					// Line start
					ctx.moveTo(xStart, y);
					
					// Line end
					ctx.lineTo(xEnd, y);
					
					// Draw the line
					ctx.stroke();
				}
				
				// Vertical lines
				var yStart = option.yOffset,
					yEnd = option.audiogramHeight - option.yOffset;
				
				for (j = 0; j <= verticalLines; j++) {
					// See comments for horizontal lines if this is unclear; it's exactly the same process.
					ctx.beginPath();
					
					var x = (j * (option.audiogramWidth / verticalLines)) + 0.5 + option.xOffset;
					
					ctx.moveTo(x, yStart);
					ctx.lineTo(x, yEnd);
					ctx.stroke();
				}
			}
			
			/**
			 * Puts labels on the x- and y-axes
			 **/
			 var drawLabels = function() {
				ctx.font = "12px 'arial'";
				ctx.fillStyle = '#000000';
				
				// x-axis labels
				for (i = 0; i < xLabels.length; i++) {
					var xStart = (i * (option.audiogramWidth / (xLabels.length - 1))) + option.xOffset;
					ctx.fillText(xLabels[i], xStart, option.yOffset / 1.5);
				}
				
				// y-axis labels
				for (j = 0; j < yLabels.length; j++) {
					var yStart = (j * (option.audiogramHeight / (yLabels.length))) + option.yOffset;
					ctx.fillText(yLabels[j], option.xOffset / 3, yStart);
				}
			}
			
			/**
			 * Draws lines connecting data points
			 **/
			var dataLine = function(x, y, color) {
				ctx.lineWidth = 1;
				
				// If first point entered, we don't need a line yet
				if (current.x === false) {
					current.x = x;
					current.y = y;
				}
				else {
					// Using $.extend because javascript passes objects by reference making cloning difficult
					previous = $.extend({}, current);
					current.x = x;
					current.y = y;
					
					// If this condition is false, we're starting a new data set (e.g. changing ears) and don't want a connecting line
					if (current.x > previous.x) {
						ctx.strokeStyle = color;
						
						// Y-coordinate adjustment for extreme slope (aesthetic change)
						yDelta = (current.y - previous.y) * 0.1;
						
						// Line drawing
						ctx.beginPath();
						ctx.moveTo(previous.x + 5, previous.y + yDelta);
						ctx.lineTo(current.x - 10, current.y - yDelta);
						ctx.stroke();
					}
				}
			}
			
			/** Public properties and methods **/
			return {
				/**
				 * Draws the canvas.  Will insert it into the DOM if not there already
				 **/
				draw : function() {
					// If called by audiogram.main() set up the canvas first
					if (firstRun) {init();}
					
					shadeBackground();
					drawGrid();
					drawLabels();
				},
				
				/**
				 * Handels calculating the intended plot point based on actual user-click location
				 *
				 * @param  float    click event's x-coordinate
				 * @param  float    click event's y-coordinate
				 * @param  object   image to be drawn
				 * @return void
				 **/
				plot : function(x, y, ear, transducer) {	
					var img = icon[ear][transducer];
					// Don't draw anything that would be off the grid
					if (y < (option.audiogramHeight - option.yOffset) && x > option.xOffset - 5) {
						// extra x - 5 because I suck at making images centered in photoshop
						ctx.drawImage(img, x - (img.width / 2) - 4, y - (img.height / 2));
					}
					
					if (transducer == 'air') {
						dataLine(x, y, (ear == 'right') ? 'd00000' : '0000d0');
					}
				},
			};
		}(); // End Canvas
		
		/**
		 * Data object handles all things related to the graph's data points
		 **/
		Data = function() {
			/** Private properties and methods **/
			var firstRun = true;
			
			/**
			 * Parses through the html table with the audiometric data for our audiogram object
			 **/
			var parseTable = function() {
				// Iterate through each table row
				$('#'+dataSource+' > tbody > tr').each(function() {
					
					// The first cell is the frequency, the rest are our data
					frequency = $($(this).children().get(0)).text();
					rightAir  = $($(this).children().get(1)).text();
					rightBone = $($(this).children().get(2)).text();
					leftAir   = $($(this).children().get(3)).text();
					leftBone  = $($(this).children().get(4)).text();
					
					// If no data, the cell text will be "false" - otherwise, put the number in our data object
					audiometricData.right.air[frequency]  = (rightAir  == 'false') ? false : rightAir;
					audiometricData.right.bone[frequency] = (rightBone == 'false') ? false : rightBone;
					audiometricData.left.air[frequency]   = (leftAir   == 'false') ? false : leftAir;
					audiometricData.left.bone[frequency]  = (leftBone  == 'false') ? false : leftBone;
				});
			};
			
			/**
			 * Gets the intersection nearest to the provided coordinates
			 *
			 * @param  int    click event's x-coordinate
			 * @param  int    click event's y-coordinate
			 * @return object
			 **/
			var getNearestIntersection = function(x, y) {
				var verticalLines = 12,
				    horizontalLines = 28,
				    sizey = option.audiogramHeight / horizontalLines,
				    sizex = option.audiogramWidth / verticalLines,
				    
				    //first we need to find the rectangle where the click happened
				    iX = parseInt(x / sizex),
				    iY = parseInt(y / sizey),
				    
				    //then we need to find the closest corner
				    quadrantX = parseInt((x % sizex) / (sizex / 2)),
				    quadrantY = parseInt((y % sizey) / (sizey / 2)),
				    
				    x1 = (iX + quadrantX) * sizex, // + option.xOffset;
				    y1 = (iY + quadrantY) * sizey; // + option.yOffset;
				    
				return {x : x1, y : y1};
			};
			
			/**
			 * Adds threshold data to the audiometricData object based upon grid x,y coordinates
			 *
			 * @param  float    click event's x-coordinate
			 * @param  float    click event's y-coordinate
			 * @return void
			 **/
			var xyToThreshold = function(x, y) {
				var verticalLines = 12,
					horizontalLines = 28,
					sizey = option.audiogramHeight / horizontalLines,
					sizex = option.audiogramWidth / verticalLines;
				
				audiometricData[option.activeEar][option.activeTransducer][frequencies[Math.round((x / sizex) - 1)]] =
				    (option.removePoint) ? false : thresholds[Math.round((y / sizey) - 1)];
			};
			
			/**
			 * Takes an audiometric data point (frequency x threshold) and returns where on the graph
			 * it should be plotted.
			 *
			 * @param  string   audimetric frequency (x-value)
			 * @param  string   threshold (y-value)
			 * @return object   coordinate object (obj.x, obj.y)
			 **/
			var thresholdToXY = function(frequency, threshold) {
				var verticalLines = 12,
					horizontalLines = 28,
					sizey = option.audiogramHeight / horizontalLines,
					sizex = option.audiogramWidth / verticalLines,
					x = (frequencies.indexOf(frequency) + 1)  * sizex,
					y = (thresholds.indexOf(threshold) + 1) * sizey;
				
				return getNearestIntersection(Math.round(x), Math.round(y));
			}
			
			/**
			 * Plots from our data object (audiometricData) onto the grid
			 **/
			var plotAudiogram = function() {
				// Iterating through each level of our audiometricData object
				$.each(audiometricData, function(ear) {
					$.each(audiometricData[ear], function(transducer) {
						$.each(audiometricData[ear][transducer], function(frequency, threshold) {
							// Don't plot any non-existant data points
							if (threshold !== false) {
								var coords = thresholdToXY(frequency, threshold);
								Canvas.plot(coords.x, coords.y, ear, transducer);
							}
						});
					});
				});
			};
			
			/** Public properties and methods **/
			return {
				
				/**
				 * Plots data to the audiometricData object
				 *
				 * @param  int  click event's x-coordinate
				 * @param  int  click event's y-coordinate
				 * @return void
				 **/
				plot : function(x, y) {
					// Default value = false if no argument supplied (when called as part of main();)
					x = x || false;
					y = y || false;
					
					// If run through main(), grab data from the html data table
					if (firstRun && !option.newGraph) { 
						firstRun = false;
						parseTable(); 
					}
					
					// If we have points, record them
					if (x && y) {
						xyToThreshold(x, y);
					}
					
					// Draw all the data points
					plotAudiogram();
				},
				
				/**
				 * Saves data to the database via AJAX call
				 **/
				 save : function() {
					// jQuery ajax handler
					$.ajax({
						// set request parameters
						type : "POST",
						data : audiometricData,
						url : '/matt/test.php',
						
						// if successful, show message indicating such
						success : function(msg) {
							console.log(msg);
							
							$('#container').before('<div id="message"></div>');
							$('#message').addClass('success').html('<p>Data saved.</p>').fadeIn(1500).delay(3500).fadeOut(1000, function() {
								$(this).remove();
							});
						},
						
						// if error, show what went wrong
						error : function(msg) {
							console.log(msg);
							
							$('#container').before('<div id="message"></div>');
							$('#message').addClass('error').html('Error: Something bad happened.  You should probably fix that. '+msg.status+'|'+msg.statusText).fadeIn(1500).delay(3500).fadeOut(1000, function() {
								$(this).remove();
							});
						},
					});
				},
			};
		}(); // End Data
		
		/**
		 * Starts the progam and adds event handlers
		 **/
		function main() {
			Canvas.draw();
			
			// Make sure our image icons are loaded before we try to plot
			$(icon.left.air).load(function() {
				$(icon.right.air).load(function() {
					$(icon.left.bone).load(function() {
						$(icon.right.bone).load(function() {
							Data.plot();
						});
					});
				});
			});
			
			if (option.editable) {
				// Click event handler
				$(canvas).bind('click', function(e) {
					
					var x = e.clientX - canvas.offsetLeft,
						y = e.clientY - canvas.offsetTop; 
					
					// If on the audiogram
					if (x <= option.audiogramWidth + option.xOffset && y <= option.audiogramHeight - option.yOffset) {
						// Clear the board
						Canvas.draw();
						
						// Record and draw the data
						Data.plot(x, y);
					}
				});
				
				// Ear & transducer selectors
				$('#button_left').click(function() {
					option.activeEar = 'left';
				});
				
				$('#button_right').click(function() {
					option.activeEar = 'right';
				});
				
				// Test button for whatever I need to check at the moment
				$('#button_test').click(function() {
					option.removePoint = (option.removePoint) ? false : true;
				});
				$('#button_save').click(function() {
					Data.save();
				});
			}
		}
		
		main();
		
		return this;
	}
})(jQuery);