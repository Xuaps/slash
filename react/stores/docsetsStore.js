var Reflux = require('reflux');
var TreeviewActions = require('../actions/treeviewActions.js');
var data = require('../utils/data.js');
var settings = require('../utils/settings.js');

var docsetsStore = Reflux.createStore({

    init: function() {
        this.docsets = [];
        this.flatten_elements =[];
        this.listenTo(TreeviewActions.load, this.onGetActiveDocsets);
        this.listenTo(TreeviewActions.selectDocset, this.onGetTypes);
        this.listenTo(TreeviewActions.selectType, this.onSearchReferences);
        this.listenTo(TreeviewActions.selectReference, this.onMarkReference);
    },

    onGetActiveDocsets: function(){
        this.docsets = JSON.parse(JSON.stringify(settings.getWorkingDocsets()));
        this.trigger(this.docsets);
    },

    onGetTypes: function(docset){
        var active_docset = this.docsets
            .filter(function(doc){ return doc.name === docset; })[0];
        if(active_docset.types){
            this.trigger(this.docsets);
            return;
        }
        data.getTypes(docset).then(function(response){ 
            active_docset.types = response['_embedded']['rl:types']; 
           this.trigger(this.docsets);
        }.bind(this)).fail(this.onFail);
    },

    onSearchReferences: function(docset, type_name, page){
        var node = this.docsets
            .filter(function(doc){ return doc.name === docset;})[0]
            .types.filter(function(type){ return type.name === type_name; })[0];
        if(node.references && !page){
            this.trigger(this.docsets);
            return;
        }
        
        page = page || 1;
	    data.getReferences(docset, type_name, page).then(function (response){
            node.references = node.references || [];
            node.references = node.references.concat(response['_embedded']['rl:references']);
            this.flatten_elements = this.flatten_elements.concat(node.references);
            this.trigger(this.docsets);    

            return response['_links'].next?this.onSearchReferences(docset, type_name, page+1):undefined;
        }.bind(this)).fail(this.onFail);
    },

    onMarkReference: function(ref){
        this.flatten_elements.forEach(function(elem){
            elem.marked = (elem.uri === ref.uri);
        });
        this.trigger(this.docsets);
    },

    onFail: function(error){
        this.trigger(new Error(error));
    }
});

module.exports = docsetsStore;
