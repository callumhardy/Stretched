/**
 * StretchED Plugin
 *
 * This plugin can be used to stretch images inside of a container element in a variety of different ways and allows you to change the way the image is stretched as the window width decreases for responsive designs
 *
 * Author: Callum Hardy <callum@ed.com.au>
 *
 * Version 1.0.1
 */

/**
 * Fall back for older browsers that don't support Object.create
 */
if( typeof Object.create !== 'function' ) {

	Object.create = function( object ) {

		function Obj(){}
		Obj.prototype = object;
		return new Obj();
	};
}

/**
 * Fall back for older browsers that don't support Object.keys
 */
if (!Object.keys) {

  Object.keys = function(obj) {

    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}

/**
 * Anonymous function
 */
(function( $, window, document, undefined ) {

	/**
	 * Global variables
	 */
	$window = $(window);
	var windowWidth = $window.innerWidth(),
		windowHeight = $window.innerHeight();

	/**
	 * The default arguments for the stretchED function
	 * These can be overridden by passing config arguments through the `.stretchED( config )` function
	 * @type {Object}
	 */
	var defaultArgs = {

		/**
		 * backgroundSize
		 *
		 * @type {String} Acts similarly to the 'cover' and 'contain' CSS background-size property
		 *
		 * Options: 'contain', 'cover'( default )
		 */
		backgroundSize: 'cover',
		
		/**
		 * padding
		 * 
		 * @type {Number/String} CSS style padding can be applied to the image for 'contain' image stretching only
		 *
		 * Both `px` and `%` can be passed in the traditional CSS format, eg: '30px 15% 50px' or '50px'
		 */
		padding: 0,

		/**
		 * stretcherPadding
		 * 
		 * @type {Number/String} CSS style padding can be applied to the stretcher element in both 'contain' and 'cover' image stretching
		 *
		 * Both `px` and `%` can be passed in the traditional CSS format, eg: '25% 120px' or '15%'
		 */
		stretcherPadding: 0,

		/**
		 * imageSelector
		 * 
		 * @type {String} A CSS selector to help single out specific image tags to stretch. 
		 * 
		 * Default is `img`
		 */
		imageSelector: 'img',

		/**
		 * alignX
		 * 
		 * @type {String} Choose an alignment for the images X axis
		 *
		 * Options: 'left', 'right', 'center'(default)
		 */
		alignX: 'center',

		/**
		 * alignY
		 * 
		 * @type {String} Choose an alignment for the images Y axis
		 *
		 * Options: 'top', 'bottom', 'center'(default)
		 */
		alignY: 'center',

		/**
		 * stretcher
		 * 
		 * @type {Object} Set initial CSS parameters for the stretcher element
		 */
		stretcher: {},

		/**
		 * breakpoints
		 * 
		 * @type {Object} An Object containing breakpoints with overrides for the config arguments. 
		 *
		 * eg: 
		 * 
		 *  breakpoints: {
				1024: {
					//	New config parameters can be entered here 
					//	They will activate when the browser width drops below 1024px 
				},
				568: {
					//	New config parameters can be entered here
					//	They will activate when the browser width drops below 568px 
				}
			}
		 */
		breakpoints: {},

		/**
		 * before
		 *
		 * A callback that fires before the image has begun stretching
		 * 
		 * @param  {Object} container The container element that the image will be stretched into
		 * @param  {Object} image     The image that will be stretched
		 */
		before: function( container, image ){},

		/**
		 * after
		 *
		 * A callback that fires after the image has finished being stretched
		 * 
		 * @param  {Object} container The container element that the image has been stretched into
		 * @param  {Object} image     The image that has just been stretched
		 */
		after: function( container, image ){}

	};/* defaultArgs */



	/**
	 * Run this function on a jQuery element to manipulate selected images within
	 * @param  {Object}		configArgs		Configurable arguments can be passed to override the defaults
	 * @return {Object}						The jQuery object that this function is run on
	 */
	$.fn.stretchED = function( configArgs )
	{
		//	Merge/Overwrite the default and config arguments
		var config = $.extend( {}, defaultArgs, configArgs );

		//	Get the containers
		$containers = $(this);

		//	If there are conainers loop through them
		if( $containers.length > 0 ){

			$containers.each(function(){

				//	Get the container
				$container = $(this);

				//	Get the images
				$images = $container.find( config.imageSelector );

				//	If no images found then get out of here before something breaks!
				if( $images.length < 1 ) return;

				//	Setup container element zIndex
				if( $container.css('z-index') === 'auto' )
					$container.css({
						zIndex: 0
					});

				//	Create an object to store elements in
				var elements = {
					container: {},
					stretcher: {},
					image: {}
				};

				//	Save containers jQuery object to the config
				elements.container.$ = $container;

				//	Create stretcher element
				$stretcher = $('<div>').addClass('stretcher');

				//	Append the stretcher to the container
				$container.append( $stretcher );

				//	Save stretchers jQuery object to the config
				elements.stretcher.$ = $stretcher;

				$images.each(function(){

					//	Get the image
					$image = $(this);

					//	Save the image src
					var imageSrc = $image.attr('src');

					//console.log( imageSrc + "/?" + new Date().getTime() );

					//	Set the image to be its natural width and height
					//	We are also hiding the image until it loads and has been stretched
					$image.css({
						width: 'auto',
						height: 'auto',
						maxWidth: 'none',
						maxHeight: 'none',
						visibility: 'hidden',
						position: 'absolute'
					});

					//	append the image to the stretcher element
					$stretcher.append( $image );

					//	Now we need to alter the src of the image by appending a unique GET var
					$image.attr( "src", imageSrc );

					//	TODO/Note: this has been removed from the above line because it was causing some weird bugs in IE 9
					//	This is to force IE to stop caching images and run the .load() jQuery function 
					//	imageSrc + "/?" + new Date().getTime()
					
					//	If the image has '0' width, it is most likely not loaded yet
					if( $image.width() === 0 ) {

						//	Wait for the image to load before manipulating it
						$image.load(function(){

							//	Save images jQuery object to the config
							//	Note: we do this after the image has loaded so that we have its correct dimensions
							elements.image.$ = $(this);

							//	Save the naturalWidth and naturalHeight
							//	Note: this attribute already exists in jQuery but we must make it manually to support, you probably guessed it... IE8 and below
							elements.image.naturalWidth = elements.image.$.width();
							elements.image.naturalHeight = elements.image.$.height();
							elements.image.ratio = elements.image.naturalWidth / elements.image.naturalHeight;

							//	Create the stretched object
							var stretched = Object.create( Stretched );

							//	Run the Stretched Object
							stretched.init( config, elements );

						});/* $image.load */

					//	Else the image has a width and is most likely loaded already
					//	We can begin manipulating it now
					} else {

						//	Save images jQuery object to the config
						//	Note: we do this after the image has loaded so that we have its correct dimensions
						elements.image.$ = $(this);

						//	Save the naturalWidth and naturalHeight
						//	Note: this attribute already exists in jQuery but we must make it manually to support, you probably guessed it... IE8 and below
						elements.image.naturalWidth = elements.image.$.width();
						elements.image.naturalHeight = elements.image.$.height();
						elements.image.ratio = elements.image.naturalWidth / elements.image.naturalHeight;

						//	Create the stretched object
						var stretched = Object.create( Stretched );

						//	Run the Stretched Object
						stretched.init( config, elements );
					}

				});/* $images.each */

			});/* $containers.each */

		}/* if( $containers.length > 0 ) */

		//	return the original jQuery object
		return $containers;

	};/* $.fn.stretchED */



	/**
	 * stretches images inside a container to fit based on user configuration options
	 */
	var Stretched = {

		/**
		 * When called the Stretcher Object will run in its entirety
		 * 
		 * @param  {Object}		config		User configuration options
		 * @param  {Object}		elements	The elements that his object will be working with
		 */
		init: function( config, elements )
		{
			var self = this;

			//	Store the config in the Stretched object
			self.config = config;

			//	Keep a copy of the original config incase we alter the config and need to revert back to the original later
			self.originalConfig = config;

			//	Store the element that we will be manipulating
			self.elements = elements;

			//	Run the initial stretching
			self.runStretch();

			//	Setup the bind events
			self.bindEvents();

		},

		runStretch: function() {

			var self = this,
				elem = self.elements,
				conf = self.config,
				breakpoint = false,
				windowWidth = $window.innerWidth(),
				activeBreakpoint = 999999;

			//	jQuery elements
			$container = elem.container.$;
			$stretcher = elem.stretcher.$;
			$image = elem.image.$;

			//	Are there any breakpoints set
			if( Object.keys(conf.breakpoints).length > 0 ) {

				//	Loop through all breakpoints found in the config
				$.each( conf.breakpoints, function( breakpoint, breakpoint_config ) {

					breakpoint = parseInt(breakpoint,10);

					//	Does the breakpoint need to activate
					if( breakpoint > windowWidth && breakpoint < activeBreakpoint ) {

						activeBreakpoint = breakpoint;

						//	Override the config with the breakpoints config
						conf = $.extend( {}, conf, breakpoint_config );
					}

				});

			}

			elem.stretcher.$.attr('style','');

			//	Setup stretcher element
			elem.stretcher.$.css({
				zIndex: -1,
				overflow: 'hidden',
				maxWidth: '',
				maxHeight: '',
				width: 'auto',
				height: 'auto'
			});

			//	config CSS
			if( typeof conf.stretcher === 'object' ) {

				$.each( conf.stretcher, function( key, value ) {

					$stretcher.css( key, value );

				});

			}

			//	Callback: before
			conf.before( elem.container, elem.image );

			//	Set the stretcher padding
			self.calculatePadding( elem.stretcher, conf.stretcherPadding );

			//	Size stretcher
			var stretcherInfo = self.stretchToFill( elem.stretcher, elem.container );

			console.log("stretcher: "+stretcherInfo);

			//	Cover
			if( conf.backgroundSize === 'cover' ) {

				//	Set the image padding - to 0
				self.calculatePadding( elem.image, 0 );

				//	Size image
				self.stretchToCover( elem.image, elem.stretcher );

				//	Image Alignment
				self.imageAlignment();

			//	Contain
			} else {

				//	Set the image padding - to config padding
				self.calculatePadding( elem.image, conf.padding );

				//	Size image
				self.stretchToContain( elem.image, elem.stretcher );

			}

			//	Un-hide the image when it is loaded and sized
			$image.css({
				visibility: 'visible'
			});

			//	Callback: after
			conf.after( elem.container, elem.image );

		},

		/**
		 * This function binds the runStretch function to trigger events
		 * @return {Object}	The Stretched Object
		 */
		bindEvents: function() {

			var self = this,
				resizing;

			//	Window Resize
			$window.resize(function()
			{
				//	Clear the current timeout
				clearTimeout(resizing);

				//	runStretch after 50ms
				resizing = setTimeout( function() {

					self.runStretch();

				}, 50);
			});

			//	Trigger Event
			self.elements.container.$.on( 'stretch', function() {

				self.runStretch();

			});

			return self;
		},

		/**
		 * Sorts a string into float values to be used for Padding or Margins
		 *
		 * @param  {number/string}		padding		A number or string that represents the desired Padding/Margin values
		 * @param  {Object}				element		An Object into which the padding values will be stored
		 * 
		 * @return {Object}							The Stretched Object
		 */
		calculatePadding: function( element, padding ) {

			var self = this;

			//	jQuery elements
			$elem = element.$;
			$parent = $elem.parent();

			//	Make sure there is an empty padding object to write to
			element.padding = {};

			if( !padding ) {

				element.padding.top =
				element.padding.right =
				element.padding.bottom =
				element.padding.left = 0;

			} else {
				//	If padding is not a string, convert it to one
				if( typeof padding !== 'string' ) padding = padding.toString();

				//	Split padding into CSS like parameters
				var paddingArray = padding.split(' ');

				$.each( paddingArray, function( key, value ) {

					//	Fancy Percentages
					if( value.indexOf('%') !== -1 ) {

						value = parseFloat( value ) / 100;

						if( key === 0 ) {

							element.padding.top = element.padding.bottom = $parent.height() * value;
							element.padding.right = element.padding.left = $parent.width() * value;
						
						} else if( key === 1 ) {

							element.padding.right = element.padding.left = $parent.width() * value;
						
						} else if( key === 2 ) {

							element.padding.bottom = $parent.height() * value;
						
						} else if( key === 3 ) {

							element.padding.left = $parent.width() * value;
						}
					
					//	Straight up Pixels
					} else {

						value = parseFloat( value );

						if( key === 0 ) {

							element.padding.top = element.padding.bottom = element.padding.right = element.padding.left = value;

						} else if( key === 1 ) {

							element.padding.right = element.padding.left = value;
						
						} else if( key === 2 ) {

							element.padding.bottom = value;
						
						} else if( key === 3 ) {

							element.padding.left = value;
						}
					}
				});
			}

			return self;
		},

		imageAlignment: function() {

			var self = this,
				elem = self.elements,
				conf = self.config;

			//	jQuery elements
			$container = elem.container.$;
			$stretcher = elem.stretcher.$;
			$image = elem.image.$;

			//	Image alignment
			if( conf.alignX === 'left' ) {

				$image.css({
					left: 0,
					right: '',
					marginLeft: 0
				});

			} else if( conf.alignX === 'right' ) {

				$image.css({
					left: '',
					right: 0,
					marginLeft: 0
				});

			}

			if( conf.alignY === 'top' ) {

				$image.css({
					top: 0,
					bottom: '',
					marginTop: 0
				});

			} else if( conf.alignY === 'bottom' ) {

				$image.css({
					top: '',
					bottom: 0,
					marginTop: 0
				});

			}

		},

		stretchToContain: function( element, targetElement ) {

			var self = this;

			//	Get jQuery elements
			$elem = element.$;
			$targetElem = targetElement.$;

			//	Target element data
			targetElement.ratio = $targetElem.width() / $targetElem.height();
			targetElement.innerWidth = targetElement.$.innerWidth() - element.padding.right - element.padding.left;
			targetElement.innerHeight = targetElement.$.innerHeight() - element.padding.top - element.padding.bottom;
			targetElement.innerRatio = targetElement.innerWidth / targetElement.innerHeight;

			//	Fit by width
			if( element.ratio > targetElement.innerRatio ) {

				element.width = ( element.naturalWidth > targetElement.innerWidth ) ?
					targetElement.innerWidth:
					element.naturalWidth;

				element.height = Math.ceil( element.width / element.ratio );

			//	Fit by height
			} else {

				element.height = ( element.naturalHeight > targetElement.innerHeight ) ?
					targetElement.innerHeight:
					element.naturalHeight;

				element.width = Math.ceil( element.height * element.ratio );
			}

			//	Sort out the margins
			element.marginLeft = -element.width / 2 + ( ( element.padding.left / 2 ) - ( element.padding.right / 2 ) );
			element.marginTop = -element.height / 2 + ( ( element.padding.top / 2 ) - ( element.padding.bottom / 2 ) );

			//	Set the CSS of the element
			$elem.css({
				position: 'absolute',
				top: '50%',
				left: '50%',
				marginLeft: element.marginLeft,
				marginTop: element.marginTop,
				width: element.width,
				height: element.height,
				maxWidth: 'none',
				maxHeight: 'none'
			});

		},

		stretchToCover: function( element, targetElement ) {

			var self = this;

			$elem = element.$;
			$targetElem = targetElement.$;

			targetElement.ratio = $targetElem.width() / $targetElem.height();

			//	Fit by width
			if( element.ratio < targetElement.ratio ) {

				element.width = $targetElem.width() + 1;
				// Note: extra px needed to help rounding in IE

				element.height = Math.ceil( element.width / element.ratio );

			//	Fit by height
			} else {

				element.height = $targetElem.height() + 1;
				// Note: extra px needed to help rounding in IE

				element.width = Math.ceil( element.height * element.ratio );
			}

			//	Sort out the margins
			element.marginLeft = -element.width / 2;
			element.marginTop = -element.height / 2;

			$elem.css({
				position: 'absolute',
				top: '50%',
				left: '50%',
				marginLeft: element.marginLeft,
				marginTop: element.marginTop,
				width: element.width,
				height: element.height,
				maxWidth: 'none',
				maxHeight: 'none'
			});
		},

		/*stretchPropertiesToWrap: function() {

		},*/

		stretchToFill: function( element, targetElement ) {

			//	Get jQuery elements
			$elem = element.$;
			$targetElem = targetElement.$;

			//	Target element data
			targetElement.ratio = $targetElem.width() / $targetElem.height();
			targetElement.innerWidth = $targetElem.innerWidth() - element.padding.right - element.padding.left;
			targetElement.innerHeight = $targetElem.innerHeight() - element.padding.top - element.padding.bottom;
			targetElement.innerRatio = targetElement.innerWidth / targetElement.innerHeight;

			//	Stretch the element to full width and height of the targetElem
			$elem.css({
				position: 'absolute',
				top: element.padding.top,
				left: element.padding.left,
				width: targetElement.innerWidth,
				height: targetElement.innerHeight
			});

			//	We need to test if the targetElement has an acceptable CSS position
			var targetElemPosition = $targetElem.css('position');

			//	If its not an 'absolute' or 'relative' position, give it a 'relative' CSS position
			if( targetElemPosition != 'absolute' && targetElemPosition != 'relative'  ) {

				$targetElem.css({
					position: 'relative'
				});

			}
		}

	};

})( jQuery, window, document );

