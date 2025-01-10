/** @odoo-module **/

import { registry } from "@web/core/registry";
import { CharField, charField } from "@web/views/fields/char/char_field";
const { Component, onMounted, useRef, useExternalListener } = owl;
import { jsonrpc } from "@web/core/network/rpc_service";
import { EventBus } from "@odoo/owl";

export class DrawDiagramBinary extends CharField {
    setup() {
        this.bus = new EventBus();
        super.setup();
        this.frameRef = useRef('diagramEditor');
        this.hideLoadBtn = false;
        this.handleMessageEvent = this._handleMessageEvent.bind(this);
        onMounted(() => {
            this.frame = this.frameRef.el;
            this.startEditing();
        });
        useExternalListener(window, "click", this.onWindowClick, true);
    }

    onWindowClick(ev){
        if($(ev.target).parent().hasClass('load-diagram-version')){
            this.initializeEditor()
        }
    }

    get url() {
        var url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&saveAndExit=0&noExitBtn=1"
        console.log('url',url)
        return url;
    }

    postMessage (msg) {
        console.log('msg1111',msg)
        if (this.frame != null) {
            this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
    }

    async initializeEditor () {
        this.postMessage({
            action: 'load',
            saveAndExit: '1',
            modified: 'unsavedChanges',
            xml: this.props.record.data.diagram,
        });
    }

    configureEditor () {
        this.postMessage({
            action: 'configure',
            config: this.props.config
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
        console.log('msg.url',msg)
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
        await jsonrpc(`/web/dataset/call_kw/${this.props.record._config.resModel}/write`, {
            model: this.props.record._config.resModel,
            method: "write",
            args: [
                [this.props.record._config.resId],
                {[this.props.name]: xml, 'save_diagram':true}
            ],
            kwargs:{}
        });
    }
    fullScreenEditor(){
        var diagramElement = document.querySelector('.o_diagram');
        if (diagramElement) {
            diagramElement.style.position = 'fixed';
            diagramElement.style.width = '100%';
            diagramElement.style.height = '100%';
            diagramElement.style.left = '0';
            diagramElement.style.top = '0';
            diagramElement.style.zIndex = '999';
        }
       document.querySelector('.load-diagram-full-screen-close').style.display = '';
       document.querySelector('.load-diagram-full-screen').style.display = 'none';
    }
    fullScreenEditorClose(){
        var diagramElement = document.querySelector('.o_diagram');
        if (diagramElement) {
            diagramElement.style.position = '';
            diagramElement.style.width = '';
            diagramElement.style.height = '';
            diagramElement.style.left = '';
            diagramElement.style.top = '';
            diagramElement.style.zIndex = '';
        }
        document.querySelector('.load-diagram-full-screen-close').style.display = 'none';
        document.querySelector('.load-diagram-full-screen').style.display = '';
    }
}
DrawDiagramBinary.template = "draw_io_diagram.draw_diagram";

export const drawDiagramBinary = {
    ...charField,
    supportedTypes: ["char"],
    component: DrawDiagramBinary,
};

registry.category("fields").add("draw_diagram", drawDiagramBinary);
