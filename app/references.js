var filters = require('../app/filters');
var util = require('util');
var db = require('./db');

function References(){
    this._query = db('refs');
} 

References.prototype.filter = function(field, operator, value) {
    if (operator == filters.operators.EQUALS) {
        this._query = this._query.where(field, value);
    }
    if (operator == filters.operators.IN && value) {
        this._query = this._query.whereIn(field, value);
    }
    if (operator == filters.operators.CONTAINS && value){
        this._query = this._query.where(field, 'ilike', '%'+value+'%');
    }
    return this;
};

References.prototype.docsetfilter = function(columns){
    this._query = this._query.innerJoin('docsets', 'refs.docset', filters.operators.EQUALS , 'docsets.docset');
    this._query = this._query.where('docsets.state', filters.operators.EQUALS , 'active')
    return this;
}


References.prototype.select = function(columns){
    this._query = this._query.select(columns);
    return this;
}

References.prototype.distinct = function(column){
    this._query = this._query.distinct(column);
    return this;
}

References.prototype.execute = function() {
    return this._query.then(
        function(rows){
            this._query = db('refs');
            return rows;
        }.bind(this),
        function(err){
            return err;
        });
};

module.exports = References;
