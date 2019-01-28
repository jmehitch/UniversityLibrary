// ----- ADD NEW BOOK -----
// Adds new book to library system
function AddBook() {
    // Makes new HTTP POST request to the Books endpoint
    var xhttp = new XMLHttpRequest;
    xhttp.open("POST", booksUrl);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Gets inputted values from input fields
    var bookTitle = document.getElementById('addTitle').value;
    var bookIsbn = document.getElementById('addIsbn').value;

    // Checks if input fields have been left blank
    if (bookTitle == '' || bookIsbn == '') {
        alert('You cannot leave any input fields empty. Please try again.');
        return
    } else {
        // Generates book JSON parameters to send to server
        var jsonParams = {
            title: bookTitle,
            isbn: bookIsbn
        };
    }
    // Sends HTTP request with JSON parameters to server
    xhttp.send(JSON.stringify(jsonParams));
    
    // Once the HTTP request has loaded AddAuthor function called
    xhttp.addEventListener('load', AddAuthor);
    
    // Refreshes display to show new book in table
    RefreshBooksTable();
}

// Function adds the author from input field to the book 
const AddAuthor = function() {
    // Obtains JSON object of most recent book to get book ID 
    var book = JSON.parse(this.response);
    var id = book.id;
    
    // Creates new HTTP POST request to add author to book
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", booksUrl+id+'/authors');
    xhttp.setRequestHeader('Content-Type', 'application/json')
    
    // Gets author name from input field
    var name = document.getElementById("addAuthor").value;

    // Capitalises first letters of names of author
    var nameArray = name.split(' ');
    var capNameArray = [];
    nameArray.forEach(function(name){
        var capName = name.charAt(0).toUpperCase()+name.substr(1);
        capNameArray.push(capName);
    });
    var capitalisedName = capNameArray.join(' ');

    // Creates JSON parameters to send to server
	var jsonParams = {
		name: capitalisedName,
    };

    // Once HTTP request has loaded table refreshed and input fields cleared
    xhttp.addEventListener('load', function() {
        RefreshBooksTable();
        document.getElementById('addTitle').value='';
        document.getElementById('addIsbn').value='';
        document.getElementById('addAuthor').value='';
    });

    // Sends HTTP request with JSON object to server
    xhttp.send(JSON.stringify(jsonParams));
}


// ----- ADDS ANOTHER AUTHOR TO BOOK -----
// Allows a new author to be created and added to a book, or an existing
// author to be added to a book
function AddAnotherAuthor() {
    // Obtains values inputted from input fields
    var name = document.getElementById('addAnotherAuthor').value;
    var auth_id = document.getElementById('idAddAuthor').value;
    var book_id = document.getElementById('idBook').value;

    // Checks that the correct fields have been filled in
    if (name=='' && auth_id=='') {
        alert('Cannot leave both name and ID fields blank.')
    // Warns if both author name and ID have been inputted 
    } else if (name!='' && auth_id!='') {
        alert('Cannot add author by both name and ID.');
    // Adds author by name and book ID 
    } else if (name!='' && book_id!='') {
        // Makes new HTTP POST request to Books endpoint
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", booksUrl+book_id+'/authors');
        xhttp.setRequestHeader('Content-Type', 'application/json');

        // Makes sure author's names have both first letters capitalised
        var nameArray = name.split(' ');
        var capNameArray = [];
        nameArray.forEach(function(name){
            var capName = name.charAt(0).toUpperCase()+name.substr(1);
            capNameArray.push(capName);
        });
        var capitalisedName = capNameArray.join(' ');
             
        // Creates JSON parameters using capitalised author name 
        jsonParams = {
            name: capitalisedName
        };

        // Sends JSON parameters to server to make changes
        xhttp.send(JSON.stringify(jsonParams));

        // Once HTTP request has finished table refreshed and input fields cleared
        xhttp.addEventListener('load', function() {
            RefreshBooksTable();
            document.getElementById('addAnotherAuthor').value='';
            document.getElementById('idAddAuthor').value='';
            document.getElementById('idBook').value='';
        });
    // Adds author by author ID and book ID
    } else if (auth_id!='' && book_id!='') {
        // Makes new HTTP POST request to books endpoint
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", booksUrl+book_id+'/authors/'+auth_id);
        xhttp.setRequestHeader('Content-Type', 'application/json');

        // Sends HTTP request to server
        xhttp.send();

        // Once HTTP request finishes, refreshes table and clears input fields
        xhttp.addEventListener('load', function() {
            RefreshBooksTable();
            document.getElementById('addAnotherAuthor').value='';
            document.getElementById('idAddAuthor').value='';
            document.getElementById('idBook').value='';
        });
    }  
}  


