/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { DEBUG } from '../shared/constants';

class LoggerService {
    trace(...payload) {
        this.log(0, payload);
    }

    info(...payload) {
        this.log(1, payload);
    }

    error(...payload) {
        this.log(2, payload);
    }

    warning(...payload) {
        this.log(3, payload);
    }

    log(level, payload) {
        if (DEBUG > level)
            return;

        switch (level) {
            case 0:
                console.trace(payload);
                break;
            case 1:
                console.log(payload);
                break;
            case 2:
                console.warn(payload);
                break;
            case 3:
                console.error(payload);
                break;
            default: break;
        }
    }
}

export const $logger = new LoggerService();