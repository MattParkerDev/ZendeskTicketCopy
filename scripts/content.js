// @ts-check
/**
 * @param {string} selector
 * @returns {Promise<Element>}
 */
function waitForElement(selector) {
  return new Promise((resolve) => {
    var foundElement = document.querySelector(selector);
    if (foundElement) {
      return resolve(foundElement);
    }

    const observer = new MutationObserver((mutations) => {
      var foundElement = document.querySelector(selector);
      if (foundElement) {
        resolve(foundElement);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/**
 * @param {Element} nearbyButton
 * @param {string} ticketNumber
 */
function AddButtonToDOM(nearbyButton, ticketNumber) {
  var div = document.createElement("div");
  div.classList.add("ember-view", "btn", "copyButton");
  div.onclick = function () {
    navigator.clipboard.writeText(ticketNumber);
  };
  var symbolSpan = document.createElement("span");
  symbolSpan.textContent = "\u2398 ";
  symbolSpan.id = "symbolSpan";
  var ticketSpan = document.createElement("span");
  ticketSpan.textContent = ticketNumber;
  ticketSpan.id = "ticketSpan";
  var hoverSpan = document.createElement("span");
  hoverSpan.textContent = "Copy";
  hoverSpan.id = "hoverSpan";
  var clickSpan = document.createElement("span");
  clickSpan.textContent = "Copied";
  clickSpan.id = "clickSpan";
  div.appendChild(symbolSpan);
  div.appendChild(ticketSpan);
  div.appendChild(hoverSpan);
  div.appendChild(clickSpan);
  if (nearbyButton !== null) {
    nearbyButton.insertAdjacentElement("afterend", div);
  }
}

/**
 * @param {Element} ticketTabContainer
 */
function ButtonPlacementHandler(ticketTabContainer) {
  var ticketTabList = ticketTabContainer.querySelectorAll(
    ".sc-1x3zb4y-0"
  );
  for (var ticketTab of ticketTabList) {
    var ticketNumber = ticketTab
      .querySelector("div")
      ?.getAttribute("data-entity-id");
    if (ticketNumber == null) continue;

    var paneSelectorString = `div[elementtiming='ticket_workspace/${ticketNumber}']`;
    var intermediate = document.querySelector(paneSelectorString);
    if (intermediate === null) continue;

    var parent = intermediate.closest("div.ember-view.workspace");
    if (parent === null) continue;

    var nearbyButton = parent.querySelector("span.ember-view.btn.active");
    if (nearbyButton === null) continue;

    var existingButton = parent.querySelector("div.copyButton");

    if (existingButton !== null) {
      var existingButtonTicketNumber =
        existingButton.querySelector("span#ticketSpan")?.textContent;

      if (existingButtonTicketNumber !== ticketNumber) {
        existingButton.remove();
      }
    }

    if (!existingButton) {
      AddButtonToDOM(nearbyButton, ticketNumber);
    }
  }
}

async function RegisterObserver() {
  var ticketTabContainer = await waitForElement("div[aria-label='Active workspaces']");
  var mainPaneContainer = await waitForElement("#main_panes");

  const callback = () => {
    if (ticketTabContainer !== null) {
      ButtonPlacementHandler(ticketTabContainer);
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(mainPaneContainer, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

addEventListener("DOMContentLoaded", RegisterObserver);
