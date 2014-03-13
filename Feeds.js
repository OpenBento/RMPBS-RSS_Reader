/* Feeds.js */
/* Copyright 2014 Mercy Interactive, Inc. and other contributors Licensed MIT */

$j = jQuery.noConflict();


function FeedGroup(){
	this.feeds = new Array();
	this.title = "";
	this.display = "title";
	this.article_count = 5;
	this.pub_div = "feed-group";
	this.output = "div";
	this.type = 'group';
	this.footer = "";
	this.parent = "";
	this.geoDataEnabled = false;
	this.geoDataOnSubmit = "updateZip()";
	this.geoDataDefaultText = "Enter Zip Code";
	this.streaming_icon = "";
	this.box_class = "";
	this.item_class = "";
	
	this.addFeed = function(title,url,type){
		if(type == "group"){
			this.feeds.push(url);
			this.feeds[this.feeds.length -1].parent = this;						
		}else{
			this_feed = new Feed(title,url,type,this);
			this_feed.streaming_icon = this.streaming_icon;
			this_feed.box_class = this.box_class;
			this_feed.item_class = this.item_class;
			this.feeds.push(this_feed);			
		}
	}
	
	this.renderFeeds = function (){
		var pub_div = this.pub_div;
		var count = this.article_count;
		var footer = this.footer;
		
		//clear the publication div
		$j("#"+pub_div).empty();
		console.log(this);
		
		if (count == -1 || count == ""){
			article_count = articles.length;
		}else{
			article_count = this.article_count;
		}
		
		
		if(this.output == "tabs"){//append ul for tabs if enabled
			$j("#"+pub_div).append('<ul id="'+pub_div+'_ul"></ul>');
		}

	  	if(this.geoDataEnabled){
	  		console.log("geoDataEnabled");
	  		zipCookie = getCookie('GeoDataZip');
	  		if(zipCookie){
		  		val=zipCookie;
	  		}else{
		  		val= this.geoDataDefaultText;
	  		}
			$j("#"+pub_div+"").append('<form onsubmit='+this.geoDataOnSubmit+'><input type="text" name="zip" id="zip" value="'+val+'" /><input type="submit" id="go" value="Go" /></form>');			  	
	  	}
	

		for(var i=0;i < this.feeds.length;i++){
			if(this.output == "tabs"){
				$j("#"+pub_div+"_ul").append('<li><a href="#'+pub_div+'_'+slugify(this.feeds[i].title)+'">'+this.feeds[i].title+'</a></li>');
			}
		
			$j("#"+pub_div+"").append('<div id="'+pub_div+'_'+slugify(this.feeds[i].title)+'"></div>');

		  	if(this.feeds[i].type == 'group'){
		  		//console.log(this.feeds[i].title);
			  	this.feeds[i].pub_div = pub_div+'_'+slugify(this.feeds[i].title);
			  	this.feeds[i].article_count = 1;
			  	
			  	if(!this.geoDataEnabled && this.feeds[i].geoDataEnabled){
				  	zipCookie = getCookie('GeoDataZip');
			  		if(zipCookie){
				  		val=zipCookie;
			  		}else{
				  		val= this.feeds[i].geoDataDefaultText;
			  		}
					$j("#"+this.feeds[i].pub_div+"").append('<form onsubmit='+this.feeds[i].geoDataOnSubmit+'><input type="text" name="zip" id="zip" value="'+val+'" /><input type="submit" id="go" value="Go" /></form>');			  	
			  	}

			  	
			  	
			  	
			  	for(var j=0;j<this.feeds[i].feeds.length;j++){
				  	$j("#"+pub_div+'_'+slugify(this.feeds[i].title)).append('<div id="'+pub_div+'_'+slugify(this.feeds[i].title)+'_'+slugify(this.feeds[i].feeds[j].title)+'" style="white-space:normal" class="'+this.feeds[i].feeds[j].box_class+'"></div>');
				  	this.feeds[i].feeds[j].show_title = false;
				  	if(this.feeds[i].geoDataEnabled){
				  		if(j==0){
				  		console.log(3);
					  		this.feeds[i].feeds[j].article_count = 3;
				  		}else if (j==1){
				  		console.log(2);
					  		this.feeds[i].feeds[j].article_count = 2;
				  		}else{
				  		console.log(1);
					  		this.feeds[i].feeds[j].article_count = 1;
				  		}
					  	
				  	}else{
				  		this.feeds[i].feeds[j].article_count = 1;
				  	}
				  	
				  	this.feeds[i].feeds[j].renderFeed();		  				  	
			  	}
				  	if(this.feeds[i].footer){
						$j("#"+pub_div+'_'+slugify(this.feeds[i].title)).append('<div id="'+pub_div+'_foot" class="feed_footer">'+this.feeds[i].footer+'</div>');			  	
				  	}
			  	
		  	}else{
			  	this.feeds[i].article_count = this.article_count;		  	
			  	this.feeds[i].renderFeed();		  	
		  	}
/*		  	console.log(this);
		  	console.log(this.footer);
		  	if(this.footer){
				$j("#"+pub_div).append('<div id="'+pub_div+'_foot" class="feed_footer">'+this.feeds[i].footer+'</div>');			  	
		  	}*/
		  	
		}
	  	if(this.footer && this.parent.length == 0){
		$j("#"+pub_div+"").append('<div id="'+pub_div+'_foot" class="feed_footer">'+this.footer+'</div>');			  	
	  	}
	  
	  
		if(this.output == "tabs"){
	  		$j("#"+pub_div+"").tabs();
		}
	}
		
}


