window.__mdeMapsAuthFailed = false;
window.gm_authFailure = function () {
  window.__mdeMapsAuthFailed = true;
  window.dispatchEvent(new CustomEvent("mde-maps-auth-failure"));
};
