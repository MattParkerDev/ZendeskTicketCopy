// @ts-check
/**
 * @param {string} selector
 * @returns {Promise<Element>}
 */
function waitForElement(selector) {
  return new Promise((resolve) => {
    const foundElement = document.querySelector(selector);
    if (foundElement) {
      return resolve(foundElement);
    }

    const observer = new MutationObserver((mutations) => {
      const foundElement = document.querySelector(selector);
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
 * @param {Element} ticketLabelButton
 * @param {string} ticketNumber
 */
function AddButtonToDOM(ticketLabelButton, ticketNumber) {
  const div = document.createElement("div");
  div.classList.add("ember-view", "btn", "copyButton");
  div.onclick = function () {
    navigator.clipboard.writeText(ticketNumber);
  };
  const symbolSpan = document.createElement("span");
  symbolSpan.textContent = "\u2398 ";
  symbolSpan.id = "symbolSpan";
  const ticketSpan = document.createElement("span");
  ticketSpan.textContent = ticketNumber;
  ticketSpan.id = "ticketSpan";
  const hoverSpan = document.createElement("span");
  hoverSpan.textContent = "Copy";
  hoverSpan.id = "hoverSpan";
  const clickSpan = document.createElement("span");
  clickSpan.textContent = "Copied";
  clickSpan.id = "clickSpan";
  div.appendChild(symbolSpan);
  div.appendChild(ticketSpan);
  div.appendChild(hoverSpan);
  div.appendChild(clickSpan);
  if (ticketLabelButton !== null) {
    ticketLabelButton.insertAdjacentElement("afterend", div);
  }
}

/**
 * @param {Element} ticketTabContainer
 */
function ButtonPlacementHandler(ticketTabContainer) {
  const ticketTabList = ticketTabContainer.querySelectorAll("[data-test-id='header-tab'][data-entity-id]");

  for (const ticketTab of ticketTabList) {
    const ticketNumber = ticketTab.getAttribute("data-entity-id");
    if (ticketNumber == null) continue;

    const paneSelectorString = `div[elementtiming='ticket_workspace/${ticketNumber}']`;
    const intermediate = document.querySelector(paneSelectorString);
    if (intermediate === null) continue;

    const parentOfTicketLabelButton = intermediate.closest("div.ember-view.workspace");
    if (parentOfTicketLabelButton === null) continue;

    const ticketLabelButton = parentOfTicketLabelButton.querySelector("span.ember-view.btn.active");
    if (ticketLabelButton === null) continue;

    const existingCopyButton = parentOfTicketLabelButton.querySelector("div.copyButton");

    if (existingCopyButton !== null) {
      const existingButtonTicketNumber = existingCopyButton.querySelector("span#ticketSpan")?.textContent;

      if (existingButtonTicketNumber !== ticketNumber) {
        existingCopyButton.remove();
      }
    }

    if (!existingCopyButton) {
      AddButtonToDOM(ticketLabelButton, ticketNumber);
    }
  }
}

async function RegisterObserver() {
  const ticketTabContainer = await waitForElement("div[aria-label='Active workspaces']");
  const mainPaneContainer = await waitForElement("#main_panes");

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
