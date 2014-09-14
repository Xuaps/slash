var LiveSearch = {


	reset: function(){
		var reference = Reference.create({ uri: '/api/get/node.js%20v0.10.29' });
		OutlineView.show(reference);
	},




	bind: function(FIELD){
		$(FIELD).keyup(function() {
			if($(FIELD).val()!=''){
				LiveSearch.validate(FIELD,false);
				LiveSearch.search();
			}else{
				LiveSearch.reset();
			}
		});
	},


	validate: function(FIELD,addOrRemove){
		$(FIELD).toggleClass( 'noresult', addOrRemove );
	},

	search: function(){
		$.ajax({
		    url: '/api/search?reference=' + $(REFERENCE).val(),
		    method: 'get'
		}).done(function(results) {
			if(VIEW == 'LANDINGVIEW'){
				ContentView.show($(URI).val());
			}
			if($(REFERENCE).val().length>1){
				$(document).trigger("LocationChange",[$(REFERENCE).val(), $(REFERENCE).val()]);
			}
			if(results.length==0){
				LiveSearch.validate(FIELD,true);
			}
			ResultList.reset();
			ResultList.show(results);
		});


	}

};