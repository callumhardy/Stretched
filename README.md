# StretchED

StretchED is at it's heart is a simple jQuery image stretching plugin. 

However it also includes many more advanced features that may apply to some of the more unique situations that a web developer may encounter whist building a site.

- [StretchED](#user-content-stretched)
	- [Setup](#user-content-setup)
	- [Usage](#user-content-usage)
		- [args parameters](#user-content-args-parameters)
		- [Callbacks](#user-content-callbacks)
	- [Examples](#user-content-examples)
		- [Covering only half of the container element](#user-content-covering-only-half-of-the-container-element)
		- [Setting a max height for the stretched Image](#user-content-setting-a-max-height-for-the-stretched-image)
		- [Adding a breakpoint that changes the backgroundSize](#user-content-adding-a-breakpoint-that-changes-the-backgroundsize)
	- [Dependencies](#user-content-dependencies)
	- [Compatibility](#user-content-compatibility)

## Setup

To use the stretchED plugin you'll need to include jQuery and either `stretchED.js` or `stretchED.min.js`

For example:

	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script type='text/javascript' src='PATH_TO_DIRECTORY/stretchED.min.js'></script>

Or if you are using Wordpress, which already includes jQuery:

	wp_enqueue_script( 'stretchED', get_template_directory_uri().'/PATH_TO_DIRECTORY/stretchED.js', array( 'jquery' ) );


## Usage

By default the only thing that stretchED needs from you operate, is to be given the jQuery object of an element or elements in the DOM. Any `<img>` tags that stretchED finds in the element(s) will be stretched to cover the entire background of the element.

The effect is similar to the CSS property `background-size: cover`

HTML:

	<div id="container">
		<img href="image.jpg"/>
	</div>

Javascript:

	var element = $('#container');

	element.stretchED(args);

After stretchED has run it will have wrapped the image in a `div` with the class 'stretcher'. Both the 'stretcher' and image will have several inline CSS styles applied

**element**

> (*required*)(*jQuery object*) Images found by the plugin inside this jQuery Object will be stretched.

**args**

> (*optional*)(*object*) A JavaScript object of parameters that allows you to configure the actions of the `stretchED()` jQuery function

### args parameters

There are many option available when configuring the plugin args.

**backgroundSize**

> (*string*) Acts similarly to the CSS `background-size` property. Options are:
+ 'contain'
+ 'cover' (*default*)

**imageSelector**

> (*string*) By default this is set to `'img'`. This means the stretcher will stretch all `<img>` tags found in the container element. If you only need to effect certain images you can pass a CSS selector here single out specific image tags to stretch.

**alignX**

> (*string*) Choose an alignment for the image's X axis. Available options are:
+ 'left'
+ 'right'
+ 'center' (*default*)

**alignY**

> (*string*) Choose an alignment for the image's Y axis. Available options are:
+ 'top'
+ 'bottom'
+ 'center' (*default*)

**stretcher**

> (*object*) Set initial CSS parameters for the stretcher element

> + **padding** (*int/string*) CSS style padding can be applied to the stretcher only when `backgroundSize: 'contain'` is active. 
    + Both `px` and `%` can be passed in the traditional CSS format, eg: `'30px 15% 50px'` or `'50px'`.
    + **Note:** The effect of padding in the stretcher element is faked by resizing the image inside it. It will not apply actual CSS padding to the stretcher element

**container**

> (*object*) Set initial CSS parameters for the container element

> + **padding** (*int/string*) CSS style padding can be applied to the container element for both `backgroundSize: 'contain'` and `backgroundSize: 'cover'`.
    + Both `px` and `%` can be passed in the traditional CSS format, eg: `'25% 120px'` or `'15%'`.
    + **Note:** The effect of padding in the container element is faked by resizing the image inside it. It will not apply actual CSS padding to the container element

**breakpoints**

> (*object*) An Object containing breakpoints with overrides for the config arguments

> For example:

	breakpoints: {
		1024: {
			//	New config parameters can be entered here 
			//	They will activate when the browser width drops below 1024px 
		},
		568: {
			//	New config parameters can be entered here
			//	They will activate when the browser width drops below 568px 
		}
	}

### Callbacks

I've never had to use these in any situation personally. But I put a few callbacks in just in case a situation pops up where they might be handy.

**before**

> (*function*) A callback that fires before the image has begun stretching

	before: function( elements ){}

> + *elements* (*object*) An object of DOM elements that the stretcher will be manipulating.

**after**

> (*function*) A callback that fires after the image has finished being stretched

	after: function( elements ){}

> + *elements* (*object*) An object of DOM elements that the stretcher will be manipulating.


## Examples

### Covering only half of the container element

We can set the container's padding to only cover a certain amount of its background. In the example below we are setting the container to have `50%` padding on the left. The plugin will then only allow the image to cover the right hand side of the container.

	element.stretchED({
		container: {
			padding: '0 0 0 50%'
		}
	});

### Setting a max height for the stretched Image

Changing the padding of elements like the example above is handy, but it will not quite help with this task. Instead for this we can assign a `maxHeight` to the 'stretcher' element. This will only allow the `100px` of the image to be visible vertically. The same can be done for `maxWidth`.

	element.stretchED({
		stretcher: {
			maxHeight: 100
		}
	});

### Adding a breakpoint that changes the backgroundSize

Below we are setting the `backgroundSize` to not not use the default `cover`, but instead use `contain`. Then we have added a breakpoint of `1024px`, which sets the `backgroundSize` to `cover`. This break point will activate when the browser width drops below `1024px`. 

	element.stretchED({
		backgroundSize: 'contain',
		breakpoints: {
			1024: {
				backgroundSize: 'cover'
			}
		}
	});

You may alter any of the configurable parameters listed here inside a breakpoint. Even another breakpoint... but that would just be crazy sauce! pffffft! breakpoinception indeed!


## Dependencies

This plugin is dependent on the following.

- [jQuery](http://jquery.com/download/)


## Compatibility

Works on all major browsers.

Tested down to Internet Explorer 7 ( those were some seriously good times... pause... naaaaat! )
