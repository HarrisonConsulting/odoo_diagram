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
        console.log('this.isDiagramEditor',this.isDiagramEditor)
        var url;
        if (this.isDiagramEditor) {
            url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noExitBtn=1";
        } else {
                // Replace with the URL for viewing only (no edit access)
//              url = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1#R${this.state.data.diagram}`;
                url = "https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1#R%3Cmxfile%20host=%22embed.diagrams.net%22%20agent=%22Mozilla/5.0%20(X11;%20Linux%20x86_64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/130.0.0.0%20Safari/537.36%22%20version=%2226.0.5%22%3E%20%3Cdiagram%20id=%22aTuWSodmG-ZDa3USIhbx%22%20name=%22Page-1%22%3E%20%3CmxGraphModel%20dx=%221023%22%20dy=%22583%22%20grid=%221%22%20gridSize=%2210%22%20guides=%221%22%20tooltips=%221%22%20connect=%221%22%20arrows=%221%22%20fold=%221%22%20page=%221%22%20pageScale=%221%22%20pageWidth=%22827%22%20pageHeight=%221169%22%20math=%220%22%20shadow=%220%22%3E%20%3Croot%3E%20%3CmxCell%20id=%220%22%20/%3E%20%3CmxCell%20id=%221%22%20parent=%220%22%20/%3E%20%3CmxCell%20id=%222%22%20value=%22%22%20style=%22rounded=1;whiteSpace=wrap;html=1;%22%20vertex=%221%22%20parent=%221%22%3E%20%3CmxGeometry%20x=%22300%22%20y=%22220%22%20width=%22120%22%20height=%2260%22%20as=%22geometry%22%20/%3E%20%3C/mxCell%3E%20%3C/root%3E%20%3C/mxGraphModel%3E%20%3C/diagram%3E%20%3C/mxfile%3E#%7B%22pageId%22%3A%22aTuWSodmG-ZDa3USIhbx%22%7D"
                console.log('urllll',url)
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
