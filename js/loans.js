// ----- LOAN BOOK TO USER -----
// Loans a book to a user specifying due date
function LoanBookToUser() {
    // Obtains loan information inputted
    var userId = document.getElementById('userIdToLoan').value;
    var bookId = document.getElementById('bookIdToLoan').value;
    var dueDate = document.getElementById('dueDate').value;

    // RegEx pattern to check date format 
    var pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]([1-5][0-9])$/

    // Checks that the inputted due date is in the correct format
    if (pattern.test(dueDate) == false) {
        alert('Date invalid.')
        return
    // Checks that all fields have been inputted
    } else if (userId=='' || bookId=='' || dueDate=='') {
        alert('You cannot leave any field blank.')
        return
    } else {
        // Formats due date for use in HTTP POST request
        var formDueDate = moment(dueDate, 'DD/MM/YY')
        var jsonDueDate = formDueDate.format('YYYY-MM-DD')

        // Starts a HTTP GET request to check a book's current loan status (using custom
        // loans route)
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", loansUrl+"book/"+bookId)
        
        // Once HTTP request loans the function runs
        xhttp.addEventListener('load', function() {
            // Obtains JSON object including book's current loan status
            var book = JSON.parse(this.response);

            // Checks if book exists
            if (book==null) {
                alert('Book does not exist.')
                return    
            } else {
                // Checks if book is currently on loan
                if (book.Loan == null) {
                                
                    // If book not currently on loan, starts a HTTP PUT request loaning
                    // book to specified user 
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST", usersUrl+userId+"/loans/"+bookId);
                    xhttp.setRequestHeader('Content-Type', 'application/json');

                    // Declares JSON parameters with inputted due date
                    var jsonParams = {
                        dueDate: jsonDueDate
                    };
                    
                    // Sends JSON data to server
                    xhttp.send(JSON.stringify(jsonParams));
                    alert('Book loaned successfully.')
                    
                    // Clear input fields 
                    document.getElementById('userIdToLoan').value='';
                    document.getElementById('bookIdToLoan').value='';
                    document.getElementById('dueDate').value='';
                } else {
                // If book already on loan, alerts user and gives return due date
                var dueDateForm = moment(book.Loan['dueDate']).format('LL');
                alert('This book is already on loan, it is due back on '+dueDateForm)
                }
            }
        });
        // Ends HTTP request
        xhttp.send();
    }
}


// ----- REMOVE CURRENT LOAN -----
// Removes a current loan from a book 
function RemoveLoan(clickedID) {
    // Checks if function was triggered by button click or Get User Loans field
    if (clickedID) {
        // Obtains the ID of the user of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted user ID from 
        var id = document.getElementById('bookIdRemoveLoan').value;
    }
    
    if (id=='') {
        alert('Cannot leave input field blank.')
        return
    } else {
        // Makes new HTTP GET request to the Loans endpoint (using custom
        // loans route)
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", loansUrl+'/book/'+id)

        // Once HTTP request has loaded the function runs
        xhttp.addEventListener('load', function() {
            // Obtains JSON object from GET request
            var response = JSON.parse(this.response);

            // Checks if inputted book exists
            if (response==null) {
                alert('Book does not exit.')
            // Checks if book is currently on loan
            } else if (response.Loan==null) {
                alert('Book is not currently on loan.') 
            } else {
                // Asks for confirmation of deletion of loan
                if (confirm("Confirm removal of loan of book with ID: "+id)) {
                    // Generates new HTTP DELETE request for inputted book
                    xhttp = new XMLHttpRequest();
                    xhttp.open("DELETE", loansUrl+response.Loan.id);

                    // Once HTTP request loads refreshes display and clears input fields
                    xhttp.addEventListener('load', function() {
                        RefreshUsersTable();
                        document.getElementById('bookIdRemoveLoan').value=''
                    });
                    // Ends HTTP request
                    xhttp.send();
                } else {
                    return
                }
            }
        });
        // Ends HTTP request
        xhttp.send();
    }
}


