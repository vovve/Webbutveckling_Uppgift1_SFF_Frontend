var page = document.getElementById("content");
var login = document.getElementById("login");

login.addEventListener("click", function(){
    showLogInPage();
});
// To Login
function showLogInPage(){
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", 
    '<center>Användarnamn: <input type="text" id="user"> Lösenord: <input type="password" id="password"> <button id="spara">Logga in</button></center>');
    
    var loginButton = document.getElementById("spara");
    
    loginButton.addEventListener("click", function(){
        var getUser = document.getElementById("user").value;
        var getPass = document.getElementById("password").value;
        
        fetch("https://localhost:5001/api/filmstudio")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            for(i=0; i<json.length; i++){
                console.log(getUser, getPass);
                if (getUser == json[i].name && getPass == json[i].password){    
                    console.log("Ja det stämmer")                   
                    localStorage.setItem("userId", i);
                } 
                else{
                    console.log("stämmer inte",json[i].name, json[i].password);
                }            

            }
            if (localStorage.getItem("userId") !== null){
                showWelcomePage();
                }
            else{
                showErrorPage();
                }
        });    
    });
}
function showErrorPage(){
    page.insertAdjacentHTML("afterbegin", "<div>Har du glömt ditt lösenord?</div>");
}
function showWelcomePage(){
    var print = "Välkommen till Sveriges Förenade Filmstudios!"; 
    
    fetch("users.json")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        page.innerHTML = "";
        page.insertAdjacentHTML("afterbegin", "<center><div>" + print);
    });
}

// To add a new studio
var newlogin = document.getElementById("newlogin");

newlogin.addEventListener("click", function(){
    addItem();
});

var addlogin = document.getElementById("content")

function addItem(Name, Password){
    addlogin.insertAdjacentHTML("afterbegin", 
    '<center>Välj användarnamn: <input type="text" id="user"> Välj lösenord: <input type="password" id="password"> <button id="spara">Spara</button></center>');
    
    var data = { Name: Name, Password: Password};
    newlogin = document.getElementById("newlogin").value;
     
    fetch('https://localhost:5001/api/filmstudio',{
        method: 'POST',
        headers:{
            'content-type': 'application/json',
           },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data  =>{
           console.log('success:' + data);
        })
        .catch((error) =>{
           console.error('error', error);
        });  
}
//-------------------------------------------------------------------------------
// To print a list of films and trivia

var movies = document.getElementById("movies");

movies.addEventListener("click", function(){
    printfilmList();
});

var filmList = document.getElementById("filmlist");

function printfilmList(){
    fetch("https://localhost:5001/api/film")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log("printfilmList", json);
        filmList.innerHTML="";
        
        for (i = 0; i < json.length; i++){
            console.log(json[i].name);
            filmList.insertAdjacentHTML("beforeend",
            '<div class = "movieposter"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/><span id = "' + json[i].id + '" >' + json[i].name + '</span></div>');
        }
        filmList.addEventListener("click", function(e){
        console.log(e.target.id);
        showMovieInfoPage(e.target.id)
        })
    });
}

function showMovieInfoPage(movieId){
    fetch("https://localhost:5001/api/film/" + movieId)
    .then(function(response){
        console.log(response);
        return response.json();
    })
    .then(function(json){
        console.log("showMovieInfoPage", json);
        filmList.innerHTML="";
        filmList.insertAdjacentHTML("beforeend",
        '<div class = "movieposter"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/><span id = "' + json.id + '" >' + json.name + '</span><div><button onclick = "rentedFilm(' + json.id + ')">Hyr film</button><button>Skriv trivia</button><button>Lämna tillbaka film</button></div></div>');            printtriviaList(json.id);
    });
}

var triviaList = document.getElementById("trivialist");

function printtriviaList(movieId){
    console.log("Visa trivia", movieId);

    fetch("https://localhost:5001/api/filmTrivia")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log("printtriviaList", json);
        
        for (i=0; i < json.length; i++){
            if(movieId == json[i].filmId){
                console.log(json[i].trivia);
                filmList.insertAdjacentHTML("beforeend", 
                '<div class = "movieposter"><span>' + json[i].trivia + '</span></div>');
            }            
        }
    });
}
// Method to rent and return (delete) a movie

movies = document.getElementById("movies")

function rentedFilm(movieId, userId){
    console.log("hyr film", movieId);
    console.log("Inloggad", localStorage.getItem("userId"));

    var data = { FilmId : movieId, StudioId : userId };
    movies = document.getElementById("movies").value;

    fetch("https://localhost:5001/api/rentedFilm"), {
        method: 'POST', 
        headers:{
            'content-type': 'application/json',
           },
        body: JSON.stringify(data),
    }
    .then(response => response.json())
    .then(data  =>{
        for (i=0; i < json.length; i++){
            if(movieId == json[i].FilmId){
                console.log(json[i].Id);
                rentedFilm.insertAdjacentHTML("beforeend", "<div>onclick = 'returnMovie(" + json[i].id + ")'>" + json[i].id + '</div>');
            }            
        }
       console.log('success:' + data);
    })
    .catch((error) =>{
       console.error('error', error);
    }); 
} 

function returnMovie(id){
    console.log("Returnera", id);

    fetch('https://localhost:5001/api/rentedFilm/' + id,{
        method: 'DELETE', 
    })
    .then(response => response.json())
    .then(response => rentedFilm());
}

//-------------------------------------------------------------------------------
// Contact info page
var page = document.getElementById("content");
var contact = document.getElementById("contact");

contact.addEventListener("click", function(){
    printContactInfo();
});

function printContactInfo(){
    page.insertAdjacentHTML("afterbegin", '<center><div class = "contact">Kontakta oss<br/>SFF@sverige.se</div></center>');
}