// ----- EDIT BOOK -----
// Allows the editing of book details 
function EditBook(clickedID) {
    // Clears edit area
    document.getElementById('editArea').innerHTML='';

    // Obtains the ID of the book of associated button that was clicked
    var idStr = document.getElementById(clickedID).id;
    var pattern = /\d+/;
    var id = pattern.exec(idStr)[0];

    // Makes new HTTP GET request to the Books endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", booksUrl+id);

    // When the GET request has loaded the data obtained is used in the function
    xhttp.addEventListener('load', function() {
        // Obtains a JSON object of results from the HTTP request
        var book = JSON.parse(this.response);

        // Declares data to display on page to edit
        var title_placeholder = book.title;
        var isbn_placeholder = book.isbn;

        // Creates heading and paragraph to display on page
        var headingText = document.createTextNode('Edit book details:');
        var editHeading = document.createElement('h3');
        editHeading.appendChild(headingText);
        var paraText = document.createTextNode('Editing details of book with ID: '+id+' - Type in the detils you want to edit (if attribute to remain unchanged leave the field blank).');
        var para = document.createElement('p');
        para.appendChild(paraText)

        // Creates title field to edit
        var titleEdit = document.createElement('input');
        titleEdit.setAttribute('type', 'text');
        titleEdit.setAttribute('value', '');
        titleEdit.setAttribute('placeholder', title_placeholder);
        titleEdit.setAttribute('id', 'editTitle');

        // Creates ISBN field to edit 
        var isbnEdit = document.createElement('input');
        isbnEdit.setAttribute('type', 'text');
        isbnEdit.setAttribute('value','');
        isbnEdit.setAttribute('placeholder', isbn_placeholder);
        isbnEdit.setAttribute('id', 'editIsbn');

        // Creates submit button to submit any changes made
        var submitButton = document.createElement('button');
        var submitButtonText = document.createTextNode('submit');
        submitButton.appendChild(submitButtonText);
        submitButton.setAttribute('value', id);
        submitButton.setAttribute('onclick', 'EditBookSubmit(value)');

        // Displays all of the created fields/buttons on page
        var editArea = document.getElementById('editArea');
        editArea.appendChild(editHeading);
        editArea.appendChild(para);
        editArea.appendChild(titleEdit);
        editArea.appendChild(isbnEdit);
        editArea.appendChild(submitButton);
    });
    // Sends HTTP request
    xhttp.send();
}


// ----- SUBMITS UPDATED USER DETAILS -----
// Function sends all edited data from EditBook() to server
function EditBookSubmit(id) {
    // Obtains inputted values from page
    var titleEdit = document.getElementById('editTitle').value;
    var isbnEdit = document.getElementById('editIsbn').value;

    // Makes new HTTP PUT request to Books endpoint
    var xhttp = new XMLHttpRequest;
    xhttp.open("PUT", booksUrl+id);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Checks to confirm changes made should be submitted
    if (confirm("Click OK to confirm these changes.")) {
        // Checks which inputs have been edited and creates JSON parameters from 
        // these changes
        if (titleEdit == '' && isbnEdit == '') {
            jsonParams = {};
        } else if (titleEdit && isbnEdit == '') {
            jsonParams = {
                title: titleEdit,
            };
        } else if (titleEdit == '' && isbnEdit) {
            jsonParams = {
                isbn: isbnEdit,
            };
        } else {
            jsonParams = {
                title: titleEdit,
                isbn: isbnEdit,
            };
        }

        // Once HTTP request has loaded refresh table 
        xhttp.addEventListener('load', function(){
            RefreshBooksTable();
        });
    } else {
        return
    }

    // Sends JSON parameters of changes to server 
    xhttp.send(JSON.stringify(jsonParams)); 
}