function Feed(title,url,type,parent){
	this.title = title;
	this.title_url = "";
	this.url = url;
	this.type = type;
	this.parent = parent;
	this.streaming_url = "";/* for stations with a live stream */
	this.data = '';
	this.pub_div = '';
	this.article_count = 5;
	this.display = 'title';
	this.output = "text/image";
	this.title_class = "";
	this.title_style = "";
	this.show_title = true;
	this.source_url = "";
	this.source_name = "";
	this.streaming_icon = "";
	this.box_class = "";
	this.item_class = "";
	this.read_more_text = "Read More";
	this.read_more_class = "read-more";
	this.default_image = "";
	this.media_override = new Array(); //Array of overrides one override is added as new Array(media(image|video),find_string,replace_string)
	
	this.loadFeed = function(){
		console.log("Loading feed: "+ this.title);
		if(this.type == "JSON"){
		 return $j.ajax({
			type: "GET",
			url: this.url+'?json=1',
			dataType: "jsonp",
			cache: false
		  });
	  }else{
		 return $j.ajax({
			type: "GET",
			url: '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+this.article_count+'&callback=?&q=' + encodeURIComponent(this.url),
			dataType: "jsonp",
			cache: false
		  });
		  
	  }		
	}
	
	this.copy = function(){
		twin_feed = new Feed(this.title,this.url,this.type,this.parent);
		twin_feed.source_url = this.source_url;
		twin_feed.source_name = this.source_name;
		twin_feed.streaming_url = this.streaming_url;
		twin_feed.streaming_icon = this.streaming_icon;
		twin_feed.box_class = this.box_class;
		twin_feed.item_class = this.item_class;
		twin_feed.read_more_text = this.read_more_text;
		twin_feed.default_image = this.default_image;
		
		return twin_feed;
	}
	
	this.renderFeed = function(data){
		var feed = this;
		this.loadFeed().done(function (result){
			feed.data = result;
			//console.log(feed);
			if(feed.parent){
				var pub_div = feed.parent.pub_div;				
//				var count = feed.parent.article_count;
				var count = feed.article_count;
				var display = feed.parent.display;
			}else{
				var pub_div = feed.pub_div;				
				var count = feed.article_count;
				var display = feed.display;
			}
	
			var output_div = pub_div+"_"+slugify(feed.title);
			if($j('#'+output_div).length <= 0){
				$j('#'+pub_div).append('<div id="'+output_div+'" class="'+feed.box_class+'" ></div>')
			}
			
			if(feed.type == 'JSON'){
				  if(feed.data.post){
				  	//console.log('Single Post');
					  this_feed = new Array();
					  this_feed.push(data.post);
				  }else if (feed.data.posts){
					  this_feed = feed.data.posts;
				  }
				  				  
				  if(count == -1){count = this_feed.length;}
				  if(feed.show_title == true){
				  	if(feed.title_url.length > 0){
					  	this_title = '<a href="'+feed.title_url+'" target="_blank">'+feed.title+'</a>';
				  	}else{
					  	this_title = feed.title;
				  	}
				  	$j("#"+output_div).parent().prepend('<h2 class="'+feed.title_class+'" style="'+feed.title_style+'">'+this_title+'</h2>');
				  }
				  
				  for(var i = 0;i < count; i++){
					  if(display == "excerpt"){
				  		
				  		if(i == (count - 1)){
							last = "_last";
						}else{
							last = "";
						}

				  		$j("#"+output_div).append('<div id="'+output_div+'_'+i+'" class="clearfix rss_excerpt'+last+' '+feed.item_class+'"></div>');

				  		
				  		if(this_feed[i].custom_fields.bento_image && this_feed[i].custom_fields.bento_image.length){
					  		$j('#'+output_div+'_'+i).append('<div class="json_thmb"><img src="'+this_feed[i].custom_fields.bento_image+'"/></div>');
				  		}else if(this_feed[i].attachments && this_feed[i].attachments.length > 0){
							  img_src = this_feed[i].attachments[0].url.split('.');
							  img_src_path = "";
							  for(var j=0;j < img_src.length;j++){
							  	if(j == img_src.length - 1){
								  img_src_path = img_src_path + img_src[j];
							  	}else if(j == img_src.length - 2){
								  img_src_path = img_src_path + img_src[j] + "-88x88.";			  	
							  	} else {
								  img_src_path = img_src_path + img_src[j] + ".";			  	
							  	}
							  }
					  		$j('#'+output_div+'_'+i).append('<div class="json_thmb"><img src="'+img_src_path+'" /></div>');
						}else{
								//attempt to find image in content
								var temp = document.createElement('div');
								temp.innerHTML = this_feed[i].content;
								var img = $j(temp).find('img').first().attr('src');
								if(img && img.indexOf('facebook.png') == -1){
								$j("#"+output_div+'_'+i).append('<div class="json_thmb"><img src="'+img+'"/></div>');									
								}else if(feed.default_image){
								$j("#"+output_div+'_'+i).append('<div class="json_thmb"><img src="'+feed.default_image+'"/></div>');
								}
				  		}
				  		
				  		if(this_feed[i].custom_fields.bento_excerpt){
					  		this_excerpt = this_feed[i].custom_fields.bento_excerpt[0];
				  		}else{
					  		this_excerpt = getExcerpt(this_feed[i].excerpt,200);
				  		}
				  		
				  		if(feed.source_name && feed.source_url){
					  		source = '<h3><a href="'+feed.source_url+'" target="_blank">'+feed.source_name+'</a></h3>';
				  		}else if (feed.source_name){
					  		source = '<h3>'+feed.source_name+'</h3>';
				  		}else{
					  		source = '';
				  		}
				  		
				  		$j('#'+output_div+'_'+i).append(source+'<h2 id="'+output_div+'_'+i+'_title" class="rss_title"><a href="'+this_feed[i].url+'">'+this_feed[i].title+'</a></h2><p id="'+output_div+'_'+i+'_excerpt">'+this_excerpt+'</p>');
				  		
				  		if(feed.read_more_text != ""){
					  		$j('#'+output_div+'_'+i).append('<div class="'+feed.read_more_class+'"><a href="'+this_feed[i].url+'">'+feed.read_more_text+'</a></div>');
				  		}
				  		
				  		
					  }else{
					  	//console.log("JSON Titles")
							$j("#"+output_div).append('<li><a id="'+output_div+'_'+i+'" href="'+this_feed[i].url+'" target="_blank" onmouseover="marquis(\''+output_div+'_'+i+'\')" onmouseout="marquis(\''+output_div+'_'+i+'\',\'reset\')">'+this_feed[i].title+'</a></li>');
							if(feed.source_name != ""){
								$j("#"+output_div).append('<span style="float:left">'+feed.source_title+'</span>');
								
							}
					  }
				}



			}else{
				articles = feed.data.responseData.feed.entries;
				console.log(articles);
				if(count == -1 || count > articles.length){count = articles.length;}
					if(display == "video-grid"){
						if(feed.show_title == true){
							if(feed.title_url.length > 0){
								this_title = '<a href="'+feed.title_url+'" target="_blank">'+feed.title+'</a>';
							}else{
								this_title = feed.title;
							}
							$j("#"+output_div).parent().prepend('<h2 class="'+feed.title_class+'" style="'+feed.title_style+'">'+this_title+'</h2>');
						}

						for(var j = 0;j < count; j++){
							$j("#"+output_div).append('<div id="'+output_div+'_'+j+'" class="clearfix rss_video '+feed.item_class+'"></div>');							
							if(articles[j].mediaGroups && articles[j].mediaGroups.length > 0){
								found=0;
								for(var k = 0 ; k < articles[j].mediaGroups[0].contents.length; k++){
									if(articles[j].mediaGroups[0].contents[k].medium == 'video' && found == 0){
										this_vid = articles[j].mediaGroups[0].contents[k].url;
										if(feed.media_override.length > 0){
											console.log('override present');
											for(var m = 0 ; m < feed.media_override.length; m++){
												console.log(m);
												if(feed.media_override[m][0] == 'video' && this_vid.indexOf(feed.media_override[m][1]) >= 0 ){
													console.log('string found');
													this_vid = this_vid.replace(feed.media_override[m][1],feed.media_override[m][2]);
													console.log(this_vid);
												}
											}
											
											
										}
										$j("#"+output_div+'_'+j).append('<div class="rss_vid"><iframe width="220" height="124" src="'+this_vid+'?controls=0&showinfo=0" frameborder="0" allowfullscreen></iframe></div>');
										found=1;
									}
								}
								
							}
							$j("#"+output_div+'_'+j).append('<h3 class="rss_vid_title"><a href="'+articles[j].link+'" target="_blank">'+articles[j].title+'</a></h3><p>'+getExcerpt(articles[j].content,1)+'</p>');

						}


						
					}else if(display == "excerpt"){
						//console.log('RSS Excerpt');
						if(feed.show_title == true){
							if(feed.title_url.length > 0){
								this_title = '<a href="'+feed.title_url+'" target="_blank">'+feed.title+'</a>';
							}else{
								this_title = feed.title;
							}
							$j("#"+output_div).parent().prepend('<h2 class="'+feed.title_class+'" style="'+feed.title_style+'">'+this_title+'</h2>');
						}

						for(var j = 0;j < count; j++){
							if(j == (count - 1)){
								last = "_last";
							}else{
								last = "";
							}
							$j("#"+output_div).append('<div id="'+output_div+'_'+j+'" class="clearfix rss_excerpt'+last+' '+feed.item_class+'"></div>');
							if(articles[j].mediaGroups && articles[j].mediaGroups.length > 0){
								for(var k = 0 ; k < articles[j].mediaGroups[0].contents.length; k++){
									if(articles[j].mediaGroups[0].contents[k].medium != 'video'){
										this_thmb = articles[j].mediaGroups[0].contents[k].url;
										$j("#"+output_div+'_'+j).append('<div class="rss_thmb"><img src="'+this_thmb+'"/></div>');										
									}
								}
								
							}else{
								//attempt to find image in content
								var temp = document.createElement('div');
								temp.innerHTML = articles[j].content;
								var img = $j(temp).find('img').first().attr('src');
								if(img){
								$j("#"+output_div+'_'+j).append('<div class="rss_thmb"><img src="'+img+'"/></div>');									
								}else if(feed.default_image){
								$j("#"+output_div+'_'+j).append('<div class="rss_thmb"><img src="'+feed.default_image+'"/></div>');																		
									
								}
							}
							
							
					  		if(feed.source_name && feed.source_url){
						  		source = '<h3><a href="'+feed.source_url+'" target="_blank">'+feed.source_name+'</a></h3>';
					  		}else if (feed.source_name){
						  		source = '<h3>'+feed.source_name+'</h3>';
					  		}else{
						  		source = '';
					  		}

							
							
							$j("#"+output_div+'_'+j).append(source+'<h2 class="rss_title"><a href="'+articles[j].link+'" target="_blank">'+articles[j].title+'</a></h2><p>'+getExcerpt(articles[j].content,4)+'</p>');
					  		if(feed.read_more_text != ""){
						  		$j('#'+output_div+'_'+j).append('<div class="'+feed.read_more_class+'"><a href="'+articles[j].link+'">'+feed.read_more_text+'</a></div>');
						  	}
						}
					}else{
					//console.log('RSS Titles ');
//						if((!feed.parent || (feed.parent && feed.parent.output != "tabs")) && feed.show_title == true){//if not part of tabular group output, generate a title
						if(!feed.parent && feed.show_title == true){//if not part of tabular group output, generate a title
							$j("#"+output_div).append('<h2 class="'+feed.title_class+'" style="'+feed.title_style+'">'+feed.title+'</h2>');
						}
					
						for(var j = 0;j < count; j++){
							source="";
							li_w = "100%";
							if(feed.source_name){
								source = '<div style="width:20%;float:right;white-space:nowrap;padding:0;text-align:right">';
								if(feed.streaming_url){
									source = source + '<a href="'+feed.streaming_url+'" target="_blank" class="streaming_image"><img src="'+feed.streaming_icon+'" height="12" width="11" alt="Listen Now"></a>';
								}
								if(feed.source_url){
									source = source + '<a href="'+feed.source_url+'" target="_blank">';
								}
								source = source+feed.source_name;								
								if(feed.source_url){
									source = source + '</a>';
								}
								source = source+'</div>';
								li_w = "80%";
							}
							$j("#"+output_div).append('<div class="clearfix" style="width:100%;">'+source+'<li style="float:left;width:'+li_w+';"><a id="'+output_div+'_'+j+'" href="'+articles[j].link+'" target="_blank" onmouseover="marquis(\''+output_div+'_'+j+'\')" onmouseout="marquis(\''+output_div+'_'+j+'\',\'reset\')">'+articles[j].title+'</a></li></div>');
						}
					}
				
			}
			
			
			if(feed.parent && feed.parent.output == "tabs"){
			  $j("#"+pub_div+"").tabs("refresh");
			  $j("#"+pub_div+"").tabs("option","active",0);
	  		}	

			
		});
	}

}

