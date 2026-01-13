// src/scripts/components/card.js

import { deleteCard, changeLikeCardStatus } from "./api.js";

const cardTemplate = document.querySelector("#card-template").content;

export const createCardElement = (cardData, currentUserId, handlers) => {
  const cardElement = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountEl = cardElement.querySelector(".card__like-count");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");

  // Fill content
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  // LIKE STATE (initial)
  const isLikedByMe = cardData.likes.some((u) => u._id === currentUserId);
  likeButton.classList.toggle("card__like-button_is-active", isLikedByMe);
  likeCountEl.textContent = cardData.likes.length;

  // DELETE BUTTON: only owner sees it
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      // If you later add confirm modal, this is where you call it.
      deleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch(console.log);
    });
  }

  // Like/unlike click
  likeButton.addEventListener("click", () => {
    const isLikedNow = likeButton.classList.contains("card__like-button_is-active");

    changeLikeCardStatus(cardData._id, isLikedNow)
      .then((updatedCard) => {
        // update UI from server response
        const liked = updatedCard.likes.some((u) => u._id === currentUserId);
        likeButton.classList.toggle("card__like-button_is-active", liked);
        likeCountEl.textContent = updatedCard.likes.length;

        // keep local data in sync (optional)
        cardData.likes = updatedCard.likes;
      })
      .catch(console.log);
  });

  // Preview
  cardImage.addEventListener("click", () => {
    handlers.onPreviewPicture({ name: cardData.name, link: cardData.link });
  });

  return cardElement;
};
