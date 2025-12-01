addNetworkHandler(`sb.hidename`, function (client, id, enabled) {
    console.log("Hiding name for ID: " + id);
	triggerNetworkEvent(`sb.hidename`, null, id, enabled);
});