function slugify(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

function marquis(obj,reset){
	if(reset){
		$j('#'+obj).css('left',0);		
	}else{
		obj_width = $j('#'+obj).width();
		parent_width = $j('#'+obj).parent().width();
		new_left = parent_width - obj_width - 15;
		if(new_left < 0){
			speed = -new_left/20;
			$j('#'+obj).css({
					'-webkit-transition': 'left '+speed+'s ease',
					'-moz-transition': 'left '+speed+'s ease',
					'-o-transition': 'left '+speed+'s ease',
					'transition': 'left '+speed+'s ease',
			});
			$j('#'+obj).css('left',new_left);
		}
	}
}

function getExcerpt(content, count){
	//strip HTML tags
	var new_content = content.replace(/(<([^>]+)>)/ig,"");
	//remove URLs
	var new_content = new_content.replace(/http:[^\s]*/ig,"");
	
	sentences = new_content.replace(/([.?!])\s*(?=[A-Z])/, "$1|").split("|")
	
	//get first *count* sentences
	return_content = "";
	
	if(sentences.length < count){count = sentences.length}
	
	for(var i = 0 ; i < count; i++){
		return_content = return_content + sentences[i];
	}
	
	
//	var new_content = new_content.substring(0, count);
	
//	return new_content;
	return return_content;
}


function wellCrap(){
  console.log("An error occurred while retrieving JSON.");
}

