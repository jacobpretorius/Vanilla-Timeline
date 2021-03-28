// Thread.sleep() in JS
const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const compareText = (checkStart, text, i18n, hasAlternate, i18nAlternate) => {
  if (!text || !text.length) {
    return false;
  }
  const lower = text.toLowerCase();
  const mainCheck = checkStart ? lower.startsWith(i18n) : lower.endsWith(i18n);
  if (mainCheck || !hasAlternate) {
    return mainCheck;
  }
  return checkStart
    ? lower.startsWith(i18nAlternate)
    : lower.endsWith(i18nAlternate);
};

const checkChildForRetweet = (thisNode) => {
  let thisNodeResult = compareText(
    this.LocalizationSettings.Retweet.checkStart,
    thisNode.innerText,
    this.LocalizationSettings.Retweet.i18n,
    false,
    null
  );

  if (thisNodeResult) {
    return true;
  }

  if (thisNode.children.length > 0) {
    for (let i = 0; i < thisNode.children.length; i++) {
      if (checkChildForRetweet(thisNode.children[i])) {
        return true;
      }
    }
  }

  return false;
};

const checkChildForLiked = (thisNode) => {
  let thisNodeResult = compareText(
    this.LocalizationSettings.Liked.checkStart,
    thisNode.innerText,
    this.LocalizationSettings.Liked.i18n,
    this.LocalizationSettings.Liked.hasAlternate,
    this.LocalizationSettings.Liked.i18nAlternate
  );

  if (thisNodeResult) {
    return true;
  }

  if (thisNode.children.length > 0) {
    for (let i = 0; i < thisNode.children.length; i++) {
      if (checkChildForLiked(thisNode.children[i])) {
        return true;
      }
    }
  }

  return false;
};

const checkChildForList = (thisNode) => {
  let thisNodeResult = compareText(
    this.LocalizationSettings.List.checkStart,
    thisNode.innerText,
    this.LocalizationSettings.List.i18n,
    false,
    null
  );

  if (thisNodeResult) {
    return true;
  }

  if (thisNode.children.length > 0) {
    for (let i = 0; i < thisNode.children.length; i++) {
      if (checkChildForList(thisNode.children[i])) {
        return true;
      }
    }
  }

  return false;
};

const checkChildForFollow = (thisNode) => {
  let thisNodeResult = compareText(
    this.LocalizationSettings.Follow.checkStart,
    thisNode.innerText,
    this.LocalizationSettings.Follow.i18n,
    false,
    null
  );

  if (thisNodeResult) {
    return true;
  }

  if (thisNode.children.length > 0) {
    for (let i = 0; i < thisNode.children.length; i++) {
      if (checkChildForFollow(thisNode.children[i])) {
        return true;
      }
    }
  }

  return false;
};

const isWhitelistAccountTweet = (tweet) => {
  let allLinks = tweet.querySelectorAll("a");
  for (let i = 0; i < allLinks.length; i++) {
    if (
      whitelistAccounts.some(
        (x) => allLinks[i].href === `https://twitter.com${x}`
      )
    ) {
      return true;
    }
  }
  return false;
};

const processTweets = () => {
  for (let i = 0; i < this.allTweets.length; i++) {
    const tweet = this.allTweets[i];

    if (tweet.classList.contains("vanilla-timeline-pass")) {
      continue;
    }
    if (isWhitelistAccountTweet(tweet)) {
      tweet.classList.add("vanilla-timeline-pass");
      continue;
    }
    if (this.hideRetweets && checkChildForRetweet(tweet)) {
      tweet.remove();
      console.log("Retweet hidden.");
      continue;
    }
    if (this.hideLikes && checkChildForLiked(tweet)) {
      tweet.remove();
      console.log("Liked tweet hidden.");
      continue;
    }
    if (this.hideLists && checkChildForList(tweet)) {
      tweet.remove();
      console.log("List tweet hidden.");
      continue;
    }
    if (this.hideFollow && checkChildForFollow(tweet)) {
      tweet.remove();
      console.log("Suggested related follow tweet hidden.");
      continue;
    }
    tweet.classList.add("vanilla-timeline-pass");
  }
};

const onValidUrl = () => {
  let activeUrl = window.location.toString();
  // Only run on these three urls
  if (
    activeUrl === "https://twitter.com" ||
    activeUrl === "https://twitter.com/" ||
    activeUrl === "https://twitter.com/home"
  ) {
    return true;
  }
  return false;
};

var hideRetweets = false;
var hideLikes = false;
var hideLists = false;
var hideFollow = false;
var whitelistAccounts = [];
var selectedLanguage = "";
var LocalizationSettings = {};

var allTweets = document.querySelectorAll("article");

window.onload = async function () {
  console.log("Vanilla Timeline is starting - v1.7");

  while (true) {
    await sleep(300);
    if (onValidUrl()) {
      // Load the settings
      try {
        chrome.storage.sync.get(
          {
            hideRetweets: true,
            hideLikes: true,
            hideLists: false,
            hideFollow: true,
            language: "English",
            accounts: [],
          },
          function (items) {
            hideRetweets = items.hideRetweets;
            hideLikes = items.hideLikes;
            hideLists = items.hideLists;
            hideFollow = items.hideFollow;

            if (selectedLanguage !== items.language) {
              selectedLanguage = items.language;
              LocalizationSettings = VanillaTimelineLocalization.filter(
                (x) => x.Name === selectedLanguage
              ).pop();
              console.log(`Language set to: ${LocalizationSettings.Name}.`);
            }

            if (items.accounts !== null && items.accounts.length) {
              items.accounts.forEach((handle) => {
                whitelistAccounts.push(handle.replace("@", "/"));
              });
            }
          }
        );
      } catch (e) {} // Chrome gets sad if you navigate out of script context. We don't care as the plugin shouldn't run then

      // Loop all article elements (tweets) every 300ms
      this.allTweets = document.querySelectorAll("article");

      processTweets();
    }
  }
};
