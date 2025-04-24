/**
 * File: modal.js
 * Team: WebFusion
 * Members: Nevathan, Liyu, Adrian, Abishan
 * Date: 2025-04-24
 *
 * Description:
 * Reusable Modal component for displaying pop-up content. 
 * Includes title, close functionality, dynamic content, and optional footer.
 */

import React from 'react';
import './modal.css';

/**
 * Modal component to display a popup dialog with content and an optional footer.
 *
 * @param {boolean} isOpen - Controls whether the modal is visible.
 * @param {function} onClose - Callback function to close the modal.
 * @param {string} title - Title text displayed in the modal header.
 * @param {JSX.Element} children - Content to render inside the modal body.
 * @param {JSX.Element} [footer] - Optional footer content (e.g., action buttons).
 *
 * @returns {JSX.Element|null} A modal overlay with header, content, and optional footer.
 */
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;