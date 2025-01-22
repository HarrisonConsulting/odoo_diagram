/** @odoo-module **/

import { registry } from "@web/core/registry";
const { Component, onMounted, useRef, useExternalListener, onWillStart, useState } = owl;
import { jsonrpc } from "@web/core/network/rpc_service";
import { useService } from "@web/core/utils/hooks";

export class DrawDiagramEditor extends Component {
    setup() {
        super.setup();
        this.frameRef = useRef('diagramEditor');
        this.hideLoadBtn = false;
        this.state = useState({data: {}})
        this.user = useService("user");
        this.handleMessageEvent = this._handleMessageEvent.bind(this);
        onWillStart(async () =>{
            this.isDiagramEditor = await this._checkUserGroup();
            this.state.data = await this.loadData();
            });
        onMounted(async () => {
            this.frame = this.frameRef.el;
            await this.startEditing();
        });
        useExternalListener(window, "click", this.onWindowClick, true);
    }
    onWindowClick(ev){
        if($(ev.target).parent().hasClass('load-diagram-version')){
            this.initializeEditor()
        }
    }
    // Check if the current user belongs to the 'portal_diagram_editor' group
    async _checkUserGroup() {
        // Assuming 'portal_diagram_editor' is the name of the group; replace with the actual group ID or name
            let data = await this.user.hasGroup('diagram_website_portal.portal_diagram_editor');
            return data
    }
    async loadData() {
        const response = await jsonrpc("/web/load_data", {
            res_model: this.props.resModel,
            res_id: parseInt(this.props.resId),
        });
        return response
    }
    get url() {
        var url;
        if (this.isDiagramEditor) {
            url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noExitBtn=1";
        } else {
                // Replace with the URL for viewing only (no edit access)
                url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noSaveBtn=1&noExitBtn=1"
            }
        return url;
    }
    postMessage (msg) {
        if (this.frame != null) {
            this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
    }
    async initializeEditor () {
        this.postMessage({
            action: 'load',
            saveAndExit: this.isDiagramEditor ? '1' : '0',
            modified: 'unsavedChanges',
            xml: this.state.data.diagram,
        });
    }
    configureEditor () {
        this.postMessage({
            action: 'configure',
            config: this.state.data.record || {}
        });
    }
    startEditing() {
        window.addEventListener('message', this.handleMessageEvent);
    }
    _handleMessageEvent(evt) {
        if (this.frame != null && evt.source == this.frame.contentWindow &&
            evt.data.length > 0) {
            try {
                var msg = JSON.parse(evt.data);
                if (msg != null) {
                    this.handleMessage(msg);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }
    handleMessage(msg) {
        switch (msg.event) {
            case 'configure':
                this.configureEditor();
                break;
            case 'init':
                this.initializeEditor();
                break;
            case 'save':
                this.saveDiagram(msg.xml, msg.exit);
                break;
            default:
                console.log(msg.event);
                break;
        }
    }
    async saveDiagram(xml, exit) {
        if (this.isDiagramEditor) {
        await jsonrpc("/web/save_diagram", {
            res_model: this.props.resModel,
            res_id: this.props.resId,
            diagram_xml: xml,
            save_diagram : true,
        });
        } else {
            alert('You do not have permission to save this diagram.');
        }
    }
}
DrawDiagramEditor.template = "draw_diagram_editor";
registry.category("public_components").add("draw_diagram", DrawDiagramEditor);
