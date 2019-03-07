'use strict';


// Show/hide details for portfolio
$('li.regret-details').hide();
$('.regret-header li').on('click', function () {
  console.log('event.target:', event.target);
  let hiddenDetails = $(event.target).closest('li.regret-header').next('li');
  console.log('thing to show:', hiddenDetails);
  $(hiddenDetails).slideToggle('fast');
});
