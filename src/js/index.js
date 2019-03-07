import $ from 'jquery';
import 'bootstrap';
import 'ekko-lightbox';
import '../css/index.scss';


// enable dropdowns
$(document).ready(() => {
    $(".dropdown-toggle").dropdown();
});

$(document).on('click', '[data-toggle="lightbox"]', event => {
    event.preventDefault();
    $(this).ekkoLightbox();
});
