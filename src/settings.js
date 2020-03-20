var accounts = [];

// Saves options to chrome.storage
function save_options() {
    var hideRetweets = document.getElementById("retweets").checked;
    var hideLikes = document.getElementById("likes").checked;

    chrome.storage.sync.set(
        {
            hideRetweets,
            hideLikes,
            accounts
        },
        function() {
            // Update status to let user know options were saved.
            var status = document.getElementById("status");
            status.classList.remove("hidden");
            setTimeout(function() {
                status.classList.add("hidden");
            }, 3000);
        }
    );
}

// Restores state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(
        {
            hideRetweets: true,
            hideLikes: true,
            accounts: []
        },
        function(items) {
            document.getElementById("retweets").checked = items.hideRetweets;
            document.getElementById("likes").checked = items.hideLikes;
            accounts = items.accounts;
        }
    );
}

document.addEventListener("DOMContentLoaded", restore_options);
document.addEventListener("load", restore_options);
document.getElementById("save").addEventListener("click", save_options);

$(document).ready(function() {
    const deleteRow = event => {
        accounts = accounts.filter(value => value !== event.target.dataset.row);
        drawTable();
    }

    const drawTable = _ => {
        table.clear().draw();
        accounts.forEach(account => {
            table.row.add([account, `<span id="deleteRowBtn" data-row="${account}">Delete</span>`]).draw();
        });

        let rows = document.querySelectorAll("#deleteRowBtn")
        rows.forEach(row => {
            row.addEventListener("click", deleteRow);
        });
    }

    var table = $("#whitelistTable").DataTable({
        columns: [{ title: "Account Handle" }, { title: "Remove" }]
    });

    drawTable();


    $("#addRow").on("click", function() {
        var user = document.getElementById("addAccountName").value;
        if (user === "@" || user.length === 0) {
            document.getElementById("addAccountName").value = "";
            return;
        }

        if (!user.startsWith("@")) {
            user = `@${user}`;
        }

        if (accounts.some(x => x === user)) {
            document.getElementById("addAccountName").value = "";
            return;
        }

        table.row.add([user, `<span id="deleteRowBtn" data-row="${user}">Delete</span>`]).draw();

        accounts.push(user);
        document.getElementById("addAccountName").value = "";
    });
});
