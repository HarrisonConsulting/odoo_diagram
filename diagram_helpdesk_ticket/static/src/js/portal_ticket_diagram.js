/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

/**
 * Enhanced modal functionality for fullscreen viewing of helpdesk ticket diagrams
 */
publicWidget.registry.TicketDiagramFullscreenModal = publicWidget.Widget.extend({
    selector: '#ticket_diagram',
    events: {
        'click #Show_ticket_full_screen': '_handleShowFullScreen',
        'click .close_ticket_modal': '_handleCloseModal',
    },
    
    async start() {
        await this._super(...arguments);
        this._setupModal();
    },
    
    /**
     * Setup modal enhancements
     */
    _setupModal() {
        // Ensure modal has proper z-index and backdrop
        const modal = this.el.querySelector('.fullscreen_ticket_diagram');
        if (modal) {
            modal.addEventListener('click', (ev) => {
                if (ev.target === modal) {
                    this._handleCloseModal();
                }
            });
        }
    },
    
    /**
     * Show fullscreen modal
     */
    _handleShowFullScreen(ev) {
        ev.preventDefault();
        const modal = this.el.querySelector('.fullscreen_ticket_diagram');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Copy diagrams to modal if not already there
            this._copyDiagramsToModal();
        }
    },
    
    /**
     * Close fullscreen modal
     */
    _handleCloseModal(ev) {
        const modal = this.el.querySelector('.fullscreen_ticket_diagram');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    },
    
    /**
     * Copy diagrams from main view to modal
     */
    _copyDiagramsToModal() {
        const modalBody = this.el.querySelector('.fullscreen_ticket_diagram .modal-body');
        const mainDiagrams = this.el.querySelector('#ticket_diagram_io');
        
        if (modalBody && mainDiagrams && !modalBody.querySelector('.diagram-viewer-container')) {
            // Clone the diagrams to the modal
            const clone = mainDiagrams.cloneNode(true);
            clone.id = 'modal_ticket_diagram_content';
            
            // Clear modal body and add cloned content
            const existingContainer = modalBody.querySelector('.diagram-viewer-container');
            if (existingContainer) {
                existingContainer.innerHTML = clone.innerHTML;
            }
        }
    },
});