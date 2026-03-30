const createCard = (card) => {
  return `
    <div class="col s12 m4">
      <div class="card pink-card">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${card.image}" alt="${card.title}">
        </div>
        <div class="card-content">
          <span class="card-title activator">
            ${card.title}
            <i class="material-icons right">more_vert</i>
          </span>
          <p><a href="${card.link}">Learn More</a></p>
        </div>
        <div class="card-reveal">
          <span class="card-title">
            ${card.title}
            <i class="material-icons right">close</i>
          </span>
          <p>${card.description}</p>
        </div>
      </div>
    </div>
  `;
};

$(document).ready(function(){
  // Initialize modal
  $('.modal').modal(); 

  // Fetch and render cards
  $.get('/api/cards', function (cards) {
    const container = $('#cards-container');
    cards.forEach(card => {
      container.append(createCard(card));
    });
  });

  // Form submission logic
  $('#submitRegister').click(() => {
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    console.log({ username, email, password });
  });
});