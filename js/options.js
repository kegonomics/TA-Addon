// Saves options to chrome.storage
function saveOptions() {
  var boostSessionTable = document.getElementById('boostSessionTable').checked;
  chrome.storage.sync.set({
    boostSessionTable: boostSessionTable
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.innerHTML = '<div class=\"alert alert-success\" role=\"alert\">Options have been saved!</div>';
    setTimeout(function() {
      status.textContent = '';
    }, 1750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.sync.get({
    boostSessionTable: true
  }, function(items) {
    document.getElementById('boostSessionTable').checked = items.boostSessionTable;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click',
    saveOptions);