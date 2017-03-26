// Saves options to chrome.storage.sync.
function save_options() {
	var whitelist = document.getElementById('whitelist').value;
  chrome.storage.sync.set({
    whitelist: whitelist
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores state using the preferences stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    whitelist: ""
  }, function(items) {
    document.getElementById('whitelist').value = items.whitelist;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
