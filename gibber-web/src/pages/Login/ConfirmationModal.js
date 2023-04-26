import React from "react";
import { Modal, Button } from "react-bootstrap";
import { languages } from "../../utils/languages";

function ConfirmationModal(props) {
  const { show, onCancel, onConfirm, lang } = props;
  function getLanguageName(languageCode) {
    const language = languages.find((lang) => lang.language === languageCode);
    return language ? language.name : "";
  }
  const languageName = getLanguageName(lang);
  return (
    <Modal className="modal-sm" show={show} onHide={onCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-sm">
          <p>Are you sure you want to select {languageName}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
