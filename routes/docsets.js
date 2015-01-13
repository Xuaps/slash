var slash = require('../app/slash');
var JSON = require('../app/JSON');

exports.search = function(req, res) {
    slash.search(req.query).then(function(references) {
        res.send(references);
    });
};

exports.get_types = function(req, res) {
    slash.get_types(req.params.uri).then(function(types) {
		list = []
		for(var i=0;i<types.length;i++){
			type = types[i];
			list.push({name: type, path: type.toLowerCase()});
		}
        res.send(list);
    });
};

exports.branch = function(req, res) {
	if(req.params.uri[0]!='/'){
		uri = '/' + req.params.uri;
	}
    if (uri == null) {
        res.send([]);
    } else {
        slash.branch(uri,1).then(function(references){
			list = JSON.Flatten(references);
			res.send(list);
		});
    }
};

//Will replace get_docsets soon.

exports.get_docsets = function(req, res) {
    slash.get_docsetsbydate(req.query).then(function(docsets) {
		list = []
		for(var i=0;i<docsets.length;i++){
			docset = docsets[i];
			list.push({name: docset.docset
, default_uri: docset.default_uri, path: docset.docset.toLowerCase(), date: docset.update_date, label: docset.label, active: docset.active});
		}
        res.send(list);
    });
};


