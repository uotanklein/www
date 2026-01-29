
var legalForm = $("#legalForm");

legalForm.submit((event) => {
	$.ajax({
		type: 'post',
		url: '/php/legal_email.php',
		data: legalForm.serialize(),
		success: () => alert('Сообщение успешно отправлено.'),
		error: (jqXHR, textStatus, errorThrown) => {
			var responseText = jqXHR.responseText;
			alert(`Сообщение не было отправлено.${ (responseText && ('\n' + responseText)) || '' }`);
		}
	});

	$('.clear_me').val('');
	event.preventDefault();
});