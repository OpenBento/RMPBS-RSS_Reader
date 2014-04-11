RMPBS-RSS Reader README

RMPBS-RSS Reader for PBS Bento Platform
Sarah Dudley--Mercy Interactive, Inc.

CONTENTS
I.	About RMPBS-RSS Reader
II.	Using RMPBS-RSS Reader
III.	Required Scripts
IV.	Additional Information

+++++++++++++++++++++++++++++++++++
ABOUT RMPBS-RSS READER
+++++++++++++++++++++++++++++++++++
RMPBS-RSS Reader is a smart snippet designed for PBS's Bento CMS platform. It ingests a given RSS feed and outputs the content within a Bento template with mupltiple display options including text, images and video.

+++++++++++++++++++++++++++++++++++
USING RMPBS-RSS READER
+++++++++++++++++++++++++++++++++++
After creating the snippet and including all necessary scripts. Add the RMPBS-RSS Reader snippet to the desired page and configure accordingly:

	article_count = TextField (5)	Optional. Number of articles to display	
	default_image = ImageField		Required. Image to display if no image is supplied in the feed
	feed_title = TextField			Optional. If present a title will be prepended to the feed.
	feed_url = TextField			Required. URL of valid RSS or Atom feed.
	source_name = TextField			Optional. Name of feed provider
	source_url = TextField			Optional. Home page URL for feed provider
	title_class = TextField			Optional. Appended to the "class" attribute of the feed title.
	title_style = TextField			Optional. Appended to the "title" attribute of the feed title.
	title_url = TextField			Optional. URL used on the feed title.
	
	images = Select|values=none,small,large					Default:large. Size of images to display
	display = Select|values=excerpt,titles,video-grid		Default:title. Display titles only, images & excerpts or video grid (if video content is available)
	feed_format = Select|values=RSS/Atom, WordPress JSON	Default(RSS/Atom). Format of feed. Wordpress JSON requires the JSON plugin and is available but not supported
	responsive = Select|values=yes,no						Default (yes). For non responsive templates set to "no"
	show_title = Select|values=true,false					Default (yes). Displays feed title if one is provided.

+++++++++++++++++++++++++++++++++++
REQUIRED SCRIPTS
+++++++++++++++++++++++++++++++++++
The RMPBS-RSS Reader snippet requires the inclusion of the following scripts:
jQuery 9.1+
Feeds.js (in this package)

Note: Feeds.js creates a no-conflict variable called '$j' in which to handle all jquery related operations. It may interfere with other snippets using jQuery, causing errors like : "the variable '$' is not defined"


+++++++++++++++++++++++++++++++++++
ADDITIONAL INFORMATION
+++++++++++++++++++++++++++++++++++
Feeds.js is a multifuncitonal feed aggregation script that warrants it's own readme - and may get one if there is demand for it.