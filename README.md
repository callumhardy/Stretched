# StretchED

StretchED is at it's heart a simple jQuery image stretching plugin. 

However it also includes many more advanced features that may apply to some of the more unique situations that a web developer may encounter whist building a site.

## Installation

Only one file needs to be included in you website's head.

For example:

	<script type='text/javascript' src='PATH_TO_DIRECTORY/stretchED.js'></script>

Or if you are using Wordpress:

	wp_register_script( 'stretchED', get_template_directory_uri().'/PATH_TO_DIRECTORY/stretchED.js', array( 'jquery' ) );
	wp_enqueue_script( 'stretchED' );

## Usage

	*jQuerySelection*.stretchED(*args*);

**jQuerySelection**

> (*required*)(*jQuery object*) Images found by the plugin inside this jQuery Object will be stretched.

**args**

> (*optional*)(*object*) A JavaScript object of parameters that allows you to configure the actions of the `stretchED()` jQuery function

**args parameters**

There are many option available when configuring the plugin args.

*backgroundSize*

> (*string*) Acts similarly to the 'cover' and 'contain' CSS `background-size` property. (*default*) `cover`

*imageSelector*

> (*string*) By default this is set to `img`. This means the stretcher will stretch all image tags found in the container element. If you only need to effect certain images you can pass a CSS selector here single out specific image tags to stretch.

*alignX*

> (*string*) Choose an alignment for the image's X axis. 
> Avalible options are:
- 'left'
- 'right'
- 'center' (*default*)



### Default

By default the only thing that stretchED needs from you operate, is to be given the jQuery object of an element in the DOM. Any `<img>` that stretchED finds in this element will be stretched to cover the entire background of the element.

The effect is similar to the CSS property `background-size: cover`

For example:

HTML

	<div id="container">
		<img href="image.jpg"/>
	</div>

Javascript

	$('#container').stretchED();

