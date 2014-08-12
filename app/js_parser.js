var cheerio = require('cheerio');
var q = require('q');
var md = require('html-md');
var Map = require('hashmap').HashMap;

exports.processReferences = function(docset, url, html){
	return q.fcall(processReferences, docset, url, html);
}

function processReferences(docset,uri,html){
	var $ = cheerio.load(html);
	var references = [];
	var links = new Map();
	var parent = null;
	var name = $('h1');
	var content = $('article');
	var type =  resolveType(name.text(), uri, $);
	if(name.length>0 && content.length>0){
		var ref=createRef(docset,name.text(), type, $.html(name)+content.html(), getSlashUrl(docset, $('nav.crumbs'),$));

		references.push(ref);	
		links.set(uri, ref.uri);
	}else{
		console.log(uri+" not processed");
	}
	return {'references':references, 'links':links};
};

function createRef(docset,name, type, content, uri){
	var ref = {"reference":name,
				"docset": docset,
				"uri": uri,
				"type": type};

	ref.parent = getParentSlashUrl(uri);	
	ref.content = content===undefined?undefined:md(content);

	return ref;
};

function getSlashUrl(docset, data, $){
	var lis = data.find('li');
	var url='';

	for(var i=lis.length-1;$(lis[i]).text().indexOf(docset)==-1;i--){

		url = '/' + $(lis[i]).text() + url;
	}

	return '/'+docset.toLowerCase()+url.toLowerCase();
};

function getParentSlashUrl(child_url){
	var parent_url='';
	if(child_url.split('/').length>3){
		parent_url = child_url.substring(0,child_url.lastIndexOf('/'));
	}

	return parent_url;
};

function resolveType(name, uri, $){
	var me  = $('#quick-links').find('a[href="'+uri+'"]');
	if(me.length>0){
		var me_element=$(me);
		var type=me.closest('ol').prev('a').text();
		
		if(type==='Methods'){
			return 'method';
		}else if(type==='Properties'){
			return 'property';
		}else if(type==='Standard built-in objects'){
			if(name.indexOf('(')>-1)
				return 'function';
			return 'object';
		}else{
			var splitted_uri = uri.split('/');
			var parent = splitted_uri[splitted_uri.length-2]

			if(parent==='Global_Objects'){
				return 'class';
			}else if(parent === 'Statements'){
				return 'statement';
			}else if(parent === 'Operators'){
				return 'expression';
			}
		}
	}
	return undefined;
};