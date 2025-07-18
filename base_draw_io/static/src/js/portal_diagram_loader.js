/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

/**
 * Simple Diagram Loader for Portal
 * Loads draw.io XML data into viewer iframes
 */
publicWidget.registry.PortalDiagramLoader = publicWidget.Widget.extend({
    selector: '.diagram-viewer-container, .diagram-viewer-container-modal',
    
    start() {
        this._super(...arguments);
        this._loadDiagram();
    },
    
    _loadDiagram() {
        const diagramData = this.el.dataset.diagram;
        const iframe = this.el.querySelector('iframe');
        
        if (diagramData && iframe) {
            // URL encode the diagram data
            const encodedData = encodeURIComponent(diagramData);
            // Load the diagram in viewer mode
            iframe.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&nav=1&title=Diagram#R${encodedData}`;
        }
    }
});