/** @jsx React.DOM */
var React = require('react');
var SearchResultRow = require('./search_result_row.jsx');
var $ = require('jquery-browserify');
var store = require('./store.js');
var Q = require('q');

module.exports = React.createClass({
	
    getInitialState: function() {
        return {results: [], total: 0};
    },
    
    getDefaultProps: function() {
        return {
            search: '',
            message: ""
        };
      },
	
    componentWillMount: function(){
		var search = this.props.search;

		if(search){
			this.loadData(search);
		}
	},

    componentDidMount: function(){
		var search = this.props.search || '';
        this.setFocus('#txtreference', search);
    },

    render: function(){
        var message = '';
        if(this.state.results.length>0){
            message=
                <div id="results" ref='scroll_panel'>
                    <div id="resultlist">
                        {this.state.results}
                    </div>
                </div>
        }else{
            message = <div id="results"><div className="search-message">Reference not found!</div></div>;
        }
        return(
            <div id="search-view" className='full-height' ref='wrap_panel' onScroll={this.askNext}>
                <div className="search-header">
                    <fieldset>
                        <input id="txtreference" ref="searchbox" type="text" className="ry-input-text" name="reference"
                        placeholder="Reference" onKeyUp={this.onKeyUp} />
                        <span className="ry-icon fa-close" onClick={this.emptySearch}></span>
                    </fieldset>
                </div>
				{message}
            </div>
        );
    },
    
    componentDidUpdate: function(prevProps, prevState){
        if(!this.refs.wrap_panel || !this.refs.scroll_panel)
           return;
        var wrap = this.refs.wrap_panel.getDOMNode();
        var scroll = (wrap.scrollHeight - wrap.clientHeight)!==0;

        if(!scroll && !(this.state.page>prevState.page && this.state.total===prevState.total)){
            this.loadNext();
        }
    },
    
    emptySearch: function(){
        this.refs.searchbox.getDOMNode('#txtreference').value='';
        this.props.onKeyUpEvent({target:{value: ''}});
        this.cleanResults();
    },

    cleanResults: function(){
        this.setState({results:[]});
    },

    setFocus: function(input, searchtext){
		this.refs.searchbox.getDOMNode(input).focus();
		this.refs.searchbox.getDOMNode(input).value = searchtext;
	},

    onKeyUp: function(event){
		event.persist();
        this.debouncedKeyUp().then(function () {
            this.props.onKeyUpEvent(event);
            if(!event.target.value){
                this.cleanResults();
            }else{
                this.loadData(event.target.value);
            }
        }.bind(this));
    },

	debouncedKeyUp: function () {
        var deferred = Q.defer();
        var timerId = this.timerId;
        var self = this;
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(function () {
                    deferred.resolve();
                }, 800);
        this.timerId = timerId;
        
        return deferred.promise;
    },

	loadData: function(searchtext, page){

        var page = page || 1;
        store.get('search', {'searchtext': searchtext, 'page': page})
    	.then(function(results){
			references = page===1?[]:this.state.results;
	        results.forEach(function(r){
	            references.push(<SearchResultRow key={'SRR' + r.ref_uri} 
	                reference={r.name} type={r.type} docset={r.docset_name} uri={r.ref_uri}/>)
	        });
			if(references.length>0){
				this.setState({results:references, total: references.length, 'page': page, lastsearch: searchtext});
			}else{
				this.setState({results:references, 'page': page, lastsearh: searchtext});
			}
		}.bind(this));

	},

    loadNext: function(){
        this.loadData(this.state.lastsearch, this.state.page+1);
    },

    askNext: function(e){
       var wrap = this.refs.wrap_panel.getDOMNode();
	   if(wrap.scrollTop + wrap.clientHeight + 5 >= wrap.scrollHeight){
			this.loadNext();
       }
    }
});
