var page = document.getElementById("content");
var login = document.getElementById("login");

login.addEventListener("click", function(){
    console.log("Klick på knappen");
    showLogInPage();
});
// Log in functions
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
    var print = "Välkommen "; 
    
    fetch("users.json")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        page.innerHTML = "";
        print = print + json[localStorage.getItem("userId")].userName + "!";
        page.insertAdjacentHTML("afterbegin", "<center><div>" + print);
        page.insertAdjacentHTML("beforeend",  "</div></center><center><div><button id ='loggoutButton'>Logga ut</button></div></center>");
    });
    
    var loggoutButton = document.getElementById("loggoutButton");
    
    loggoutButton.addEventListener("click", function(){
        localStorage.removeItem("userId");
        showLogInPage();
    });
}

var newlogin = document.getElementById("newlogin");

newlogin.addEventListener("click", function(){
    console.log("Klick på nytt login");
    addItem();
});

var addlogin = document.getElementById("content")

function addItem(Name, Password){
    console.log("Lägg till");
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
// Method to print a list of films and trivia

var movies = document.getElementById("movies");

movies.addEventListener("click", function(){
    console.log("Klick på filmknappen");
    printfilmList();
    printtriviaList();
});

var filmList = document.getElementById("filmlist");

function printfilmList(){
    fetch("https://localhost:5001/api/film")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log("printfilmList", json);
        
        for (i = 0; i < json.length; i++){
            console.log(json[i].name);
            filmList.insertAdjacentHTML("beforeend",
            '<div class = "movieposter"><img src="img/bio.jpg" alt="omslagsbild" width="25%" height="25%"><br/><span id = "' + json[i].id + '" >' + json[i].name + '</span></div>');
        }
        filmList.addEventListener("click", function(e){
        console.log(e.target.id);
        //showMovieInfoPage(e.target.id)
        })
    });
}

function showMovieInfoPage(){

}

var triviaList = document.getElementById("trivialist");

function printtriviaList(movieId){
    console.log(movieId);

    fetch("https://localhost:5001/api/filmTrivia")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        console.log("printtriviaList", json);
        
        for (i=0; i < json.length; i++){
            if(movieId == json[i].FilmId){
                console.log(json[i].trivia);
                //trivialist.insertAdjacentHTML("beforeend", '<div class = "movieposter">' + json[i].trivia + '</div>');
            }            
        }
    });
}

// Method to rent and return (delete) a movie
function rentedFilm(){
    fetch("https://localhost:5001/api/rentedFilm")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("rentedFilm", json);
        
        for (i=0; i < json.length; i++)
        {
            if(movieId == json[i].FilmId){
                console.log(json[i].Id);
                rentedFilm.insertAdjacentHTML("beforeend", "<div>onclick = 'deleteItem(" + json[i].id + ")'>" + json[i].id + '</div>');
            }            
        }
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
var page = document.getElementById("content");
var contact = document.getElementById("contact");

contact.addEventListener("click", function(){
    printContactInfo();
});

function printContactInfo(){
    page.insertAdjacentHTML("afterbegin", '<center><div class = "contact">Kontakta oss<br/>SFF@sverige.se</div></center>');
}
