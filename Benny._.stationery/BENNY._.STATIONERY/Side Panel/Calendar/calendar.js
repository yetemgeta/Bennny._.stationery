var currentDate = new Date();

function renderCalendar() {
    var monthYear = document.getElementById('month-year');
    var calendarBody = document.getElementById('calendar-body');

    // Clear calendar
    calendarBody.innerHTML = '';

    // Set month and year in header
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    monthYear.textContent = getMonthName(month) + ' ' + year;

    // Get first day and last day of the month
    var firstDay = new Date(year, month, 1).getDay();
    var lastDay = new Date(year, month + 1, 0).getDate();

    var date = 1;
    for (var i = 0; i < 6; i++) {
        var row = document.createElement('tr');

        for (var j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                var cell = document.createElement('td');
                row.appendChild(cell);
            } else if (date > lastDay) {
                break;
            } else {
                var cell = document.createElement('td');
                cell.textContent = date;
                row.appendChild(cell);
                date++;
            }
        }

        calendarBody.appendChild(row);

        if (date > lastDay) {
            break;
        }
    }
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function getMonthName(month) {
    var monthNames = [
        'January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October',
        'November', 'December'
    ];
    return monthNames[month];
}

renderCalendar();