// ----- SEARCH FOR BOOKS -----
// Searches database of books for inputted parameters
function BookSearch() {
    // Clears any previous search results
    document.getElementById('displayList').innerHTML='';
    
    // Obtains inputted values for use in search 
    var searchTitle = document.getElementById('titleSearch').value.replace(/\s/g, "%");
    var searchId = document.getElementById('idBookSearch').value;
    var searchIsbn = document.getElementById('isbnSearch').value;

    // Constructs search URL using inputted values
    var url = bookSearchUrl+'title='+searchTitle+'&id='+searchId+'&isbn='+searchIsbn;

    // Makes new HTTP GET request to Books endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);

    // When HTTP GET request has finished function runs
    xhttp.addEventListener('load', function(){    
        // Obtains search list area from HTML     
        displayList = document.getElementById('displayList')

        // Obtains JSON object of search results from GET request
        var response = JSON.parse(this.response);

        // Checks if search returned any results
        if (response.length == 0) {
            var text = document.createTextNode('No results found. Please try again.');
            var listItem = document.createElement('li');
            listItem.appendChild(text);
            displayList.appendChild(listItem);
        } else {
            // Loops through results and displays all results found 
            for (i=0; i<response.length; i++) {
                // Creates text to display search results
                var text = document.createTextNode('Title: '+response[i].title+
                    ' | ID: '+response[i].id+' | ISBN: '+response[i].isbn+' ')

                // Creates edit button
                var editButton = document.createElement('button');
                var editText = document.createTextNode('edit book');
                editButton.appendChild(editText);
                editButton.setAttribute("id", "editButton"+response[i].id);
                editButton.setAttribute("onclick", "EditBook(this.id)");
                
                // Creates delete button
                var delButton = document.createElement('button');
                var delText = document.createTextNode('delete book');
                delButton.appendChild(delText);
                delButton.setAttribute("id", "delButton"+response[i].id);
                delButton.setAttribute("onclick", "DeleteBook(this.id)");
                
                // Creates loans button
                var loansButton = document.createElement('button')
                var loansText = document.createTextNode('show book loan');
                loansButton.appendChild(loansText)
                loansButton.setAttribute("id", "loansButton"+response[i].id);
                loansButton.setAttribute("onclick", "GetBookLoan(this.id)");
                
                // Creates list item and displays all elements on page
                var listItem = document.createElement('li');
                listItem.appendChild(text);
                listItem.appendChild(editButton);
                listItem.appendChild(delButton);
                listItem.appendChild(loansButton)
                displayList.appendChild(listItem);
            }
            
            // Clears all search input fields
            document.getElementById('titleSearch').value='';
            document.getElementById('idBookSearch').value='';
            document.getElementById('isbnSearch').value=''; 
        } 
    });

    // Sends HTTP request
    xhttp.send();
}


// ----- SEARCH FOR AUTHOR -----
function SearchAuthor() {
    // Clears previous search results
    document.getElementById('displayList').innerHTML='';
    // Obtains inputted values from input fields
    var authorSearchName = document.getElementById('authorSearch').value.replace(/\s/g, "%");
    var authorSearchId = document.getElementById('authorIdSearch').value;

    // Constructs search url using inputted search terms
    var url = authorSearchUrl+'name='+authorSearchName+'&id='+authorSearchId+' ';

    // Makes new HTTP GET request using search URL
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);

    // When HTTP request has loaded function is run
    xhttp.addEventListener('load', function(){  
        // Obtains search list area from HTML       
        displayList = document.getElementById('displayList')

        // Obtains JSON object from HTTP request
        var response = JSON.parse(this.response);

        // Checks if search returns any results
        if (response.length==0) {
            // Alerts the user no results have been found 
            //alert('No results found');
            var text = document.createTextNode('No results found. Please try again.');
            var listItem = document.createElement('li');
            listItem.appendChild(text);
            displayList.appendChild(listItem);
        } else {
            // Loops through all results and displays results found
            for (i=0; i<response.length; i++) {
                // Creates text to display search results
                var text = document.createTextNode('Name: '+response[i].name+
                    ' | ID: '+response[i].id+' ')

                // Obtains search list area from HTML 
                displayList = document.getElementById('displayList')
                
                // Creates edit button
                var editButton = document.createElement('button');
                var editText = document.createTextNode('edit author');
                var editButtonId = "editButton"+response[i].id;
                editButton.appendChild(editText);
                editButton.setAttribute("id", editButtonId);
                editButton.setAttribute("onclick", "EditAuthor(this.id)");
                
                // Creates delete button
                var delButton = document.createElement('button');
                var delText = document.createTextNode('delete author');
                var delButtonId = "delButton"+response[i].id;
                delButton.appendChild(delText);
                delButton.setAttribute("id", delButtonId);
                delButton.setAttribute("onclick", "DeleteAuthor(this.id)");

                // Creates list item and displays all elements 
                var listItem = document.createElement('li');
                listItem.appendChild(text);
                listItem.appendChild(editButton);
                listItem.appendChild(delButton);
                displayList.appendChild(listItem);

                // Clears search inputs
                document.getElementById('authorSearch').value='';
                document.getElementById('authorIdSearch').value='';
            }
        }

    });
    // Sends HTTP request
    xhttp.send();
}


