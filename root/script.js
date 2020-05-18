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
//__________________________________________________________________

var filmList = document.getElementById("filmlist");
var saveButton = document.getElementById("savefilmTitle");

saveButton.addEventListener("click", function()
{
    filmTitle = document.getElementById("filmtitle").value;
    addItem(filmTitle, 0);
});

printfilmList();

function printfilmList()
{
fetch("https://localhost:5001/api/Film")
    .then(function(response)
    {
        return response.json();
    })
    .then(function(json)
    {
        console.log("printfilmList", json);

        filmList.innerHTML = "";

        for (i=0; i<json.length; i++)
        {
            console.log(json[i].name);
            filmList.insertAdjacentHTML("beforeend", "<div>button onclick='deleteItem(" + json[i].id +  ")'>" + json[i].name + "</button></div>")
        };
    });
};

//addItem("Mary stewart", 0);

function addItem(filmTitle, iscomplete)
{
    console.log("Lägg till")

    var data = { filmTitle: filmTitle, iscomplete: iscomplete};

    fetch('https://localhost:5001/api/Film',  
    {
        method: 'POST', 
        headers: 
        {
            'content-type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data  => 
    {
        console.log('sucsess:' + data);
        printfilmList();
    })
    .catch((error) => 
    {
        console.error('error', error);
    });
    
};

function deleteItem()
{
    console.log("Radera", id)

    fetch('https://localhost:5001/api/Film/' + id, {method: 'DELETE', })
    .then(response => response.json())
    .then(response => printfilmList())
}
