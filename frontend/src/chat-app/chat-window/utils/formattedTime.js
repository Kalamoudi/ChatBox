
function getFormattedTime(messageDate) {

    const currentTime = new Date(messageDate);

    const dateString = currentTime.toString();
    const dateParts = dateString.split(' ');
    const timeZonePart = dateParts[5];
    const timeZoneNumber = parseInt(timeZonePart.slice(3, 6));
 


    let hours = currentTime.getHours() + timeZoneNumber;
    const minutes = currentTime.getMinutes();


    let ampm = 'AM'
    const extraZero = minutes < 10 ? '0' : ''
    if(hours >= 12){
        hours -= 12
        ampm = 'PM'
    }
    hours = hours === 0 ? 12 : hours

    const formattedTime = `${hours}:${extraZero}${minutes} ${ampm}`;

    return formattedTime;

}

export default getFormattedTime;