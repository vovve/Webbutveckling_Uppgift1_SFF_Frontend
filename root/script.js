
var user = "Mia";
var password = "1234";

var loginButton = document.getElementById("spara");

loginButton.addEventListener("click", function()
{
    console.log("Knapp")
    
    var getUser = document.getElementById("user");
    var getPass = document.getElementById("password");
    
    if (getPass == user && getPass == password)
    {    
        console.log("Ja det stämmer")
    }
    else
    {
        console.log("Nej, något var fel")        
    }

});