// NB make sure i18n values are entered in lowercase
// Except for the language name.
var VanillaTimelineLocalization = [
  {
    Name: "English",
    Liked: {
      // 'Some User liked'
      i18n: "liked",
      checkStart: false,
      hasAlternate: false,
      i18nAlternate: "",
    },
    Retweet: {
      // 'Some User Retweeted'
      i18n: "retweeted",
      checkStart: false,
    },
    List: {
      // 'Tweet from Some List'
      i18n: "tweet from",
      checkStart: true,
    },
    Follow: {
      // 'Someuser and 5 others follow'
      i18n: "follow",
      checkStart: false,
    },
  },
  {
    Name: "Portuguese",
    Liked: {
      // 'Some User curtiu'
      i18n: "curtiu",
      checkStart: false,
      // 'Two users curtiram'
      hasAlternate: true,
      i18nAlternate: "curtiram",
    },
    Retweet: {
      // 'Some User retweetou'
      i18n: "retweetou",
      checkStart: false,
    },
    List: {
      // 'Tweet de Some List'
      i18n: "tweet de",
      checkStart: true,
    },
    Follow: {
      // 'Someuser e 5 outros seguem'
      i18n: "seguem",
      checkStart: false,
    },
  },
];