// ----- UPDATE CURRENT LOAN -----
// Updates the due date of a book currently on loan
function UpdateLoan() {
    // Obtains inputted user ID from 
    var id = document.getElementById('bookIdUpdateLoan').value;
    var dueDate = document.getElementById('updatedDueDate').value;
    
    // RegEx pattern to check date format 
    var pattern = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]([1-5][0-9])$/

    // Checks that the inputted due date is in the correct format
    if (pattern.test(dueDate) == false) {
        alert('Date invalid.')
        return
    } else if (id=='') {
        alert('Cannot leave input field blank.')
        return
    } else {
        // Formats due date for use in HTTP POST request
        var formDueDate = moment(dueDate, 'DD/MM/YY')
        var jsonDueDate = formDueDate.format('YYYY-MM-DD')

        // Makes new HTTP GET request to the Loans endpoint (using customised
        // loan route)
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", loansUrl+'/book/'+id)

        // Once HTTP request has loaded the function runs
        xhttp.addEventListener('load', function() {
            // Obtains JSON object from HTTP GET request
            var response = JSON.parse(this.response);

            //Checks if inputted book exists
            if (response==null) {
                alert('Book does not exit.')
            // Checks if book is currently on loan
            } else if (response.Loan==null) {
                alert('Book is not currently on loan.') 
            } else {
                // Asks for confirmation of change of due date
                if (confirm("Confirm updated due date ("+dueDate+") of loan of book with ID: "+id)) {
                    // Starts new HTTP PUT request to update due date
                    xhttp = new XMLHttpRequest();
                    xhttp.open("PUT", loansUrl+response.Loan.id);
                    xhttp.setRequestHeader('Content-Type', 'application/json')

                    // Declares JSON parameters of updated due date
                    var jsonParams = {
                        dueDate: jsonDueDate
                    };

                    // Sends JSON data to server to update due date of loan
                    xhttp.send(JSON.stringify(jsonParams));
                    alert('Loan due date updated.')
                    
                    // Clears input field
                    document.getElementById('bookIdUpdateLoan').value='';
                    document.getElementById('updatedDueDate').value='';                    
                } else {
                    return
                }
            }
        });
        // Ends HTTP request
        xhttp.send();
    }
}


// ----- GET LIST OF USER LOANS -----
// Displays a list of user's current books on loan
function GetUserLoans(clickedID) {
    // Checks if function was triggered by button click or Get User Loans field
    if (clickedID) {
        // Obtains the ID of the user of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted user ID from input field 
        var id = document.getElementById('userIdLoan').value;
    }

    // Makes new HTTP GET request to the Loans endpoint (using custom
    // loans route)
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", loansUrl+'/user/'+id)

    // Runs function to display loan information when HTTP request finishes
    xhttp.addEventListener('load', function() {
        // Obtains a JSON object of results from the HTTP request 
        var response = JSON.parse(this.response);

        // Checks if user with associated ID exists 
        if (response == null) {
            alert('User does not exist.')
            return
        } else {
            // Declares the user details obtained from JSON object
            var userName = response.name
            var userId = response.id
            var loans = response['Loans']
            var booksArray = []
            loans.forEach(function(loan){
                booksArray.push([loan['BookId'], loan['dueDate']])
            });

            // Checks if user has any current loans 
            if (booksArray.length==0) {
                // Creates text to display
                var text = document.createTextNode(userName+' (ID: '+userId+
                    ')  doesn\'t have and books currently on loan.')
                var para = document.createElement('p');
                para.appendChild(text);
            } else {
                // Creates text to display
                var text = document.createTextNode(userName+' (ID: '+userId+
                    ') currently has '+booksArray.length+' books on loan:')
                var para = document.createElement('p');
                para.appendChild(text);
            }

            // Displays text on page 
            var displayList = document.getElementById('displayList');
            displayList.appendChild(para);

            // Loops through all of the books on loan by that user 
            booksArray.forEach(function(book){
                // Creates new HTTP request for each book 
                xhttp = new XMLHttpRequest();
                xhttp.open("GET", baseUrl+"/books/"+book[0]);

                // Obtains the due date of the book from array of books
                var dueDate = moment(book[1]).format('LL');

                // Runs function when HTTP request loads
                xhttp.addEventListener('load', function() {
                    // Obtains JSON object of response
                    var response = JSON.parse(this.response);
                    
                    // Creates text stating information of book on loan
                    var liText = document.createTextNode('Title: '+response.title+
                        ' | ID: '+response.id+' | ISBN: '+response.isbn+
                        ' | Return Due Date: '+dueDate+' ')
                    var li = document.createElement('li');

                    // Creates remove loan button
                    var removeButton = document.createElement('button');
                    var removeText = document.createTextNode('remove loan');
                    removeButton.appendChild(removeText);
                    removeButton.setAttribute("id", "removeButton"+response.id);
                    removeButton.setAttribute("onclick", "RemoveLoan(this.id)");

                    // Displays text and button 
                    li.appendChild(liText);
                    li.appendChild(removeButton)
                    displayList.appendChild(li);
                    
                });
                // Ends HTTP Request
                xhttp.send();
            });
        }
    });
    // Ends HTTP Request
    xhttp.send();
    // Clears previous search results and input field
    document.getElementById('userIdLoan').value=''
    document.getElementById('displayList').innerHTML=''
} 


