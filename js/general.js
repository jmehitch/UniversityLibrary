// Declare base URL to access local server
const baseUrl = "http://127.0.0.1:3000";

// Declare constants for books:
var booksUrl = baseUrl + "/books/";
var getBooksUrl = booksUrl+'?allEntities=true';
var bookSearchUrl = baseUrl+'/search?type=book&';

// Declare constants for users: 
var usersUrl = baseUrl + "/users/";
var getUsersUrl = usersUrl;
var userSearchUrl = baseUrl+'/search?type=user&'

// Declare constants for authors: 
var authorsUrl = baseUrl + "/authors/";
var authorSearchUrl = baseUrl+'/search?type=author&';

// Declare constants for loans: 
var loansUrl = baseUrl+"/loans/";


// ----- TOGGLES DISPLAY OF EACH FUNCTION -----
function HideShow(id) {
    // Clears previously displayed information
    document.getElementById('displayList').innerHTML=''
    document.getElementById('start').innerHTML=''
    // Obtains all elements with class "showArea"
    var elements = document.getElementsByClassName('showArea')
    // Initially loops all elements and hides all of them 
    for (i=0; i<elements.length; i++) {
        elements[i].style.display = "none"
    }
    // Whichever element is then clicked on gets displayed
    var item = document.getElementById(id)
    item.style.display = "block";
}


// ----- UPDATES TABLES OF ITEMS (BOOKS) -----
function RefreshBooksTable() {
    // Makes new HTTP GET request to Books endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', getBooksUrl);

    // When HTTP request is loaded, goes through the returned data and add each 
    // item to a new row in the table
    xhttp.addEventListener('load', function() {
        // Clears the table of existing data
        document.getElementById('booksTableContainer').innerHTML = "";

        // Obtains JSON object of response
        var books = JSON.parse(this.response);

        // Accesses table HTML element from page 
        var table = document.getElementById('booksTableContainer');

        // Creates table row for headings
        var row = table.insertRow(0);
        row.insertCell(0).innerHTML="<b>Title</b>";
        row.insertCell(1).innerHTML="<b>ID</b>";
        row.insertCell(2).innerHTML="<b>ISBN</b>";
        row.insertCell(3).innerHTML="<b>Authors</b>";
        row.insertCell(4).innerHTML="<b>Edit</b>";
        row.insertCell(5).innerHTML="<b>Delete</b>";
        row.insertCell(6).innerHTML="<b>Loans</b>";    
        
        // Loops through all books and update table of books
        books.forEach(function(book) {  
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);

            // Inserts corresponding book values into each cell
            cell1.innerHTML=book.title;
            cell2.innerHTML=book.id;
            cell3.innerHTML=book.isbn;

            // Loops through all the authors of a book and add to table data
            var authors_arr = [];
            book.Authors.forEach(function(author) {
                authors_arr.push(author.name+' (ID: '+author.id+')');
            });
            authors_str = authors_arr.join(", ");
            cell4.innerHTML=authors_str;

            // Creates edit buttons and adds to table for each row
            var edit_btn = document.createElement('button');
            var edit_text = document.createTextNode('edit');
            edit_btn.appendChild(edit_text)
            edit_btn.setAttribute("id", "edit_btn"+book.id);
            edit_btn.setAttribute("onclick", "EditBook(this.id)");
            cell5.appendChild(edit_btn)

            // Creates delete buttons and adds to table for each row
            var del_btn = document.createElement('button');
            var del_text = document.createTextNode('delete');
            del_btn.appendChild(del_text);
            del_btn.setAttribute('value', 'book')
            del_btn.setAttribute("id", "del_btn"+book.id);
            del_btn.setAttribute("onclick", "DeleteBook(this.id)");
            cell6.appendChild(del_btn)

            // Creates loans buttons and adds to table for each row
            var loans_btn = document.createElement('button')
            var loans_text = document.createTextNode('loan info');
            loans_btn.appendChild(loans_text)
            loans_btn.setAttribute("id", "loans_btn"+book.id);
            loans_btn.setAttribute("onclick", "GetBookLoan(this.id)");
            cell7.appendChild(loans_btn)  
        });

        // Clears display list
        document.getElementById('displayList').innerHTML='';

        // Clears edit area
        document.getElementById('editArea').innerHTML='';

        // Clears "showArea" for showing functions
        var elements = document.getElementsByClassName('showArea')
        for (i=0; i<elements.length; i++) {
            elements[i].style.display = "none"
        }
    });

    // Sends HTTP request 
    xhttp.send();
}


