var pieces = posts.split(/[\s,-]+/);
for (var i = 0; i < pieces.length; i++) {
	(function(i) { // AJAX is asynchrone
		var rep = pieces[i];
		var c = rep.search("http://");
		var d = rep.search("https://");
		var tosend = "{ url: '" + rep + "' }";
		tosend = JSON.stringify(eval("(" + tosend + ")"));
		if(c == 0 || d == 0){
			$.ajax({
				url: '/geturl',
				data: tosend,
				type: 'POST',
				dataType:'json',
				contentType: "application/json",
				jsonpCallback: 'callback',
				success: function (data) {
					posts = posts.replace(rep + " ", data);
					console.log(posts)
					$("#result").html(posts);
				}
			});
		}
	})(i);
	//$("#result").html(posts);
};