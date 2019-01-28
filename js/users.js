// ----- ADD NEW USER ----- 
// Adds new user to library system
function AddUser() {
    // Makes new HTTP POST request to the Users endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", usersUrl);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Obtains the inputted values from HTML page
    var userName = document.getElementById('addNewName').value;
    var userBarcode = document.getElementById('addNewBarcode').value;
    var userMemType= document.getElementById('newMemberType').value;

    // Capitalises first letters of the newly inputted user name
    var nameArr = userName.split(' ');
    var capNameArr = [];
    nameArr.forEach(function(name){
        var capName = name.charAt(0).toUpperCase()+name.substr(1);
        capNameArr.push(capName);
    });
    var capitalisedName = capNameArr.join(' ');
    
    // Checks input is valid - warning if not
    if (userName == '' || userBarcode == '') {
        alert('You cannot leave any input fields empty. Please try again.');
        return
    } else {
        // Generate JSON parameters to send to server from input data
        var jsonParams = {
        name: capitalisedName,
        barcode: userBarcode,
        memberType: userMemType
        };
    }

    // When PUT request is finished refreshes table and clears input fields  
    xhttp.addEventListener('load', function(){
        alert('User successfully added.')
        RefreshUsersTable();
        document.getElementById('addNewName').value='';
        document.getElementById('addNewBarcode').value='';
        });

    // Sends JSON data collected to server to add new user
    xhttp.send(JSON.stringify(jsonParams));
} 


// ----- UPDATE USER DETIALS -----
// Allows the editing of user details
function EditUser(clickedID) {
    // Clears edit area
    document.getElementById('editArea').innerHTML='';

    // Obtains the ID of the user of associated button that was clicked
    var idStr = document.getElementById(clickedID).id;
    var pattern = /\d+/;
    var id = pattern.exec(idStr)[0];

    // Makes new HTTP GET request to the Users endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", usersUrl+id);

    // When GET request has loaded the data obtained is used in the function
    xhttp.addEventListener('load', function() {
        // Obtains a JSON object of results from the HTTP request 
        var user = JSON.parse(this.response);

        // Declares data to display on page to edit
        var namePlaceholder = user.name;
        var barcodePlaceholder = user.barcode;
        var memTypePlaceholder = user.memberType;
        if (memTypePlaceholder == "Staff") {
            memTypeVal1 = "Staff";
            memTypeVal2 = "Student";
        } else {
            memTypeVal1 = "Student";
            memTypeVal2 = "Staff";
        }

        // Creates headings and text to display on page
        var headingText = document.createTextNode('Edit user details:');
        var editHeading = document.createElement('h3');
        editHeading.appendChild(headingText);
        var paraText = document.createTextNode('Editing details of user with ID: '+id+' - Type in the detils you want to edit (if attribute to remain unchanged leave the field blank).');
        var para = document.createElement('p');
        para.appendChild(paraText)

        // Creates name field to edit
        var nameEdit = document.createElement('input');
        nameEdit.setAttribute('type', 'text');
        nameEdit.setAttribute('value', '');
        nameEdit.setAttribute('placeholder', namePlaceholder);
        nameEdit.setAttribute('id', 'editName');

        // Creates barcode field to edit
        var barcodeEdit = document.createElement('input');
        barcodeEdit.setAttribute('type', 'text');
        barcodeEdit.setAttribute('value','');
        barcodeEdit.setAttribute('placeholder', barcodePlaceholder);
        barcodeEdit.setAttribute('id', 'editBarcode');

        // Creates member type dropdown field to edit
        var memTypeEdit = document.createElement('select');
        memTypeEdit.setAttribute('id', 'editMemType');
        var memTypeEditOpt1 = document.createElement('option');
        var memTypeEditOpt2 = document.createElement('option');
        var memTypeEditOpt1Text = document.createTextNode(memTypeVal1);
        var memTypeEditOpt2Text = document.createTextNode(memTypeVal2);
        memTypeEditOpt1.setAttribute('value', memTypeVal1);
        memTypeEditOpt2.setAttribute('value', memTypeVal2);
        memTypeEditOpt1.appendChild(memTypeEditOpt1Text);
        memTypeEditOpt2.appendChild(memTypeEditOpt2Text);
        memTypeEdit.appendChild(memTypeEditOpt1);
        memTypeEdit.appendChild(memTypeEditOpt2);

        // Creates submit button to submit any changes made
        var submitButton = document.createElement('button');
        var submitButtonText = document.createTextNode('submit');
        submitButton.appendChild(submitButtonText);
        submitButton.setAttribute('value', id);
        submitButton.setAttribute('onclick', 'EditUserSubmit(value)');

        // Displays all of the created fields/buttons on page 
        var editArea = document.getElementById('editArea');
        editArea.appendChild(editHeading);
        editArea.appendChild(para);
        editArea.appendChild(nameEdit);
        editArea.appendChild(barcodeEdit);
        editArea.appendChild(memTypeEdit);
        editArea.appendChild(submitButton);
    });

    // Sends HTTP request
    xhttp.send();
}


