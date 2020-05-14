console.log(localStorage.getItem("userId"));

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
    page.innerHTML = "";
    var print = "Hej och välkommen "; 

    fetch("users.json")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        print = print + json[localStorage.getItem("userId")].userName;
        page.insertAdjacentHTML("afterbegin", print);

    });

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
    page.insertAdjacentHTML("afterbegin", 'Användarnamn: <input type="text" id="user"> Lösenord: <input type="password" id="password"> <button id="spara">Logga in</button>');

    var loginButton = document.getElementById("spara");

    loginButton.addEventListener("click", function()
    {
        var getUser = document.getElementById("user").value;
        var getPass = document.getElementById("password").value;

        fetch("users.json")
            .then(function(response)
            {
                return response.json();
            })
            .then(function(json)
            {
                console.log(json);

                for(i=0; i<json.length; i++)
                {
                if (getUser == json[i].userLogin && getPass == json[i].userPassword)
                {    
                    console.log("Ja det stämmer")                   
                    localStorage.setItem("userId", i);
                }             
            }
            if(localStorage.getItem("userId") !== null) 
            {
                showWelcomePage();
            }
            else
            {
                showErrorPage();
            }
        });    
    });
}

