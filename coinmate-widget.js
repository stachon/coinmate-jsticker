(function() {

// Localize jQuery variable
var jQuery;

/******** Load jQuery if not present *********/
if (window.jQuery === undefined || window.jQuery.fn.jquery !== '3.1.0') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type","text/javascript");
    script_tag.setAttribute("src",
        "https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
          if (this.readyState == 'complete' || this.readyState == 'loaded') {
              scriptLoadHandler();
          }
      };
    } else { // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
} else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
}

/******** Called once jQuery has loaded ******/
function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
}

/******** Our main function ********/

var exchangePairs = {
  'BTC_EUR' : {
    decimalPlaces: 2,
    display: "EUR",
    apiName: "BTC_EUR",
  },
  'BTC_CZK' : {
    decimalPlaces: 2,
    display: "CZK",
    apiName: "BTC_CZK"
  },
};

var localizedMessages = {
  "en" : {
    "Buy at" : "Buy at",
    "Sell at": "Sell at",
    "Exchange data provided by" : "Exchange data provided by",
  },
  "cs" : {
    "Buy at" : "Koupit za",
    "Sell at": "Prodat za",
    "Exchange data provided by" : "Data poskytuje",
  }
}

var locale = "en";

function localizedString(key) {
  return localizedMessages[locale][key];
}

function formatWidget(data, currencyName) {
  var widget = "<div class='coinmate-widget-inner'>" +
  "<p class='coinmate-widget-header'>Bitcoin (BTC) <b>" + data.last + "</b> " + currencyName + "</p>" +
  //"<font color='#009900'><b>&#9650;</b> + 3.32 " + currencyName + " (+0.15 %)" +
  "  <p class='coinmate-widget-price'>" +
         localizedString("Buy at") + "<br>" +
  "      <span id='coinmate-ask-price'>" + data.ask + " " + currencyName + "</span>" +
  "  </p>" +
  "  <p class='coinmate-widget-price'>" +
         localizedString("Sell at") + "<br>" +
  "      <span id='coinmate-bid-price'>" + data.bid + " " + currencyName + "</span>" +
  "  </p>" +
  "  <p class='coinmate-widget-footer'>" + localizedString("Exchange data provided by") + " <a href='https://coinmate.io'>coinmate.io</a></p>" +
  "</div>";
  jQuery('#coinmate-widget').html(widget);
}

function displayError() {
  var widget = "An error has occured!";
  jQuery('#coinmate-widget').html(widget);
}

function fetchData(pair) {

  jQuery.ajax({
    url: 'https://coinmate.io/api/ticker?currencyPair=' + pair.apiName,
    type: 'GET',
    success: function(data) {
      formatWidget(data.data, pair.display);
    },
    error: function() {
      displayError();
    },
  });
}

function main() {
    jQuery(document).ready(function() {
      var dataPair = jQuery("#coinmate-widget").data("pair");
      var pair = exchangePairs[dataPair];
      var currencyName = pair.display;
      locale = jQuery("#coinmate-widget").data("lang");
      locale = (typeof locale === 'undefined') ? "en" : locale;

      fetchData(pair);

      jQuery.getScript("https://js.pusher.com/3.1/pusher.min.js", function() {
        var coinmatePusher = new Pusher('af76597b6b928970fbb0' , {
          encrypted: true
        });

        var coinmateChannel = coinmatePusher.subscribe('order_book-' + pair.apiName);
        coinmateChannel.bind('order_book', function(data) {
          var bid = data.bids[0].price;
          var ask = data.asks[0].price;
          jQuery('#coinmate-bid-price').text(bid + " " + currencyName);
          jQuery('#coinmate-ask-price').text(ask + " " + currencyName);
        });
      });
      //setInterval(function(){ fetchData(); }, 5000);
    });
}

})(); // We call our anonymous function immediately