// ----- SUBMITS UPDATED USER DETAILS -----
// Function sends all edited data from EditUser() to server
function EditUserSubmit(id) {
    // Obtains the inputted values from page
    var nameEdit = document.getElementById('editName').value;
    var barcodeEdit = document.getElementById('editBarcode').value;
    var memTypeEdit = document.getElementById('editMemType').value;

    // Capitalises first letters of the newly inputted user name
    var nameArr = nameEdit.split(' ');
    var capNameArr = [];
    nameArr.forEach(function(name){
        var capName = name.charAt(0).toUpperCase()+name.substr(1);
        capNameArr.push(capName);
    });
    var capitalisedName = capNameArr.join(' ');
    
    // Makes new HTTP PUT request to the Users endpoint
    var xhttp = new XMLHttpRequest;
    xhttp.open("PUT", usersUrl+id);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    // Checks to confirm changes to be made should be submitted
    if (confirm("Click OK to confirm these changes.")) {
        // Checks what data has been changed and generates JSON parameters 
        // with corresponding data
        if (nameEdit == '' && barcodeEdit == '') {
            jsonParams = {
                memberType: memTypeEdit
            };
        } else if (nameEdit == '') {
            jsonParams = {
                barcode: barcodeEdit,
                memberType: memTypeEdit
            };
        } else if (barcodeEdit == '') {
            jsonParams = {
                name: capitalisedName,
                memberType: memTypeEdit
            }
        } else {
            jsonParams = {
                name: capitalisedName,
                barcode: barcodeEdit,
                memberType: memTypeEdit
            };
        } 
    } else {
        // Returns nothing if changes cancelled 
        return
    }

    // Refreshes display and clears display area when HTTP request loads
    xhttp.addEventListener('load', function(){
        RefreshUsersTable();
    });

    // Sends JSON data collected to server to edit user
    xhttp.send(JSON.stringify(jsonParams));
}
    

// ----- USER SEARCH ----- 
// Searches database of users by inputted parameters
function UserSearch() {
    // Clears any previous search results
    document.getElementById('displayList').innerHTML='';
    
    // Obtains inputted values to use for search
    var searchName = document.getElementById('nameSearch').value.replace(/\s/g, "%");
    var searchId = document.getElementById('idSearch').value;
    var searchBarcode = document.getElementById('barcodeSearch').value;

    // Concatenates search parameters to construct string to use as search URL 
    var url = userSearchUrl+'name='+searchName+'&id='+searchId+'&barcode='+searchBarcode;

    // Makes new HTTP GET request to the Users endpoint
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url);

    // When HTTP GET request has finished function runs
    xhttp.addEventListener('load', function(){  
        // Obtains search list area from HTML 
        var displayList = document.getElementById('displayList')
        
        // Obtains JSON object of search results from HTTP GET request 
        var response = JSON.parse(this.response);

        // Checks if search returned any results
        if (response.length == 0) {
            // Alerts user that no results have been found
            var text = document.createTextNode('No results found. Please try again.');
            var listItem = document.createElement('li');
            listItem.appendChild(text);
            displayList.appendChild(listItem);
        } else {
            // Loops through results and displays all results found
            for (i=0; i<response.length; i++) {
                // Creates text to display result
                var text = document.createTextNode('Name: '+response[i].name+
                    ' | ID: '+response[i].id+' | Barcode: '+response[i].barcode+
                    ' | Member Type: '+response[i].memberType+' ');
                
                // Creates edit button
                var editButton = document.createElement('button');
                var editText = document.createTextNode('edit user');
                editButton.appendChild(editText);
                editButton.setAttribute("id", "editButton"+response[i].id);
                editButton.setAttribute("onclick", "EditUser(this.id)");

                // Creates delete button
                var delButton = document.createElement('button');
                var delText = document.createTextNode('delete user');
                delButton.appendChild(delText);
                delButton.setAttribute("id", "delButton"+response[i].id);
                delButton.setAttribute("onclick", "DeleteUser(this.id)");

                // Creates loans button
                var loansButton = document.createElement('button')
                var loansText = document.createTextNode('show user\'s loans');
                loansButton.appendChild(loansText)
                loansButton.setAttribute("id", "loansButton"+response[i].id);
                loansButton.setAttribute("onclick", "GetUserLoans(this.id)");

                // Creates list item and displays all elements on page
                var listItem = document.createElement('li');
                listItem.appendChild(text);
                listItem.appendChild(editButton);
                listItem.appendChild(delButton);
                listItem.appendChild(loansButton)
                displayList.appendChild(listItem);
            }

            // Clears all search input fields
            document.getElementById('nameSearch').value='';
            document.getElementById('barcodeSearch').value='';
            document.getElementById('idSearch').value='';
        }
    });

    // Sends HTTP request
    xhttp.send();
}


// --- DELETE USERS ---
// General delete for users
function DeleteUser(clickedID) {
    if (clickedID) {
        // Obtains the ID of the user of associated button that was clicked
        var idStr = document.getElementById(clickedID).id;
        var pattern = /\d+/;
        var id = pattern.exec(idStr)[0];
    } else {
        // Obtains inputted user ID from 
        var id = document.getElementById('deleteUserId').value;
    } 
    // Checks for user to confirm deletion
    if (confirm("Click OK to confirm deletion of user ID: "+id)) {
        // Creates new HTTP DELETE request
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", usersUrl+id);

        // Once HTTP request loaded, refreshes display and clear input field
        xhttp.addEventListener('load', function(){
            RefreshUsersTable();
            RefreshBooksTable();
            document.getElementById('deleteUserId').value='';
        });

        // Sends HTTP request
        xhttp.send();
    } else {
        // Clears input field
        document.getElementById('deleteUserId').value='';
        return
    }
}