// ----- SEARCH FOR BOOKS BY AN AUTHOR -----
// Allows searching of books written by an author 
function SearchAuthorBook() {
    // Clears display list 
    document.getElementById('displayList').innerHTML='';
    // Obtains inputted values from input fields
    var searchAuthor = document.getElementById('authorBookSearch').value.toLowerCase().replace(/\s+/g, "%");
    var searchAuthorId = document.getElementById('authorIdBookSearch').value;

    // Makes new HTTP GET request to authors endpoint 
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", authorsUrl+"/?allEntities=true")

    // When HTTP request finished function run to find and display books
    xhttp.addEventListener('load', function(){
        // Obtains JSON object from HTTP request 
        var authors = JSON.parse(this.response);

        // Loops through all authors found in search 
        for (i=0; i<authors.length; i++) {
            // Checks if author's name or ID inputted matches any in JSON response 
            if (searchAuthor == authors[i].name.toLowerCase().replace(/\s/g, "%") 
                    || searchAuthorId == authors[i].id) {
                // If author matches books written by the author added to an array 
                booksArray = [];
                authors[i].Books.forEach(function(book) {
                    booksArray.push([book.title, book.id, book.isbn]);
                });
                
                // Obtains list area from document
                var displayList = document.getElementById('displayList');
                
                // Creates author information text to display
                var written_by_text = document.createTextNode('Books written by '
                    +authors[i].name+ ' (ID: '+authors[i].id+'):');
                var p_item = document.createElement('p');
                p_item.appendChild(written_by_text);
                displayList.appendChild(p_item);

                // Loops through all books written by matched author 
                for (x=0; x<booksArray.length; x++) {
                    // Creates book information text to displa
                    var list_text = document.createTextNode('Book Title: '
                        +booksArray[x][0]+' | Book ID: '+booksArray[x][1]+
                        ' | ISBN: '+booksArray[x][2]+' ');

                    // Creates edit button
                    var editButton = document.createElement('button');
                    var editText = document.createTextNode('edit author');
                    var editButtonId = "editButton"+authors[i].id;
                    editButton.appendChild(editText);
                    editButton.setAttribute("id", editButtonId);
                    editButton.setAttribute("onclick", "EditAuthor(this.id)");

                    // Creates delete button
                    var delButton = document.createElement('button');
                    var delText = document.createTextNode('delete author');
                    var delButtonId = "delButton"+authors[i].id;
                    delButton.appendChild(delText);
                    delButton.setAttribute("id", delButtonId);
                    delButton.setAttribute("onclick", "DeleteAuthor(this.id)");

                    // Creates list item and displays all elements 
                    var listItem = document.createElement('li');
                    listItem.appendChild(list_text);
                    listItem.appendChild(editButton);
                    listItem.appendChild(delButton);
                    displayList.appendChild(listItem);
                }
                break;
            } else if (i==authors.length-1) {
                // Creates text to show if no results found 
                var displayList = document.getElementById('displayList')
                var text = document.createTextNode('No results found. Please try again.');
                var listItem = document.createElement('li');
                listItem.appendChild(text);
                displayList.appendChild(listItem);
            }
        }

        // Clears search input fields 
        document.getElementById('authorBookSearch').value='';
        document.getElementById('authorIdBookSearch').value='';
    });

    // Sends HTTP request 
    xhttp.send();
}


