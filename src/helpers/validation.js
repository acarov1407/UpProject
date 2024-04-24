import { nameRegex, emailRegex } from "./regex";

export function validateEmpty(data){
    const isFull = !Object.values(data).includes('');
    return isFull;
}

export function validateDeadline(date){
    const isValidDeadline = new Date(date).getTime() > new Date().getTime();
    return isValidDeadline;
}

function validateTaskDeadline(taskDeadline, projectDeadline){
    const isValidDeadline = new Date(taskDeadline).getTime() <= new Date(projectDeadline).getTime(); 
    return isValidDeadline;
}

function validateName(name) {
    const MIN_LENGTH = 2;
    const MAX_LENGTH = 50;
    const isValidName = nameRegex.test(name) && name.length >= MIN_LENGTH && name.length <= MAX_LENGTH;
    return isValidName;
}

export function validateEmail(email) {
    const isValidEmail = emailRegex.test(email);
    return isValidEmail;
}

export function validatePassword(password){
    const isValidPassword = password.length >= 8;
    return isValidPassword;
}

export function validatePasswords(password, repeatedPassword){
    const areSamePassword = password === repeatedPassword;
    return areSamePassword;
}

export function validateForm(formData){
    const {name, email, password, repeatedPassword} = formData; 

    const isFull = validateEmpty(formData);
    const isValidName = validateName(name);
    const isValidEmail = validateEmail(email);
    const isValidPassword = validatePassword(password);
    const areSamePassword = validatePasswords(password, repeatedPassword);

    if(!isFull){
        return {
            isValid: false,
            msg: 'All fields are required'
        }
    }
    
    if(!isValidName) {
        return {
            isValid: false,
            msg: 'Enter a valid name'
        }
    }

    if(!isValidEmail) {
        return {
            isValid: false,
            msg: 'Enter a valid email'
        }
    }

    if(!isValidPassword){
        return {
            isValid: false,
            msg: 'Your password must be at leat 8 characters long'
        }
    }

    if(!areSamePassword){
        return {
            isValid: false,
            msg: 'Passwords does not match'
        }
    }

    return {
        isValid: true,
        msg: ''
    }
}

export function validateTaskForm(task, projectDeadline){
    const isFull = validateEmpty(task);
    const isValidDeadline = validateTaskDeadline(task.deadline, projectDeadline);
    if(!isFull){
        return {
            isValid: false,
            msg: 'All fields are required'
        }
    }

    if(!isValidDeadline){
        return {
            isValid: false,
            msg: 'Deadline is not valid'
        }
    }

    return {
        isValid: true,
        msg: ''
    }


}