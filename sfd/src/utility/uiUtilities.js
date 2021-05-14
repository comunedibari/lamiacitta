/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { isDate } from "lodash";

export const scrollToTop = (logger) => {
    var int = setInterval(() => {
        var i = window.pageYOffset;

        if (logger) {
            logger.trace("window sta a " + i);
        }
        i -= 30;
        window.scrollTo(0, i);
        if (i <= 0) clearInterval(int);
    }, 20);
}

export const scrollElementToY = (elementId, y, logger) => {
    var int = setInterval(() => {

        const elementY = document.getElementById(elementId).getBoundingClientRect().top;
        var deltaY = 0;

        if (logger) {
            logger.trace(elementId + " sta a " + elementY);
        }

        if (elementY > y + 30) {
            deltaY = 30;
        } else if (elementY < y - 30) {
            deltaY = -30;
        }

        window.scrollTo(0, window.pageYOffset + deltaY);
        if (deltaY === 0) clearInterval(int);
    }, 20);
}

export const parseDateToLocalString = (value, defaultValue = '--') => {
    if (!value) return defaultValue;

    if (!isDate(value))
        value = new Date(value);

    return isDate(value) ? value.toLocaleDateString() : defaultValue;
}

export const parseStringToDate = (value, defaultValue = null) => {
    if (!value) return defaultValue;

    if (!isDate(value))
        value = new Date(`${value} 00:00:00`);

    return isDate(value) ? value : defaultValue;
}

export default {
    scrollToTop,
    scrollElementToY,
    parseDateToLocalString,
    parseStringToDate
}