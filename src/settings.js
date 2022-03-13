var accounts = [];

// Setup i18n drop down
let select = $("#language")[0];
select.options.length = 0;
for (let i = 0; i < VanillaTimelineLocalization.length; i++) {
  select.add(new Option(VanillaTimelineLocalization[i].Name));
}

// Saves options to chrome.storage
var save_options = () => {
  let hideRetweets = document.getElementById("retweets").checked;
  let hideLikes = document.getElementById("likes").checked;
  let hideLists = document.getElementById("lists").checked;
  let hideFollow = document.getElementById("follow").checked;
  let hidePromoted = document.getElementById("promoted").checked;
  let hideTrending = document.getElementById("trending").checked;
  let language = document.getElementById("language").value;

  chrome.storage.sync.set(
    {
      hideRetweets,
      hideLikes,
      hideLists,
      hideFollow,
      hidePromoted,
      hideTrending,
      language,
      accounts,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.classList.remove("hidden");
      setTimeout(function () {
        status.classList.add("hidden");
      }, 3000);
    }
  );
};

// Restores state using the preferences
// stored in chrome.storage.
var restore_options = () => {
  chrome.storage.sync.get(
    {
      hideRetweets: true,
      hideLikes: true,
      hideLists: false,
      hideFollow: true,
      hidePromoted: false,
      hideTrending: true,
      language: "English",
      accounts: [],
    },
    function (items) {
      document.getElementById("retweets").checked = items.hideRetweets;
      document.getElementById("likes").checked = items.hideLikes;
      document.getElementById("lists").checked = items.hideLists;
      document.getElementById("follow").checked = items.hideFollow;
      document.getElementById("promoted").checked = items.hidePromoted;
      document.getElementById("trending").checked = items.hideTrending;
      document.getElementById("language").value = items.language;
      accounts = items.accounts;
    }
  );
};

document.addEventListener("DOMContentLoaded", restore_options);
document.addEventListener("load", restore_options);
document.getElementById("save").addEventListener("click", save_options);
document.getElementById("language").addEventListener("change", save_options);

document.getElementById("retweets").addEventListener("click", save_options);
document.getElementById("likes").addEventListener("click", save_options);
document.getElementById("lists").addEventListener("click", save_options);
document.getElementById("follow").addEventListener("click", save_options);
document.getElementById("promoted").addEventListener("click", save_options);
document.getElementById("trending").addEventListener("click", save_options);

$(document).ready(function () {
  const deleteRow = (event) => {
    accounts = accounts.filter((value) => value !== event.target.dataset.row);
    drawTable();
    save_options();
  };

  const drawTable = (_) => {
    table.clear().draw();
    accounts.forEach((account) => {
      table.row
        .add([
          account,
          `<span id="deleteRowBtn" data-row="${account}">Delete</span>`,
        ])
        .draw();
    });

    let rows = document.querySelectorAll("#deleteRowBtn");
    rows.forEach((row) => {
      row.addEventListener("click", deleteRow);
    });
  };

  var table = $("#whitelistTable").DataTable({
    columns: [{ title: "Account Handle" }, { title: "Remove" }],
  });

  drawTable();

  $("#addRow").on("click", function () {
    var user = document.getElementById("addAccountName").value;
    if (user === "@" || user.length === 0) {
      document.getElementById("addAccountName").value = "";
      return;
    }

    if (!user.startsWith("@")) {
      user = `@${user}`;
    }

    if (accounts.some((x) => x === user)) {
      document.getElementById("addAccountName").value = "";
      return;
    }

    table.row
      .add([user, `<span id="deleteRowBtn" data-row="${user}">Delete</span>`])
      .draw();

    accounts.push(user);
    document.getElementById("addAccountName").value = "";
    save_options();
  });
});
