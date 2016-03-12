// best practice: wrap in function
(function() {

  // this controller handles the filtering and searching of brothers
  var listingController = function(){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than brother
    var listing = this;

    // =========================================================================
    // =========================================================================
    // for handling checkbox filters
    // set default options
    listing.sortType     = 'roll';
    listing.sortReverse  = true;
    listing.search       = '';
    listing.filter       = {};

    // The options available for standings
    listing.standings = [
      { property : "standing", value: "Active" },
      { property : "standing", value: "Alumni" },
    ];

    // The relevant options available for employment seeking status
    listing.availables = [
      { property : "available", value: "Internship" },
      { property : "available", value: "Full-Time" },
      { property : "available", value: "Part-Time" },
      { property : "available", value: "Unavailable"}
    ];

    // The gpa brackets
    listing.gpas = [
      { property : "gpa", value: "3.00 - 3.32" },
      { property : "gpa", value: "3.33 - 3.66" },
      { property : "gpa", value: "3.67 - 4.00" },
      { property : "gpa", value: "On Request" },
    ];

    // =========================================================================
    // =========================================================================
    // Filter by property
    listing.filterByProperties = function (brother) {
      // Use this snippet for matching with AND
      var matchesAND = true;
      for (var prop in listing.filter) {
        if (noSubFilter(listing.filter[prop])) continue;
        if (!listing.filter[prop][brother[prop]]) {
          matchesAND = false;
          break;
        }
      }
      return matchesAND;
    };

    // =========================================================================
    // =========================================================================
    // checks if there is any filter activated
    function noSubFilter(subFilterObj) {
      for (var key in subFilterObj) {
        if (subFilterObj[key]) return false;
      }
      return true;
    };

    // =========================================================================
    // =========================================================================
    // set the id of the clicked row in scope because uirouter doesn't accept angular exp as parameters
    listing.setID = function(brother){
      listing.desiredID = brother._id;
    };
    
  }

  // =========================================================================
  // =========================================================================
    // For minification purposes
    listingController.$inject = [];

    // Attach the controller
    angular.module('zgApp').controller('listingController', listingController);
}());
