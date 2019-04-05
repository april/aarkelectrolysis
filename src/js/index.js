import $ from 'jquery';
import 'bootstrap';
import 'ekko-lightbox';
import '../css/index.scss';

// enable dropdowns
$(document).ready(() => {
  $(".dropdown-toggle").dropdown();
});

$().ready(() => {
  $(document).on('click', '[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });
});