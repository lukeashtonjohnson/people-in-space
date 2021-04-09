const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.querySelector('.people-in-space');
const button = document.querySelector('button');


function getProfiles(json) {
  const profiles = json.people.map( person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
           .then( response => response.json())
           .then( profile => {
                  return { ...profile, craft };
           })
           .catch( error => console.log('Error fetching Wiki',error));
  });
  return Promise.all(profiles);
}

function generateHTML(data) {
  data.map(person => {
    if (typeof person.thumbnail !== 'undefined') {
      const section = document.createElement('section');
        peopleList.appendChild(section);
        section.innerHTML = `
          <img src=${person.thumbnail.source}>
          <span>${person.craft}</span>
          <h2>${person.title}</h2>
          <h3>${person.description}</h3>
          <p>${person.extract}</p>
        `;
    }
    
  });
  
}

button.addEventListener('click', (event) => {
  
  event.target.textContent = "Loading...";
  fetch(astrosUrl)
    .then( response => response.json() )
    .then(getProfiles)
    .then( generateHTML)
    .catch( error => {
      console.log(error);
    })
    .finally( () => event.target.remove() );
  
});