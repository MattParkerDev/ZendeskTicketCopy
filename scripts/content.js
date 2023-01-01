function waitForElement(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

async function AddButtonToDOM(nearbyButton, ticketNumber) {
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

async function ButtonPlacementHandler(ticketTabContainer) {
  var ticketTabList = ticketTabContainer.querySelectorAll(
    ".sc-1x3zb4y-0.eXHmlx"
  );
  for (var ticketTab of ticketTabList) {
    var ticketNumber = ticketTab
      .querySelector("div")
      .getAttribute("data-entity-id");
    var paneSelector = `div[elementtiming='ticket_workspace/${ticketNumber}']`;
    var intermediate = document.querySelector(paneSelector);

    if (intermediate !== null) {
      var parent = intermediate.closest("div.ember-view.workspace");
      var nearbyButton = parent.querySelector("span.ember-view.btn.active");
      var existingButton = parent.querySelector("div.copyButton");
      if (!existingButton && nearbyButton !== null && parent !== null) {
        AddButtonToDOM(nearbyButton, ticketNumber);
      }
    }
  }
}

async function RegisterObserver() {
  var ticketTabContainer = await waitForElement("div[aria-label='Tabs']");
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
