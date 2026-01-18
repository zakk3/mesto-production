/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import {
  getUserInfo,
  getCardList,
  setUserInfo,
  setUserAvatar,
  addCard,
} from "./components/api.js";

import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const renderLoading = (button, isLoading, defaultText) => {
  if (isLoading) {
    button.textContent = defaultText === "Создать" ? "Создание..." : "Сохранение...";
  } else {
    button.textContent = defaultText;
  }
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const createInfoString = (title, value) => {
  const template = document.querySelector(
    "#popup-info-definition-template"
  ).content;

  const element = template.cloneNode(true);
  element.querySelector(".popup__info-title").textContent = title;
  element.querySelector(".popup__info-value").textContent = value;

  return element;
};




// Validation settings
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(
  ".popup__info-list"
);

// Enable validation on all forms
enableValidation(validationSettings);

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");


const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(profileSubmitButton, true, "Сохранить");

  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch(console.log)
    .finally(() => {
      renderLoading(profileSubmitButton, false, "Сохранить");
    });
};


const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(avatarSubmitButton, true, "Сохранить");

  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
      avatarForm.reset();
    })
    .catch(console.log)
    .finally(() => {
      renderLoading(avatarSubmitButton, false, "Сохранить");
    });
};

const handleInfoClick = (cardId) => {
  getCardList()
    .then((cards) => {
      const cardData = cards.find((card) => card._id === cardId);

      cardInfoModalInfoList.innerHTML = "";

      cardInfoModalInfoList.append(
        createInfoString(
          "Описание:",
          cardData.name
        )
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardData.createdAt))
        )
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Владелец:",
          cardData.owner.name
        )
      );

      cardInfoModalInfoList.append(
        createInfoString("Количество лайков:", cardData.likes.length)
      );

      // Populate likes list
      const likesList = cardInfoModalWindow.querySelector(".popup__list");
      likesList.innerHTML = "";

      cardData.likes.forEach((user) => {
        const template = document.querySelector(
          "#popup-info-user-preview-template"
        ).content;
        const userElement = template.cloneNode(true);
        userElement.querySelector(".popup__list-item").textContent = user.name;
        likesList.append(userElement);
      });

      openModalWindow(cardInfoModalWindow);
    })
    .catch(console.error);
};








const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  renderLoading(cardSubmitButton, true, "Создать");

  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((newCardData) => {
      placesWrap.prepend(
        createCardElement(newCardData, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          handleInfoClick: handleInfoClick,
        })
      );
      closeModalWindow(cardFormModalWindow);
      cardForm.reset();
    })
    .catch(console.log)
    .finally(() => {
      renderLoading(cardSubmitButton, false, "Создать");
    });
};



// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

// ✅ ADD THESE BUTTONS (after you have profileForm, cardForm, avatarForm)
const profileSubmitButton = profileForm.querySelector(".popup__button");
const cardSubmitButton = cardForm.querySelector(".popup__button");
const avatarSubmitButton = avatarForm.querySelector(".popup__button");



openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});



//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});


let currentUserId = null;

Promise.all([getUserInfo(), getCardList()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach((cardData) => {
      placesWrap.append(
        createCardElement(cardData, currentUserId, {
          onPreviewPicture: handlePreviewPicture,
          handleInfoClick: handleInfoClick,
        })
      );
    });
  })
  .catch(console.log);


