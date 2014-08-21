$(function() {
	$('#PostMessage').after($('#recaptcha_widget_div'));
	$("#PostForm").on('submit', function(event){
		event.preventDefault();

		var messagetext = $("#PostMessage").val();
		var recaptcha_response_field = $("#recaptcha_response_field").val();
		var recaptcha_challenge_field = $("#recaptcha_challenge_field").val();

		var tosend = "{ msg: '" + messagetext + "', recaptcha_response_field: '" + recaptcha_response_field + "', recaptcha_challenge_field: '" + recaptcha_challenge_field + "' }"
		tosend = JSON.stringify(eval("(" + tosend + ")"));
		$.ajax({
			url: '/submit',
			data: tosend,
			type: 'POST',
			dataType:'json',
			contentType: "application/json",
			jsonpCallback: 'callback', // this is not relevant to the POST anymore
			success: function (data) {
				$('#result').html(data);
				$('#result').show('slow');
				$('form').hide('slow');
			},
			error: function (xhr, status, error) {
				console.log('Error: ' + error);
			},
		});
	});
});