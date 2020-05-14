console.log(localStorage.getItem("userId"));

var user = "mia";
var password = "1234";

var page = document.getElementById("content");

if (localStorage.getItem("userId") !== "null")
{
    showWelcomePage();
}
else
{
    showLogInPage
}

function showWelcomePage()
{
    page.innerHTML = "Välkommen!";
    page.insertAdjacentHTML("beforeend", "<div><button id ='loggoutButton'>Logga ut</button></div>")

    var loggoutButton = document.getElementById("loggoutButton");
    
    loggoutButton.addEventListener("click", function()
    {
        localStorage.removeItem("userId");
        showLogInPage();
    });
}

function showErrorPage()
{
    page.insertAdjacentHTML("afterbegin", "<div>Har du glömt ditt lösenord?</div>");
}

function showLogInPage()
{
    page.innerHTML = "";
    page.insertAdjacentHTML("afterbegin", 'Namn: <input type="text" id="user"> Lösenord: <input type="password" id="password"> <button id="spara">Logga in</button>');

    var loginButton = document.getElementById("spara");

    loginButton.addEventListener("click", function()
    {
        console.log("Knapp")
        
        var getUser = document.getElementById("user").value;
        var getPass = document.getElementById("password").value;
        
        if (getUser == user && getPass == password)
        {    
            console.log("Ja det stämmer")
            
            localStorage.setItem("userId", getUser);
            console.log(localStorage.getItem("userId"));
            
            showWelcomePage();
        }
        else
        {
            console.log("Nej, något var fel")
            showErrorPage();
            
        }
    
    });
}

