/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  
  // template strings for ${query} -> value 
  let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`); 
  // console.log(response); 

  // map over an array of results
  let shows = response.data.map(result => {
    return {
      id: result.show.id,
      name: result.show.name, 
      summary: result.show.summary,
      image: result.show.image ? result.show.image.medium : 'https://tinyurl.com/tv-missing',
    }
  })
  return shows; 
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <div class="text-center">
              <button class="btn btn-success" id="btn-search">Episodes</button>
             </div>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`); 

  // TODO: return array-of-episode-info, as described in docstring above

  // map over an array of results
  let episodes = response.data.map(episode => {
    return {
      id: episode.id, 
      name: episode.name, 
      season: episode.season, 
      number: episode.number, 
    }
  })
  return episodes; 
}

/** Populate episodes list: 
 *  - given list of episodes add episodes to DOM 
 */

function populateEpisodes(episodes) {
  const episodeList = $('#episodes-list'); 
  episodeList.empty(); 

  // for loop
  for(let episode of episodes) {
    let item = $(
      // episode (season #, episode #) 
      `<li>${episode.name}(season ${episode.season}, episode ${episode.number})</li>`
    )
    episodeList.append(item); 
  }
  $('#episodes-area').show(); 
}

