var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
var weekdays   = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var today  = new Date()
var months = []

function generateCalendar (eventData) {
  var eventData = eventData.sort(function(a, b) { return (new Date(a.dateoftalk)) - (new Date(b.dateoftalk)) })
  generateAllTheMonths(eventData)
  eventData.forEach(function (event) {
   appendEventCustom(event)
  })

  // Highlight today
  $('#' + formattedDate(today)).removeClass('no-event').addClass('today')
  addMonthMenu()
}

function addMonthMenu() {
  $('#calendar-goes-here').prepend('<div id="cal-controls">')
  $('.month-table').each(function(_, table) {
    var month = $(table).data('month')
    $('#cal-controls').append('<a class="month-menuitem" data-target="' + month + '" href="#' + month + '">' + month + '</a>')
  })

  $(document).on('click', '.month-menuitem', function(e) {
    $('[data-month]').hide()
    $('[data-month="' + $(this).data('target') + '"]').show()
    $(this).addClass('active').siblings().removeClass('active')
    e.preventDefault()
  })

  // Get current month and click it
  var currentMonth = $('[data-target=' + (new Date()).getFullYear() + "-"  + monthNames[(new Date()).getMonth()] + ']')
  if( currentMonth.length ) {
    currentMonth.click()
  } else {
    $('[data-target]').first().click()
  }
}

function appendEventCustom(event){
   var eventDate = new Date(event.dateoftalk)
   //var eventElement = $('<div class="event"><a target="_blank" href="' + event.slidelink + '"class="collapsible">' + event.topic + '</a></div>')
  // $('#' + formattedDate(eventDate)).removeClass('no-event').append(eventElement)
  // var eventDate = new Date(event.dateoftalk)
  console.log(event.slidelink)
  var buttonElement = $('<button class="collapsible">' + event.topic + '</button><div class="content"> <p>' +
  '<ul style="list-style-type:none"><li><b>Topic:</b> ' + event.topic +
  '</li> <li><b>Speaker:</b> ' +  event.speaker + 
  '</li> <li> <b>Start Time:</b> ' + event.starttime + 
  '</li> <li> <b>Venue:</b> ' + event.venue +
  '</li> <li> <b>Link:</b> ' + '<a target="_blank" href="' + event.slidelink + '"class="collapsible">' +   event.slidelink + '</a>' +
  '</li></ul> <\p></div>')
  

  $('#' + formattedDate(eventDate)).removeClass('no-event').append(buttonElement)
  var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
}

/*
function appendEvent( event ) {
  var eventStartDate = new Date(event.dateoftalk)
  console.log(eventStartDate)
  var eventEndDate   = new Date(event.enddate)
  console.log(eventEndDate)
  var eventElement   = $('<div class="event"><a target="_blank" href="' + event.tickets + '">' + event.name + '</a></div>')

  // Handle multi-days
  if ( eventEndDate.getDate() ) {
    var date         = eventStartDate
    var spacerNumber = $('#' + formattedDate(eventStartDate)).find('.event').length
    eventElement.addClass('multi-days')

    while ( eventEndDate > date ) {
      // If reached end of month, go to first day of the next month
      // Else go to the next day
      if (date == new Date(date.getFullYear(), date.getMonth() + 1, 0)) {
        date == new Date(date.getFullYear(), date.getMonth() + 1, 1)
      } else {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 )
      }

      // Add spacer to line up the event
      var dateElement = $('#' + formattedDate(date))
      var steps = dateElement.find('.event').length
      loopForTimes( spacerNumber - steps, function() {
        dateElement.append('<div class="event spacer">&nbsp;</div>')
      })

      dateElement.removeClass('no-event').append('<div class="event multi-days following-days" title="' + event.name + '"><a target="_blank" href="' + event.tickets + '">' + event.name + '</a></div>')
    }
  }

  $('#' + formattedDate(eventStartDate)).removeClass('no-event').append(eventElement)
}*/

function generateAllTheMonths( eventData ) {
  var dates = []
  var months = []

  eventData.forEach(function(event) {
    if (event.dateoftalk) dates.push(event.dateoftalk)
    //if (event.dateoftalk) dates.push(event.dateoftalk)
  })

  dates.forEach(function (date) {
    date = new Date(date)
    if(months.indexOf(date.getFullYear().toString() + date.getMonth()) < 0) {
      months.push(date.getFullYear().toString() + date.getMonth())
      generateMonthTable(date)
    } else {
    }
  })
}

function generateMonthTable( date ) {
  var eventMonthName = monthNames[date.getMonth()]
  var monthTable     = $('<table cellspacing=0 class="month-table" data-month="' + date.getFullYear() + "-"  + eventMonthName + '" id="month-' + date.getMonth() + '"></table>')
  var monthTableBody = monthTable.append('<tbody>')
  // var today          = new Date()
  var endOfToday     = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 00, 00, 00)
  var firstDay       = new Date(date.getFullYear(), date.getMonth(), 1)
  var numberOfDays   = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  var weekDayNumber  = firstDay.getDay()

  $('#calendar-goes-here').append(monthTable)
  monthTable.before('<h2 data-month="' + date.getFullYear() + '-' + eventMonthName + '">' + eventMonthName + ' ' + date.getFullYear() + '</h2>')

  // Add month calendar header
  monthTableBody.append('<tr class="header"></tr>')
  var headerRow = monthTableBody.find('.header')
  loopForTimes( 7, function(i) {
    headerRow.append('<td>' + weekdays[i] + '</td>')
  })

  // Add empty days from previous month
  var times = weekDayNumber == 0 ? 6 : weekDayNumber - 1
  loopForTimes( times, function() {
    getFirstAvailableRow(monthTable).append('<td class="empty"></td>')
  })

  // Filling the month with days
  loopForTimes( numberOfDays, function(daynumber) {
    var thisDay = new Date(date.getFullYear(), date.getMonth(), (daynumber + 1))
    var id = formattedDate(thisDay)
    var pastClass = endOfToday > thisDay ? "past" : ""
    getFirstAvailableRow(monthTableBody).append('<td class="no-event ' + pastClass + '" id=' + id + '><div class=day>'+ (daynumber + 1) +'</div></td>')
  })

  // Add empty days from next month
  var lastRow = monthTable.find('tr:last')
  var cellsInLastRow = lastRow.find('td').length
  // Check if this is necessary
  if ( cellsInLastRow < 7 ) {
    loopForTimes( (7 - cellsInLastRow), function() {
      lastRow.append('<td class="empty"></td>')
    })
  }
}

// Because I don't like ot write for()
function loopForTimes( times, callback ) {
  for( var i=0; i < times; i++ ){
    callback(i)
  }
}

// This is handy: getting the first row with available cell space
function getFirstAvailableRow( table ) {
  var row = table.find('tr.days').filter(function(i, thisRow) {
    return ($(thisRow).find('td').length) < 7
  })
  // If no available row, create a new one
  if( row.length == 0 ) {
    table.append('<tr class=days>')
    var row = table.find('tr').last()
  }
  return row
}

// Create an unique date string for cell lookup
function formattedDate( date ) {
  return date.getFullYear() + '-' + monthNames[date.getMonth()] + '-' + date.getDate()
}
