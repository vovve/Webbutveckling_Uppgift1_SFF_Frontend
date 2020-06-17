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
  if (localStorage.getItem("userId") === null) {
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
  filmList.innerHTML = "";
  trivialist.innerHTML = "";
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
          '<div class = "movieposter" id="' + json[i].id + '"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/>' +
            json[i].name +
            "</div>"
        );
      }
      filmList.addEventListener("click", function(e) {
        console.log("target", e.target.id);

        // Kollar så att vi har ett target.id innan vi kallar på funktionen så att vi inte skickar iväg ett undefined.
          if (e.target.id !== "") {
            showMovieInfoPage(e.target.id);
          }
      });
    });
}

function showMovieInfoPage(movieId) {

  trivialist.innerHTML = "";

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
  console.log("Visa trivia", movieId);

  trivialist.innerHTML = "";

  // Här skall vi inte skicka in id för vi skall hämta all data, och sedan filtrera den i fronten.
  fetch("https://localhost:5001/api/filmTrivia/")
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {

      // for loop för att loopa igenom trivia listan.
      for (i=0; i<json.length; i++) {

        // Här skulle vi kunna köra en filter funktion för att filtrera arrayn till enbart den trivia som hör till filmen, men jag illustrerar med en IF nu:
        if (json[i].filmId === movieId) {
          trivialist.insertAdjacentHTML(
            "beforeend",
            '<div class = "movieposter"><span>' + json[i].trivia + "</span></div>"
          );
        }
      }
    });
}

// Method to rent and return (delete) a movie and post new trivia
var rentMovie = document.getElementById("rentAMovie");

function rentAMovie(movieId) {
  console.log("hyr film", movieId);
  console.log("Inloggad", localStorage.getItem("userId"));

  var userId = localStorage.getItem("userId");
  
  var data = { FilmId: movieId, FilmstudioId: userId };

  // I denna post behöver vi inte skicka in id, eftersom vi lägger till en ny "rad" i databasen, inte gör något med en befintlig rad som med PUT.
  fetch("https://localhost:5001/api/rentedFilm/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("success:", data);

        // Här anropar jag funktionen för att skriva ut filminfo sidan igen efter att vi har hyrt en film för att "uppdatera" sidan. 
        // Här skulle man även kunna ge någon feedback till användaren i framtiden att en film har hyrts.
        showMovieInfoPage(movieId);
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

function addTrivia(movieid) {
  
  // Du döper den inkommande värdet till funktionen till movieid, men sedan i länken så försökte du skriva ut variabeln movieId = lätt att missa men ställer till med en del problem.

  console.log("addTrivia");

  page.innerHTML = "";
  trivialist.innerHTML = "";
  page.insertAdjacentHTML(
    "beforeend",
    `<div class="form" id="SaveTrivia">  <textarea id="triviaTextarea" rows="4" cols="50">Skriv din text här...</textarea><button onclick="SaveTrivia(${movieid})" type="submit" class="btn" id="btnSaveTrivia">Spara</button></div>`
  );

      // var data = { FilmId: movieid, Trivia: text };
      
      // newTrivia = document.getElementById("SaveTrivia").value;

      // fetch("https://localhost:5001/api/filmtrivia", {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log("success:" + data);
      //   })
      //   .catch((error) => {
      //     console.error("error", error);
      //   });
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
