// Function to get Russian error message
const getRussianErrorMessage = (inputElement) => {
  if (inputElement.validity.valueMissing) {
    return "Это обязательное поле";
  }
  if (inputElement.validity.typeMismatch) {
    if (inputElement.type === "url") {
      return "Пожалуйста, введите корректный URL";
    }
    if (inputElement.type === "email") {
      return "Пожалуйста, введите корректный адрес электронной почты";
    }
  }
  if (inputElement.validity.tooShort) {
    return `Минимальная длина: ${inputElement.minLength} символов`;
  }
  if (inputElement.validity.tooLong) {
    return `Максимальная длина: ${inputElement.maxLength} символов`;
  }
  return "Некорректное значение";
};

// Function to show validation error
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(settings.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.errorClass);
};

// Function to hide validation error
const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(settings.inputErrorClass);
  errorElement.classList.remove(settings.errorClass);
  errorElement.textContent = "";
};

// Function to check input validity
const checkInputValidity = (formElement, inputElement, settings) => {
  // Check if input has custom error message for invalid characters
  if (!inputElement.validity.valid) {
    let errorMessage = getRussianErrorMessage(inputElement);
    
    // Check for custom regex validation on name/card-name fields
    if (inputElement.classList.contains("popup__input_type_name") || 
        inputElement.classList.contains("popup__input_type_card-name")) {
      const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s\-]*$/;
      if (inputElement.value && !nameRegex.test(inputElement.value)) {
        errorMessage = inputElement.dataset.errorMessage;
      }
    }
    
    showInputError(formElement, inputElement, errorMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

// Function to check if form has invalid inputs
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Function to disable submit button
const disableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Function to enable submit button
const enableSubmitButton = (buttonElement, settings) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

// Function to toggle button state based on form validity
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// Function to set event listeners on form inputs
const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  toggleButtonState(inputList, buttonElement, settings);
  
  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Function to clear validation errors
export const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
  
  disableSubmitButton(buttonElement, settings);
};

// Function to enable validation on all forms
export const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};