// ----- GET USER CURRENTLY LOANING A BOOK ----- 
// Obtains the user that is currently loaning a particular book
function GetBookLoan(clickedID) {
    // Checks if function was triggered by button click or Get User Loans field
    if (clickedID) {
        // Obtains the ID of the book of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted book ID from input field
        var id = document.getElementById('bookLoanId').value;
    }

    // Makes new HTTP GET request to Loans endpoint (using custom
    // loans route)
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", baseUrl+'/loans/book/'+id)

    // Runs function to display loan information when HTTP request finishes
    xhttp.addEventListener('load', function() {
        // Obtains a JSON object of results from the HTTP request 
        var response = JSON.parse(this.response);

        // Checks if book with associated ID exists
        if (response==null) {
            alert('Book does not exist.')
            return
        } else {
            // Declares the book details obtained from JSON object
            var bookTitle = response.title;
            var bookIsbn = response.isbn

            // Checks if the book is currently on loan 
            if (response['Loan']==null) {
                // Displays alert if book not currently on loan
                alert('The book '+'"'+bookTitle+'"'+' is not currently on loan.')
            } else {
                // Defines loan information 
                var dueDate = moment(response['Loan'].dueDate).format('LL');
                var userId = response['Loan']['UserId'];

                // Creates and displays text with book loan information 
                var text = document.createTextNode(bookTitle+' (ISBN: '+
                    bookIsbn+') is currently on loan until: '+dueDate+', to user:')
                var para = document.createElement('p');
                para.appendChild(text);
                var listArea = document.getElementById('displayList');
                listArea.appendChild(para);
                
                // Makes new HTTP GET request to users endpoint to get user information
                xhttp = new XMLHttpRequest();
                xhttp.open("GET", baseUrl+"/users/"+userId);

                // When HTTP request loads text for user information generated 
                xhttp.addEventListener('load', function() {
                    // Obtains JSON object received from HTTP request
                    var response = JSON.parse(this.response);

                    // Creates and displays text about user with book on loan 
                    var li_text = document.createTextNode('Name: '+response.name+
                        ' | ID: '+response.id+' | Member Type: '+response.memberType);
                    var li = document.createElement('li');
                    li.appendChild(li_text);
                    listArea.appendChild(li);
                });
                // Sends HTTP request 
                xhttp.send(); 
            }
        } 
    });
    // Sends HTTP request 
    xhttp.send();
    // Clears display area 
    document.getElementById('displayList').innerHTML=''
    // Clear input field
    document.getElementById('bookLoanId').value='';
} 
