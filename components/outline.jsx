/** @jsx React.DOM */
var React = require('react');
var Link = require('react-router').Link;
var Reference = require('../public/js/WebClient/Reference.js');

var Outline = React.createClass({
  self: this,
  selecteduri: '',
  getInitialState: function() {
	self = this;
	return {data: []};
  },

  componentWillReceiveProps: function (newProps) {
	var refuri = newProps.params.splat;
	store.get('parent', {'refuri': refuri})
    .then(function(parent){
	//Reference.get_parent(refuri, function(parent) {
		if(parent.uri==undefined){
			self.setState({data: [{reference: 'test',uri: '/uri'},{reference: 'test2',uri: '/uri2'}]});
			return false;
		}
		store.get('branch', {'uri': parent.uri})
		.then(function(data){
		//Reference.get_branch(parent.uri,function(data){
			data.unshift(parent);
			self.selecteduri = refuri;
			self.setState({data: data});
		});
	});
  },

  render: function() {
	var rows = [];
	var symbols = {};
	$.each(this.state.data, function(key,item){
		
		if (!symbols[item.type]) {
			symbols[item.type] = [];
		}
		item.uri = item.uri.substr(1);
		if(item.uri==self.selecteduri){
		symbols[item.type].push(
        <li className="selected-item">
			{item.reference}
        </li>
		);
		}else{
		symbols[item.type].push(
        <li>
			<Link to='result' params={{splat: item.uri}}>{item.reference}</Link><br/>
        </li>
							   );
		}
	});
	$.each(symbols, function(symbol,items){
        rows.push(<li><img src={'/img/type-' + symbol + '.png'} title={symbol} className="ry-type-source"/>{symbol}<ul>{items}</ul></li>);
	});
	return(
      <div id="outline-view" className="half-height">
          <div className="component-header"><a>Outline</a></div>
          <div className="component-content">
              <ul className="outline-list">
                  {rows}
              </ul>
          </div>
      </div>);
  }
});

module.exports = Outline;
