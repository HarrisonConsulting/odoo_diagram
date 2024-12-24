/** @odoo-module **/

import { registry } from "@web/core/registry";
import { session } from "@web/session"; // To access user session data
const { Component, onMounted, useRef, useExternalListener, onWillStart, useState } = owl;
import { jsonrpc } from "@web/core/network/rpc_service";
import { useService } from "@web/core/utils/hooks";

export class DrawDiagramEditor extends Component {
    setup() {
        super.setup();
        this.frameRef = useRef('diagramEditor');
        this.user = useService("user");
        this.hideLoadBtn = false;
        this.state = useState({data: {}})
        this.handleMessageEvent = this._handleMessageEvent.bind(this);
        // Check if the current user belongs to the portal_diagram_editor group
        this.isDiagramEditor = this._checkUserGroup();
        // Load data asynchronously
        onWillStart(async () => this.state.data = await this.loadData())
        onMounted(async () => {
            this.frame = this.frameRef.el;
            this.startEditing();
        });
        useExternalListener(window, "click", this.onWindowClick, true);
    }

    // Check if the current user belongs to the 'portal_diagram_editor' group
    async _checkUserGroup() {
        // Assuming 'portal_diagram_editor' is the name of the group; replace with the actual group ID or name
            let data = await this.user.hasGroup('diagram_website_portal.portal_diagram_editor');
            return data
    }

    onWindowClick(ev) {
        if($(ev.target).parent().hasClass('load-diagram-version')){
            this.initializeEditor()
        }
    }

    async loadData() {
        const [response] = await jsonrpc(`/web/dataset/call_kw`, {
            model: this.props.resModel,
            method: "read",
            args: [parseInt(this.props.resId), ["diagram","diagram_version_id"]],
            kwargs: {}
        });
        return response;
    }

    get url() {
        return "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noExitBtn=1";
    }

    postMessage(msg) {
        if (this.frame != null) {
            this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
    }

    async initializeEditor() {
//        if (this.isDiagramEditor) {
            this.postMessage({
                action: 'load',
                saveAndExit: '1',
                modified: 'unsavedChanges',
                xml: this.state.data.diagram,
            });
//        } else {
//            alert('You do not have permission to edit this diagram.');
//        }
    }

    configureEditor() {
        if (this.isDiagramEditor) {
            this.postMessage({
                action: 'configure',
                config: this.props.config || {}
            });
        }
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
            await jsonrpc(`/web/dataset/call_kw/`, {
                model: this.props.resModel,
                method: "write",
                args: [
                    [this.props.resId],
                    {[this.props.name]: xml, 'save_diagram': true}
                ],
                kwargs: {}
            });
        } else {
            alert('You do not have permission to save this diagram.');
        }
    }
}

DrawDiagramEditor.template = "draw_diagram_editor";
registry.category("public_components").add("draw_diagram", DrawDiagramEditor);

