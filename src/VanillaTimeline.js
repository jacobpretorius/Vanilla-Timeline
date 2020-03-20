// Thread.sleep() in JS
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const checkChildForRetweet = (thisNode) => {
    if (thisNode.innerText && thisNode.innerText.length 
        && thisNode.innerText.endsWith("Retweeted")) {
        return true;
    }

    if (thisNode.children.length > 0) {
        for (let i = 0; i < thisNode.children.length; i++) {
            if (checkChildForRetweet(thisNode.children[i]))
            {
                return true
            }
        }
    }

    return false;
}

const checkChildForLiked = (thisNode) => {
    if (thisNode.innerText && thisNode.innerText.length 
        && thisNode.innerText.endsWith("liked")) {
        return true;
    }

    if (thisNode.children.length > 0) {
        for (let i = 0; i < thisNode.children.length; i++) {
            if (checkChildForLiked(thisNode.children[i]))
            {
                return true
            }
        }
    }

    return false;
}

const isWhitelistAccountTweet = tweet => {
    let allLinks = tweet.querySelectorAll("a");
    for (let i = 0; i < allLinks.length; i++) {
        if (whitelistAccounts.some(x => allLinks[i].href === `https://twitter.com${x}`)){
            return true;
        }
    }
    return false;
}

const processTweets = _ => {
    this.allTweets.forEach(tweet => {
        if (tweet.classList.contains("vanilla-timeline-pass")){
            return;
        }
        if (isWhitelistAccountTweet(tweet)) {
            tweet.classList.add("vanilla-timeline-pass");
            return;
        } else
        if (this.hideRetweets && checkChildForRetweet(tweet)) {
            tweet.remove();
            console.log(`${tweet.innerText.substring(0, tweet.innerText.indexOf("Retweeted"))}retweet hidden.`);
        } else 
        if (this.hideLikes && checkChildForLiked(tweet)) {
            tweet.remove();
            console.log(`${tweet.innerText.substring(0, tweet.innerText.indexOf("Liked"))}like hidden.`);
        }
        else {
            tweet.classList.add("vanilla-timeline-pass");
        }
    });
};

const onValidUrl = () =>{
    let activeUrl = window.location.toString();
    // Only run on these three urls
    if (activeUrl === "https://twitter.com" 
    || activeUrl === "https://twitter.com/" 
    || activeUrl === "https://twitter.com/home") {
        return true;
    }
    return false;
}

var hideRetweets = false;
var hideLikes = false;
var whitelistAccounts = [];
var allTweets = document.querySelectorAll("article");

window.onload = async function () {
    console.log("Vanilla Timeline is starting.");
    
    while (true) {
        await sleep(300);
        if (onValidUrl()) {
            // Load the settings
            try { 
                chrome.storage.sync.get({
                    hideRetweets: true,
                    hideLikes: true,
                    accounts: []
                }, function(items) {
                    hideRetweets = items.hideRetweets;
                    hideLikes = items.hideLikes;
                    if (items.accounts !== null && items.accounts.length){
                        items.accounts.forEach(handle => {
                            whitelistAccounts.push(handle.replace("@", "/"));
                        });
                    }
                });
            } catch (e) {} // Chrome gets sad if you navigate out of script context. We don't care as the plugin shouldn't run then
            
            // Loop all article elements (tweets) every 300ms
            this.allTweets = document.querySelectorAll("article");

            processTweets();
        }
    }    
}
