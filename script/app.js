function handleFloatingLabel() {
    let input = document.querySelector('.js-floating-input'),
        label = document.querySelector('.js-floating-label');

    input.addEventListener('blur', function () {
        console.log(event);
        if (input.value) {
            label.classList.add('is-floating');
        } else {
            label.classList.remove('is-floating');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');
    handleFloatingLabel();
});