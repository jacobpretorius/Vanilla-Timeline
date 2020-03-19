// Inject the script to hide tweets
var s = document.createElement('script');
s.src = chrome.extension.getURL('VanillaTimeline.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    // Load the settings
    chrome.storage.sync.get({
        hideRetweets: true,
        hideLikes: true,
        accounts: []
    }, function(items) {
        if (items.hideRetweets) {
            document.body.setAttribute("vanilla-timeline-hide-retweets", true);
        }
        if (items.hideLikes) {
            document.body.setAttribute("vanilla-timeline-hide-likes", true);
        }
        document.body.setAttribute("data-vanilla-timeline-accounts", JSON.stringify(items.accounts));
    });

    s.parentNode.removeChild(s);
};