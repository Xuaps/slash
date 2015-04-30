/** @jsx React.DOM */
var React = require('react');
var Search = require('../search-panel/search.jsx');
var TreeView = require('../docsets-tree/treeview.jsx');
var URI = require ('URIjs');
var Router = require('react-router');
var RouterHandler = Router.RouteHandler;
var Link = Router.Link;

module.exports = React.createClass({
    mixins: [ Router.State, Router.Navigation ],
    getInitialState: function(){
        return {last_search: this.getQuery().ref || ''};
    },

    render: function(){
        return(
                <div>
                    <header>
                        <div className='container'>
                            <div className='row'>
                                <div className="col-xs-5">
                                    <a className="btn btn-default" href="#" onClick={this.activeSideBar}>
                                        <span className="glyphicon glyphicon-menu-hamburger"></span>
                                    </a>
                                    <a href="/" alt="Refly.co">Refly</a>
                                </div>
                                <div className="col-xs-3 col-xs-offset-4 text-right">
                                    <a className="btn btn-default" href="#">
                                        <span className="glyphicon glyphicon-user"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div id="content" className="container">
                        <div className='row row-offcanvas row-offcanvas-left'>
                            <div className="col-sm-3 sidebar-offcanvas">
                                <div className="sidebar-panel">
                                    <Search key="searchcomp" onKeyUpEvent={this.search} onClick={this.navigation} search={this.getQuery().ref}/>
                                    {!this.searchVisible()?<TreeView key="treeviewcomp" onNodeClick={this.navigation} />:''}
                                </div>
                                <div className="footer sidebar-panel">
                                        <ul className="nav nav-pills">
                                            <li><Link to="settings">Settings</Link></li>
                                            <li><Link to="about">About</Link></li>
                                            <li><Link to="/Legal">Legal</Link></li>
                                        </ul>
                                </div>
                            </div>
                            <article className="col-xs-12 col-sm-9">
                                <RouterHandler key="resultviewcomp" onNavigation={this.navigation} params={{docset:this.getParams().docset, uri: this.getParams().splat}}/>
                            </article>
                        </div>                        
                    </div>
                </div>
        );
    },

    activeSideBar: function(){
        $('.row-offcanvas').toggleClass('active');
    },
  
    navigation: function(uri){
        $('.row-offcanvas').toggleClass('active');
        this.transitionTo(uri);
    },
    
    search: function(event){
        this.setState({last_search: event.target.value});
    },
    
    searchVisible: function(){
        return this.state.last_search || this.getQuery().ref;
    }
});
