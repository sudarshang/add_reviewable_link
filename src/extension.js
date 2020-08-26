"use strict";

// loader-code: wait until gmailjs has finished loading, before triggering actual extensiode-code.
const loaderId = setInterval(() => {
  if (!window._gmailjs) {
    return;
  }

  clearInterval(loaderId);
  startExtension(window._gmailjs, window._jQuery);
}, 100);

// actual extension-code
function startExtension(gmail, jQuery) {
  window.gmail = gmail;

  gmail.observe.on("load", () => {
    const userEmail = gmail.get.user_email();

    gmail.observe.on("view_email", (domEmail) => {
      let links = jQuery(".adn").find("a");
      for (var i = 0; i < links.length; i++) {
        if (
          links[i].hostname == "git.zooxlabs.com" &&
          links[i].pathname.includes("/pull/") &&
          jQuery(links[i]).siblings("[data-reviewable-link]").length == 0
        ) {
          var newLink = document.createElement("A");
          newLink.setAttribute("data-reviewable-link", "y");
          var comps = links[i].pathname.split("/");
          var reviewableUrl =
            "https://reviewable.zooxlabs.com/reviews/" +
            comps[1] +
            "/" +
            comps[2] +
            "/" +
            comps[4];
          newLink.href = reviewableUrl;
          newLink.innerText = "(Reviewable)";
          links[i].insertAdjacentElement("afterend", newLink);
        }
      }

      const emailData = gmail.new.get.email_data(domEmail);
    });
  });
}
