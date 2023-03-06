export function ConvertMinutes(value) {
    if (value && value > 0) {
        let minutes = (Number(value) / 60).toFixed(1);
        return minutes + " menit"
    } else {
        return "-"
    }
}

export function convertTime(value) {
    let seconds = value
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds - (hours * 3600)) / 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes;
}

export function convertStringTime(value) {
    if (value > 3600) {
        let hours = Math.floor(value / 3600)
        let minutes = Math.floor((value - (hours * 3600)) / 60)
        let seconds = value - ((minutes * 60) + (hours * 3600))
        if (seconds > 0 ) {
            return hours + " jam " + minutes + " menit " + seconds + " detik"
        } else {
            return hours + " jam " + minutes + " menit"
        }
    } else if (value > 60) {
        let minutes = Math.floor(value/ 60)
        let seconds = value - (minutes * 60)
        if (seconds > 0 ) {
            return minutes + " menit " + seconds + " detik"
        } else {
            return seconds + " menit"
        }
    } else {
        return value + " detik"
    }
}