(function ($) {
    "use strict";

    // Spinner //
    var spinner=function () {
        setTimeout(function () {
                if ($('#spinner').length > 0) {
                    $('#spinner').removeClass('show');
                }
            }

            , 1);
    }

    ;
    spinner();


    // Initiate the wowjs //
    new WOW().init();


    // Sticky Navbar //
    $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.sticky-top').addClass('shadow-sm').css('top', '0px');
            }

            else {
                $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
            }
        });


    // Back to top button //
    $(window).scroll(function () {
            if ($(this).scrollTop() > 300) {
                $('.back-to-top').fadeIn('slow');
            }

            else {
                $('.back-to-top').fadeOut('slow');
            }
        });

    $('.back-to-top').click(function () {
            $('html, body').animate({
                scrollTop: 0
            }

            , 1500, 'easeInOutExpo');
        return false;
    });


// Facts counter //
$('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000
});


// Header carousel //
$(".header-carousel").owlCarousel({
autoplay: true,
smartSpeed: 1500,
items: 1,
dots: true,
loop: true,
nav : true,
navText : [ '<i class="bi bi-chevron-left"></i>',
'<i class="bi bi-chevron-right"></i>'
]
});


// Testimonials carousel //
$(".testimonial-carousel").owlCarousel({
autoplay: true,
smartSpeed: 1000,
center: true,
dots: false,
loop: true,
nav : true,
navText : [ '<i class="bi bi-arrow-left"></i>',
'<i class="bi bi-arrow-right"></i>'

],
responsive: {
    0: {
        items:1
    }

    ,
    768: {
        items:2
    }
}
});


// Portfolio isotope and filter //
var portfolioIsotope=$('.portfolio-container').isotope({
itemSelector: '.portfolio-item',
layoutMode: 'fitRows'
});

$('#portfolio-flters li').on('click', function () {
    $("#portfolio-flters li").removeClass('active');
    $(this).addClass('active');

    portfolioIsotope.isotope({
        filter: $(this).data('filter')
    });
});

})(jQuery);

// Back.html //

var inventoryData=[];
var undoStack=[];
var redoStack=[];

if (localStorage.getItem("inventory")) {
inventoryData=JSON.parse(localStorage.getItem("inventory"));
}

document.addEventListener("DOMContentLoaded", function () {
    populateTable();
});

function populateTable() {
var tableBody=document.querySelector("#inventory-table tbody");

for (var i=0; i < inventoryData.length; i++) {
    var row=inventoryData[i];
    addRow(row.item, row.value, row.quantity);
}
}

function addRow(item, value, quantity) {
var tableBody=document.querySelector("#inventory-table tbody");
var row=document.createElement("tr");

addTableCell(row, item || "New Item", true);
addTableCell(row, value || 0, true);
addTableCell(row, quantity || 0, true);
addTableCell(row, ""); // Total cell
addActionCell(row);

tableBody.insertBefore(row, tableBody.lastElementChild);
}

function addTableCell(row, content, isEditable) {
var cell=document.createElement("td");

if (isEditable) {
    cell.contentEditable=true;
}

cell.textContent=content;
row.appendChild(cell);
}

function addActionCell(row) {
var actionsCell=document.createElement("td");
var deleteButton=document.createElement("button");
deleteButton.textContent="Delete";

deleteButton.addEventListener("click", function () {
        deleteRow(row);
    });
actionsCell.appendChild(deleteButton);
row.appendChild(actionsCell);
}

function deleteRow(row) {
if (confirm("Are you sure you want to delete this row?")) {
    row.parentNode.removeChild(row);
}
}

function calculateTotal() {
var rows=document.querySelectorAll("#inventory-table tbody tr");
var total=0;

for (var i=0; i < rows.length; i++) {
    var row=rows[i];
    var value=parseFloat(row.children[1].textContent);
    var quantity=parseFloat(row.children[2].textContent);
    var rowTotal=value * quantity;

    if ( !isNaN(rowTotal)) {
        row.children[3].textContent=rowTotal.toFixed(2);
        total+=rowTotal;
    }
}

document.getElementById("total-cell").textContent=total.toFixed(2);
}

function saveData() {
calculateTotal();

var tableBody=document.querySelector("#inventory-table tbody");
var rows=tableBody.querySelectorAll("tr");
inventoryData=[];

for (var i=0; i < rows.length; i++) {
    var row=rows[i];
    var item=row.children[0].textContent;
    var value=parseFloat(row.children[1].textContent);
    var quantity=parseFloat(row.children[2].textContent);

    if ( !isNaN(value) && !isNaN(quantity)) {
        inventoryData.push({
            item: item,
            value: value,
            quantity: quantity
        });
}
}

localStorage.setItem("inventory", JSON.stringify(inventoryData));
alert("Inventory data saved successfully!");
}

$('#side-panel').on('mousewheel', function (e) {
    var delta=e.originalEvent.deltaY;

    if (delta > 0) {
        $(this).scrollTop($(this).scrollTop() + 100);
    }

    else {
        $(this).scrollTop($(this).scrollTop() - 100);
    }
});

function toggleSidePanel() {
var sidePanel=document.getElementById("side-panel");
sidePanel.classList.toggle("open");

var mainContent=document.getElementById("main-content");
var toggleButton=document.getElementById("side-panel-toggle");
var toggleText=document.getElementById("side-panel-toggle-text");

if (sidePanel.classList.contains("open")) {
    adjustMainContentWidth(320);
    updateToggleButton("←", "Close");
}

else {
    adjustMainContentWidth(0);
    updateToggleButton("→", "Open");
}
}


