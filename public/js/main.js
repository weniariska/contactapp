const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    document.getElementById('flash-msg').append(wrapper)
}

const flashError = document.getElementById('alert_error')
if (flashError) {
    appendAlert(flashError.value, 'danger')
}

const flashSuccess = document.getElementById('alert_success')
if (flashSuccess) {
    appendAlert(flashSuccess.value, 'success')
}