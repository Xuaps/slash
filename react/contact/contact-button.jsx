var React = require('react')
var Reflux = require('reflux');
var store = require('./store.js');
var actions = require('./actions.js');

var Contact = React.createClass({
    mixins: [Reflux.connect(store, 'status')],
    getInitialState: function(){
       return {status:{}};
    },


    render: function(){
        if(this.state.status.sent){
          var statusinfo = (<div className="alert alert-dismissible messageok">
                                <button type="button" className="close" data-dismiss="alert">×</button>
                                <strong>Good!</strong> Message sent successfully.<br /><em>you will recieve an answer as soon as possible.</em>
                            </div>);
        }else{
          var statusinfo = (<span></span>);
        }
        if(this.state.status.isAuthenticated){
            var inputName = (<input type="text" disabled="disabled" className="form-control focusable" ref="namebox" id="inputName" name="txtname"/>);
            var inputEmail = (<input type="text" disabled="disabled" className="form-control focusable" ref="emailbox" id="inputEmail" name="txtemail"/>);
        }else{
            var inputName = (<input type="text" className="form-control focusable" ref="namebox" id="inputName" name="txtname" placeholder="Name"/>);
            var inputEmail = (<input type="text" className="form-control focusable" ref="emailbox" id="inputEmail" name="txtemail" placeholder="Email"/>);
        }
        var contactinfo =  (<fieldset>
                              <div className="form-group">
                                 <label htmlFor="txtname" className="control-label">Name:</label>
                                 <div>{inputName}</div>
                              </div>
                              <div className="form-group">
                                 <label htmlFor="txtemail" className="control-label">Email:</label>
                                 <div>{inputEmail}</div>
                              </div>
                              <div className="form-group">
                                 <label htmlFor="txtmessage" className="control-label">Message:</label>
                                 <div><textarea className="form-control focusable" rows="3" ref="messagebox" id="txtmessage" placeholder="Message"></textarea></div>
                              </div>
                           </fieldset>);
        return (<div>
                    <button type="button" className="btn btn-default navbar-btn" onClick={this.reDraw} data-toggle="modal" data-backdrop="false" data-target="#myModal">
                      <span className="glyphicon glyphicon-envelope" aria-hidden="true"></span>
                    </button>
                    <div className="modal fade" ref="MyModal" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="well">
                          <div className="modal-header">
                            {statusinfo}
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">Contact us!</h4>
                          </div>
                          <form name="frmcontact">
                          <div className="modal-body">
                            {contactinfo}
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" onClick={this.onClickHandler} className="btn btn-primary">Send Message</button>
                          </div>
                          </form>
                        </div>
                      </div>
                    </div>
                </div>);
    },

    reDraw: function(){
        actions.init();
    },

    onClickHandler: function(){
        var name_box = this.refs.namebox.getDOMNode('#txtname');
        var email_box = this.refs.emailbox.getDOMNode('#txtemail');
        var message_box = this.refs.messagebox.getDOMNode('#txtmessage');
        var name = name_box.value;
        var email = email_box.value;
        var content = message_box.value;
        actions.sendMail(name, email, content);
        var self = this;
        setTimeout(function(){self.closeModal();},2000);
    },
    closeModal: function(){
        var name_box = this.refs.namebox.getDOMNode('#txtname');
        var email_box = this.refs.emailbox.getDOMNode('#txtemail');
        var message_box = this.refs.messagebox.getDOMNode('#txtmessage');
        name_box.value = '';
        email_box.value = '';
        message_box.value = '';      
        $(this.refs.MyModal.getDOMNode('#myModal')).modal('toggle');
    }
});

module.exports = Contact;
