var page = document.getElementById("content");

showWelcomePage();

function showWelcomePage() {
  var print = "Välkommen till Sveriges Förenade Filmstudios!";
  page.insertAdjacentHTML("afterbegin", "<center><div>" + print);
}

// To Login
var login = document.getElementById("login");
var isLoggedIn = false;

login.addEventListener("click", function () {
  if (localStorage.getItem("userId") !== null) {
    showLogInPage();
    loginUser();
  } else {
    isLoggedIn = true;
    page.innerHTML = "Hej du / Logga ut";
  }
});

function showLogInPage() {
  page.innerHTML = "";
  page.insertAdjacentHTML(
    "afterbegin",
    '<center>Användarnamn: <input type="text" id="user"> Lösenord: <input type="password" id="password"> <button id="spara">Logga in</button></center>'
  );
}

function loginUser() {
  var loginButton = document.getElementById("spara");

  loginButton.addEventListener("click", function () {
    var getUser = document.getElementById("user").value;
    var getPass = document.getElementById("password").value;

    fetch("https://localhost:5001/api/filmstudio")
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        for (i = 0; i < json.length; i++) {
          if (
            getUser == json[i].name &&
            getPass == json[i].password &&
            json[i].verified == true
          ) {
            console.log("Ja det stämmer");
            localStorage.setItem("userId", i);
            studioId = json[i].id;
            isLoggedIn = true;
            welcomeStudio();
          }
        }
        if (localStorage.getItem("userId") !== null) {
          showWelcomePage();
        } else {
          showErrorPage();
        }
      });
  });
}

function showErrorPage() {
  page.insertAdjacentHTML(
    "afterbegin",
    "<div>Har du glömt ditt lösenord?</div>"
  );
}

function welcomeStudio() {
  console.log(localStorage.getItem("userId"));
  page.innerHTML = "Nu är du inloggad och kan låna filmer om du vill!";
}

// To add a new studio
var newlogin = document.getElementById("newlogin");

newlogin.addEventListener("click", function () {
  addItem();
});

var addlogin = document.getElementById("content");

function addItem(Name, Password) {
  page.innerHTML = "";
  addlogin.insertAdjacentHTML(
    "afterbegin",
    '<center>Välj användarnamn: <input type="text" id="user"> Välj lösenord: <input type="password" id="password"> <button id="spara">Spara</button></center>'
  );

  var data = { Name: Name, Password: Password };
  newlogin = document.getElementById("newlogin").value;

  fetch("https://localhost:5001/api/filmstudio", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("success:" + data);
    })
    .catch((error) => {
      console.error("error", error);
    });
}
//-------------------------------------------------------------------------------
// To print a list of films and trivia

var movies = document.getElementById("movies");

movies.addEventListener("click", function () {
  printfilmList();
});

var filmList = document.getElementById("filmlist");

function printfilmList() {
  page.innerHTML = "";
  fetch("https://localhost:5001/api/film")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      filmList.innerHTML = "";
        for (i = 0; i < json.length; i++) {
        console.log(json[i].name);
        filmList.insertAdjacentHTML(
          "beforeend",
          '<div class = "movieposter"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/><span id = "' +
            json[i].id +
            '" >' +
            json[i].name +
            "</span></div>"
        );
      }
      filmList.addEventListener("click", function(e) {
        console.log(e.target.id);
        showMovieInfoPage(e.target.id);
      });
    });
}

function showMovieInfoPage(movieId) {
  fetch("https://localhost:5001/api/film/" + movieId)
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (json) {
      console.log("showMovieInfoPage", json);
      filmList.innerHTML = "";
      filmList.insertAdjacentHTML(
        "beforeend",
        '<div class = "movieposter"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/><span id = "' +
          json.id +
          '" >' +
          json.name +
          '</span><div><button onclick = "rentAMovie(' +
          json.id +
          ')">Hyr film</button><button onclick = "addTrivia(' +
          json.id +
          ')">Skriv trivia</button></div></div>'
      );
      printtriviaList(json.id);
    });
}

var triviaList = document.getElementById("trivialist");

function printtriviaList(movieId) {
  triviaList.innerHTML = "";
  console.log("Visa trivia", movieId);

  fetch("https://localhost:5001/api/filmTrivia/" + movieId)
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      triviaList.insertAdjacentHTML(
        "beforeend",
        '<div class = "movieposter"><span>' + json.trivia + "</span></div>"
      );
    });
}

// Method to rent and return (delete) a movie and post new trivia
var rentMovie = document.getElementById("rentAMovie");

function rentAMovie(movieId, userId) {
  triviaList.innerHTML = "";
  console.log("hyr film", movieId);
  console.log("Inloggad", localStorage.getItem("userId"));

  
  var data = { FilmId: movieId, FilmstudioId: userId };

  fetch("https://localhost:5001/api/rentedFilm/" + movieId, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("success:", data);
      })
      .catch((error) => {
        console.error("error", error);
      });
    }

function returnMovie(id) {
  console.log("Returnera", id);

  fetch("https://localhost:5001/api/rentedFilm/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((response) => rentedFilm());
}

function addTrivia(movieid, text) {
  page.innerHTML = "";
  page.insertAdjacentHTML(
    "beforeend",
    `<div class="form" id="SaveTrivia">  <textarea id="triviaTextarea" rows="4" cols="50">Skriv din text här...</textarea><button onclick="SaveTrivia(${movieId})" type="submit" class="btn" id="btnSaveTrivia">Spara</button></div>`
  );

  var data = { FilmId: movieid, Trivia: text };
  newTrivia = document.getElementById("SaveTrivia").value;

  fetch("https://localhost:5001/api/filmtrivia" + id, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("success:" + data);
    })
    .catch((error) => {
      console.error("error", error);
    });
}

//-------------------------------------------------------------------------------
// Contact info page
var page = document.getElementById("content");
var contact = document.getElementById("contact");

contact.addEventListener("click", function () {
  printContactInfo();
});

function printContactInfo() {
  page.innerHTML = "";
  page.insertAdjacentHTML(
    "afterbegin",
    '<center><div class = "contact">Kontakta oss<br/>SFF@sverige.se</div></center>'
  );
}
