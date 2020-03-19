console.log("Vanilla Timeline is starting.");

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
        && thisNode.innerText.endsWith("Liked")) {
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

let hideRetweets = false;
let hideLikes = false;
let whitelistAccounts = [];

let allTweets = document.querySelectorAll("article");
window.addEventListener('load', async function () {
    this.hideRetweets = document.body.getAttribute("vanilla-timeline-hide-retweets") === "true";
    this.hideLikes = document.body.getAttribute("vanilla-timeline-hide-likes") === "true";
    let accountHandles = JSON.parse(document.body.getAttribute("data-vanilla-timeline-accounts"));

    if (accountHandles !== null && accountHandles.length){
        accountHandles.forEach(handle => {
            whitelistAccounts.push(handle.replace("@", "/"));
        });
    }

    // Loop all article elements (tweets) every 300ms
    while (true) {
        this.allTweets = document.querySelectorAll("article");

        await sleep(300);
        
        processTweets();
    }
});