// ----- EDIT AUTHOR ----- 
// Allows the editing of author details 
function EditAuthor(clickedID) {
    // Clears edit area
    document.getElementById('editArea').innerHTML='';

    // Obtains the ID of the user of the associated button that was clicked
    var idStr = document.getElementById(clickedID).id;
    var pattern = /\d+/;
    var id = pattern.exec(idStr)[0];

    // Makes new HTTP GET request to authors endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", authorsUrl+id);

    // When GET request has loaded the data obtained is used in the function
    xhttp.addEventListener('load', function() {
        // Obtains a JSON object of results from the HTTP request 
        var author = JSON.parse(this.response);

        // Declares name to display on page to edit
        var namePlaceholder = author.name;

        // Creates headings and text to display on page
        var headingText = document.createTextNode('Edit author details:');
        var editHeading = document.createElement('h3');
        editHeading.appendChild(headingText);
        var paraText = document.createTextNode('Editing details of author with ID: '+id+' - Type in the detils you want to edit (if attribute to remain unchanged leave the field blank).');
        var para = document.createElement('p');
        para.appendChild(paraText)

        // Creates name field to edit
        var nameEdit = document.createElement('input');
        nameEdit.setAttribute('type', 'text');
        nameEdit.setAttribute('value', '');
        nameEdit.setAttribute('placeholder', namePlaceholder);
        nameEdit.setAttribute('id', 'editName');

        // Creates submit button to submit changes made 
        var submitButton = document.createElement('button');
        var submitButtonText = document.createTextNode('submit');
        submitButton.appendChild(submitButtonText);
        submitButton.setAttribute('value', id);
        submitButton.setAttribute('onclick', 'EditAuthorSubmit(value)');

        // Displays all of the created fields/buttons on page 
        var editArea = document.getElementById('editArea');
        editArea.appendChild(editHeading);
        editArea.appendChild(para);
        editArea.appendChild(nameEdit);
        editArea.appendChild(submitButton);

        // Clears display list
        document.getElementById('displayList').innerHTML='';
    });
    
    // Sends HTTP request
    xhttp.send();
}


// ----- SUBMITS UPDATED AUTHOR DETAILS ------
// Function sends all edited data from EditAuthor() to server
function EditAuthorSubmit(id) {
    // Obtains new name from inputted value from input field
    var nameEdit = document.getElementById('editName').value;

    // Makes new HTTP PUT request to authors endpoint
    var xhttp = new XMLHttpRequest;
    xhttp.open("PUT", authorsUrl+id);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Checks to confirm change of author name 
    if (confirm("Click OK to confirm these changes.")) {
        // Creates JSON parameters to send to server
        if (nameEdit == '') {
            jsonParams = {};
        } else {
            jsonParams = {
                name: nameEdit,
            };
        }

        // Once HTTP request has finished refresh tables 
        xhttp.addEventListener('load', function(){
            RefreshBooksTable();
        });
    } else {
        return
    }

    // Sends JSON parameters generated to server
    xhttp.send(JSON.stringify(jsonParams));
}


// ----- DELETE AUTHOR -----
// Deletes an author from Library System 
function DeleteAuthor(clickedID) {
    if (clickedID) {
        // Obtains the ID of the user of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted user ID from 
        var id = document.getElementById('delAuthId').value;
    } 
    // Checks for user to confirm deletion 
    if (confirm("Click OK to confirm deletion of author with ID: "+id)) {
        // Makes new HTTP DELETE request to Authors endpoint
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", authorsUrl+id);

        // When HTTP request is finished tables refreshed and input field cleared
        xhttp.addEventListener('load', function(){
            RefreshBooksTable();
            document.getElementById('delAuthId').value='';
        });

        // Sends HTTP request 
        xhttp.send();
    } else {
        // Clears input field
        document.getElementById('delAuthId').value='';
        return
    }
}


// --- DELETE BOOK ---
// General delete for books
function DeleteBook(clickedID) {
    if (clickedID) {
        // Obtains the ID of the user of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted user ID from 
        var id = document.getElementById('deleteBookId').value;
    } 
    // Checks for user to confirm deletion
    if (confirm("Click OK to confirm deletion of book ID: "+id)) {
        // Creates new HTTP DELETE request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", booksUrl+id);

        // Once HTTP request loaded, refreshes display and clear input field
        xhttp.addEventListener('load', function(){
            RefreshUsersTable();
            RefreshBooksTable();
            document.getElementById('deleteBookId').value='';
        });

        // Sends HTTP request
        xhttp.send();
    } else {
        // Clears input field
        document.getElementById('deleteBookId').value='';
        return
    }
}