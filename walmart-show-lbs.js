// ==UserScript==
// @name        show pounds unit price walmart.ca
// @namespace   Violentmonkey Scripts
// @version     1.1.1b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=walmart.ca
//
// @match       https://www.walmart.ca/*
// @grant       none
// @run-at      document-idle
// @author      ICHx, Gemini
// @description Automatically converts Walmart Canada's unit prices from 100g to lbs.
// @downloadURL https://update.greasyfork.org/scripts/578351/show%20pounds%20unit%20price%20walmartca.user.js
// @updateURL https://update.greasyfork.org/scripts/578351/show%20pounds%20unit%20price%20walmartca.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function convertPrices() {
        // console.log('convertPrices')
        let priceElements = document.querySelectorAll('div[data-testid="product-price-per-unit"]');
        let priceElements2 = document.querySelectorAll('span[data-seo-id="hero-unit-price"]');

        let aggregList = Array.from(priceElements);
        aggregList = aggregList.concat(Array.from(priceElements2));
        aggregList.forEach(x => {

            // Prevent duplicate appends if the script checks this element again
            // console.log("before " + x.innerHTML)
            if (x.innerHTML.includes('/lb')) return;

            // Match the numeric price before "/100g"
            const match = x.innerHTML.match(/\$?([0-9.]+)\s*¢?\/100\s*g/i);

            let isCent = x.innerHTML.includes('¢');

            if (match) {
                let pricePer100g = parseFloat(match[1]);
                let pricePerLb = (pricePer100g * 4.53592);

                if (isCent) {
                    pricePerLb /= 100;
                }
                pricePerLb = pricePerLb.toFixed(2)

                // In-place append the converted price
                x.innerHTML = (`$${pricePerLb}/lb (${x.innerHTML})`);
            }
            // console.log("after " + x.innerHTML)

        });
    }

    // 1. Run immediately when the script injects
    convertPrices();

    // 2. Watch the page for dynamically loaded products (scrolling, pagination, searching)
    const observer = new MutationObserver(() => {
        convertPrices();
    });

    observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
    });
})();