function adjustMainContentWidth(width) {
document.getElementById("main-content").style.width=`calc(100% - ${width}px)`;
}

function updateToggleButton(icon, text) {
document.getElementById("side-panel-toggle").innerHTML=icon;
document.getElementById("side-panel-toggle-text").textContent=text;
}

// Function to export data to a CSV file
function exportData() {
var rows=document.querySelectorAll("#inventory-table tbody tr");
var csvContent="data:text/csv;charset=utf-8,";

// Add column headers
csvContent+="Name,Value,Quantity,Total\n";

// Construct CSV content
rows.forEach(function(row) {
        var rowData=[];

        row.querySelectorAll("td").forEach(function(cell, index) {

                // Exclude the last cell (action cell with delete button)
                if (index < 4) {
                    rowData.push(cell.textContent);
                }
            });
        csvContent +=rowData.join(",") + "\n";
    });

// Create a data URI for the CSV content
var encodedUri=encodeURI(csvContent);

// Create a temporary link element and trigger a download
var link=document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "inventory_data.csv");
document.body.appendChild(link); // Required for Firefox
link.click();

// Cleanup
document.body.removeChild(link);
}

// Function to import data from a CSV file
function importData(event) {
var file=event.target.files[0];

if (file) {
    var reader=new FileReader();

    reader.onload=function () {
        var data=reader.result;
        var rows=data.split("\n");

        // Clear existing table data
        clearTable();

        // Populate table with data from CSV, skipping the first line
        for (var i=1; i < rows.length; i++) {
            var rowData=rows[i].split(",");

            if (rowData.length===4) {
                addRow(rowData[0], rowData[1], rowData[2]);
            }
        }
    }

    ;

    reader.readAsText(file);
}
}

// Function to clear existing table data
function clearTable() {
var tableBody=document.querySelector("#inventory-table tbody");
tableBody.innerHTML='';
}


function searchItems() {
var input,
filter,
table,
tr,
td,
i,
txtValue;
input=document.getElementById("searchInput");
filter=input.value.toUpperCase();
table=document.getElementById("inventory-table");
tr=table.getElementsByTagName("tr");

// Loop through all table rows, and hide those that don't match the search query
for (i=0; i < tr.length; i++) {
    td=tr[i].getElementsByTagName("td")[0]; // Change index to match the column you want to search (e.g., 0 for name)

    if (td) {
        txtValue=td.textContent || td.innerText;

        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display="";
        }

        else {
            tr[i].style.display="none";
        }
    }
}
}


//firebase//

const firebaseConfig= {
apiKey: "AIzaSyBx7j5e9IEoHu8syzkAgOHPyrWveS6G6RA",
    authDomain: "benny-stationery-7005d.firebaseapp.com",
    databaseURL: "https://benny-stationery-7005d-default-rtdb.firebaseio.com",
    projectId: "benny-stationery-7005d",
    storageBucket: "benny-stationery-7005d.appspot.com",
    messagingSenderId: "902546331580",
    appId: "1:902546331580:web:f0005597f0f73e9bed7db9"
}

;

//initialize
firebase.initializeApp(firebaseConfig);

//reference your database
var bennyStationeryDB=firebase.database().ref('Benny-stationery');


document.getElementById('contactForm').addEventListener("submit", submitForm);

function submitForm(e) {
e.preventDefault();

var firstName=getElementByVal('FirstName');
var middleName=getElementByVal('MiddleName');
var lastName=getElementByVal('LastName');
var emailID=getElementByVal('EmailID');
var MobileNumber=getElementByVal('MobileNumber');
var password=getElementByVal('CompanyPassword');
var SpecialNote=getElementByVal('SpecialNote');

saveMessages(firstName, middleName, lastName, emailID, MobileNumber, password, SpecialNote) .then(()=> {
        // Redirect to back.html after saving data
        window.location.href='back.html';

    }) .catch(error=> {
        console.error('Error saving data:', error);
        // Handle error, such as displaying an error message to the user
    });
// console.log(firstName, middleName, lastName, emailID, MobileNumber, password, SpecialNote)
}

const saveMessages=(firstName, middleName, lastName, emailID, MobileNumber, password, SpecialNote)=> {
var newContactForm=bennyStationeryDB.push();

newContactForm.set({
    FirstName : firstName,
    MiddleName : middleName,
    LastName : lastName,
    EmailID : emailID,
    MobileNumber : MobileNumber,
    CompanyPassword : password,
    SpecialNote : SpecialNote,

});
}

;

const getElementByVal=(id)=> {
return document.getElementById(id).value;
}

;

// calculator //

            function appendCharacter(character) {
        document.getElementById('result').value += character;
    }
    
    function clearResult() {
        document.getElementById('result').value = '';
    }
    
    function deleteCharacter() {
        var result = document.getElementById('result').value;
        document.getElementById('result').value = result.slice(0, -1);
    }
    
    function evaluateExpression() {
        var result = document.getElementById('result').value;
        document.getElementById('result').value = eval(result);
    }

$('#side-panel').on('mousewheel', function (e) {
var delta = e.originalEvent.deltaY;
if (delta > 0) {
// Scrolling down
$(this).scrollTop($(this).scrollTop() + 100);
} else {
// Scrolling up
$(this).scrollTop($(this).scrollTop() - 100);
}
});                      


//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//


