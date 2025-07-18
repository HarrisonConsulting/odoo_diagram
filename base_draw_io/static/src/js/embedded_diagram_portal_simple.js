/** @odoo-module */
import { Component } from "@odoo/owl";
import { onMounted, useRef, useState } from "@odoo/owl";
import { rpc } from "@web/core/network/rpc";

/**
 * Simple portal-aware diagram component that doesn't depend on backend embedding sets
 * This component is used in portal/frontend contexts where HTML editor is not available
 */
export class PortalEmbeddedDiagram extends Component {
    static template = "base_draw_io.EmbeddedDiagram";
    static props = {
        host: { type: Object, optional: true },
        readonly: { type: Boolean, optional: true },
    };
    
    setup() {
        this.frameRef = useRef('diagramEditor');
        this.state = useState({
            isLoading: true,
            diagramData: null,
            readonly: this.props.readonly || false,
        });
        
        onMounted(async () => {
            this.frame = this.frameRef.el;
            await this.initializeDiagram();
            window.addEventListener("message", this.handleMessage.bind(this));
            // Wait for next tick to ensure iframe is rendered
            await new Promise(resolve => setTimeout(resolve, 0));
            this.frame = this.frameRef.el;  // Re-get the frame ref after render
            await this.loadIframe();
        });
    }
    
    async initializeDiagram() {
        // Load diagram data from host element
        const hostEl = this.props.host?.el || this.props.host;
        if (!hostEl) {
            console.warn("No host element found for diagram");
            this.state.diagramData = this.getDefaultDiagram();
        } else {
            const existingData = hostEl.dataset.diagramData;
            this.state.diagramData = existingData || this.getDefaultDiagram();
        }
        
        // Check if user can edit (for portal context)
        await this.checkEditPermission();
        
        // Set loading to false so iframe is rendered in template
        this.state.isLoading = false;
    }
    
    async checkEditPermission() {
        // In portal context, check edit permission via RPC
        if (window.location.pathname.includes('/my/')) {
            const hostEl = this.props.host?.el;
            const recordEl = hostEl?.closest('[data-id]');
            const recordId = recordEl?.dataset.id;
            const model = this.getModelFromUrl();
            
            if (model && recordId) {
                try {
                    const canEdit = await rpc("/diagram/check_edit_permission", {
                        model: model,
                        res_id: parseInt(recordId),
                    });
                    this.state.readonly = !canEdit;
                } catch (e) {
                    this.state.readonly = true;
                }
            } else {
                this.state.readonly = true;
            }
        }
    }
    
    getModelFromUrl() {
        const path = window.location.pathname;
        if (path.includes('/my/task')) {
            return 'project.task';
        } else if (path.includes('/my/ticket')) {
            return 'helpdesk.ticket';
        }
        return null;
    }
    
    getDefaultDiagram() {
        return '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>';
    }
    
    async loadIframe() {
        // Wait for the iframe to be available in the DOM
        if (!this.frame) {
            console.warn("Iframe not available yet, retrying...");
            setTimeout(() => this.loadIframe(), 100);
            return;
        }
        
        if (this.state.readonly) {
            // Viewer mode - load with diagram data encoded in URL
            this.frame.src = '';
            await new Promise(resolve => setTimeout(resolve, 1000));
            const encodedDiagram = encodeURIComponent(this.state.diagramData || '');
            this.frame.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&pageScale=1&layers=1&nav=1&title=#R${encodedDiagram}`;
        } else {
            // Editor mode - load empty then initialize via messages
            this.frame.src = '';
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.frame.src = `https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1`;
        }
    }
    
    postMessage(msg) {
        if (this.frame != null) {
            this.frame?.contentWindow?.postMessage(JSON.stringify(msg), '*');
        }
    }
    
    configureEditor() {
        this.postMessage({
            action: 'configure',
            config: {}
        });
    }
    
    initializeEditor() {
        this.postMessage({
            action: 'load',
            xml: this.state.diagramData,
            autosave: '1',
        });
    }
    
    handleMessage(event) {
        if (!this.frame || event.source !== this.frame.contentWindow) {
            return;
        }
        
        try {
            const message = JSON.parse(event.data);
            
            switch (message.event) {
                case 'configure':
                    this.configureEditor();
                    break;
                    
                case 'init':
                    this.initializeEditor();
                    break;
                    
                case 'autosave':
                case 'save':
                    if (message.xml && !this.state.readonly) {
                        this.saveDiagram(message.xml);
                    }
                    break;
                    
                case 'exit':
                    // User clicked exit
                    break;
            }
        } catch (e) {
            // Not a message for us
        }
    }
    
    saveDiagram(xmlData) {
        this.state.diagramData = xmlData;
        
        // Save to host element
        const hostEl = this.props.host?.el || this.props.host;
        if (hostEl) {
            hostEl.dataset.diagramData = xmlData;
            hostEl.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    onDestroy() {
        window.removeEventListener("message", this.handleMessage.bind(this));
    }
}