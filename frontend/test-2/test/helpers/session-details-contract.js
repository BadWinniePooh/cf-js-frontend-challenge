export function validateSessionDetails(session){
    const errors = [];
    if(typeof session.title !== 'string' || session.title.trim() === ''){
        errors.push('Title must be a non-empty string');
    }
    if(!Array.isArray(session.tags)){
        errors.push('Tags must be an array');
    }
    if(!Array.isArray(session.attendees)){
        errors.push('Attendees must be an array');
    }
    let tags = Array.from(session.tags ?? []);
    tags.forEach((tag, index) => {
        if(typeof tag.label !== 'string' || tag.label.trim() === ''){
            errors.push(`Tag at index ${index} must have a non-empty string label`);
        }
        if(typeof tag.color !== 'string' || tag.color.trim() === ''){
            errors.push(`Tag at index ${index} must have a non-empty string color`);
        }
    });
    let attendees = Array.from(session.attendees ?? []);
    attendees.forEach((attendee, index) => {
        if(typeof attendee.name !== 'string' || attendee.name.trim() === ''){
            errors.push(`Attendee at index ${index} must have a non-empty string name`);
        }
        if(typeof attendee.initials !== 'string' || attendee.initials.trim() === ''){
            errors.push(`Attendee at index ${index} must have a non-empty string initials`);
        }
    });
    return errors;

}