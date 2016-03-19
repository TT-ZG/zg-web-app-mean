angular.module('zgApp').service('items', [function () {
    var loggedIn = false;
    // The options available for standings
    var standings = [
      { property : "standing", value: "Active" },
      { property : "standing", value: "Alumni" },
    ];

    // The relevant options available for employment seeking status
    var availables = [
      { property : "available", value: "Internship" },
      { property : "available", value: "Full-Time" },
      { property : "available", value: "Part-Time" },
      { property : "available", value: "Unavailable"}
    ];

    // The gpa brackets
    var gpas = [
      { property : "gpa", value: "3.00 - 3.32" },
      { property : "gpa", value: "3.33 - 3.66" },
      { property : "gpa", value: "3.67 - 4.00" },
      { property : "gpa", value: "On Request" },
    ];

    var defaultBrother = {
      available: 'Unavailable',
      gpa: 'On Request',
      standing: 'Active',
      internships: [{id: 1, name:''}]
    };

    return {
        getStandings: function () {
            return standings;
        },
        getAvailables: function () {
            return availables;
        },
        getGpas: function () {
            return gpas;
        },
        getDefault: function() {
          return defaultBrother;
        }
    };
}]);
