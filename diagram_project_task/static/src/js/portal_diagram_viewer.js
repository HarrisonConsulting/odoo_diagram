/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

/**
 * Portal Diagram Viewer
 * 
 * This widget handles diagram rendering in the portal context without
 * requiring the full HTML editor infrastructure. It extracts diagrams
 * from the HTML content and renders them in a read-only viewer.
 */
publicWidget.registry.PortalDiagramViewer = publicWidget.Widget.extend({
    selector: '.diagram-portal-container',
    
    async start() {
        await this._super(...arguments);
        await this._initializeDiagrams();
    },
    
    /**
     * Initialize all diagrams in the container
     */
    async _initializeDiagrams() {
        const diagramFields = this.el.querySelectorAll('.diagram-field-portal');
        
        for (const field of diagramFields) {
            await this._renderDiagram(field);
        }
    },
    
    /**
     * Render a single diagram field
     */
    async _renderDiagram(fieldEl) {
        // Get the HTML content from the field
        const htmlContent = fieldEl.innerHTML || '';
        
        // Extract all drawio diagram images from the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const diagramImages = doc.querySelectorAll('img[data-diagram-data]');
        
        if (diagramImages.length === 0) {
            // No diagrams found, show a placeholder
            fieldEl.innerHTML = '<div class="text-muted p-3">No diagrams available</div>';
            return;
        }
        
        // Clear the field and render each diagram
        fieldEl.innerHTML = '';
        
        for (const img of diagramImages) {
            const diagramData = img.getAttribute('data-diagram-data');
            if (diagramData) {
                const viewerContainer = this._createViewerContainer(diagramData);
                fieldEl.appendChild(viewerContainer);
            }
        }
    },
    
    /**
     * Create a viewer container for a diagram
     */
    _createViewerContainer(diagramData) {
        const container = document.createElement('div');
        container.className = 'diagram-viewer-container mb-3';
        
        // Create iframe for the viewer
        const iframe = document.createElement('iframe');
        iframe.className = 'diagram-viewer-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = '1px solid #ddd';
        iframe.style.borderRadius = '4px';
        
        // Encode the diagram data for the viewer URL
        const encodedData = encodeURIComponent(diagramData);
        iframe.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&nav=1&title=Diagram#R${encodedData}`;
        
        container.appendChild(iframe);
        return container;
    },
});

/**
 * Enhanced modal functionality for fullscreen viewing
 */
publicWidget.registry.DiagramFullscreenModal = publicWidget.Widget.extend({
    selector: '#task_diagram',
    events: {
        'click #Show_full_screen': '_handleShowFullScreen',
        'click .close_modal': '_handleCloseModal',
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
        const modal = this.el.querySelector('.fullscreen_diagram');
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
        const modal = this.el.querySelector('.fullscreen_diagram');
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
        const modal = this.el.querySelector('.fullscreen_diagram');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    },
    
    /**
     * Copy diagrams from main view to modal
     */
    _copyDiagramsToModal() {
        const modalBody = this.el.querySelector('.fullscreen_diagram .modal-body');
        const mainDiagrams = this.el.querySelector('#task_diagram_io');
        
        if (modalBody && mainDiagrams && !modalBody.querySelector('.diagram-viewer-container')) {
            // Clone the diagrams to the modal
            const clone = mainDiagrams.cloneNode(true);
            clone.id = 'modal_diagram_content';
            
            // Clear modal body and add cloned content
            const existingContainer = modalBody.querySelector('.diagram-portal-container');
            if (existingContainer) {
                existingContainer.innerHTML = clone.innerHTML;
            }
        }
    },
});