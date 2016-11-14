# Coinmate JavaScript Widget

An embeddable JS widget to include on your site to display the latest prices on [Coinmate.io](https://coinmate.io)

# Usage

1. Include the JS in your page:


```
<script type="text/javascript" src="coinmate-widget.js"></script>
```

2. Include the CSS stylesheet or supply your own:

```
<link rel="stylesheet" type="text/css" href="coinmate-widget.css"/>
```

3. Include a DIV with ID `coinmate-widget`:

```
<div id="coinmate-widget" data-pair="BTC_EUR"></div>
```

# Configuration

Use the following attributes of the widget DIV to customize the ticker:

* `data-lang` to select the display langauage. Currently "en" for English or "cs" for Czech.
* `data-pair` to select the currency pair. Currently BTC_EUR or BTC_CZK.

# Notes on implementation

* It embeds its own version of jQuery
* First fetch of price is done with REST, subsequent updates are using WebSockets API.
