import { TimeagoClock, TimeagoFormatter } from "ngx-timeago";
import { Observable, interval } from "rxjs";

// ticks every 2s
export class TimeAgoFormatter implements TimeagoFormatter {
    format(then: number): string {

        var result: string;
        let now = new Date().getTime();

        let delta = (now - then) / 1000;

        if (delta < 10) {
            result = 'now';
        }
        else if (delta < 60) { 
            result = 'less than a minute ago';
        }
        else if (delta < 3600) { 
            result = Math.floor(delta / 60) + ' minutes ago';
        }
        else if (delta < 86400) { 
            result = Math.floor(delta / 3600) + ' hours ago';
        }
        else { 
            result = Math.floor(delta / 86400) + ' days ago';
        }
        return result;
    }

}