// ----- UPDATES TABLES OF ITEMS (USERS) -----
function RefreshUsersTable() {
    // Makes new HTTP GET request to Users endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', getUsersUrl);

    // When HTTP request is loaded, goes through the returned data and add each 
    // item to a new row in the table
    xhttp.addEventListener('load', function() {
        // Clears the table of existing data
        document.getElementById('usersTableContainer').innerHTML = "";

        // Obtains JSON object of response
        var users = JSON.parse(this.response);

        // Accesses table HTML element from page 
        var table = document.getElementById('usersTableContainer');

        // Creates table row for headings
        var row = table.insertRow(0);
        row.insertCell(0).innerHTML="<b>Name</b>";
        row.insertCell(1).innerHTML="<b>ID</b>";
        row.insertCell(2).innerHTML="<b>Barcode</b>";
        row.insertCell(3).innerHTML="<b>Member Type</b>";
        row.insertCell(4).innerHTML="<b>Edit</b>";
        row.insertCell(5).innerHTML="<b>Delete</b>";
        row.insertCell(6).innerHTML="<b>Loans</b>";
        
        // Loops through all users and update table of users
        users.forEach(function(user) {  
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);

            // Inserts corresponding user values into each cell   
            cell1.innerHTML=user.name;
            cell2.innerHTML=user.id;
            cell3.innerHTML=user.barcode;
            cell4.innerHTML=user.memberType;
    
            // Creates edit buttons and adds to table for each row
            var edit_btn = document.createElement('button');
            var edit_text = document.createTextNode('edit');
            edit_btn.appendChild(edit_text)
            edit_btn.setAttribute("id", "edit_btn"+user.id);
            edit_btn.setAttribute("onclick", "EditUser(this.id)");
            cell5.appendChild(edit_btn)

            // Creates delete buttons and adds to table for each row
            var del_btn = document.createElement('button');
            var del_text = document.createTextNode('delete');
            del_btn.appendChild(del_text);
            del_btn.setAttribute("id", "del_btn"+user.id);
            del_btn.setAttribute("onclick", "DeleteUser(this.id, value)");
            cell6.appendChild(del_btn)

            // Creates loans buttons and adds to table for each row
            var loans_btn = document.createElement('button')
            var loans_text = document.createTextNode('loans info');
            loans_btn.appendChild(loans_text)
            loans_btn.setAttribute("id", "loans_btn"+user.id);
            loans_btn.setAttribute("onclick", "GetUserLoans(this.id)");
            cell7.appendChild(loans_btn)
        });

        // Clears display list
        document.getElementById('displayList').innerHTML='';

        // Clears edit area
        document.getElementById('editArea').innerHTML='';

        // Clears "showArea" for showing functions
        var elements = document.getElementsByClassName('showArea')
        for (i=0; i<elements.length; i++) {
            elements[i].style.display = "none"
        }
    });
    // Sends HTTP request
    xhttp.send();
}


// Runs all functions once page has loaded
window.onload = function() {
    RefreshBooksTable();
    RefreshUsersTable();

    document.getElementById('newSubmit').addEventListener('click', function () {
        AddBook();
    });

    document.getElementById('authorSubmit').addEventListener('click', function () {
        AddAnotherAuthor();
    });

    document.getElementById('searchBook').addEventListener('click', function() {
        BookSearch();
    });

    document.getElementById('searchAuthor').addEventListener('click', function() {
        SearchAuthor();
    });

    document.getElementById('searchAuthorBook').addEventListener('click', function() {
        SearchAuthorBook();
    });

    document.getElementById('bookLoanSearch').addEventListener('click', function() {
        GetBookLoan();
    });

    document.getElementById('deleteBookButton').addEventListener('click', function() {
        DeleteBook();
    });

    document.getElementById('deleteAuthorButton').addEventListener('click', function() {
        DeleteAuthor();
    }); 

    document.getElementById('addNewSubmit').addEventListener('click', function() {
        AddUser();
    });

    document.getElementById('userSearchButton').addEventListener('click', function() {
        UserSearch();
    });

    document.getElementById('deleteUserButton').addEventListener('click', function() {
        DeleteUser();
    });

    document.getElementById('loanSubmit').addEventListener('click', function() {
        LoanBookToUser();
    });

    document.getElementById('getLoansSubmit').addEventListener('click', function() {
        GetUserLoans();
    });

    document.getElementById('loanRemoveSubmit').addEventListener('click', function() {
        RemoveLoan();
    });

    document.getElementById('loanUpdateSubmit').addEventListener('click', function() {
        UpdateLoan();
    });
}